import {createSlice, createAsyncThunk} from "reduxjs/toolkit"

export const fetchProducts = createAsyncThunk("products/fetchAll", (categoryId = null) => {
    const url = categoryId ? `/products?category_id=${categoryId}` : '/products'
    return fetch(url)
    .then((r) => {
        if(!r.ok) throw new Error("Failed to fetch products")
        return r.json()
    })
    .then (data => data)    
})


export const fetchProductById = createAsyncThunk("products/fetchById", (id) => {
    return fetch(`/products/${id}`)
    .then(r => {
        if (!r.ok) throw  new Error("Product not found")
        return r.json()    
        })
    .then(data => data)    
})

const productSlice = createSlice({
    name: 'products',
    initialState: {items: [], selectedProduct: null, loading: false, error: null},
    extraReducers: (builder) => {
        builder
        .addCase(fetchProducts.pending, (state) => {state.loading = true})
        .addCase(fetchProducts.fulfilled, (state, action) => {
            state.loading = false
            state.items = action.payload
        })
        .addCase(fetchProductById.fulfilled, (state, action) => {
            state.selectedProduct =action.payload
        })
    }
})

export default productSlice.reducer;