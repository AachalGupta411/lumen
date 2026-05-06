import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import MainLayout from './layouts/MainLayout.jsx';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.jsx';
import Cart from './pages/Cart.jsx';
import Checkout from './pages/Checkout.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Profile from './pages/Profile.jsx';
import OrderSuccess from './pages/OrderSuccess.jsx';
import NotFound from './pages/NotFound.jsx';
import ProtectedRoute from './routes/ProtectedRoute.jsx';

import { fetchCart } from './redux/slices/cartSlice.js';
import { fetchMe } from './redux/slices/authSlice.js';
import { useCartSocket } from './hooks/useCartSocket.js';

export default function App() {
  const dispatch = useDispatch();
  const token = useSelector((s) => s.auth.token);

  useCartSocket();

  useEffect(() => {
    if (token) dispatch(fetchMe());
    dispatch(fetchCart());
  }, [token, dispatch]);

  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/products" element={<Products />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/orders/success/:id" element={<OrderSuccess />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
