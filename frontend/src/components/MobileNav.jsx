import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { X } from 'lucide-react';
import { closeMobileNav } from '../redux/slices/uiSlice.js';

const links = [
  ['/', 'Home'],
  ['/products', 'Shop all'],
  ['/products?category=Electronics', 'Electronics'],
  ['/products?category=Fashion', 'Fashion'],
  ['/products?category=Shoes', 'Shoes'],
  ['/products?category=Accessories', 'Accessories'],
  ['/products?category=Home', 'Home'],
];

export default function MobileNav() {
  const open = useSelector((s) => s.ui.mobileNavOpen);
  const dispatch = useDispatch();

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => dispatch(closeMobileNav())}
            className="fixed inset-0 z-50 bg-ink-900/40 backdrop-blur-sm md:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 220 }}
            className="fixed top-0 left-0 z-50 h-full w-[85%] max-w-sm bg-white shadow-xl md:hidden flex flex-col"
          >
            <div className="flex items-center justify-between p-4 border-b border-ink-100">
              <span className="font-display font-extrabold text-xl">Lumen</span>
              <button
                onClick={() => dispatch(closeMobileNav())}
                className="btn-ghost p-2"
                aria-label="close"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 overflow-y-auto p-2">
              {links.map(([to, label]) => (
                <Link
                  key={label}
                  to={to}
                  onClick={() => dispatch(closeMobileNav())}
                  className="block px-4 py-3 rounded-xl hover:bg-ink-100 text-ink-800 font-medium"
                >
                  {label}
                </Link>
              ))}
            </nav>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
