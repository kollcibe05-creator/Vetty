import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5555';

// Async thunks for service operations
export const fetchServices = createAsyncThunk(
  'services/fetchServices',
  async (params = {}, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/services`, { params });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch services');
    }
  }
);

export const fetchServiceById = createAsyncThunk(
  'services/fetchServiceById',
  async (serviceId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/services/${serviceId}`);
      return res.data;
    } catch (err) {
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
      });
  },
});

// Selectors
export const selectServices = (state) => state.services;
export const selectCurrentService = (state) => state.services.currentService;
export const selectServiceFilters = (state) => state.services.filters;
export const selectServiceLoading = (state) => state.services.loading;
export const selectAppointments = (state) => state.services.appointments;

//remove the thunks (fetch Services)
export const { setFilters, clearCurrentService, clearError } = serviceSlice.actions;
export default serviceSlice.reducer;