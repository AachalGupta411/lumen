import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './error.js';

export const protect = asyncHandler(async (req, res, next) => {
  let token;
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer ')) token = auth.split(' ')[1];

  if (!token) {
    res.status(401);
    throw new Error('Not authorized – no token');
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id);
  if (!user) {
    res.status(401);
    throw new Error('User not found');
  }
  req.user = user;
  next();
});

export const optionalAuth = asyncHandler(async (req, _res, next) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) return next();
  try {
    const decoded = jwt.verify(auth.split(' ')[1], process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id);
  } catch {
    /* ignore */
  }
  next();
});

export const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Admin only');
  }
  next();
};
