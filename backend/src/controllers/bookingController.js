const { prisma } = require('../config/database');
const { sendBookingConfirmation, sendBookingStatusUpdate } = require('../services/emailService');
const { paginate, buildPaginationMeta } = require('../utils/helpers');

const createBooking = async (req, res, next) => {
  try {
    const { eventType, eventDate, location, guestCount, notes, packageId } = req.body;
    const userId = req.user.id;

    const data = {
      userId,
      eventType,
      eventDate: new Date(eventDate),
      location,
      guestCount: parseInt(guestCount),
      notes,
    };
    if (packageId) data.packageId = packageId;

    const booking = await prisma.booking.create({ data });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    sendBookingConfirmation({ email: user.email, name: user.name, booking });

    res.status(201).json({ success: true, message: 'Booking created successfully', data: booking });
  } catch (error) {
    next(error);
  }
};

const getBookings = async (req, res, next) => {
  try {
    const { page, limit, status, eventType } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);

    const where = {};
    if (req.user.role !== 'ADMIN') {
      where.userId = req.user.id;
    }
    if (status) where.status = status;
    if (eventType) where.eventType = eventType;

    const [bookings, total] = await Promise.all([
      prisma.booking.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: req.user.role === 'ADMIN'
          ? { user: { select: { id: true, name: true, email: true } }, package: { select: { id: true, name: true } } }
          : { package: { select: { id: true, name: true } } },
      }),
      prisma.booking.count({ where }),
    ]);

    res.json({
      success: true,
      data: bookings,
      pagination: buildPaginationMeta(total, p, l),
    });
  } catch (error) {
    next(error);
  }
};

const getBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: {
        user: { select: { id: true, name: true, email: true } },
        package: { select: { id: true, name: true } },
      },
    });

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }
    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, adminNotes } = req.body;

    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status, adminNotes },
    });

    if (['APPROVED', 'REJECTED', 'COMPLETED'].includes(status)) {
      const user = await prisma.user.findUnique({ where: { id: booking.userId } });
      sendBookingStatusUpdate({ email: user.email, name: user.name, booking: updated, status });
    }

    res.json({ success: true, message: `Booking ${status.toLowerCase()}`, data: updated });
  } catch (error) {
    next(error);
  }
};

const deleteBooking = async (req, res, next) => {
  try {
    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Booking deleted successfully' });
  } catch (error) {
    next(error);
  }
};

const updateBooking = async (req, res, next) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    if (req.user.role !== 'ADMIN' && booking.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    if (req.user.role !== 'ADMIN' && booking.status !== 'PENDING') {
      return res.status(403).json({ success: false, message: 'Can only edit pending bookings' });
    }

    const { eventType, eventDate, location, guestCount, notes, packageId, status, adminNotes } = req.body;
    const data = {};

    if (req.user.role === 'ADMIN') {
      if (status) data.status = status;
      if (adminNotes !== undefined) data.adminNotes = adminNotes;
    }

    if (eventType) data.eventType = eventType;
    if (eventDate) data.eventDate = new Date(eventDate);
    if (location) data.location = location;
    if (guestCount) data.guestCount = parseInt(guestCount);
    if (notes !== undefined) data.notes = notes;
    if (packageId !== undefined) data.packageId = packageId;

    const updated = await prisma.booking.update({ where: { id: req.params.id }, data });

    if (req.user.role === 'ADMIN' && status && ['APPROVED', 'REJECTED', 'COMPLETED'].includes(status)) {
      const user = await prisma.user.findUnique({ where: { id: booking.userId } });
      sendBookingStatusUpdate({ email: user.email, name: user.name, booking: updated, status });
    }

    res.json({ success: true, message: 'Booking updated', data: updated });
  } catch (error) {
    next(error);
  }
};

const getMyBookings = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = { userId: req.user.id };
    if (status) where.status = status;

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { package: { select: { id: true, name: true } } },
    });
    res.json({ success: true, data: bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getBookings, getBooking, updateBookingStatus, updateBooking, deleteBooking, getMyBookings };
