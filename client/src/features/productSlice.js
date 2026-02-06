<<<<<<< HEAD
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5555';
=======
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { showSpinner, showNotification, hideSpinner } from "./uiSlice"

export const fetchProducts = createAsyncThunk("products/fetchAll", (categoryId = null, {dispatch, rejectWithValue}) => {
    const url = categoryId ? `/products?category_id=${categoryId}` : '/products'
    dispatch(showSpinner({message: "Loading products..."}))
    return fetch(url)
    .then((r) => {
        if(!r.ok) throw new Error("Failed to fetch products")
        return r.json()
    })
    .then (data => {
       dispatch(hideSpinner()) 
       return data

    })   
    .catch(err => {
        dispatch(hideSpinner())
        dispatch(showNotification({
            type: "error",
            title: "Fetch Error",
            message: err.message
        }))
        return rejectWithValue(err.message)
    }) 
})
>>>>>>> origin/dev

// Async thunks for product operations
export const fetchProducts = createAsyncThunk(
  'products/fetchProducts',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/products`, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch products');
    }
  }
);

<<<<<<< HEAD
export const fetchProductById = createAsyncThunk(
  'products/fetchProductById',
  async (productId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/products/${productId}`);
      return res.data;
    } catch (err) {
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
=======
export const fetchProductById = createAsyncThunk("products/fetchById", (id, {dispatch, rejectWithValue}) => {
    dispatch(showSpinner({message: "Fetching product details..."}))
    return fetch(`/products/${id}`)
    .then(r => {
        if (!r.ok) throw  new Error("Product not found")
        return r.json()    
        })
    .then(data => {

        dispatch(hideSpinner())
        return data

    })    
    .catch(err => {
        dispatch(hideSpinner())
        dispatch(showNotification({
           type: 'error',
           title: 'Not Found',
           message: err.message 
           
        }))
        return rejectWithValue(err.message)
    })
})
export const patchProduct = createAsyncThunk(
    "products/patch", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}))
        return fetch(`/products/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(fields),
        })
        .then(r => {
            if (!r.ok) throw new Error("Failed to update product")
            return r.json()
        })
        .then(data => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Product updated!"
            }))
            return data
        })
        .catch(err => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'error',
                title: 'Update Error',
                message: err.message  
            }))
            return rejectWithValue(err.message)
        })
    }
    
)
export const postProduct = createAsyncThunk(
    "products/post", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}))
        return fetch("/products", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(fields),
        })
        .then(r => {
            if (!r.ok) throw new Error("Failed to post product")
            return r.json()
        })
        .then(data => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Product posted!"
            }))
            return data
        })
        .catch(err => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'error',
                title: 'Post Error',
                message: err.message  
            }))
            return rejectWithValue(err.message)
        })
    }
    
)

export const deleteProduct = createAsyncThunk(
    'products/delete', 
    (id, {dispatch, rejectWithValue}) => {
        dispatch(showSpinner({message: 'Deleting Product...'}))
        return fetch(`/products/${id}`, {
           method: "DELETE" 
        })
        .then(r => {
            if (!r.ok) throw new Error("Could not delete product")
            return r.status === 204? {id} : r.json();
        })
        .then(()=> {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: "success", 
                message: "Product deleted Successfully!"
            }))
            return id 
        })
        .catch(err => {
            dispatch(hideSpinner())
            dispatch(showNotification({type: 'error', title: 'Delete Failed', message: err.message}))
            return rejectWithValue(err.message)
        })
        
    }
)

const productSlice = createSlice({
    name: 'products',
    initialState: {items: [], selectedProduct: null, loading: false, error: null},
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchProductById.pending, (state) => {
        state.loading = true;
      })
        .addCase(fetchProductById.fulfilled, (state, action) => {
            state.selectedProduct =action.payload
        })
        .addCase(fetchProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(patchProduct.pending, (state) => {
               state.loading = true;
               state.error = null;
            })
            .addCase(patchProduct.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })
      .addCase(patchProduct.fulfilled, (state, action) => {
        const index = state.items.findIndex(p => p.id == action.payload.id)
        if (index !== -1){
            state.items[index] = action.payload
        }
      }).addCase(deleteProduct.pending, (state) => {
               state.loading = true;
               state.error = null
            })
            .addCase(deleteProduct.rejected, (state, action) => {
              state.loading = false;
              state.error = action.payload;
            })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.items = state.items.filter(product => product.id !== action.payload)
      })
      .addCase(postProduct.pending, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(postProduct.rejected, (state) => {
        state.loading = true
        state.error = null
      })
      .addCase(postProduct.fulfilled, (state, action) => {
        state.items = [...state.items, action.payload]
      })
>>>>>>> origin/dev
    }
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
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch products
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
      
      // Fetch single product
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
      
      // Search products
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
      });
  },
});

<<<<<<< HEAD
// Selectors
export const selectProducts = (state) => state.products;
export const selectCurrentProduct = (state) => state.products.currentProduct;
export const selectProductFilters = (state) => state.products.filters;
export const selectProductLoading = (state) => state.products.loading;

export const { setFilters, clearCurrentProduct, clearError } = productSlice.actions;
=======
export const {clearSelectedProduct} = productSlice.actions;
>>>>>>> origin/dev
export default productSlice.reducer;