<<<<<<< HEAD
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
=======
import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { hideSpinner, showNotification, showSpinner } from "./uiSlice"
>>>>>>> origin/dev

const API_URL = 'http://localhost:5555';

<<<<<<< HEAD
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
=======
export const fetchServices = createAsyncThunk("services/fetchAll", (categoryId = null, {dispatch, rejectWithValue}) => {
    const url = categoryId ? `/services?category_id=${categoryId}` : '/services'
    dispatch(showSpinner({message: "Loading services..."}))
    return fetch(url)
    .then((r) => {
        if(!r.ok) throw new Error("Failed to fetch services")
        return r.json()
    })
    .then (data => {
        
        dispatch(hideSpinner())
        return data
    }) 
    .catch (err => {
        dispatch(hideSpinner())
        dispatch(showNotification({
            type: 'error',
            title: 'Fetch Error',
            message: 'Failed to fetch services'
        }))
        return rejectWithValue(err.message)
    })
})
>>>>>>> origin/dev

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

<<<<<<< HEAD
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
=======
export const fetchServiceById = createAsyncThunk("services/fetchById", (id, {dispatch, rejectWithValue}) => {
    dispatch(showSpinner({message: "Fetching service detail..."}))
    return fetch(`/services/${id}`)
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
            title: 'Fetch Error',
            message: err.message || 'Failed to fetch service detail'
        }))
        return rejectWithValue(err.message)
    })   
})
>>>>>>> origin/dev

export const patchService = createAsyncThunk(
    "services/patch", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}))
        return fetch(`/services/${id}`, {
            method: "PATCH",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(fields),
        })
        .then(r => {
            if (!r.ok) throw new Error("Failed to update service")
            return r.json()
        })
        .then(data => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Service updated!"
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
export const deleteService = createAsyncThunk(
    'services/delete', 
    (id, {dispatch, rejectWithValue}) => {
        dispatch(showSpinner({message: 'Deleting Service...'}))
        return fetch(`/services/${id}`, {
           method: "DELETE" 
        })
        .then(r => {
            if (!r.ok) throw new Error("Could not delete Service")
            return r.status === 204? {id} : r.json();
        })
        .then(()=> {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: "success", 
                message: "Service deleted Successfully!"
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

export const postService = createAsyncThunk(
    "services/post", (formData, {dispatch, rejectWithValue}) => {
        const {id, ...fields} = formData;
        dispatch(showSpinner({message: "Saving Changes..."}))
        return fetch("/services", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(fields),
        })
        .then(r => {
            if (!r.ok) throw new Error("Failed to post service")
            return r.json()
        })
        .then(data => {
            dispatch(hideSpinner())
            dispatch(showNotification({
                type: 'success',
                message: "Service posted!"
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




const serviceSlice = createSlice({
<<<<<<< HEAD
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
=======
    name: 'services',
    initialState: {list: [], selectedService: null, loading: false, error: null},
    reducers: {
        clearSelectedService: (state) => {
            state.selectedService = null
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(fetchServices.pending, (state) => {
            state.loading = true
            state.error = null
        })
        .addCase(fetchServices.fulfilled, (state, action) => {
            state.loading = false
            state.list = action.payload
        })
        .addCase(fetchServices.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchServiceById.pending, (state) => {
        state.loading = true;
      })
        .addCase(fetchServiceById.fulfilled, (state, action) => {
            state.selectedService =action.payload
        })
        .addCase(fetchServiceById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(patchService.pending, (state) => {
         state.loading = true;
         state.error = null;
      })
      .addCase(patchService.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
       .addCase(patchService.fulfilled, (state, action) => {
              const index = state.list.findIndex(p => p.id == action.payload.id)
              if (index !== -1){
                  state.list[index] = action.payload
              }
            })
        .addCase(deleteService.pending, (state) => {
            state.loading = true;
            state.error = null
      })
        .addCase(deleteService.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload;
        })
        .addCase(deleteService.fulfilled, (state, action) => {
        state.list = state.list.filter(product => product.id !== action.payload)
        })
    .addCase(postService.pending, (state) => {
            state.loading = true
            state.error = null
    })
    .addCase(postService.rejected, (state) => {
    state.loading = true
    state.error = null
    })
    .addCase(postService.fulfilled, (state, action) => {
    state.list = [...state.list, action.payload]
    })
>>>>>>> origin/dev
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