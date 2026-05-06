import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { User, Mail, Lock } from 'lucide-react';
import toast from 'react-hot-toast';
import { register } from '../redux/slices/authSlice.js';
import { fetchCart } from '../redux/slices/cartSlice.js';

export default function Register() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading } = useSelector((s) => s.auth);
  const [form, setForm] = useState({ name: '', email: '', password: '' });

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password)
      return toast.error('Fill all fields');
    if (form.password.length < 6) return toast.error('Password must be 6+ characters');
    try {
      await dispatch(register(form)).unwrap();
      await dispatch(fetchCart());
      toast.success('Account created!');
      navigate('/');
    } catch (err) {
      toast.error(err || 'Registration failed');
    }
  };

  return (
    <div className="container-x py-10 grid md:grid-cols-2 gap-10 items-center min-h-[80vh]">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full mx-auto order-2 md:order-1"
      >
        <h1 className="text-3xl font-bold">Create account</h1>
        <p className="text-ink-500 mt-1">Join Lumen for a personalised shopping feed.</p>

        <form onSubmit={submit} className="mt-7 space-y-4">
          <Field icon={User} label="Full name">
            <input
              className="input pl-10"
              placeholder="Jane Doe"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </Field>
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
              type="password"
              autoComplete="new-password"
              className="input pl-10"
              placeholder="At least 6 characters"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
          </Field>

          <button disabled={loading} className="btn-primary w-full">
            {loading ? 'Creating…' : 'Create account'}
          </button>
        </form>

        <p className="mt-5 text-sm text-ink-600">
          Already have an account?{' '}
          <Link to="/login" className="text-brand-600 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="hidden md:block order-1 md:order-2"
      >
        <div className="rounded-3xl overflow-hidden shadow-pop relative aspect-[4/5] bg-gradient-to-br from-amber-200 to-rose-400">
          <img
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=900&q=80&auto=format&fit=crop"
            alt=""
            className="w-full h-full object-cover mix-blend-multiply"
          />
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
