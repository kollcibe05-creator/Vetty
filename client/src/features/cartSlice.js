import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSpinner, hideSpinner, showNotification } from './uiSlice';

const API_URL = 'http://localhost:5555';

// Async thunks for cart operations
export const fetchCart = createAsyncThunk(
  'cart/fetchCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Loading cart...' }));
      const res = await axios.get(`${API_URL}/cart`, {
        withCredentials: true
      });
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Cart Error',
        message: err.response?.data?.error || 'Failed to fetch cart',
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch cart');
    }
  }
);

export const addToCart = createAsyncThunk(
  'cart/addToCart',
  async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Adding to cart...' }));
      const res = await axios.post(
        `${API_URL}/cart-items`,
        { product_id: productId, quantity },
        {
          withCredentials: true
        }
      );
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Added to Cart',
        message: 'Item successfully added to your cart',
      }));
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Cart Error',
        message: err.response?.data?.error || 'Failed to add to cart',
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to add to cart');
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/updateCartItem',
  async ({ cartItemId, quantity }, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Updating cart...' }));
      const res = await axios.patch(
        `${API_URL}/cart/${cartItemId}`,
        { quantity },
        {
          withCredentials: true
        }
      );
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Cart Updated',
        message: 'Cart item quantity updated',
      }));
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Cart Error',
        message: err.response?.data?.error || 'Failed to update cart',
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to update cart');
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/removeFromCart',
  async (cartItemId, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Removing item...' }));
      await axios.delete(`${API_URL}/cart/${cartItemId}`, {
        withCredentials: true
      });
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Item Removed',
        message: 'Item removed from cart',
      }));
      return cartItemId;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Cart Error',
        message: err.response?.data?.error || 'Failed to remove from cart',
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to remove from cart');
    }
  }
);

export const clearCart = createAsyncThunk(
  'cart/clearCart',
  async (_, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Clearing cart...' }));
      await axios.delete(`${API_URL}/cart`, {
        withCredentials: true
      });
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'success',
        title: 'Cart Cleared',
        message: 'All items removed from cart',
      }));
      return [];
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Cart Error',
        message: err.response?.data?.error || 'Failed to clear cart',
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to clear cart');
    }
  }
);

export const processMpesaPayment = createAsyncThunk(
  'cart/processMpesaPayment',
  async (paymentData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Processing M-Pesa payment...' }));
      const res = await axios.post(
        `${API_URL}/payments/mpesa`,
        paymentData,
        {
          withCredentials: true
        }
      );
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Payment Failed',
        message: err.response?.data?.error || 'Failed to process M-Pesa payment',
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to process M-Pesa payment');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    loading: false,
    error: null,
    totalAmount: 0,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    calculateTotal: (state) => {
      state.totalAmount = state.items.reduce(
        (total, item) => total + item.quantity * item.product.price,
        0
      );
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Cart
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart_items || [];
        state.totalAmount = action.payload.total_amount || 0;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add to Cart
      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart_items || [];
        state.totalAmount = action.payload.total_amount || 0;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Cart Item
      .addCase(updateCartItem.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.cart_items || [];
        state.totalAmount = action.payload.total_amount || 0;
      })
      .addCase(updateCartItem.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove from Cart
      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
        cartSlice.caseReducers.calculateTotal(state);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Clear Cart
      .addCase(clearCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
      })
      .addCase(clearCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Process M-Pesa Payment
      .addCase(processMpesaPayment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(processMpesaPayment.fulfilled, (state, action) => {
        state.loading = false;
        // Payment successful, you might want to clear cart or update payment status
        // This depends on your business logic
      })
      .addCase(processMpesaPayment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, calculateTotal } = cartSlice.actions;

// Selectors
export const selectCart = (state) => state.cart;

export default cartSlice.reducer;
