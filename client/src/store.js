// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';
import uiReducer from './features/uiSlice';
import productReducer from './features/productSlice';
import serviceReducer from './features/serviceSlice';
import reviewReducer from './features/reviewSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    products: productReducer,
    services: serviceReducer,
    reviews: reviewReducer,
  },
  
  devTools: process.env.NODE_ENV !== 'production',
});