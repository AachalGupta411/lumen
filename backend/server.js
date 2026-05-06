import 'dotenv/config';
import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { Server as SocketServer } from 'socket.io';

import { connectDB } from './config/db.js';
import { initRedis } from './redis/redisClient.js';
import { notFound, errorHandler } from './middleware/error.js';
import { initSockets } from './sockets/index.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import cartRoutes from './routes/cartRoutes.js';
import orderRoutes from './routes/orderRoutes.js';

const app = express();
const server = http.createServer(app);

const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(helmet());
app.use(cors({ origin: CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(morgan('dev'));
app.use(
  rateLimit({
    windowMs: 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);

app.get('/api/health', (_req, res) =>
  res.json({ status: 'ok', uptime: process.uptime(), time: new Date().toISOString() })
);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.use(notFound);
app.use(errorHandler);

const io = new SocketServer(server, {
  cors: { origin: CLIENT_URL, credentials: true },
});
app.set('io', io);
initSockets(io);

const PORT = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB();
  } catch (e) {
    console.error('[mongo] failed:', e.message);
    console.warn('[mongo] continuing without DB – API endpoints needing DB will error.');
  }
  await initRedis();
  server.listen(PORT, () => console.log(`[api] listening on http://localhost:${PORT}`));
};

start();
