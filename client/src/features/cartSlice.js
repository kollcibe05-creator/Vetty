import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axios';
import { showSpinner, hideSpinner, showNotification } from './uiSlice';

const handleAsyncError = (err, dispatch, defaultMessage, rejectWithValue) => {
  dispatch(hideSpinner());
  const message = err.response?.data?.error || defaultMessage;
  dispatch(showNotification({ type: 'error', title: 'Error', message }));
  return rejectWithValue(message);
};



export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue, dispatch, getState }) => {
  try {
    const res = await api.get('/cart');
    return res.data;
  } catch (err) {
    if (err.response?.status === 401) {
      return rejectWithValue('Not authenticated');
    }
    return rejectWithValue(err.response?.data?.error || 'Failed to fetch cart');
  } 
});

export const addToCart = createAsyncThunk('cart/add', async ({ productId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Adding to cart...' }));
    const res = await api.post('/cart-items', { product_id: productId, quantity });
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Failed to add item', rejectWithValue);
  }
});

export const processMpesaPayment = createAsyncThunk(
  'cart/processMpesaPayment',
  async (paymentData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Initiating M-Pesa payment...' }));
      const res = await api.post('/payments/mpesa', paymentData); 
      dispatch(hideSpinner());
      dispatch(showNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'Payment request sent to your phone!' 
      }));
      return res.data;
    } catch (err) {
      return handleAsyncError(err, dispatch, 'M-Pesa payment failed', rejectWithValue);
    }
  }
);

export const updateCartItem = createAsyncThunk('cart/update', async ({ itemId, quantity }, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Updating cart...' }));
    const res = await api.patch(`/cart-items/${itemId}`, { quantity });
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Failed to update item', rejectWithValue);
  }
});

export const removeFromCart = createAsyncThunk('cart/remove', async (itemId, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Removing item...' }));
    const res = await api.delete(`/cart-items/${itemId}`);
    dispatch(hideSpinner());
    return itemId; 
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Failed to remove item', rejectWithValue);
  }
});

export const clearCart = createAsyncThunk('cart/clear', async (_, { rejectWithValue, dispatch }) => {
  try {
    dispatch(showSpinner({ message: 'Clearing cart...' }));
    const res = await api.delete('/cart');
    dispatch(hideSpinner());
    return res.data;
  } catch (err) {
    return handleAsyncError(err, dispatch, 'Failed to clear cart', rejectWithValue);
  }
});

export const processCheckout = createAsyncThunk(
  'cart/checkout',
  async (checkoutData, { rejectWithValue, dispatch }) => {
    try {
      dispatch(showSpinner({ message: 'Processing checkout...' }));
      const res = await api.post('/checkout', checkoutData);
      dispatch(hideSpinner());
      dispatch(showNotification({ 
        type: 'success', 
        title: 'Success', 
        message: 'Order placed successfully!' 
      }));
     
      return res.data;
    } catch (err) {
      return handleAsyncError(err, dispatch, 'Checkout failed', rejectWithValue);
    }
  }
);


const cartSlice = createSlice({
  name: 'cart',
  initialState: { items: [], loading: false, error: null, totalAmount: 0, isAuthenticated: false },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.totalAmount = 0;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items || [];
        state.totalAmount = action.payload.total_amount || 0;
        state.isAuthenticated = true;
      })
      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.loading = false;
        // Update the item in the cart
        const updatedItem = action.payload;
        const index = state.items.findIndex(item => item.id === updatedItem.id);
        if (index !== -1) {
          state.items[index] = updatedItem;
        }
        // Recalculate total
        state.totalAmount = state.items.reduce((total, item) => total + (item.quantity * item.product.price), 0);
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the item from the cart
        const removedItemId = action.payload;
        state.items = state.items.filter(item => item.id !== removedItemId);
        // Recalculate total
        state.totalAmount = state.items.reduce((total, item) => total + (item.quantity * item.product.price) || 0, 0);
      })
      .addCase(clearCart.fulfilled, (state) => {
        state.loading = false;
        state.items = [];
        state.totalAmount = 0;
        state.isAuthenticated = false;
      })
      .addCase(processCheckout.fulfilled, (state, action) => {
        state.loading = false;
        state.items = []; 
      })
      .addCase(processMpesaPayment.fulfilled, (state) => {
        state.loading = false;
        state.totalAmount = 0; 
      })
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/pending'),
        (state) => { state.loading = true; }
      )
      .addMatcher(
        (action) => action.type.startsWith('cart/') && action.type.endsWith('/rejected'),
        (state, action) => { 
          state.loading = false; 
          state.error = action.payload;
          // Mark as unauthenticated on 401
          if (action.payload === 'Not authenticated') {
            state.isAuthenticated = false;
          }
        }
      );
  },
});


export const selectCart = (state) => state.cart || {items: [], totalAmount: 0}; 
export const selectCartTotal = (state) => state.cart?.totalAmount || 0;
export const selectCartLoading = (state) => state.cart?.loading || false;
export const selectCartError = (state) => state.cart?.error || null;

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;