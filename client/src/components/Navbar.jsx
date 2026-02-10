import NavLink from './NavLink';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
// import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { selectCart } from '../features/cartSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(selectCart);
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
              <NavLink to="/cart" className="relative p-2 hover:bg-blue-500 rounded-full transition-colors">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    {items.length > 0 && (
                      <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                        {items.length}
                      </span>
                    )}
              </NavLink>
              {/* --- USER SPECIFIC LINKS --- */}
              <NavLink to="/profile/user-dashboard" className="hover:text-blue-200">Profile</NavLink>
              
              {!isAdmin && (
                <>
                   <NavLink to="/profile/user-dashboard" className="hover:text-blue-200">Dashboard</NavLink>

                {/* //   <NavLink to="/profile/service-stats" className="hover:text-blue-200">My Services</NavLink>
                //   <NavLink to="/profile/product-stats" className="hover:text-blue-200">My Orders</NavLink> */}
                </>
              )}

              {/* --- SELLER SPECIFIC SECTION --- */}
              {isAdmin && (
                <div className="flex space-x-3 border-l border-blue-400 pl-3">
                  <NavLink to="/admin" className="text-yellow-300 hover:text-white">Seller Dashboard</NavLink>
                  <NavLink to="/admin/stock" className="hover:text-blue-200">Inventory</NavLink>
                  <NavLink to="/admin/approval-stats" className="hover:text-blue-200">Approvals</NavLink>
                  <NavLink to="/admin/product-form" className="hover:text-blue-200">+Product</NavLink>
                </div>
              )}

              {/* --- BUYER SPECIFIC SECTION --- */}
              {isAuthenticated && !isAdmin && (
                <div className="flex space-x-3 border-l border-blue-400 pl-3">
                  <NavLink to="/products" className="hover:text-blue-200">Marketplace</NavLink>
                  <NavLink to="/profile" className="hover:text-blue-200">Profile</NavLink>
                  <NavLink to="/dashboard" className="hover:text-blue-200">My Orders</NavLink>
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