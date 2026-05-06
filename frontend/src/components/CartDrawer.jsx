import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ShoppingBag, Plus, Minus, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { closeCartDrawer } from '../redux/slices/uiSlice.js';
import { updateCartItem, removeCartItem } from '../redux/slices/cartSlice.js';
import { inr } from '../utils/format.js';

export default function CartDrawer() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const open = useSelector((s) => s.ui.cartDrawerOpen);
  const { items, totalPrice, totalItems } = useSelector((s) => s.cart);

  const close = () => dispatch(closeCartDrawer());

  const setQty = (productId, qty) => dispatch(updateCartItem({ productId, quantity: qty }));
  const remove = (productId) => {
    dispatch(removeCartItem({ productId }));
    toast.success('Removed from cart');
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={close}
            className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-white shadow-2xl flex flex-col"
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-ink-100">
              <div className="flex items-center gap-2">
                <ShoppingBag size={20} />
                <h3 className="font-display text-lg font-bold">Your cart</h3>
                <span className="chip">{totalItems} items</span>
              </div>
              <button onClick={close} className="btn-ghost p-2" aria-label="close">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {items.length === 0 && (
                <div className="h-full grid place-items-center text-center py-16 text-ink-500">
                  <div>
                    <ShoppingBag size={48} className="mx-auto text-ink-300" />
                    <p className="mt-3 font-medium text-ink-700">Your cart is empty</p>
                    <p className="text-sm">Add a few items to get started.</p>
                    <button
                      onClick={() => {
                        close();
                        navigate('/products');
                      }}
                      className="btn-primary mt-4"
                    >
                      Start shopping
                    </button>
                  </div>
                </div>
              )}

              <AnimatePresence initial={false}>
                {items.map((it) => (
                  <motion.div
                    layout
                    key={it.product}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    className="flex gap-3 p-3 rounded-2xl border border-ink-100 hover:border-ink-200 transition"
                  >
                    <img
                      src={it.image}
                      alt={it.title}
                      className="w-20 h-20 object-cover rounded-xl bg-ink-100"
                      onError={(e) => (e.currentTarget.src = 'https://placehold.co/200x200?text=%20')}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium line-clamp-2">{it.title}</p>
                      <p className="text-sm text-ink-500 mt-0.5">{inr(it.price)}</p>

                      <div className="mt-2 flex items-center justify-between">
                        <div className="inline-flex items-center border border-ink-200 rounded-xl">
                          <button
                            className="p-1.5 hover:bg-ink-100 rounded-l-xl"
                            onClick={() => setQty(it.product, it.quantity - 1)}
                            aria-label="decrease"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-semibold tabular-nums">
                            {it.quantity}
                          </span>
                          <button
                            className="p-1.5 hover:bg-ink-100 rounded-r-xl"
                            onClick={() => setQty(it.product, it.quantity + 1)}
                            aria-label="increase"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => remove(it.product)}
                          className="text-ink-400 hover:text-rose-600 p-1.5"
                          aria-label="remove"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {items.length > 0 && (
              <div className="border-t border-ink-100 p-4 space-y-3 bg-ink-50/40">
                <div className="flex items-center justify-between">
                  <span className="text-ink-600">Subtotal</span>
                  <span className="font-semibold text-lg">{inr(totalPrice)}</span>
                </div>
                <Link to="/cart" onClick={close} className="btn-outline w-full">
                  View cart
                </Link>
                <button
                  onClick={() => {
                    close();
                    navigate('/checkout');
                  }}
                  className="btn-primary w-full"
                >
                  Checkout
                </button>
              </div>
            )}
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
