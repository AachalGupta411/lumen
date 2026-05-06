import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';

export const fetchProducts = createAsyncThunk('products/fetch', async (params = {}) => {
  const { data } = await api.get('/products', { params });
  return data;
});

export const fetchFeatured = createAsyncThunk('products/featured', async () => {
  const { data } = await api.get('/products', { params: { featured: 'true', limit: 8 } });
  return data.items;
});

export const fetchTrending = createAsyncThunk('products/trending', async () => {
  const { data } = await api.get('/products', { params: { trending: 'true', limit: 8 } });
  return data.items;
});

export const fetchProductById = createAsyncThunk('products/byId', async (id) => {
  const { data } = await api.get(`/products/${id}`);
  return data.product;
});

export const fetchCategories = createAsyncThunk('products/categories', async () => {
  const { data } = await api.get('/products/categories');
  return data.categories;
});

const slice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    pagination: { page: 1, pages: 1, total: 0 },
    featured: [],
    trending: [],
    categories: [],
    current: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (b) => {
    b.addCase(fetchProducts.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(fetchProducts.fulfilled, (s, a) => {
        s.loading = false;
        s.items = a.payload.items;
        s.pagination = a.payload.pagination;
      })
      .addCase(fetchProducts.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error?.message;
      })
      .addCase(fetchFeatured.fulfilled, (s, a) => {
        s.featured = a.payload;
      })
      .addCase(fetchTrending.fulfilled, (s, a) => {
        s.trending = a.payload;
      })
      .addCase(fetchCategories.fulfilled, (s, a) => {
        s.categories = a.payload;
      })
      .addCase(fetchProductById.pending, (s) => {
        s.current = null;
        s.loading = true;
      })
      .addCase(fetchProductById.fulfilled, (s, a) => {
        s.loading = false;
        s.current = a.payload;
      })
      .addCase(fetchProductById.rejected, (s, a) => {
        s.loading = false;
        s.error = a.error?.message;
      });
  },
});

export default slice.reducer;
