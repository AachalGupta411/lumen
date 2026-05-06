import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, ShoppingBag, User, Menu, LogOut, Package } from 'lucide-react';
import { logout } from '../redux/slices/authSlice.js';
import { openCartDrawer, openMobileNav } from '../redux/slices/uiSlice.js';
import toast from 'react-hot-toast';

export default function Navbar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartCount = useSelector((s) => s.cart.totalItems);
  const user = useSelector((s) => s.auth.user);
  const [profileOpen, setProfileOpen] = useState(false);
  const [query, setQuery] = useState('');

  const onSearch = (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    navigate(`/products?q=${encodeURIComponent(query.trim())}`);
  };

  const onLogout = () => {
    dispatch(logout());
    toast.success('Logged out');
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-ink-100">
      <div className="container-x flex items-center gap-4 h-16">
        <button
          className="md:hidden p-2 -ml-2 rounded-lg hover:bg-ink-100"
          onClick={() => dispatch(openMobileNav())}
          aria-label="menu"
        >
          <Menu size={22} />
        </button>

        <Link to="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 grid place-items-center text-white font-display font-extrabold shadow-pop">
            L
          </div>
          <span className="font-display font-extrabold text-xl tracking-tight hidden sm:inline">
            Lumen
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 ml-4 text-sm font-medium">
          {[
            ['/', 'Home'],
            ['/products', 'Shop'],
            ['/products?category=Electronics', 'Electronics'],
            ['/products?category=Fashion', 'Fashion'],
            ['/products?category=Shoes', 'Shoes'],
          ].map(([to, label]) => (
            <NavLink
              key={label}
              to={to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg transition ${
                  isActive ? 'text-brand-700 bg-brand-50' : 'text-ink-700 hover:bg-ink-100'
                }`
              }
              end={to === '/'}
            >
              {label}
            </NavLink>
          ))}
        </nav>

        <form onSubmit={onSearch} className="flex-1 max-w-xl ml-auto hidden sm:block">
          <div className="relative">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search for products, brands and more"
              className="input pl-10"
            />
          </div>
        </form>

        <div className="flex items-center gap-1 ml-auto sm:ml-0">
          {user ? (
            <div className="relative">
              <button
                onClick={() => setProfileOpen((v) => !v)}
                onBlur={() => setTimeout(() => setProfileOpen(false), 150)}
                className="btn-ghost px-2.5 py-2"
              >
                <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 grid place-items-center font-semibold">
                  {user.name?.[0]?.toUpperCase()}
                </div>
                <span className="hidden lg:inline text-sm font-medium max-w-[8rem] truncate">
                  {user.name}
                </span>
              </button>
              <AnimatePresence>
                {profileOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute right-0 mt-2 w-56 card p-2"
                  >
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100 text-sm">
                      <User size={16} /> My Profile
                    </Link>
                    <Link to="/profile" className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-ink-100 text-sm">
                      <Package size={16} /> My Orders
                    </Link>
                    <button
                      onClick={onLogout}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-rose-50 text-rose-600 text-sm"
                    >
                      <LogOut size={16} /> Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <Link to="/login" className="btn-ghost px-3 py-2 text-sm">
              <User size={18} />
              <span className="hidden sm:inline">Sign in</span>
            </Link>
          )}

          <button
            onClick={() => dispatch(openCartDrawer())}
            className="relative btn-ghost px-3 py-2"
            aria-label="Open cart"
          >
            <ShoppingBag size={20} />
            <AnimatePresence>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0.6, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.6, opacity: 0 }}
                  className="absolute -top-0.5 -right-0.5 min-w-[20px] h-5 px-1 rounded-full bg-brand-600 text-white text-[11px] font-semibold grid place-items-center"
                >
                  {cartCount}
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
    </header>
  );
}
