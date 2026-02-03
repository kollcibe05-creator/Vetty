
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
      { path: 'mpesaForm', element: <MpesaForm /> },
      
      {
        element: <ProtectedRoute />,  
        children: [
          { path: 'profile', element: <Profile /> },
        ],
      },
      
      {
        element: <ProtectedRoute allowedRoles={['admin']} />,
        children: [
          { path: 'admin', element: <Admin /> },
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