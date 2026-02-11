import { createBrowserRouter, Outlet, Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import Navbar from './Navbar';
import Footer from './Footer';

// Page Imports
import Home from '../pages/Home';
import Login from '../pages/Login';
import Signup from '../pages/Signup';
import SellerSignup from '../pages/SellerSignup';
import Products from '../pages/Products';
import Services from '../pages/Services';
import ProductDetail from '../pages/ProductDetail';
import ServiceDetail from '../pages/ServiceDetail';
import MpesaForm from '../pages/MpesaForm';
import Profile from '../pages/Profile';
import UserDashboard from '../pages/UserDashboard';
import AccountDetails from '../pages/AccountDetails';
import ServiceStats from '../pages/ServiceStats'; 
import ProductStats from '../pages/ProductStats';
import DashboardOverview from '../pages/admin/DashboardOverview';
import AdminDashboard from '../pages/AdminDashboard';
import StockManagement from '../pages/admin/StockManagement';
import ProductForm from '../pages/admin/ProductForm';
import ServiceForm from '../pages/admin/ServiceForm';
import ApprovalStats from '../pages/admin/ApprovalStats';
<<<<<<< HEAD
=======
// import UserDashboard from '../pages/allUserDashboard';
import DashboardOverview from '../pages/admin/DashboardOverview';
>>>>>>> fa9bc719277a2cb1a734b063a750d78dc189d702
import OrderRow from '../pages/admin/OrderRow';
<<<<<<< HEAD
import DebugAuth from '../pages/DebugAuth';
=======
import Cart from '../pages/Cart';
import UserDashboard from '../pages/userDashboard';

<<<<<<< HEAD
>>>>>>> origin/suleiman

=======
>>>>>>> fa9bc719277a2cb1a734b063a750d78dc189d702
const Layout = () => (
  <div className="flex flex-col min-h-screen bg-[#FFFBF0]">
    <Navbar />
    <main className="flex-grow container mx-auto px-4 py-8">
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
      // --- 1. Public Routes ---
      { path: 'home', element: <Home /> },
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },
      { path: 'seller-signup', element: <SellerSignup /> },
      { path: 'products', element: <Products /> },
      { path: 'products/:id', element: <ProductDetail /> },
      { path: 'services', element: <Services /> },
      { path: 'services/:id', element: <ServiceDetail /> },
<<<<<<< HEAD
      { path: 'mpesa-payment', element: <MpesaForm /> },
=======
      {path: 'cart', element: <Cart/>},
      { path: 'mpesaForm', element: <MpesaForm /> },
>>>>>>> origin/suleiman

      // --- 2. Shared Dashboard (History & Account) ---
      // Fix: Added lowercase roles to handle backend data inconsistencies
      {
        element: <ProtectedRoute allowedRoles={['User', 'Seller', 'Admin', 'user', 'seller', 'admin']} />,  
        children: [
          { path: 'dashboard', element: <UserDashboard /> },
          { path: 'profile', element: <Profile /> },
          { path: 'profile/account', element: <AccountDetails /> },
<<<<<<< HEAD
          
          // Fix for "My Services": Supports old and new URLs to eliminate 404s
          { path: 'my-services', element: <ServiceStats /> }, 
          { path: 'profile/service-stats', element: <ServiceStats /> }, 

          // Fix for "My Orders": Prevents unintended redirects to Home
          { path: 'my-orders', element: <ProductStats /> },   
          { path: 'profile/product-stats', element: <ProductStats /> },
=======
          // { path: 'profile/service-stats', element: <ServiceStats /> },
          // { path: 'profile/product-stats', element: <ProductStats /> },
          { path: 'profile/user-dashboard', element: <UserDashboard /> },
>>>>>>> origin/suleiman
        ],
      },

      // --- 3. Management (Sellers & Admins) ---
      {
        element: <ProtectedRoute allowedRoles={['Admin', 'Seller', 'admin', 'seller']} />,
        children: [
          { path: 'admin', element: <DashboardOverview /> },
<<<<<<< HEAD
=======
          // { path: 'admin/test', element: <TestAdmin /> },
>>>>>>> fa9bc719277a2cb1a734b063a750d78dc189d702
          { path: 'admin/dashboard', element: <AdminDashboard /> },
          { path: 'admin/stock', element: <StockManagement /> },
          { path: 'admin/add-product', element: <ProductForm /> },
          { path: 'admin/add-service', element: <ServiceForm /> },
          { path: 'admin/approvals', element: <ApprovalStats /> },
          { path: 'admin/orders', element: <OrderRow /> },
        ],
      },

<<<<<<< HEAD
      // --- 4. System Logic ---
      { path: 'debug', element: <DebugAuth /> },
=======
      
      // { path: 'debug', element: <DebugAuth /> },
>>>>>>> fa9bc719277a2cb1a734b063a750d78dc189d702
      { path: '', element: <Navigate to="/home" replace /> },
      { 
        path: '*', 
        element: (
          <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
            <span className="text-8xl mb-4">😿</span>
            <h2 className="text-3xl font-black text-[#2D1B69]">404 - Paws Not Found</h2>
            <p className="text-gray-500 mb-6 font-medium">The page wandered off into the dog park.</p>
            <button 
              onClick={() => window.location.href = '/home'}
              className="bg-orange-500 text-white px-8 py-3 rounded-full font-black shadow-lg hover:scale-105 transition-transform"
            >
              Go Back Home
            </button>
          </div>
        ) 
      },
    ],
  },
]);

export default router;