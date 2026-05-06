import User from '../models/User.js';
import { asyncHandler } from '../middleware/error.js';
import { signToken } from '../utils/jwt.js';
import { mergeGuestIntoUserCart } from '../services/cartService.js';

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, sessionId } = req.body;
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('name, email, password are required');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(409);
    throw new Error('Email already registered');
  }

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user._id });

  let cart;
  if (sessionId) cart = await mergeGuestIntoUserCart(sessionId, user._id);

  res.status(201).json({ success: true, token, user: user.toSafeJSON(), cart });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password, sessionId } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  const token = signToken({ id: user._id });
  let cart;
  if (sessionId) cart = await mergeGuestIntoUserCart(sessionId, user._id);

  res.json({ success: true, token, user: user.toSafeJSON(), cart });
});

export const me = asyncHandler(async (req, res) => {
  res.json({ success: true, user: req.user.toSafeJSON() });
});
