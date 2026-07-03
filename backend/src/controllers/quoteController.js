const { prisma } = require('../config/database');
const { sendQuoteConfirmation } = require('../services/emailService');
const { paginate, buildPaginationMeta } = require('../utils/helpers');

const createQuote = async (req, res, next) => {
  try {
    const { eventType, budget, description } = req.body;
    const userId = req.user.id;

    const quote = await prisma.quote.create({
      data: { userId, eventType, budget, description },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    sendQuoteConfirmation({ email: user.email, name: user.name, quote });

    res.status(201).json({ success: true, message: 'Quote request submitted', data: quote });
  } catch (error) {
    next(error);
  }
};

const getQuotes = async (req, res, next) => {
  try {
    const { page, limit, status } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);

    const where = {};
    if (req.user.role !== 'ADMIN') where.userId = req.user.id;
    if (status) where.status = status;

    const [quotes, total] = await Promise.all([
      prisma.quote.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: req.user.role === 'ADMIN'
          ? { user: { select: { id: true, name: true, email: true } } }
          : undefined,
      }),
      prisma.quote.count({ where }),
    ]);

    res.json({
      success: true,
      data: quotes,
      pagination: buildPaginationMeta(total, p, l),
    });
  } catch (error) {
    next(error);
  }
};

const getQuote = async (req, res, next) => {
  try {
    const quote = await prisma.quote.findUnique({
      where: { id: req.params.id },
      include: { user: { select: { id: true, name: true, email: true } } },
    });

    if (!quote) {
      return res.status(404).json({ success: false, message: 'Quote not found' });
    }
    if (req.user.role !== 'ADMIN' && quote.userId !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

const updateQuote = async (req, res, next) => {
  try {
    const { status, adminResponse } = req.body;
    const data = {};
    if (status) data.status = status;
    if (adminResponse !== undefined) data.adminResponse = adminResponse;

    const quote = await prisma.quote.update({
      where: { id: req.params.id },
      data,
    });
    res.json({ success: true, data: quote });
  } catch (error) {
    next(error);
  }
};

const deleteQuote = async (req, res, next) => {
  try {
    await prisma.quote.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Quote deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createQuote, getQuotes, getQuote, updateQuote, deleteQuote };
