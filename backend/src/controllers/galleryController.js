const { prisma } = require('../config/database');
const { deleteFile, getFileUrl } = require('../services/uploadService');

const createGalleryItem = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Image file is required' });
    }

    const { caption, category, sortOrder } = req.body;
    const imageUrl = getFileUrl(req.file.filename);

    const item = await prisma.gallery.create({
      data: {
        imageUrl,
        caption,
        category,
        sortOrder: sortOrder ? parseInt(sortOrder) : 0,
      },
    });

    res.status(201).json({ success: true, message: 'Image uploaded', data: item });
  } catch (error) {
    next(error);
  }
};

const getGallery = async (req, res, next) => {
  try {
    const { category } = req.query;
    const where = {};
    if (category) where.category = category;

    const items = await prisma.gallery.findMany({
      where,
      orderBy: [{ sortOrder: 'asc' }, { createdAt: 'desc' }],
    });

    res.json({ success: true, data: items });
  } catch (error) {
    next(error);
  }
};

const updateGalleryItem = async (req, res, next) => {
  try {
    const { caption, category, sortOrder } = req.body;
    const data = {};
    if (caption !== undefined) data.caption = caption;
    if (category !== undefined) data.category = category;
    if (sortOrder !== undefined) data.sortOrder = parseInt(sortOrder);

    if (req.file) {
      const old = await prisma.gallery.findUnique({ where: { id: req.params.id } });
      if (old) deleteFile(old.imageUrl);
      data.imageUrl = getFileUrl(req.file.filename);
    }

    const item = await prisma.gallery.update({
      where: { id: req.params.id },
      data,
    });

    res.json({ success: true, data: item });
  } catch (error) {
    next(error);
  }
};

const deleteGalleryItem = async (req, res, next) => {
  try {
    const item = await prisma.gallery.findUnique({ where: { id: req.params.id } });
    if (!item) {
      return res.status(404).json({ success: false, message: 'Gallery item not found' });
    }
    deleteFile(item.imageUrl);
    await prisma.gallery.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createGalleryItem, getGallery, updateGalleryItem, deleteGalleryItem };
