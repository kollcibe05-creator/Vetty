import { createSlice, createAsyncThunk, isAnyOf } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5555';
const config = { withCredentials: true };

// --- Thunks ---

export const login = createAsyncThunk('auth/login', async (credentials, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/login`, credentials, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const signup = createAsyncThunk('auth/signup', async (userData, { rejectWithValue }) => {
  try {
    const res = await axios.post(`${API_URL}/signup`, userData, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Signup failed');
  }
});

export const logout = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await axios.delete(`${API_URL}/logout`, config);
    return null;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'Logout failed');
  }
});

export const checkSession = createAsyncThunk('auth/checkSession', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API_URL}/check_session`, config);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.error || 'No session');
  }
});

// --- Slice ---

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    initialized: false, 
    error: null,
  },
  reducers: {
    clearAuth: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // 1. Success cases
      .addMatcher(
        isAnyOf(login.fulfilled, signup.fulfilled, checkSession.fulfilled),
        (state, action) => {
          state.user = action.payload;
          state.isAuthenticated = true;
          state.loading = false;
          state.initialized = true;
          state.error = null;
        }
      )
      // 2. Failure/Logout cases
      .addMatcher(
        isAnyOf(logout.fulfilled, checkSession.rejected),
        (state) => {
          state.user = null;
          state.isAuthenticated = false;
          state.loading = false;
          state.initialized = true;
        }
      )
      // 3. Global Loading State
      .addMatcher(
        isAnyOf(login.pending, signup.pending, checkSession.pending, logout.pending),
        (state) => {
          state.loading = true;
          state.error = null;
        }
      )
      // 4. Handle Errors
      .addMatcher(
        isAnyOf(login.rejected, signup.rejected),
        (state, action) => {
          state.loading = false;
          state.error = action.payload;
        }
      );
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;