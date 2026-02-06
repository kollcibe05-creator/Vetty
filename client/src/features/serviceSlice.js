import {createSlice, createAsyncThunk} from "@reduxjs/toolkit"
import { hideSpinner, showNotification, showSpinner } from "./uiSlice"


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
    }
})

export const {clearSelectedService} = serviceSlice.actions

export default serviceSlice.reducer;