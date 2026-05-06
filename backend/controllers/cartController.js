import { asyncHandler } from '../middleware/error.js';
import {
  getGuestCart,
  addToGuestCart,
  updateGuestCartItem,
  removeFromGuestCart,
  clearGuestCart,
  getUserCart,
  addToUserCart,
  updateUserCartItem,
  removeFromUserCart,
  clearUserCart,
  mergeGuestIntoUserCart,
} from '../services/cartService.js';

const sessionFrom = (req) => req.headers['x-session-id'] || req.body.sessionId || req.query.sessionId;

const emit = (req, userId, sessionId, cart) => {
  const io = req.app.get('io');
  if (!io) return;
  if (userId) io.to(`user:${userId}`).emit('cart:update', cart);
  else if (sessionId) io.to(`guest:${sessionId}`).emit('cart:update', cart);
};

export const getCart = asyncHandler(async (req, res) => {
  const cart = req.user
    ? await getUserCart(req.user._id)
    : await getGuestCart(sessionFrom(req));
  res.json({ success: true, cart });
});

export const addItem = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;
  const sessionId = sessionFrom(req);
  const cart = req.user
    ? await addToUserCart(req.user._id, productId, +quantity)
    : await addToGuestCart(sessionId, productId, +quantity);
  emit(req, req.user?._id, sessionId, cart);
  res.json({ success: true, cart });
});

export const updateItem = asyncHandler(async (req, res) => {
  const { productId, quantity } = req.body;
  const sessionId = sessionFrom(req);
  const cart = req.user
    ? await updateUserCartItem(req.user._id, productId, +quantity)
    : await updateGuestCartItem(sessionId, productId, +quantity);
  emit(req, req.user?._id, sessionId, cart);
  res.json({ success: true, cart });
});

export const removeItem = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const sessionId = sessionFrom(req);
  const cart = req.user
    ? await removeFromUserCart(req.user._id, productId)
    : await removeFromGuestCart(sessionId, productId);
  emit(req, req.user?._id, sessionId, cart);
  res.json({ success: true, cart });
});

export const clearCart = asyncHandler(async (req, res) => {
  const sessionId = sessionFrom(req);
  const cart = req.user ? await clearUserCart(req.user._id) : await clearGuestCart(sessionId);
  emit(req, req.user?._id, sessionId, cart);
  res.json({ success: true, cart });
});

export const mergeCart = asyncHandler(async (req, res) => {
  if (!req.user) {
    res.status(401);
    throw new Error('Login required to merge');
  }
  const sessionId = sessionFrom(req);
  const cart = await mergeGuestIntoUserCart(sessionId, req.user._id);
  emit(req, req.user._id, null, cart);
  res.json({ success: true, cart });
});
