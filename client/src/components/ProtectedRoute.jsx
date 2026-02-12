import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, initialized } = useSelector((state) => state.auth);

  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Authenticating...
      </div>
    );
  }

 
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  const userRole = user?.role?.name || user?.role; 
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;