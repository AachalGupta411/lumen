import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Star, ShoppingBag, Plus, Minus, Truck, Shield, RotateCcw } from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchProductById } from '../redux/slices/productSlice.js';
import { addToCart } from '../redux/slices/cartSlice.js';
import { openCartDrawer } from '../redux/slices/uiSlice.js';
import { inr } from '../utils/format.js';

export default function ProductDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const product = useSelector((s) => s.products.current);
  const loading = useSelector((s) => s.products.loading);
  const [active, setActive] = useState(0);
  const [qty, setQty] = useState(1);

  useEffect(() => {
    dispatch(fetchProductById(id));
    setActive(0);
    setQty(1);
  }, [dispatch, id]);

  if (loading || !product) {
    return (
      <div className="container-x py-10 grid md:grid-cols-2 gap-8">
        <div className="aspect-square skeleton" />
        <div className="space-y-3">
          <div className="skeleton h-6 w-2/3" />
          <div className="skeleton h-4 w-1/3" />
          <div className="skeleton h-4 w-full" />
          <div className="skeleton h-4 w-5/6" />
        </div>
      </div>
    );
  }

  const discount =
    product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0;

  const onAdd = async () => {
    try {
      await dispatch(addToCart({ productId: product._id, quantity: qty })).unwrap();
      toast.success(`Added ${qty} to cart`);
      dispatch(openCartDrawer());
    } catch (err) {
      toast.error(err?.message || 'Could not add');
    }
  };

  return (
    <div className="container-x py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <motion.div
            key={active}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-square rounded-2xl overflow-hidden bg-ink-100"
          >
            <img
              src={product.images?.[active]}
              alt={product.title}
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = 'https://placehold.co/800x800?text=%20')}
            />
          </motion.div>
          <div className="grid grid-cols-4 gap-3 mt-3">
            {product.images?.map((src, i) => (
              <button
                key={i}
                onClick={() => setActive(i)}
                className={`aspect-square rounded-xl overflow-hidden border-2 transition ${
                  active === i ? 'border-brand-600' : 'border-transparent hover:border-ink-200'
                }`}
              >
                <img src={src} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm uppercase tracking-wide text-ink-500 font-medium">
            {product.brand} · {product.category}
          </p>
          <h1 className="mt-2 text-3xl sm:text-4xl font-bold leading-tight">{product.title}</h1>

          <div className="mt-3 flex items-center gap-3">
            <div className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 px-2 py-1 rounded-md text-sm font-semibold">
              <Star size={14} className="fill-emerald-600 text-emerald-600" />
              {product.rating?.toFixed(1)}
            </div>
            <span className="text-sm text-ink-500">{product.numReviews} reviews</span>
          </div>

          <div className="mt-5 flex items-end gap-3">
            <span className="text-3xl font-extrabold">{inr(product.price)}</span>
            {product.mrp > product.price && (
              <>
                <span className="text-lg text-ink-400 line-through">{inr(product.mrp)}</span>
                <span className="text-sm font-semibold text-emerald-600">
                  {discount}% off
                </span>
              </>
            )}
          </div>
          <p className="text-xs text-ink-500 mt-1">Inclusive of all taxes</p>

          <p className="mt-5 text-ink-700 leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-sm font-medium">Quantity</span>
            <div className="inline-flex items-center border border-ink-200 rounded-xl">
              <button
                className="p-2 hover:bg-ink-100 rounded-l-xl"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                aria-label="decrease"
              >
                <Minus size={16} />
              </button>
              <span className="px-4 font-semibold tabular-nums">{qty}</span>
              <button
                className="p-2 hover:bg-ink-100 rounded-r-xl"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                aria-label="increase"
              >
                <Plus size={16} />
              </button>
            </div>
            <span
              className={`text-sm font-medium ${
                product.stock > 5
                  ? 'text-emerald-600'
                  : product.stock > 0
                  ? 'text-amber-600'
                  : 'text-rose-600'
              }`}
            >
              {product.stock > 5
                ? 'In stock'
                : product.stock > 0
                ? `Only ${product.stock} left`
                : 'Out of stock'}
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            <button onClick={onAdd} disabled={product.stock <= 0} className="btn-primary flex-1 sm:flex-none">
              <ShoppingBag size={18} /> Add to cart
            </button>
            <button
              onClick={async () => {
                await onAdd();
              }}
              disabled={product.stock <= 0}
              className="btn-secondary flex-1 sm:flex-none"
            >
              Buy now
            </button>
          </div>

          <div className="mt-8 grid grid-cols-3 gap-4 text-xs">
            {[
              [Truck, 'Free shipping', '₹999+'],
              [Shield, 'Secure pay', 'SSL/JWT'],
              [RotateCcw, '7-day returns', 'No questions'],
            ].map(([Icon, t, s]) => (
              <div key={t} className="card p-3 text-center">
                <Icon size={18} className="mx-auto text-brand-600 mb-1" />
                <p className="font-semibold">{t}</p>
                <p className="text-ink-500">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
