import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { hideSpinner, showNotification, showSpinner } from "./uiSlice"

const API_URL = 'http://localhost:5555';

// Async thunks for service operations
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Loading services..."}));
      const res = await axios.get(`${API_URL}/services`, { params });
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Fetch Error',
        message: 'Failed to fetch services'
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (serviceId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Fetching service detail..."}));
      const res = await axios.get(`${API_URL}/services/${serviceId}`);
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      dispatch(showNotification({
        type: 'error',
        title: 'Fetch Error',
        message: err.message || 'Failed to fetch service detail'
      }));
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch service');
    }
  }
);

export const searchServices = createAsyncThunk(
  'services/searchServices',
  async (query, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/services/search`, { 
        params: { q: query } 
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to search services');
    }
  }
);

export const fetchAppointments = createAsyncThunk(
  'services/fetchAppointments',
  async (userId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/appointments`, {
        params: { user_id: userId }
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch appointments');
    }
  }
);

export const patchService = createAsyncThunk(
    "services/patch", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}))
        return axios.patch(`${API_URL}/services/${id}`, fields, {
            headers: {"Content-Type": "application/json"},
        })
        .then(res => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Service updated!"
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
export const deleteService = createAsyncThunk(
    'services/delete', 
    (id, {dispatch, rejectWithValue}) => {
        dispatch(showSpinner({message: 'Deleting Service...'}))
        return axios.delete(`${API_URL}/services/${id}`)
        .then(() => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: "success", 
                message: "Service deleted Successfully!"
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

export const postService = createAsyncThunk(
    "services/post", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}))
        return axios.post(`${API_URL}/services`, formData, {
            headers: {"Content-Type": "application/json"},
        })
        .then(res => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Service posted!"
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




const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    currentService: null,
    categories: [],
    appointments: [],
    loading: false,
    error: null,
    filters: {
      category: '',
      search: '',
      sortBy: 'name',
      sortOrder: 'asc'
    }
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearCurrentService: (state) => {
      state.currentService = null;
    },
    clearSelectedService: (state) => {
      state.currentService = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch services
      .addCase(fetchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch single service
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchServiceById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentService = action.payload;
      })
      .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Search services
      .addCase(searchServices.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchServices.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(searchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Patch service
      .addCase(patchService.pending, (state) => {
         state.loading = true;
         state.error = null;
      })
      .addCase(patchService.fulfilled, (state, action) => {
              state.loading = false;
              const index = state.items.findIndex(p => p.id == action.payload.id)
              if (index !== -1){
                  state.items[index] = action.payload
              }
              if (state.currentService?.id === action.payload.id) {
                  state.currentService = action.payload;
              }
      })
      .addCase(patchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete service
      .addCase(deleteService.pending, (state) => {
            state.loading = true;
            state.error = null
      })
      .addCase(deleteService.fulfilled, (state, action) => {
        state.loading = false;
        state.items = state.items.filter(service => service.id !== action.payload)
        if (state.currentService?.id === action.payload) {
            state.currentService = null;
        }
      })
      .addCase(deleteService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
      })
      
      // Post service
      .addCase(postService.pending, (state) => {
            state.loading = true
            state.error = null
      })
      .addCase(postService.fulfilled, (state, action) => {
            state.loading = false
            state.items = [...state.items, action.payload]
      })
      .addCase(postService.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
      });
  },
});

// Selectors
export const selectServices = (state) => state.services;
export const selectCurrentService = (state) => state.services.currentService;
export const selectServiceFilters = (state) => state.services.filters;
export const selectServiceLoading = (state) => state.services.loading;
export const selectAppointments = (state) => state.services.appointments;

export const { setFilters, clearCurrentService, clearSelectedService, clearError } = serviceSlice.actions;
export default serviceSlice.reducer;