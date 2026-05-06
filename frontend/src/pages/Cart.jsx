import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import toast from 'react-hot-toast';
import { updateCartItem, removeCartItem, clearCart } from '../redux/slices/cartSlice.js';
import { inr } from '../utils/format.js';

export default function Cart() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, totalPrice, totalItems } = useSelector((s) => s.cart);

  const tax = +(totalPrice * 0.05).toFixed(2);
  const shipping = totalPrice > 999 || totalPrice === 0 ? 0 : 49;
  const grand = totalPrice + tax + shipping;

  if (items.length === 0) {
    return (
      <div className="container-x py-16 text-center">
        <ShoppingBag size={56} className="mx-auto text-ink-300" />
        <h1 className="mt-4 text-2xl font-bold">Your cart is empty</h1>
        <p className="text-ink-500 mt-1">Start adding things you love.</p>
        <Link to="/products" className="btn-primary mt-6 inline-flex">
          Browse products <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">
        Cart <span className="text-ink-400 font-medium">({totalItems})</span>
      </h1>

      <div className="grid lg:grid-cols-[1fr_360px] gap-8">
        <div className="space-y-3">
          <AnimatePresence initial={false}>
            {items.map((it) => (
              <motion.div
                key={it.product}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: 50 }}
                className="card p-4 flex gap-4"
              >
                <Link
                  to={`/product/${it.product}`}
                  className="w-24 h-24 sm:w-28 sm:h-28 shrink-0 rounded-xl overflow-hidden bg-ink-100"
                >
                  <img src={it.image} alt={it.title} className="w-full h-full object-cover" />
                </Link>
                <div className="flex-1 min-w-0">
                  <Link
                    to={`/product/${it.product}`}
                    className="font-semibold hover:text-brand-700 line-clamp-2"
                  >
                    {it.title}
                  </Link>
                  <p className="text-ink-500 mt-1 text-sm">{inr(it.price)} each</p>

                  <div className="mt-3 flex flex-wrap items-center gap-3">
                    <div className="inline-flex items-center border border-ink-200 rounded-xl">
                      <button
                        className="p-2 hover:bg-ink-100 rounded-l-xl"
                        onClick={() =>
                          dispatch(
                            updateCartItem({ productId: it.product, quantity: it.quantity - 1 })
                          )
                        }
                      >
                        <Minus size={14} />
                      </button>
                      <span className="px-4 font-semibold tabular-nums">{it.quantity}</span>
                      <button
                        className="p-2 hover:bg-ink-100 rounded-r-xl"
                        onClick={() =>
                          dispatch(
                            updateCartItem({ productId: it.product, quantity: it.quantity + 1 })
                          )
                        }
                      >
                        <Plus size={14} />
                      </button>
                    </div>
                    <button
                      onClick={() => {
                        dispatch(removeCartItem({ productId: it.product }));
                        toast.success('Removed');
                      }}
                      className="text-ink-500 hover:text-rose-600 inline-flex items-center gap-1 text-sm"
                    >
                      <Trash2 size={15} /> Remove
                    </button>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-lg whitespace-nowrap">
                    {inr(it.price * it.quantity)}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          <button
            onClick={() => {
              dispatch(clearCart());
              toast.success('Cart cleared');
            }}
            className="text-sm text-ink-500 hover:text-rose-600 inline-flex items-center gap-1"
          >
            <Trash2 size={14} /> Clear cart
          </button>
        </div>

        <aside>
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-lg mb-4">Order summary</h3>
            <div className="space-y-2.5 text-sm">
              <Row label={`Subtotal (${totalItems} items)`} value={inr(totalPrice)} />
              <Row label="Estimated tax (5%)" value={inr(tax)} />
              <Row
                label="Shipping"
                value={shipping === 0 ? <span className="text-emerald-600 font-semibold">Free</span> : inr(shipping)}
              />
              <hr className="border-ink-100 my-2" />
              <Row label="Total" value={inr(grand)} bold />
            </div>
            <button onClick={() => navigate('/checkout')} className="btn-primary w-full mt-5">
              Proceed to checkout <ArrowRight size={16} />
            </button>
            <p className="text-xs text-ink-500 mt-3 text-center">
              Secure checkout · JWT auth · Real-time cart
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? 'text-base' : ''}`}>
    <span className={bold ? 'font-bold' : 'text-ink-600'}>{label}</span>
    <span className={bold ? 'font-extrabold' : 'font-semibold'}>{value}</span>
  </div>
);
