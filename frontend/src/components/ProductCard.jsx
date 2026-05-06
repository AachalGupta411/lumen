import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { useDispatch } from 'react-redux';
import toast from 'react-hot-toast';
import { addToCart } from '../redux/slices/cartSlice.js';
import { openCartDrawer } from '../redux/slices/uiSlice.js';
import { inr } from '../utils/format.js';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  const id = product._id || product.id;

  const onAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await dispatch(addToCart({ productId: id, quantity: 1 })).unwrap();
      toast.success('Added to cart');
      dispatch(openCartDrawer());
    } catch (err) {
      toast.error(err?.message || 'Could not add');
    }
  };

  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : 0;

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className="group"
    >
      <Link to={`/product/${id}`} className="block card overflow-hidden h-full">
        <div className="relative aspect-square bg-ink-100 overflow-hidden">
          <img
            src={product.images?.[0]}
            alt={product.title}
            className="w-full h-full object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
            onError={(e) => (e.currentTarget.src = 'https://placehold.co/600x600?text=%20')}
          />
          {discount > 0 && (
            <span className="absolute top-3 left-3 bg-rose-600 text-white text-[11px] font-bold px-2 py-1 rounded-md">
              -{discount}%
            </span>
          )}
          {product.stock <= 0 && (
            <div className="absolute inset-0 bg-white/80 grid place-items-center text-ink-700 font-semibold">
              Out of stock
            </div>
          )}
          <button
            onClick={onAdd}
            disabled={product.stock <= 0}
            className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-ink-900 text-white grid place-items-center shadow-pop opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition disabled:bg-ink-300"
            aria-label="Add to cart"
          >
            <Plus size={18} />
          </button>
        </div>
        <div className="p-3.5">
          <p className="text-[11px] uppercase tracking-wide text-ink-400 font-medium">
            {product.brand}
          </p>
          <h3 className="text-sm font-semibold line-clamp-2 mt-0.5 min-h-[2.5rem]">
            {product.title}
          </h3>
          <div className="mt-2 flex items-center gap-1 text-xs text-ink-600">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="font-medium">{product.rating?.toFixed(1) || '4.2'}</span>
            <span className="text-ink-400">({product.numReviews || 0})</span>
          </div>
          <div className="mt-2 flex items-end gap-2">
            <span className="text-lg font-bold text-ink-900">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-sm text-ink-400 line-through">{inr(product.mrp)}</span>
                <span className="text-xs font-semibold text-emerald-600">-{discount}%</span>
              </>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
