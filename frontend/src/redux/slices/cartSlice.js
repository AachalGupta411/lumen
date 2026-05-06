import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

const empty = { items: [], totalItems: 0, totalPrice: 0 };

export const fetchCart = createAsyncThunk('cart/fetch', async () => {
  const { data } = await api.get('/cart');
  return data.cart;
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity = 1 }) => {
  const { data } = await api.post('/cart/add', { productId, quantity });
  return data.cart;
});

export const updateCartItem = createAsyncThunk('cart/update', async ({ productId, quantity }) => {
  const { data } = await api.put('/cart/update', { productId, quantity });
  return data.cart;
});

export const removeCartItem = createAsyncThunk('cart/remove', async ({ productId }) => {
  const { data } = await api.post('/cart/remove', { productId });
  return data.cart;
});

export const clearCart = createAsyncThunk('cart/clear', async () => {
  const { data } = await api.delete('/cart/clear');
  return data.cart;
});

export const mergeCart = createAsyncThunk('cart/merge', async () => {
  const { data } = await api.post('/cart/merge');
  return data.cart;
});

const slice = createSlice({
  name: 'cart',
  initialState: { ...empty, loading: false, error: null },
  reducers: {
    setCart(state, action) {
      const c = action.payload || empty;
      state.items = c.items || [];
      state.totalItems = c.totalItems || 0;
      state.totalPrice = c.totalPrice || 0;
    },
  },
  extraReducers: (b) => {
    const setOk = (s, a) => {
      const c = a.payload || empty;
      s.items = c.items || [];
      s.totalItems = c.totalItems || 0;
      s.totalPrice = c.totalPrice || 0;
      s.loading = false;
      s.error = null;
    };
    [fetchCart, addToCart, updateCartItem, removeCartItem, clearCart, mergeCart].forEach((thunk) => {
      b.addCase(thunk.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
        .addCase(thunk.fulfilled, setOk)
        .addCase(thunk.rejected, (s, a) => {
          s.loading = false;
          s.error = a.error?.message || 'Cart error';
        });
    });
  },
});

export const { setCart } = slice.actions;
export default slice.reducer;
