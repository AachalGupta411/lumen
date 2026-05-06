import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';
import { login } from '../redux/slices/authSlice.js';
import { fetchCart } from '../redux/slices/cartSlice.js';

export default function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ email: '', password: '' });
  const [show, setShow] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!form.email || !form.password) return toast.error('Fill all fields');
    try {
      await dispatch(login(form)).unwrap();
      await dispatch(fetchCart());
      toast.success('Welcome back!');
      navigate(location.state?.from || '/');
    } catch (err) {
      toast.error(err || 'Login failed');
    }
  };

  return (
    <div className="container-x py-10 grid md:grid-cols-2 gap-10 items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="hidden md:block"
      >
        <div className="rounded-3xl overflow-hidden shadow-pop relative aspect-[4/5] bg-gradient-to-br from-brand-200 to-brand-500">
          <img
            src="https://images.unsplash.com/photo-1483985988355-763728e1935b?w=900&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover mix-blend-multiply"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="max-w-md w-full mx-auto"
      >
        <h1 className="text-3xl font-bold">Welcome back</h1>
        <p className="text-ink-500 mt-1">Sign in to sync your cart and continue.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <Field icon={Mail} label="Email">
            <input
              type="email"
              autoComplete="email"
              className="input pl-10"
              placeholder="you@example.com"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </Field>

          <Field icon={Lock} label="Password">
            <input
              type={show ? 'text' : 'password'}
              autoComplete="current-password"
              className="input pl-10 pr-10"
              placeholder="••••••••"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              onClick={() => setShow((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500"
              tabIndex={-1}
            >
              {show ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </Field>

          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="mt-5 text-sm text-ink-600">
          New to Lumen?{' '}
          <Link to="/register" className="text-brand-600 font-semibold hover:underline">
            Create an account
          </Link>
        </p>

        <div className="mt-6 p-3 rounded-xl bg-ink-100 text-xs text-ink-600">
          <span className="font-semibold">Demo:</span> demo@shop.dev / demo1234
        </div>
      </motion.div>
    </div>
  );
}

const Field = ({ icon: Icon, label, children }) => (
  <label className="block">
    <span className="text-sm font-medium text-ink-700">{label}</span>
    <div className="relative mt-1.5">
      <Icon size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-400" />
      {children}
    </div>
  </label>
);
