import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { redis } from '../redis/redisClient.js';

const GUEST_KEY = (sessionId) => `cart:guest:${sessionId}`;
const TTL = parseInt(process.env.GUEST_CART_TTL || '604800', 10);

const buildItemSnapshot = (product, quantity) => ({
  product: product._id,
  quantity,
  priceSnapshot: product.price,
  titleSnapshot: product.title,
  imageSnapshot: product.images?.[0] || '',
});

const calcTotals = (items) => ({
  totalItems: items.reduce((s, i) => s + i.quantity, 0),
  totalPrice: +items.reduce((s, i) => s + i.priceSnapshot * i.quantity, 0).toFixed(2),
});

const formatCart = (cartLike) => {
  const items = (cartLike.items || []).map((i) => ({
    product: String(i.product),
    quantity: i.quantity,
    price: i.priceSnapshot,
    title: i.titleSnapshot,
    image: i.imageSnapshot,
  }));
  const totals = calcTotals(cartLike.items || []);
  return { items, ...totals };
};

const clampToStock = (qty, stock) => Math.max(1, Math.min(qty, stock));

/* ---------------- GUEST CART (Redis) ---------------- */

export const getGuestCart = async (sessionId) => {
  if (!sessionId) return { items: [], totalItems: 0, totalPrice: 0 };
  const raw = await redis.get(GUEST_KEY(sessionId));
  const cart = raw ? JSON.parse(raw) : { items: [] };
  return formatCart(cart);
};

const saveGuestCart = async (sessionId, items) => {
  await redis.set(GUEST_KEY(sessionId), JSON.stringify({ items }), TTL);
};

export const addToGuestCart = async (sessionId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < 1) throw new Error('Out of stock');

  const raw = await redis.get(GUEST_KEY(sessionId));
  const data = raw ? JSON.parse(raw) : { items: [] };

  const existing = data.items.find((i) => String(i.product) === String(productId));
  if (existing) {
    existing.quantity = clampToStock(existing.quantity + quantity, product.stock);
  } else {
    data.items.push(buildItemSnapshot(product, clampToStock(quantity, product.stock)));
  }

  await saveGuestCart(sessionId, data.items);
  return formatCart(data);
};

export const updateGuestCartItem = async (sessionId, productId, quantity) => {
  const raw = await redis.get(GUEST_KEY(sessionId));
  const data = raw ? JSON.parse(raw) : { items: [] };
  const item = data.items.find((i) => String(i.product) === String(productId));
  if (!item) throw new Error('Item not in cart');

  if (quantity <= 0) {
    data.items = data.items.filter((i) => String(i.product) !== String(productId));
  } else {
    const product = await Product.findById(productId);
    item.quantity = clampToStock(quantity, product?.stock || quantity);
  }

  await saveGuestCart(sessionId, data.items);
  return formatCart(data);
};

export const removeFromGuestCart = async (sessionId, productId) => {
  const raw = await redis.get(GUEST_KEY(sessionId));
  const data = raw ? JSON.parse(raw) : { items: [] };
  data.items = data.items.filter((i) => String(i.product) !== String(productId));
  await saveGuestCart(sessionId, data.items);
  return formatCart(data);
};

export const clearGuestCart = async (sessionId) => {
  await redis.del(GUEST_KEY(sessionId));
  return { items: [], totalItems: 0, totalPrice: 0 };
};

/* ---------------- USER CART (MongoDB) ---------------- */

export const getUserCart = async (userId) => {
  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = await Cart.create({ user: userId, items: [] });
  return formatCart(cart);
};

export const addToUserCart = async (userId, productId, quantity = 1) => {
  const product = await Product.findById(productId);
  if (!product) throw new Error('Product not found');
  if (product.stock < 1) throw new Error('Out of stock');

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  const existing = cart.items.find((i) => String(i.product) === String(productId));
  if (existing) {
    existing.quantity = clampToStock(existing.quantity + quantity, product.stock);
    existing.priceSnapshot = product.price;
  } else {
    cart.items.push(buildItemSnapshot(product, clampToStock(quantity, product.stock)));
  }
  cart.recalc();
  await cart.save();
  return formatCart(cart);
};

export const updateUserCartItem = async (userId, productId, quantity) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new Error('Cart not found');
  const item = cart.items.find((i) => String(i.product) === String(productId));
  if (!item) throw new Error('Item not in cart');

  if (quantity <= 0) {
    cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
  } else {
    const product = await Product.findById(productId);
    item.quantity = clampToStock(quantity, product?.stock || quantity);
  }
  cart.recalc();
  await cart.save();
  return formatCart(cart);
};

export const removeFromUserCart = async (userId, productId) => {
  const cart = await Cart.findOne({ user: userId });
  if (!cart) return { items: [], totalItems: 0, totalPrice: 0 };
  cart.items = cart.items.filter((i) => String(i.product) !== String(productId));
  cart.recalc();
  await cart.save();
  return formatCart(cart);
};

export const clearUserCart = async (userId) => {
  await Cart.findOneAndUpdate(
    { user: userId },
    { $set: { items: [], totalItems: 0, totalPrice: 0 } },
    { upsert: true }
  );
  return { items: [], totalItems: 0, totalPrice: 0 };
};

/* ---------------- MERGE LOGIC ---------------- */

export const mergeGuestIntoUserCart = async (sessionId, userId) => {
  if (!sessionId) return getUserCart(userId);

  const raw = await redis.get(GUEST_KEY(sessionId));
  const guest = raw ? JSON.parse(raw) : { items: [] };

  let cart = await Cart.findOne({ user: userId });
  if (!cart) cart = new Cart({ user: userId, items: [] });

  const productIds = guest.items.map((i) => i.product);
  const products = await Product.find({ _id: { $in: productIds } });
  const productMap = new Map(products.map((p) => [String(p._id), p]));

  for (const gItem of guest.items) {
    const product = productMap.get(String(gItem.product));
    if (!product || product.stock < 1) continue;

    const existing = cart.items.find((i) => String(i.product) === String(gItem.product));
    if (existing) {
      existing.quantity = clampToStock(existing.quantity + gItem.quantity, product.stock);
      existing.priceSnapshot = product.price;
    } else {
      cart.items.push(buildItemSnapshot(product, clampToStock(gItem.quantity, product.stock)));
    }
  }

  cart.recalc();
  await cart.save();
  await redis.del(GUEST_KEY(sessionId));
  return formatCart(cart);
};
