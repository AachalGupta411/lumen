import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { Package, MapPin, User } from 'lucide-react';
import api from '../services/api.js';
import { inr } from '../utils/format.js';

export default function Profile() {
  const user = useSelector((s) => s.auth.user);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    api
      .get('/orders')
      .then(({ data }) => mounted && setOrders(data.orders))
      .catch(() => {})
      .finally(() => mounted && setLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div className="container-x py-8">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="card p-6 flex items-center gap-4"
      >
        <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 grid place-items-center text-2xl font-bold">
          {user?.name?.[0]?.toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold">{user?.name}</h1>
          <p className="text-ink-500">{user?.email}</p>
        </div>
      </motion.div>

      <h2 className="mt-8 text-xl font-bold flex items-center gap-2">
        <Package size={20} /> Your orders
      </h2>

      {loading ? (
        <div className="space-y-3 mt-4">
          {[1, 2].map((i) => (
            <div key={i} className="card p-5 space-y-2">
              <div className="skeleton h-4 w-1/3" />
              <div className="skeleton h-3 w-1/4" />
            </div>
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="card p-10 text-center mt-4">
          <p className="text-ink-500">No orders yet — your future treasures will live here.</p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {orders.map((o) => (
            <motion.div
              key={o._id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="card p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-xs text-ink-500">Order #{o._id.slice(-8).toUpperCase()}</p>
                  <p className="font-semibold mt-1">
                    {new Date(o.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <span className="chip bg-brand-100 text-brand-700">{o.orderStatus}</span>
                  <span className="chip">{o.paymentMethod.toUpperCase()}</span>
                  <span className="chip bg-emerald-100 text-emerald-700">
                    {o.paymentStatus}
                  </span>
                </div>
              </div>
              <div className="mt-4 grid sm:grid-cols-[1fr_auto] gap-4">
                <div className="flex flex-wrap gap-2">
                  {o.items.slice(0, 4).map((it) => (
                    <img
                      key={it.product}
                      src={it.image}
                      alt={it.title}
                      title={it.title}
                      className="w-14 h-14 rounded-lg object-cover bg-ink-100"
                    />
                  ))}
                  {o.items.length > 4 && (
                    <div className="w-14 h-14 rounded-lg bg-ink-100 grid place-items-center text-sm font-semibold text-ink-600">
                      +{o.items.length - 4}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <p className="text-ink-500 text-sm">Total</p>
                  <p className="font-extrabold text-lg">{inr(o.grandTotal)}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
