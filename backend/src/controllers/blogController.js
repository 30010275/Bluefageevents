const { prisma } = require('../config/database');
const { createSlug, paginate, buildPaginationMeta } = require('../utils/helpers');
const { deleteFile, getFileUrl } = require('../services/uploadService');

const createBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, isPublished } = req.body;
    let slug = createSlug(title);

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      slug = `${slug}-${Date.now()}`;
    }

    const data = {
      title,
      slug,
      content,
      excerpt,
      authorId: req.user.id,
      isPublished: isPublished || false,
    };
    if (isPublished) data.publishedAt = new Date();
    if (req.file) data.coverImage = getFileUrl(req.file.filename);

    const blog = await prisma.blog.create({ data });

    res.status(201).json({ success: true, message: 'Blog post created', data: blog });
  } catch (error) {
    next(error);
  }
};

const getBlogs = async (req, res, next) => {
  try {
    const { page, limit, category, search } = req.query;
    const { skip, take, page: p, limit: l } = paginate(page, limit);

    const where = { isPublished: true };
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ];
    }

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        skip,
        take,
        orderBy: { publishedAt: 'desc' },
        select: {
          id: true, title: true, slug: true, coverImage: true, excerpt: true,
          publishedAt: true, createdAt: true,
          author: { select: { id: true, name: true } },
        },
      }),
      prisma.blog.count({ where }),
    ]);

    res.json({
      success: true,
      data: blogs,
      pagination: buildPaginationMeta(total, p, l),
    });
  } catch (error) {
    next(error);
  }
};

const getBlog = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const blog = await prisma.blog.findUnique({
      where: { slug },
      include: { author: { select: { id: true, name: true } } },
    });

    if (!blog) {
      const byId = await prisma.blog.findUnique({
        where: { id: slug },
        include: { author: { select: { id: true, name: true } } },
      });
      if (!byId || (!byId.isPublished && req.user?.role !== 'ADMIN')) {
        return res.status(404).json({ success: false, message: 'Blog post not found' });
      }
      return res.json({ success: true, data: byId });
    }

    if (!blog.isPublished && req.user?.role !== 'ADMIN') {
      return res.status(404).json({ success: false, message: 'Blog post not found' });
    }

    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const getAllBlogsAdmin = async (req, res, next) => {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { id: true, name: true } } },
    });
    res.json({ success: true, data: blogs });
  } catch (error) {
    next(error);
  }
};

const updateBlog = async (req, res, next) => {
  try {
    const { title, content, excerpt, isPublished } = req.body;
    const data = {};
    if (title !== undefined) {
      data.title = title;
      data.slug = createSlug(title);
    }
    if (content !== undefined) data.content = content;
    if (excerpt !== undefined) data.excerpt = excerpt;
    if (isPublished !== undefined) {
      data.isPublished = isPublished;
      data.publishedAt = isPublished ? new Date() : null;
    }
    if (req.file) {
      const old = await prisma.blog.findUnique({ where: { id: req.params.id } });
      if (old) deleteFile(old.coverImage);
      data.coverImage = getFileUrl(req.file.filename);
    }

    const blog = await prisma.blog.update({ where: { id: req.params.id }, data });
    res.json({ success: true, data: blog });
  } catch (error) {
    next(error);
  }
};

const deleteBlog = async (req, res, next) => {
  try {
    const blog = await prisma.blog.findUnique({ where: { id: req.params.id } });
    if (blog) deleteFile(blog.coverImage);
    await prisma.blog.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: 'Blog post deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBlog, getBlogs, getBlog, getAllBlogsAdmin, updateBlog, deleteBlog };
