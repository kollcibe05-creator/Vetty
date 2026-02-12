import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:5555';

export const fetchDashboard = createAsyncThunk(
  "admin/fetchDashboard",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/dashboard`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch dashboard"
      );
    }
  }
);

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


export const fetchAdminAppointments = createAsyncThunk(
  'admin/fetchAdminAppointments',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/appointments`, {
        withCredentials: true
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch appointments');
    }
  }
);

export const updateAdminAppointmentStatus = createAsyncThunk(
  'admin/updateAdminAppointmentStatus',
  async ({ appointmentId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${API_URL}/admin/appointments/${appointmentId}`,
        { status: status },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update appointment');
    }
  }
);

export const updateAdminOrderStatus = createAsyncThunk(
  "admin/updateAdminOrderStatus",
  async ({ orderId, status }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/admin/orders/${orderId}`, { status }, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update order status");
    }
  }
);

// Delete order
export const deleteAdminOrder = createAsyncThunk(
  "admin/deleteAdminOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/orders/${orderId}`, { withCredentials: true });
      return orderId; 
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete order");
    }
  }
);

// Categories
export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/categories`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch categories');
    }
  }
);

export const createCategory = createAsyncThunk(
  'admin/createCategory',
  async (categoryData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/categories`, categoryData, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create category');
    }
  }
);

export const updateCategory = createAsyncThunk(
  'admin/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/categories/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update category');
    }
  }
);

export const deleteCategory = createAsyncThunk(
  'admin/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/categories/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete category');
    }
  }
);

// Products
export const fetchProducts = createAsyncThunk(
  'admin/fetchProducts',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/products`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch products');
    }
  }
);

export const createProduct = createAsyncThunk(
  'admin/createProduct',
  async (productData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/products`, productData, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create product');
    }
  }
);

export const updateProduct = createAsyncThunk(
  'admin/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/products/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update product');
    }
  }
);

export const deleteProduct = createAsyncThunk(
  'admin/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/products/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete product');
    }
  }
);

// Services (same pattern as products)
export const fetchServices = createAsyncThunk(
  'admin/fetchServices',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/services`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch services');
    }
  }
);

export const createService = createAsyncThunk(
  'admin/createService',
  async (serviceData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/services`, serviceData, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create service');
    }
  }
);

export const updateService = createAsyncThunk(
  'admin/updateService',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/services/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update service');
    }
  }
);

export const deleteService = createAsyncThunk(
  'admin/deleteService',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/services/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete service');
    }
  }
);


// Fetch delivery zones
export const fetchDeliveryZones = createAsyncThunk(
  "admin/fetchDeliveryZones",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/delivery-zones`, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch delivery zones");
    }
  }
);

// Create a new delivery zone
export const createDeliveryZone = createAsyncThunk(
  "admin/createDeliveryZone",
  async (data, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_URL}/delivery-zones`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to create delivery zone");
    }
  }
);

// Update delivery zone
export const updateDeliveryZone = createAsyncThunk(
  "admin/updateDeliveryZone",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(`${API_URL}/delivery-zones/${id}`, data, { withCredentials: true });
      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to update delivery zone");
    }
  }
);

// Delete delivery zone
export const deleteDeliveryZone = createAsyncThunk(
  "admin/deleteDeliveryZone",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/delivery-zones/${id}`, { withCredentials: true });
      return id;
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to delete delivery zone");
    }
  }
);
export const fetchInventoryAlerts = createAsyncThunk(
  "admin/fetchInventoryAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/inventory`, { withCredentials: true });
      return res.data.map(item => ({
        id: item.id,
        productName: item.name,
        stock: item.stock_quantity,
        threshold: 10 // default threshold or can come from backend
      }));
    } catch (err) {
      return rejectWithValue(err.response?.data?.error || "Failed to fetch inventory alerts");
    }
  }
);

// Fetch all users
export const fetchUsers = createAsyncThunk(
  "admin/fetchUsers",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${API_URL}/admin/users`, {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to fetch users"
      );
    }
  }
);

// Update user role
export const updateUserRole = createAsyncThunk(
  "admin/updateUserRole",
  async ({ id, role_id }, { rejectWithValue }) => {
    try {
      const res = await axios.patch(
        `${API_URL}/admin/users/${id}`,
        { role_id },
        { withCredentials: true }
      );
      return res.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to update user"
      );
    }
  }
);

// Delete user
export const deleteUser = createAsyncThunk(
  "admin/deleteUser",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/admin/users/${id}`, {
        withCredentials: true,
      });
      return id;
    } catch (err) {
      return rejectWithValue(
        err.response?.data?.error || "Failed to delete user"
      );
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
  categories: [],
  products: [],
  services: [],
  loading: false,
  error: null,
  deliveryZones: [],
  users: [],
  dashboard: {}
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
      .addCase(updateAdminOrderStatus.fulfilled, (state, action) => {
    const updatedOrder = action.payload;
    const index = state.allOrders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) state.allOrders[index] = updatedOrder;
  })
  .addCase(updateAdminOrderStatus.rejected, (state, action) => {
    state.error = action.payload;
  })

  // Delete order
  .addCase(deleteAdminOrder.fulfilled, (state, action) => {
    state.allOrders = state.allOrders.filter(o => o.id !== action.payload);
  })
  .addCase(deleteAdminOrder.rejected, (state, action) => {
    state.error = action.payload;
  })
  .addCase(fetchDeliveryZones.fulfilled, (state, action) => {
    state.deliveryZones = action.payload;
  })
  .addCase(createDeliveryZone.fulfilled, (state, action) => {
    state.deliveryZones.push(action.payload);
  })
  .addCase(updateDeliveryZone.fulfilled, (state, action) => {
    const index = state.deliveryZones.findIndex(z => z.id === action.payload.id);
    if (index !== -1) state.deliveryZones[index] = action.payload;
  })
  .addCase(deleteDeliveryZone.fulfilled, (state, action) => {
    state.deliveryZones = state.deliveryZones.filter(z => z.id !== action.payload);
  })

  // Inventory alerts
  .addCase(fetchInventoryAlerts.fulfilled, (state, action) => {
    state.inventoryAlerts = action.payload;
  })
      


.addCase(fetchAdminAppointments.pending, (state) => {
  state.loading = true;
})
.addCase(fetchAdminAppointments.fulfilled, (state, action) => {
  state.loading = false;
  state.pendingAppointments = action.payload;
})
.addCase(fetchAdminAppointments.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// Update Appointment Status
.addCase(updateAdminAppointmentStatus.fulfilled, (state, action) => {
  const updated = action.payload;
  const index = state.pendingAppointments.findIndex(a => a.id === updated.id);
  if (index !== -1) {
    state.pendingAppointments[index] = updated;
  }
})
// Fetch users
.addCase(fetchUsers.fulfilled, (state, action) => {
  state.users = action.payload;
})

// Update role
.addCase(updateUserRole.fulfilled, (state, action) => {
  const index = state.users.findIndex(u => u.id === action.payload.id);
  if (index !== -1) state.users[index] = action.payload;
})

// Delete user
.addCase(deleteUser.fulfilled, (state, action) => {
  state.users = state.users.filter(u => u.id !== action.payload);
})
// FETCH PRODUCTS
.addCase(fetchProducts.pending, (state) => {
  state.loading = true;
})
.addCase(fetchProducts.fulfilled, (state, action) => {
  state.loading = false;
  state.products = action.payload;
})
.addCase(fetchProducts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})

// CREATE PRODUCT
.addCase(createProduct.fulfilled, (state, action) => {
  state.products.push(action.payload);
})

// UPDATE PRODUCT
.addCase(updateProduct.fulfilled, (state, action) => {
  const index = state.products.findIndex(p => p.id === action.payload.id);
  if (index !== -1) state.products[index] = action.payload;
})

// DELETE PRODUCT
.addCase(deleteProduct.fulfilled, (state, action) => {
  state.products = state.products.filter(p => p.id !== action.payload);
})


// FETCH CATEGORIES
.addCase(fetchCategories.fulfilled, (state, action) => {
  state.categories = action.payload;
})

// CREATE CATEGORY
.addCase(createCategory.fulfilled, (state, action) => {
  state.categories.push(action.payload);
})

// DELETE CATEGORY
.addCase(deleteCategory.fulfilled, (state, action) => {
  state.categories = state.categories.filter(c => c.id !== action.payload);
})


// FETCH SERVICES
.addCase(fetchServices.fulfilled, (state, action) => {
  state.services = action.payload;
})

// CREATE SERVICE
.addCase(createService.fulfilled, (state, action) => {
  state.services.push(action.payload);
})

// UPDATE SERVICE
.addCase(updateService.fulfilled, (state, action) => {
  const index = state.services.findIndex(s => s.id === action.payload.id);
  if (index !== -1) state.services[index] = action.payload;
})

// DELETE SERVICE
.addCase(deleteService.fulfilled, (state, action) => {
  state.services = state.services.filter(s => s.id !== action.payload);
})
.addCase(fetchDashboard.fulfilled, (state, action) => {
  state.dashboard = action.payload;
})




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
