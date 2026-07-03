const { prisma } = require('../config/database');

const createPackage = async (req, res, next) => {
  try {
    const { name, description, price, features, isFeatured, badge } = req.body;

    const pkg = await prisma.package.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        features,
        isFeatured: isFeatured || false,
        badge,
      },
    });

    res.status(201).json({ success: true, message: 'Package created', data: pkg });
  } catch (error) {
    next(error);
  }
};

const getPackages = async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: packages });
  } catch (error) {
    next(error);
  }
};

const getAllPackages = async (req, res, next) => {
  try {
    const packages = await prisma.package.findMany({
      orderBy: { sortOrder: 'asc' },
    });
    res.json({ success: true, data: packages });
  } catch (error) {
    next(error);
  }
};

const getPackage = async (req, res, next) => {
  try {
    const pkg = await prisma.package.findUnique({ where: { id: req.params.id } });
    if (!pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }
    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

const updatePackage = async (req, res, next) => {
  try {
    const { name, description, price, features, isFeatured, badge, isActive, sortOrder } = req.body;
    const data = {};
    if (name) data.name = name;
    if (description !== undefined) data.description = description;
    if (price) data.price = parseFloat(price);
    if (features) data.features = features;
    if (isFeatured !== undefined) data.isFeatured = isFeatured;
    if (badge !== undefined) data.badge = badge;
    if (isActive !== undefined) data.isActive = isActive;
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);

    const pkg = await prisma.package.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: pkg });
  } catch (error) {
    next(error);
  }
};

const deletePackage = async (req, res, next) => {
  try {
    await prisma.package.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Package deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createPackage, getPackages, getAllPackages, getPackage, updatePackage, deletePackage };
