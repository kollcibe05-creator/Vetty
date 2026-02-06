
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role?.name)) {
    return <Navigate to="/profile" replace />;
  }

  
  return <Outlet />;
};

export default ProtectedRoute;