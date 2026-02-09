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
  <div className="flex flex-col min-h-screen">
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
        children: [{ path: 'profile', element: <Profile /> }],
      },

      
      {
        element: <ProtectedRoute allowedRoles={['Admin']} />,
        children: [{ path: 'admin', element: <Admin /> }],
      },

      
      { path: '', element: <Navigate to="/home" replace /> },

      
      { path: '*', element: <div className="text-center mt-10 text-2xl">404 - Page not found</div> },
    ],
  },
]);

export default router;
