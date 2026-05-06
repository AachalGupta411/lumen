import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { asyncHandler } from '../middleware/error.js';
import { clearUserCart } from '../services/cartService.js';

export const createOrder = asyncHandler(async (req, res) => {
  const { shippingAddress, paymentMethod = 'cod' } = req.body;
  if (!shippingAddress?.line1 || !shippingAddress?.city) {
    res.status(400);
    throw new Error('Shipping address required');
  }

  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart || cart.items.length === 0) {
    res.status(400);
    throw new Error('Cart is empty');
  }

  const products = await Product.find({ _id: { $in: cart.items.map((i) => i.product) } });
  const map = new Map(products.map((p) => [String(p._id), p]));

  const items = [];
  let subTotal = 0;

  for (const ci of cart.items) {
    const p = map.get(String(ci.product));
    if (!p) {
      res.status(400);
      throw new Error(`Product unavailable: ${ci.titleSnapshot}`);
    }
    if (p.stock < ci.quantity) {
      res.status(400);
      throw new Error(`Insufficient stock for ${p.title}`);
    }
    items.push({
      product: p._id,
      title: p.title,
      image: p.images?.[0] || '',
      quantity: ci.quantity,
      price: p.price,
    });
    subTotal += p.price * ci.quantity;
  }

  const tax = +(subTotal * 0.05).toFixed(2);
  const shippingFee = subTotal > 999 ? 0 : 49;
  const grandTotal = +(subTotal + tax + shippingFee).toFixed(2);

  const order = await Order.create({
    user: req.user._id,
    items,
    shippingAddress,
    paymentMethod,
    paymentStatus: paymentMethod === 'cod' ? 'pending' : 'paid',
    subTotal,
    tax,
    shippingFee,
    grandTotal,
  });

  await Promise.all(
    items.map((i) =>
      Product.updateOne({ _id: i.product }, { $inc: { stock: -i.quantity } })
    )
  );

  await clearUserCart(req.user._id);

  const io = req.app.get('io');
  if (io) io.to(`user:${req.user._id}`).emit('order:created', { orderId: order._id });

  res.status(201).json({ success: true, order });
});

export const myOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json({ success: true, orders });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
  if (!order) {
    res.status(404);
    throw new Error('Order not found');
  }
  res.json({ success: true, order });
});
