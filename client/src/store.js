// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';
import uiReducer from './features/uiSlice';
import serviceReducer from "./features/serviceSlice"
import productReducer from "./features/productSlice"

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    services: serviceReducer,
    products: productReducer,
  },
  
  devTools: process.env.NODE_ENV !== 'production',
});