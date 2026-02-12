import { createBrowserRouter, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';


// Page Imports
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import SellerSignup from '../pages/SellerSignup';
import Profile from '../pages/Profile';
import MpesaForm from '../pages/MpesaForm';
import Products from '../pages/Products';
import Services from '../pages/Services';
import ProductDetail from '../pages/ProductDetail';
import ServiceDetail from '../pages/ServiceDetail';
import ApprovalStats from '../pages/admin/ApprovalStats';
import Cart from '../pages/Cart';
import UserDashboard from '../pages/userDashboard';
import AdminOrders from '../pages/admin/AdminOrders';
import CategoryAdmin from '../pages/admin/CategoryAdmin';
import ServiceAdmin from '../pages/admin/ServiceAdmin';
import ProductAdmin from '../pages/admin/AdminProduct';
import DeliveryZoneAdmin from '../pages/admin/DeliveryZoneAdmin';
import InventoryAlertAdmin from '../pages/admin/InventoryAlertAdmin';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminDashboard from '../pages/admin/AdminDashboard';
import Layout from '../pages/Layout';
import ErrorPage from '../pages/ErrorPage';


const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      // --- 1. Public Routes ---
      { path: 'home', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'seller-signup', element: <SellerSignup /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:id', element: <ServiceDetail /> },

      { path: 'mpesa-payment', element: <MpesaForm /> },

      {path: 'cart', element: <Cart/>},
      { path: 'mpesaForm', element: <MpesaForm /> },
      


      // --- 2. Shared Dashboard (History & Account) ---
      // Fix: Added lowercase roles to handle backend data inconsistencies
      {
        element: <ProtectedRoute allowedRoles={['User', 'Seller', 'Admin', 'user', 'seller', 'admin']} />,  
        children: [
          { path: 'dashboard', element: <UserDashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'profile/user-dashboard', element: <UserDashboard /> },

        ],
      },

      // --- 3. Management (Sellers & Admins) ---
      {
        element: <ProtectedRoute allowedRoles={['Admin', 'Seller', 'admin', 'seller']} />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'admin/dashboard', element: <AdminDashboard /> },
          { path: 'admin/products', element: <ProductAdmin /> },
          { path: 'admin/services', element: <ServiceAdmin/> },
          { path: 'admin/approval-stats', element: <ApprovalStats /> },
          { path: 'admin/orders', element: <AdminOrders /> },
          { path: 'admin/categories', element: <CategoryAdmin /> },
          { path: 'admin/delivery-zones', element: <DeliveryZoneAdmin /> },
          { path: 'admin/inventory-alert', element: <InventoryAlertAdmin /> },
          { path: 'admin/users', element: <AdminUsers /> },

        ],
      },
      { path: '', element: <Navigate to="/home" replace /> },

      
      { path: '*', element: <ErrorPage /> },
    ],
  },
]);

export default router;