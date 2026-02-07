
import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Footer from './Footer';

import Login from '../pages/Login';
import Signup from '../pages/Signup';
import Profile from '../pages/Profile';
import Admin from '../pages/Admin';
import Home from '../pages/Home';
import MpesaForm from '../pages/MpesaForm';
import Products from '../pages/Products';
import Services from '../pages/Services';
import ProductDetail from '../pages/productDetail';
import ServiceDetail from '../pages/ServiceDetail';
import AccountDetails from '../pages/AccountDetails';
import ServiceStats from '../pages/ServiceStats';
import ProductStats from '../pages/ProductStats';
import AdminDashboard from '../pages/admin/Dashboard';
import AdminStats from '../pages/admin/ApprovalStats';
import StockManagement from '../pages/admin/StockManagement';
import ProductForm from '../pages/admin/ProductForm';
import ServiceForm from '../pages/admin/ServiceForm';

const Layout = () => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'home', element: <Home /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:id', element: <ServiceDetail /> },
      { path: 'mpesaForm', element: <MpesaForm /> },
      
      {
        element: <ProtectedRoute allowedRoles={['User']}/>,  
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'profile/account', element: <AccountDetails /> },
          { path: 'profile/service-stats', element: <ServiceStats /> },
          { path: 'profile/product-stats', element: <ProductStats /> },
        ],
      },
      
      {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [
          { path: 'admin', element: <Admin /> },
          { path: 'admin/stats', element: <AdminStats /> },
          { path: 'admin/dashboard', element: <AdminDashboard /> },
          { path: 'admin/stock', element: <StockManagement /> },
          { path: 'admin/product-form', element: <ProductForm /> },
          { path: 'admin/service-form', element: <ServiceForm /> },
        ],
      },
      
      {
        path: '',
        element: <Navigate to="/home" replace />,
      },
    
      { path: '*', element: <div>404 - Page not found</div> },
    ],
  },
]);

export default router;