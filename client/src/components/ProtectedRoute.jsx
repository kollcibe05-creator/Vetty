import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ allowedRoles = [] }) => {
  const { isAuthenticated, user, initialized } = useSelector((state) => state.auth);

  // 1. If we haven't checked the session yet, DON'T render children.
  // This stops the 401 waterfall because Admin components won't mount.
  if (!initialized) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Authenticating...
      </div>
    );
  }

  // 2. Redirect to login if session check failed
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  
  // 3. Role-based check
  const userRole = user?.role?.name || user?.role; 
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;