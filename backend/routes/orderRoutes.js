import { Router } from 'express';
import { createOrder, myOrders, getOrderById } from '../controllers/orderController.js';
import { protect } from '../middleware/auth.js';

const router = Router();
router.post('/', protect, createOrder);
router.get('/', protect, myOrders);
router.get('/:id', protect, getOrderById);

export default router;
