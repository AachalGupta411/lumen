import Product from '../models/Product.js';
import { asyncHandler } from '../middleware/error.js';

export const getProducts = asyncHandler(async (req, res) => {
  const {
    q,
    category,
    minPrice,
    maxPrice,
    sort = 'newest',
    page = 1,
    limit = 12,
    featured,
    trending,
  } = req.query;

  const filter = {};
  if (q) filter.$or = [{ title: new RegExp(q, 'i') }, { tags: new RegExp(q, 'i') }];
  if (category && category !== 'all') filter.category = category;
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = +minPrice;
    if (maxPrice) filter.price.$lte = +maxPrice;
  }
  if (featured === 'true') filter.featured = true;
  if (trending === 'true') filter.trending = true;

  const sortMap = {
    newest: { createdAt: -1 },
    priceAsc: { price: 1 },
    priceDesc: { price: -1 },
    rating: { rating: -1 },
    popular: { numReviews: -1 },
  };

  const skip = (Math.max(1, +page) - 1) * +limit;
  const [items, total] = await Promise.all([
    Product.find(filter).sort(sortMap[sort] || sortMap.newest).skip(skip).limit(+limit),
    Product.countDocuments(filter),
  ]);

  res.json({
    success: true,
    items,
    pagination: { page: +page, limit: +limit, total, pages: Math.ceil(total / +limit) },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }
  res.json({ success: true, product });
});

export const getCategories = asyncHandler(async (_req, res) => {
  const cats = await Product.distinct('category');
  res.json({ success: true, categories: cats });
});
