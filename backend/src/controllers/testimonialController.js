const { prisma } = require('../config/database');

const createTestimonial = async (req, res, next) => {
  try {
    const { content, rating, eventType } = req.body;

    const testimonial = await prisma.testimonial.create({
      data: {
        userId: req.user.id,
        content,
        rating: rating ? parseInt(rating) : 5,
        eventType,
        status: 'PENDING',
      },
    });

    res.status(201).json({ success: true, message: 'Testimonial submitted for review', data: testimonial });
  } catch (error) {
    next(error);
  }
};

const getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { status: 'APPROVED' },
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true } } },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

const getAllTestimonials = async (req, res, next) => {
  try {
    const { status } = req.query;
    const where = {};
    if (status) where.status = status;

    const testimonials = await prisma.testimonial.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, email: true } } },
    });
    res.json({ success: true, data: testimonials });
  } catch (error) {
    next(error);
  }
};

const updateTestimonial = async (req, res, next) => {
  try {
    const { status, content, rating } = req.body;
    const data = {};
    if (status) data.status = status;
    if (content) data.content = content;
    if (rating) data.rating = parseInt(rating);

    const testimonial = await prisma.testimonial.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: testimonial });
  } catch (error) {
    next(error);
  }
};

const deleteTestimonial = async (req, res, next) => {
  try {
    await prisma.testimonial.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Testimonial deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createTestimonial, getTestimonials, getAllTestimonials, updateTestimonial, deleteTestimonial };
