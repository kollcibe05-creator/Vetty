import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Helper to check if user is Admin (handles string or nested object)
  const isAdmin = user?.role === 'Admin' || user?.role?.name === 'Admin';

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <NavLink to="/home" className="hover:text-blue-200">Vetty</NavLink>
        </div>

        <div className="flex space-x-4 items-center">
          {/* Public Links */}
          <NavLink to="/home" className="hover:text-blue-200">Home</NavLink>
          <NavLink to="/products" className="hover:text-blue-200">Products</NavLink>
          <NavLink to="/services" className="hover:text-blue-200">Services</NavLink>

          {isAuthenticated ? (
            <>
              {/* --- USER SPECIFIC LINKS --- */}
              <NavLink to="/profile" className="hover:text-blue-200">Profile</NavLink>
              
              {!isAdmin && (
                <>
                  <NavLink to="/profile/service-stats" className="hover:text-blue-200">My Services</NavLink>
                  <NavLink to="/profile/product-stats" className="hover:text-blue-200">My Orders</NavLink>
                </>
              )}

              {/* --- ADMIN SPECIFIC SECTION --- */}
              {isAdmin && (
                <div className="flex space-x-3 border-l border-blue-400 pl-3">
                  <NavLink to="/admin/dashboard" className="text-yellow-300 hover:text-white">Admin Dashboard</NavLink>
                  <NavLink to="/admin/stock" className="hover:text-blue-200">Stock</NavLink>
                  <NavLink to="/admin/approval-stats" className="hover:text-blue-200">Approvals</NavLink>
                  {/* Dropdown or simple link for adding items */}
                  <NavLink to="/admin/product-form" className="hover:text-blue-200">+Product</NavLink>
                </div>
              )}

              <button 
                onClick={() => dispatch(logout())} 
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition-colors"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              {/* --- GUEST LINKS --- */}
              <NavLink to="/login" className="hover:text-blue-200">Login</NavLink>
              <NavLink to="/signup" className="hover:text-blue-200">Signup</NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;