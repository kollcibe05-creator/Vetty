import { createSlice } from '@reduxjs/toolkit';

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
