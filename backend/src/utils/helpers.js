const slugify = require('slugify');

const createSlug = (text) => {
  return slugify(text, { lower: true, strict: true, trim: true });
};

const sanitizeHtml = (text) => {
  if (!text) return '';
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
};

const stripHtml = (text) => {
  if (!text) return '';
  return text.replace(/<[^>]*>/g, '');
};

const paginate = (page = 1, limit = 10) => {
  const p = Math.max(1, parseInt(page));
  const l = Math.min(100, Math.max(1, parseInt(limit)));
  const skip = (p - 1) * l;
  return { skip, take: l, page: p, limit: l };
};

const buildPaginationMeta = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  return {
    total,
    page,
    limit,
    totalPages,
    hasNextPage: page < totalPages,
    hasPrevPage: page > 1,
  };
};

module.exports = { createSlug, sanitizeHtml, stripHtml, paginate, buildPaginationMeta };
