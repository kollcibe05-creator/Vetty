import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSpinner, hideSpinner, showNotification } from './uiSlice';
import { fetchProducts } from './productSlice';

const API_URL = 'https://thallous-nongraduated-doris.ngrok-free.dev';

const axiosConfig = {
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
    'ngrok-skip-browser-warning': 'true',
  },
};

const handleAsyncError = (err, dispatch, defaultMessage, rejectWithValue) => {
  dispatch(hideSpinner());
  const message = err.response?.data?.error || defaultMessage;
  dispatch(showNotification({ type: 'error', title: 'Error', message }));
  return rejectWithValue(message);
};

// --- ASYNC THUNKS ---
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Loading cart...' }));
    const res = await axios.get(`${API_URL}/cart`, axiosConfig);
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Failed to fetch cart', rejectWithValue);
  }
});

export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Adding to cart...' }));
    const res = await axios.post(`${API_URL}/cart-items`, { product_id: productId, quantity }, axiosConfig);
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Failed to add item', rejectWithValue);
  }
});

export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ cartItemId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Updating...' }));
    const res = await axios.patch(`${API_URL}/cart/${cartItemId}`, { quantity }, axiosConfig);
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Update failed', rejectWithValue);
  }
});

export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (cartItemId, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Removing...' }));
    await axios.delete(`${API_URL}/cart/${cartItemId}`, axiosConfig);
    dispatch(hideSpinner());
    return cartItemId;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Remove failed', rejectWithValue);
  }
});

export const clearCart = createAsyncThunk('cart/clearCart', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Clearing...' }));
    await axios.delete(`${API_URL}/cart`, axiosConfig);
    dispatch(hideSpinner());
    return [];
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Clear failed', rejectWithValue);
  }
});

export const processCheckout = createAsyncThunk('cart/processCheckout', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Processing order...' }));
    const res = await axios.post(`${API_URL}/check-out`, {}, axiosConfig);
    dispatch(hideSpinner());
    dispatch(fetchProducts());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Checkout failed', rejectWithValue);
  }
});

export const processMpesaPayment = createAsyncThunk('cart/processMpesaPayment', async (paymentData, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Requesting M-Pesa Prompt...' }));
    const res = await axios.post(`${API_URL}/payments/mpesa`, paymentData, axiosConfig);
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'M-Pesa Failed', rejectWithValue);
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, totalAmount: 0 },
  reducers: {
    clearError: (state) => { state.error = null; },
    calculateTotal: (state) => {
      state.totalAmount = state.items.reduce((t, i) => t + i.quantity * i.product.price, 0);
    },
  },
  extraReducers: (builder) => {
    const updateData = (state, action) => {
      state.loading = false;
      state.items = action.payload.cart_items || [];
      state.totalAmount = action.payload.total_amount || 0;
    };

    builder
      // 1. ADD ALL CASES FIRST
      .addCase(fetchCart.fulfilled, updateData)
      .addCase(addToCart.fulfilled, updateData)
      .addCase(updateCartItem.fulfilled, updateData)
      .addCase(processCheckout.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(i => i.id !== action.payload);
        state.totalAmount = state.items.reduce((t, i) => t + i.quantity * i.product.price, 0);
      })
      .addCase(processMpesaPayment.fulfilled, (state) => {
        state.loading = false;
      })
      // 2. ADD MATCHERS LAST
      .addMatcher((a) => a.type.endsWith('/pending'), (s) => { s.loading = true; s.error = null; })
      .addMatcher((a) => a.type.endsWith('/rejected'), (s, a) => { s.loading = false; s.error = a.payload; });
  },
});

export const { clearError, calculateTotal } = cartSlice.actions;
export const selectCart = (state) => state.cart;
export default cartSlice.reducer;