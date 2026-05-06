import { Router } from 'express';
import {
  getCart,
  addItem,
  updateItem,
  removeItem,
  clearCart,
  mergeCart,
} from '../controllers/cartController.js';
import { optionalAuth, protect } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getCart);
router.post('/add', optionalAuth, addItem);
router.put('/update', optionalAuth, updateItem);
router.post('/remove', optionalAuth, removeItem);
router.delete('/clear', optionalAuth, clearCart);
router.post('/merge', protect, mergeCart);

export default router;
