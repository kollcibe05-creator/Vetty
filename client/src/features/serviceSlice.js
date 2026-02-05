import {createSlice, createAsyncThunk, isRejectedWithValue} from "@reduxjs/toolkit"


export const fetchServices = createAsyncThunk("services/fetchAll", (categoryId = null) => {
    const url = categoryId ? `/services?category_id=${categoryId}` : '/services'
    return fetch(url)
    .then((r) => {
        if(!r.ok) throw new Error("Failed to fetch services")
        return r.json()
    })
    .then (data => data) 
    .catch (err => {
       return (err.message)
    }  )
})


export const fetchServiceById = createAsyncThunk("services/fetchById", (id) => {
    return fetch(`/services/${id}`)
    .then(r => {
        if (!r.ok) throw  new Error("Product not found")
        return r.json()    
        })
    .then(data => data)    
})

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
      });
    }
})

export const {clearSelectedService} = serviceSlice.actions

export default serviceSlice.reducer;