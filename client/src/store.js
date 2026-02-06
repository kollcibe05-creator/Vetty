// src/store.js
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';
import uiReducer from './features/uiSlice';
<<<<<<< HEAD
import productReducer from './features/productSlice';
import serviceReducer from './features/serviceSlice';
import reviewReducer from './features/reviewSlice';
=======
import serviceReducer from "./features/serviceSlice"
import productReducer from "./features/productSlice"
>>>>>>> origin/dev

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
<<<<<<< HEAD
    products: productReducer,
    services: serviceReducer,
    reviews: reviewReducer,
=======
    services: serviceReducer,
    products: productReducer,
>>>>>>> origin/dev
  },
  
  devTools: process.env.NODE_ENV !== 'production',
});