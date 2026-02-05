import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Async thunks for review operations
export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/reviews`, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch reviews');
    }
  }
);

export const createReview = createAsyncThunk(
  'reviews/createReview',
  async (reviewData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/reviews`, reviewData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create review');
    }
  }
);

export const updateReview = createAsyncThunk(
  'reviews/updateReview',
  async ({ reviewId, reviewData }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/reviews/${reviewId}`, reviewData);
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update review');
    }
  }
);

export const deleteReview = createAsyncThunk(
  'reviews/deleteReview',
  async (reviewId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/reviews/${reviewId}`);
      return reviewId;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete review');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState: {
    items: [],
    currentReview: null,
    loading: false,
    error: null,
    filters: {
      productId: null,
      serviceId: null,
      rating: null,
      sortBy: 'created_at',
      sortOrder: 'desc'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentReview: (state) => {
      state.currentReview = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch reviews
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Create review
      .addCase(createReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Update review
      .addCase(updateReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateReview.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(item => item.id === action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete review
      .addCase(deleteReview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteReview.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(item => item.id !== action.payload);
      })
      .addCase(deleteReview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectReviews = (state) => state.reviews;
export const selectCurrentReview = (state) => state.reviews.currentReview;
export const selectReviewFilters = (state) => state.reviews.filters;
export const selectReviewLoading = (state) => state.reviews.loading;

export const { setFilters, clearCurrentReview, clearError } = reviewSlice.actions;
export default reviewSlice.reducer;
