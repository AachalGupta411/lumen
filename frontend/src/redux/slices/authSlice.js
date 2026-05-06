import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api.js';
import {
  setToken,
  clearToken,
  setStoredUser,
  clearStoredUser,
  getStoredUser,
  getToken,
  getSessionId,
} from '../../services/session.js';

export const login = createAsyncThunk('auth/login', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/login', { ...payload, sessionId: getSessionId() });
    setToken(data.token);
    setStoredUser(data.user);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Login failed');
  }
});

export const register = createAsyncThunk('auth/register', async (payload, { rejectWithValue }) => {
  try {
    const { data } = await api.post('/auth/register', { ...payload, sessionId: getSessionId() });
    setToken(data.token);
    setStoredUser(data.user);
    return data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Registration failed');
  }
});

export const fetchMe = createAsyncThunk('auth/me', async (_, { rejectWithValue }) => {
  try {
    const { data } = await api.get('/auth/me');
    setStoredUser(data.user);
    return data.user;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || 'Auth check failed');
  }
});

const slice = createSlice({
  name: 'auth',
  initialState: {
    user: getStoredUser(),
    token: getToken(),
    loading: false,
    error: null,
  },
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      clearToken();
      clearStoredUser();
    },
  },
  extraReducers: (b) => {
    b.addCase(login.pending, (s) => {
      s.loading = true;
      s.error = null;
    })
      .addCase(login.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(login.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(register.pending, (s) => {
        s.loading = true;
        s.error = null;
      })
      .addCase(register.fulfilled, (s, a) => {
        s.loading = false;
        s.user = a.payload.user;
        s.token = a.payload.token;
      })
      .addCase(register.rejected, (s, a) => {
        s.loading = false;
        s.error = a.payload;
      })
      .addCase(fetchMe.fulfilled, (s, a) => {
        s.user = a.payload;
      })
      .addCase(fetchMe.rejected, (s) => {
        s.user = null;
        s.token = null;
      });
  },
});

export const { logout } = slice.actions;
export default slice.reducer;
