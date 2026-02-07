import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { showSpinner, showNotification, hideSpinner } from "./uiSlice"

const API_URL = 'http://localhost:5555';

// Async thunks for product operations
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Loading products..."}));
      const res = await axios.get(`${API_URL}/products`, { params });
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Fetch Error',
        message: 'Failed to fetch products'
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Fetching product details..."}));
      const res = await axios.get(`${API_URL}/products/${productId}`);
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Not Found',
        message: err.response?.data?.error || 'Failed to fetch product'
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch product');
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/products/search`, { 
        params: { q: query } 
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to search products');
    }
  }
);

export const patchProduct = createAsyncThunk(
    "products/patch", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}));
        return axios.patch(`${API_URL}/products/${id}`, fields, {
            headers: {"Content-Type": "application/json"},
        })
        .then(res => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Product updated!"
            }))
            return res.data
        })
        .catch(err => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'error',
                title: 'Update Error',
                message: err.response?.data?.error || err.message  
            }))
            return rejectWithValue(err.response?.data?.error || err.message)
        })
    }
)

export const postProduct = createAsyncThunk(
    "products/post", (formData, {dispatch, rejectWithValue}) => {
        dispatch(showSpinner({message: "Saving Changes..."}));
        return axios.post(`${API_URL}/products`, formData, {
            headers: {"Content-Type": "application/json"},
        })
        .then(res => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Product posted!"
            }))
            return res.data
        })
        .catch(err => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'error',
                title: 'Post Error',
                message: err.response?.data?.error || err.message  
            }))
            return rejectWithValue(err.response?.data?.error || err.message)
        })
    }
)

export const deleteProduct = createAsyncThunk(
    'products/delete', 
    (id, {dispatch, rejectWithValue}) => {
        dispatch(showSpinner({message: 'Deleting Product...'}));
        return axios.delete(`${API_URL}/products/${id}`)
        .then(() => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: "success", 
                message: "Product deleted Successfully!"
            }))
            return id 
        })
        .catch(err => {
            dispatch(hideSpinner())
            dispatch(showNotification({type: 'error', title: 'Delete Failed', message: err.response?.data?.error || err.message}))
            return rejectWithValue(err.response?.data?.error || err.message)
        })
    }
)

const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    currentProduct: null,
    categories: [],
    loading: false,
    error: null,
    filters: {
      category: '',
      search: '',
      sortBy: 'name',
      sortOrder: 'asc'
    },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentProduct: (state) => {
      state.currentProduct = null;
    },
    clearSelectedProduct: (state) => {
      state.currentProduct = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentProduct = action.payload;
      })
      .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(searchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(patchProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(patchProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.items.findIndex(p => p.id == action.payload.id);
        if (index !== -1) {
          state.items[index] = action.payload;
        }
        if (state.currentProduct?.id === action.payload.id) {
          state.currentProduct = action.payload;
        }
      })
      .addCase(patchProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(product => product.id !== action.payload);
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(postProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(postProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.items = [...state.items, action.payload];
      })
      .addCase(postProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectProducts = (state) => state.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductLoading = (state) => state.products.loading;

export const { setFilters, clearCurrentProduct, clearSelectedProduct, clearError } = productSlice.actions;
export default productSlice.reducer;