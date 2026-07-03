const { prisma } = require('../config/database');
const { sendNewsletterConfirmation } = require('../services/emailService');

const subscribe = async (req, res, next) => {
  try {
    const { email } = req.body;
    const name = req.body.name || email.split('@')[0];

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing) {
      if (!existing.isActive) {
        await prisma.newsletterSubscriber.update({
          where: { email },
          data: { isActive: true },
        });
        return res.json({ success: true, message: 'Subscription reactivated' });
      }
      return res.json({ success: true, message: 'Already subscribed' });
    }

    await prisma.newsletterSubscriber.create({ data: { email } });
    sendNewsletterConfirmation({ email, name });

    res.status(201).json({ success: true, message: 'Successfully subscribed to newsletter' });
  } catch (error) {
    next(error);
  }
};

const unsubscribe = async (req, res, next) => {
  try {
    const { email } = req.params;
    await prisma.newsletterSubscriber.update({
      where: { email },
      data: { isActive: false },
    });
    res.json({ success: true, message: 'Successfully unsubscribed' });
  } catch (error) {
    next(error);
  }
};

const getSubscribers = async (req, res, next) => {
  try {
    const subscribers = await prisma.newsletterSubscriber.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: subscribers });
  } catch (error) {
    next(error);
  }
};

module.exports = { subscribe, unsubscribe, getSubscribers };
