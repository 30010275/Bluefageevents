const { prisma } = require('../config/database');
const { paginate, buildPaginationMeta } = require('../utils/helpers');

const createContact = async (req, res, next) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const contact = await prisma.contact.create({
      data: { name, email, phone, subject, message },
    });

    res.status(201).json({ success: true, message: 'Message sent successfully', data: contact });
  } catch (error) {
    next(error);
  }
};

const getContacts = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);

    const where = {};
    if (status) where.status = status;

    const [contacts, total] = await Promise.all([
      prisma.contact.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.contact.count({ where }),
    ]);

    res.json({
      success: true,
      data: contacts,
      pagination: buildPaginationMeta(total, p, l),
    });
  } catch (error) {
    next(error);
  }
};

const getContact = async (req, res, next) => {
  try {
    const contact = await prisma.contact.findUnique({ where: { id: req.params.id } });
    if (!contact) {
      return res.status(404).json({ success: false, message: 'Contact message not found' });
    }
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

const updateContactStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const contact = await prisma.contact.update({
      where: { id: req.params.id },
      data: { status },
    });
    res.json({ success: true, data: contact });
  } catch (error) {
    next(error);
  }
};

const deleteContact = async (req, res, next) => {
  try {
    await prisma.contact.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Contact message deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createContact, getContacts, getContact, updateContactStatus, deleteContact };
