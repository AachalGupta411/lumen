import { Link, useParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Package } from 'lucide-react';

export default function OrderSuccess() {
  const { id } = useParams();
  return (
    <div className="container-x py-16 grid place-items-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card p-8 sm:p-12 max-w-lg text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', delay: 0.2 }}
          className="mx-auto w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 grid place-items-center"
        >
          <CheckCircle2 size={48} />
        </motion.div>
        <h1 className="mt-5 text-2xl sm:text-3xl font-bold">Order placed!</h1>
        <p className="text-ink-600 mt-2">
          Thank you for shopping with Lumen. Your order confirmation has been sent to your email.
        </p>
        <p className="mt-4 text-sm text-ink-500">
          Order ID:{' '}
          <span className="font-mono font-semibold text-ink-800">
            #{id.slice(-8).toUpperCase()}
          </span>
        </p>
        <div className="mt-7 flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/profile" className="btn-secondary">
            <Package size={16} /> View orders
          </Link>
          <Link to="/products" className="btn-outline">
            Continue shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
