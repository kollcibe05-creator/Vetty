import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

import { hideSpinner, showNotification, showSpinner } from "./uiSlice"


// const API_URL = 'http://127.0.0.1:5555';
import api from '../api/axios';


export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (filters = {}, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({ message: "Loading services..." }));


      const params = {};

      if (filters.category && filters.category !== "") {
        params.category = filters.category;
      }
      if (filters.search && filters.search !== "") {
        params.search = filters.search;
      }
      

      if (filters.sortBy) {
        params.sort_by = filters.sortBy;
      }
      if (filters.sortOrder) {
        params.sort_order = filters.sortOrder;
      }

      const res = await api.get(`/services`, { params });
      dispatch(hideSpinner());
      return res.data;
    } catch (err) {
      dispatch(hideSpinner());
      return rejectWithValue(err.response?.data?.error || 'Server Error');
    }
  }
);
export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (serviceId, { dispatch, rejectWithValue }) => {
    try {
      dispatch(showSpinner({message: "Fetching service detail..."}));
      const res = await api.get(`/services/${serviceId}`);
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
      const res = await api.get(`/services/search`, { 
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
      const res = await api.get(`/appointments`, {
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
        return api.patch(`/services/${id}`, fields, {
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
        return api.delete(`/services/${id}`)
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
        return api.post(`/services`, formData, {
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

export const createAppointment = createAsyncThunk(
  'services/createAppointment',
  async (bookingData, { dispatch, rejectWithValue }) => {
    try {
      const res = await api.post(`/appointments`, bookingData, {
        withCredentials: true 
      });
      dispatch(showNotification({ type: 'success', message: 'Booked successfully!' }));
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.error || 'Booking failed';
      dispatch(showNotification({ type: 'error', message: msg }));
      return rejectWithValue(msg);
    }
  }
);

 export const fetchUserOrders = createAsyncThunk(
  'user/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/my-orders`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch orders');
    }
  }
);
export const fetchUserAppointments = createAsyncThunk(
  'user/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(`/my-appointments`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch appointments');
    }
  }
);




const serviceSlice = createSlice({
  name: 'services',
  initialState: {
    items: [],
    currentService: null,
    categories: [],
    appointments: [],
    loading: false,
    error: null,
    userOrders: [],
    userAppointments: [],
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
      })
      .addCase(createAppointment.pending, (state) => {
            state.loading = true
            state.error = null
      })
      .addCase(createAppointment.fulfilled, (state, action) => {
            state.loading = false
            state.userAppointments.unshift(action.payload)
      })
      .addCase(createAppointment.rejected, (state, action) => {
            state.loading = false
            state.error = action.payload
      })



      .addCase(fetchUserOrders.fulfilled, (state, action) => { state.userOrders = action.payload; })
      .addCase(fetchUserAppointments.fulfilled, (state, action) => { state.userAppointments = action.payload; })
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