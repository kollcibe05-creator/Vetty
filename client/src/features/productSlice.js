import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSpinner, showNotification, hideSpinner } from "./uiSlice";

// testing
import api from '../api/axios';
// const API_URL = 'http://127.0.0.1:5555';

// --- Async Thunks ---
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (arg = {}, { dispatch, rejectWithValue }) => {
    const {background = false, ...filters} = arg
    try {
      if (!background) dispatch(showSpinner({message: "Loading products..."}));
      const queryParams = {}
      if (filters.category) queryParams.category = filters.category;
      if (filters.search) queryParams.search = filters.search;
      if (filters.sortBy) queryParams.sort_by = filters.sortBy;
      if (filters.sortOrder) queryParams.sort_order = filters.sortOrder;
      const res = await api.get(`/products`, { params: queryParams });
      
      if (!background) dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      if (!params.background) {
        dispatch(showNotification({ type: 'error', title: 'Fetch Error', message: 'Failed to fetch products' }));
      }
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Fetching details..."}));
      const res = await api.get(`/products/${productId}`);
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({ type: 'error', title: 'Not Found', message: 'Product could not be found' }));
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/search`, { params: { q: query } });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Search failed');
    }
  }
);


const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    loading: false,
    error: null,
    filters: { category: '', search: '', sortBy: 'name', sortOrder: 'asc' },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All
      .addCase(fetchProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; })
      .addCase(fetchProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Fetch One
      .addCase(fetchProductById.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductById.fulfilled, (state, action) => { state.loading = false; state.currentProduct = action.payload; })
      .addCase(fetchProductById.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      // Search
      .addCase(searchProducts.fulfilled, (state, action) => { state.loading = false; state.items = action.payload; });

  },
});

export const selectAllProducts = (state) => state.products.items; 

export const selectProducts = (state) => state.products;
export const selectProductFilters = (state) => state.products.filters;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductLoading = (state) => state.products.loading;

export const { setFilters, clearCurrentProduct, clearError } = productSlice.actions;
export default productSlice.reducer;