
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './features/authSlice';
import cartReducer from './features/cartSlice';
import uiReducer from './features/uiSlice';
import productReducer from './features/productSlice';
import serviceReducer from './features/serviceSlice';
import reviewReducer from './features/reviewSlice';
import adminReducer from './features/adminSlice';

export const store = configureStore({
  reducer: {
    admin: adminReducer,
    auth: authReducer,
    cart: cartReducer,
    ui: uiReducer,
    products: productReducer,
    services: serviceReducer,
    reviews: reviewReducer,
    admin: adminReducer,
  },
  
  devTools: process.env.NODE_ENV !== 'production',
});