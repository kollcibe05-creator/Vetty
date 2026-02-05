import {createSlice, createAsyncThunk} from "reduxjs/toolkit"


export const fetchServices = createAsyncThunk("services/fetchAll", (categoryId = null) => {
    const url = categoryId ? `/services?category_id=${categoryId}` : '/services'
    return fetch(url)
    .then((r) => {
        if(!r.ok) throw new Error("Failed to fetch services")
        return r.json()
    })
    .then (data => console.log(data))    
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
        .addCase(fetchServices.pending, (state) => {state.loading = true})
        .addCase(fetchServices.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(fetchServiceById.fulfilled, (state, action) => {
            state.selectedProduct =action.payload
        })
    }
})

export const {clearSelectedService} = serviceSlice.actions

export default serviceSlice.reducer;