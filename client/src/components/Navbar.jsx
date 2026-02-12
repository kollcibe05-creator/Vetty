

import NavLink from './NavLink';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { selectCart } from '../features/cartSlice';
import { fetchInventory } from '../features/adminSlice'; 




const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const cart = useSelector(selectCart);
  const dispatch = useDispatch();
  const alerts = useSelector(fetchInventory); 

  const role = user?.role?.name || user?.role;
  const isAdmin = role === 'Admin';

  // Helper for consistent link styling
  const navLinkClass = "px-4 py-2 rounded-full font-bold transition-all text-[#2D1B69] hover:text-orange-500 hover:bg-orange-50";
  const adminLinkClass = "px-4 py-2 rounded-full font-bold transition-all text-purple-700 hover:bg-purple-100";

  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">

        {/* Logo */}
        <div className="text-xl font-bold">
          <NavLink to="/home" className="hover:text-blue-200">
            Vetty
          </NavLink>
        </div>

        <div className="flex items-center space-x-6">

          {/* Public Links */}
          <NavLink to="/home">Home</NavLink>
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/services">Services</NavLink>

          {/* -------- AUTHENTICATED USERS -------- */}
          {isAuthenticated && (
            <>
              {/* Cart (Users only) */}
              {!isAdmin && (
                <NavLink
                  to="/cart"
                  className="relative p-2 hover:bg-blue-500 rounded-full transition-colors"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>

                  {cart.items?.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
                      {cart.items.length}
                    </span>
                  )}
                </NavLink>
              )}

              {/* Profile Icon */}
              <NavLink to="/profile">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-6 h-6 hover:text-blue-200"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </NavLink>

              {/* -------- ADMIN LINKS -------- */}
              {isAdmin && (
                <div className="flex items-center space-x-4 border-l border-blue-400 pl-4">
                  <NavLink to="/admin/dashboard" className="text-yellow-300">
                    AdminDashboard
                  </NavLink>
                  <NavLink to="/admin/products">Manage Products</NavLink>
                  <NavLink to="/admin/services">Manage Services</NavLink>
                  <NavLink to="/admin/categories">Manage Categories</NavLink>
                  <NavLink to="/admin/inventory-alert" className="relative p-2 hover:bg-blue-500 rounded-full transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                      d="M13 16h-1v-4h-1m1 0V8m0 4h1m4 4h1v-4h1m-1 0V8m0 4h-1m-8 4H5v-4H4m1 0V8m0 4h1" 
                    />
                  </svg>
                  {alerts.length > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-xs px-1.5 py-0.5 rounded-full">
                      {alerts.length}
                    </span>
                  )}
                </NavLink>
                  <NavLink to="/admin/delivery-zones">Manage delivery zones</NavLink>
                  <NavLink to="/admin/approval-stats">ApprovalStats</NavLink>
                  <NavLink to="/admin/orders">OrderStats</NavLink>
                  <NavLink to="/admin/users">userDetails</NavLink>
                </div>
              )}

              {/* -------- USER LINKS -------- */}
              {!isAdmin && (
                <NavLink to="/profile/user-dashboard">
                  My Dashboard
                </NavLink>
              )}

              {/* Logout */}
              <button
                onClick={() => dispatch(logout())}
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100 transition"
              >
                Logout
              </button>
            </>
          )}

          {/* -------- GUEST -------- */}
          {!isAuthenticated && (
            <>
              <NavLink to="/login">Login</NavLink>
              <NavLink to="/signup">Signup</NavLink>
            </>
          )}

        </div>
      </div>
    </nav>
  );
};

export default Navbar;
