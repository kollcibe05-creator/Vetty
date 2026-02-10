import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5555';

// Async thunks for admin operations
export const fetchAdminStats = createAsyncThunk(
  'admin/fetchAdminStats',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/stats`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch admin stats');
    }
  }
);

export const fetchInventory = createAsyncThunk(
  'admin/fetchInventory',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/inventory`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch inventory');
    }
  }
);

export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/orders`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch orders');
    }
  }
);

export const fetchApprovals = createAsyncThunk(
  'admin/fetchApprovals',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/approvals`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch approvals');
    }
  }
);

// Admin slice for managing sales, orders, inventory, and approvals
const initialState = {
  salesStats: [],
  allOrders: [],
  inventoryAlerts: [],
  pendingApprovals: [],
  pendingAppointments: [],
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    setSalesStats(state, action) {
      state.salesStats = action.payload;
    },
    setAllOrders(state, action) {
      state.allOrders = action.payload;
    },
    setInventoryAlerts(state, action) {
      state.inventoryAlerts = action.payload;
    },
    setPendingApprovals(state, action) {
      state.pendingApprovals = action.payload;
    },
    setPendingAppointments(state, action) {
      state.pendingAppointments = action.payload;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch admin stats
      .addCase(fetchAdminStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminStats.fulfilled, (state, action) => {
        state.loading = false;
        state.salesStats = action.payload;
      })
      .addCase(fetchAdminStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch inventory
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventoryAlerts = action.payload.map(item => ({
          id: item.id,
          productName: item.name,
          stock: item.stock_quantity,
          threshold: 10
        }));
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Fetch approvals
      .addCase(fetchApprovals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchApprovals.fulfilled, (state, action) => {
        state.loading = false;
        state.pendingApprovals = action.payload;
      })
      .addCase(fetchApprovals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  setSalesStats,
  setAllOrders,
  setInventoryAlerts,
  setPendingApprovals,
  setPendingAppointments,
  setLoading,
  setError,
} = adminSlice.actions;

export default adminSlice.reducer;
