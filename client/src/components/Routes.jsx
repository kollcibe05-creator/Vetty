
import { createBrowserRouter, Outlet } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';


import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import Admin from './pages/Admin';  

const router = createBrowserRouter([
  {
    path: '/',
    element: <Outlet />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'signup', element: <Signup /> },

      
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
        element: <Navigate to="/profile" replace />,
      },

    
      { path: '*', element: <div>404 - Page not found</div> },
    ],
  },
]);

export default router;