import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Truck, Shield, RotateCcw, Sparkles } from 'lucide-react';
import {
  fetchFeatured,
  fetchTrending,
  fetchCategories,
} from '../redux/slices/productSlice.js';
import ProductCard from '../components/ProductCard.jsx';
import ProductGridSkeleton from '../components/ProductGridSkeleton.jsx';

const categoryColors = {
  Electronics: 'from-sky-400 to-indigo-500',
  Fashion: 'from-rose-400 to-pink-500',
  Shoes: 'from-amber-400 to-orange-500',
  Accessories: 'from-emerald-400 to-teal-500',
  Home: 'from-violet-400 to-fuchsia-500',
};

export default function Home() {
  const dispatch = useDispatch();
  const { featured, trending, categories } = useSelector((s) => s.products);

  useEffect(() => {
    dispatch(fetchFeatured());
    dispatch(fetchTrending());
    dispatch(fetchCategories());
  }, [dispatch]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-50 via-white to-amber-50" />
        <div className="container-x relative py-14 sm:py-20 grid lg:grid-cols-2 gap-10 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 chip bg-white border border-ink-100">
              <Sparkles size={14} className="text-brand-600" />
              New arrivals just dropped
            </div>
            <h1 className="mt-4 text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-[1.05]">
              Shop the <span className="text-brand-600">modern way</span>.
              <br />
              Curated. Quick. Lumen.
            </h1>
            <p className="mt-5 text-ink-600 text-lg max-w-lg">
              From everyday essentials to standout pieces — discover thoughtfully designed
              products with real-time cart and lightning-fast checkout.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link to="/products" className="btn-primary">
                Shop now <ArrowRight size={16} />
              </Link>
              <Link to="/products?trending=true" className="btn-outline">
                See trending
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-4 max-w-md">
              {[
                [Truck, 'Free shipping', 'On orders ₹999+'],
                [Shield, 'Secure pay', 'JWT-protected'],
                [RotateCcw, 'Easy returns', '7-day window'],
              ].map(([Icon, t, s]) => (
                <div key={t} className="text-xs">
                  <Icon size={20} className="text-brand-600 mb-2" />
                  <p className="font-semibold text-ink-900">{t}</p>
                  <p className="text-ink-500">{s}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="relative"
          >
            <div className="relative aspect-[5/4] rounded-3xl overflow-hidden shadow-pop bg-gradient-to-br from-brand-100 to-brand-300">
              <img
                src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=1000&q=80&auto=format&fit=crop"
                alt="Lifestyle shopping"
                className="w-full h-full object-cover mix-blend-multiply"
                onError={(e) => (e.currentTarget.style.display = 'none')}
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="absolute -bottom-4 -left-4 sm:-left-8 card p-4 max-w-[14rem]"
            >
              <p className="text-xs text-ink-500">Today only</p>
              <p className="font-bold text-ink-900">Up to 60% off</p>
              <p className="text-sm text-ink-600">on selected categories</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Categories */}
      <section className="container-x py-10">
        <div className="flex items-end justify-between mb-5">
          <h2 className="text-2xl sm:text-3xl font-bold">Shop by category</h2>
          <Link to="/products" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
          {categories.map((c) => (
            <Link
              key={c}
              to={`/products?category=${encodeURIComponent(c)}`}
              className="group relative h-28 sm:h-32 rounded-2xl overflow-hidden shadow-card"
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${
                  categoryColors[c] || 'from-ink-400 to-ink-600'
                }`}
              />
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition" />
              <div className="relative h-full p-4 flex items-end">
                <span className="text-white font-semibold text-lg drop-shadow">{c}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Featured products</h2>
            <p className="text-ink-500 text-sm mt-1">Hand-picked just for you</p>
          </div>
          <Link to="/products?featured=true" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </Link>
        </div>
        {featured.length === 0 ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {featured.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* Trending */}
      <section className="container-x py-8">
        <div className="flex items-end justify-between mb-5">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold">Trending now</h2>
            <p className="text-ink-500 text-sm mt-1">What everyone's loving this week</p>
          </div>
          <Link to="/products?trending=true" className="text-sm text-brand-600 hover:text-brand-700 font-medium">
            View all →
          </Link>
        </div>
        {trending.length === 0 ? (
          <ProductGridSkeleton />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
            {trending.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
