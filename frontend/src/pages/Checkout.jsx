import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CreditCard, Wallet, Truck, ShieldCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../services/api.js';
import { setCart } from '../redux/slices/cartSlice.js';
import { inr } from '../utils/format.js';

const paymentOptions = [
  { id: 'cod', label: 'Cash on Delivery', icon: Wallet, desc: 'Pay with cash on arrival' },
  { id: 'card', label: 'Card', icon: CreditCard, desc: 'Visa / Mastercard / RuPay' },
  { id: 'upi', label: 'UPI', icon: ShieldCheck, desc: 'GPay, PhonePe, Paytm' },
];

export default function Checkout() {
  const { items, totalPrice, totalItems } = useSelector((s) => s.cart);
  const user = useSelector((s) => s.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    name: user?.name || '',
    line1: '',
    city: '',
    state: '',
    zip: '',
    country: 'India',
    phone: '',
  });
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [placing, setPlacing] = useState(false);

  const tax = +(totalPrice * 0.05).toFixed(2);
  const shipping = totalPrice > 999 ? 0 : 49;
  const grand = totalPrice + tax + shipping;

  const place = async (e) => {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your cart is empty');
    if (!address.line1 || !address.city || !address.zip) return toast.error('Address required');

    setPlacing(true);
    try {
      const { data } = await api.post('/orders', {
        shippingAddress: address,
        paymentMethod,
      });
      dispatch(setCart({ items: [], totalItems: 0, totalPrice: 0 }));
      toast.success('Order placed!');
      navigate(`/orders/success/${data.order._id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Could not place order');
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="container-x py-8">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6">Checkout</h1>

      <form onSubmit={place} className="grid lg:grid-cols-[1fr_400px] gap-8">
        <div className="space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="card p-5"
          >
            <h2 className="font-bold text-lg flex items-center gap-2">
              <Truck size={18} className="text-brand-600" /> Shipping address
            </h2>
            <div className="grid sm:grid-cols-2 gap-3 mt-4">
              <Input label="Full name" value={address.name} onChange={(v) => setAddress({ ...address, name: v })} />
              <Input label="Phone" value={address.phone} onChange={(v) => setAddress({ ...address, phone: v })} />
              <Input
                label="Address line"
                wide
                value={address.line1}
                onChange={(v) => setAddress({ ...address, line1: v })}
              />
              <Input label="City" value={address.city} onChange={(v) => setAddress({ ...address, city: v })} />
              <Input label="State" value={address.state} onChange={(v) => setAddress({ ...address, state: v })} />
              <Input label="ZIP" value={address.zip} onChange={(v) => setAddress({ ...address, zip: v })} />
              <Input label="Country" value={address.country} onChange={(v) => setAddress({ ...address, country: v })} />
            </div>
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="card p-5"
          >
            <h2 className="font-bold text-lg flex items-center gap-2">
              <CreditCard size={18} className="text-brand-600" /> Payment method
            </h2>
            <div className="mt-4 grid sm:grid-cols-3 gap-3">
              {paymentOptions.map(({ id, label, icon: Icon, desc }) => (
                <button
                  type="button"
                  key={id}
                  onClick={() => setPaymentMethod(id)}
                  className={`text-left p-4 rounded-2xl border-2 transition ${
                    paymentMethod === id
                      ? 'border-brand-600 bg-brand-50'
                      : 'border-ink-200 hover:border-ink-300'
                  }`}
                >
                  <Icon size={20} className="text-brand-600" />
                  <p className="font-semibold mt-2">{label}</p>
                  <p className="text-xs text-ink-500">{desc}</p>
                </button>
              ))}
            </div>
            {paymentMethod !== 'cod' && (
              <p className="text-xs text-ink-500 mt-4">
                * This is a demo — no real payment will be processed.
              </p>
            )}
          </motion.section>
        </div>

        <aside>
          <div className="card p-5 sticky top-20">
            <h3 className="font-bold text-lg mb-4">
              Order summary <span className="text-ink-400 font-medium">({totalItems})</span>
            </h3>
            <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
              {items.map((it) => (
                <div key={it.product} className="flex gap-3 text-sm">
                  <img src={it.image} alt="" className="w-12 h-12 rounded-lg object-cover bg-ink-100" />
                  <div className="flex-1 min-w-0">
                    <p className="line-clamp-1 font-medium">{it.title}</p>
                    <p className="text-ink-500">
                      {it.quantity} × {inr(it.price)}
                    </p>
                  </div>
                  <p className="font-semibold">{inr(it.price * it.quantity)}</p>
                </div>
              ))}
            </div>
            <hr className="border-ink-100 my-4" />
            <div className="space-y-2 text-sm">
              <Row label="Subtotal" value={inr(totalPrice)} />
              <Row label="Tax (5%)" value={inr(tax)} />
              <Row
                label="Shipping"
                value={
                  shipping === 0 ? (
                    <span className="text-emerald-600 font-semibold">Free</span>
                  ) : (
                    inr(shipping)
                  )
                }
              />
              <hr className="border-ink-100 my-2" />
              <Row label="Total" value={inr(grand)} bold />
            </div>
            <button disabled={placing} className="btn-primary w-full mt-5">
              {placing ? 'Placing order…' : `Place order · ${inr(grand)}`}
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

const Input = ({ label, value, onChange, wide }) => (
  <label className={`block ${wide ? 'sm:col-span-2' : ''}`}>
    <span className="text-sm font-medium text-ink-700">{label}</span>
    <input
      className="input mt-1.5"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </label>
);

const Row = ({ label, value, bold }) => (
  <div className={`flex justify-between ${bold ? 'text-base' : ''}`}>
    <span className={bold ? 'font-bold' : 'text-ink-600'}>{label}</span>
    <span className={bold ? 'font-extrabold' : 'font-semibold'}>{value}</span>
  </div>
);
