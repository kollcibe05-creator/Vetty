
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';
import { showSpinner, hideSpinner, showNotification } from './uiSlice';

const API_URL = 'http://localhost:5555'; 

export const signup = createAsyncThunk(
  'auth/signup',
  async (userData, {dispatch,  rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Signing you up..."}))
      await axios.post(`${API_URL}/signup`, userData);
      dispatch(showNotification({
        type: "success",
        title: "successful sign up",
        message: "welcome to the pack!"
      }))
      return { success: true };
    } catch (err) {
      return rejectWithValue(err.response?.data?.msg || 'Signup failed');
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (credentials, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Logging you in..."}))
      const res = await axios.post(`${API_URL}/login`, credentials, {
        withCredentials: true // Important for session cookies
      });
      dispatch(hideSpinner())
      dispatch(showNotification({
          type: "success",
          title: "Welcome",
          message: "Enjoy our products and services!"
      }))
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      const errorMessage = err.response?.data?.error || 'Login failed';

      dispatch(showNotification({
          type: 'error',
          title: 'Login Error',
          message: errorMessage
        }));
      return rejectWithValue(err.response?.data?.error || 'Login failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/logout`, {
        withCredentials: true // Important for session cookies
      });
      dispatch(showNotification({
        type: "success",
        title: "Logged out",
        message: "You have been logged out successfully"
      }));
      return { success: true };
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Logout failed');
    }
  }
);

export const fetchProfile = createAsyncThunk(
  'auth/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/check_session`, {
        withCredentials: true // Important for session cookies
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Session expired');
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
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
    
    builder.addCase(login.pending, (state) => {
      state.loading = true;

      state.error = null;
    });
    builder.addCase(login.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(login.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });

    
    builder.addCase(fetchProfile.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(fetchProfile.fulfilled, (state, action) => {
      state.loading = false;
      state.user = action.payload;
      state.isAuthenticated = true;
    });
    builder.addCase(fetchProfile.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
      state.isAuthenticated = false;
    });

    builder.addCase(logout.pending, (state) => {
      state.loading = true;
    });
    builder.addCase(logout.fulfilled, (state) => {
      state.loading = false;
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
    });
    builder.addCase(logout.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload;
    });
  },
});

export const { clearAuth } = authSlice.actions;
export default authSlice.reducer;