import React from 'react';
import NavLink from './NavLink';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  // Helper to check if user is Admin (handles string or nested object)
  const isAdmin = user?.role === 'Admin' || user?.role?.name === 'Admin';

  // Helper for consistent link styling
  const navLinkClass = "px-4 py-2 rounded-full font-bold transition-all text-[#2D1B69] hover:text-orange-500 hover:bg-orange-50";
  const adminLinkClass = "px-4 py-2 rounded-full font-bold transition-all text-purple-700 hover:bg-purple-100";

  return (
    <nav className="bg-[#FFFBF0] border-b border-orange-100 sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 h-20 flex justify-between items-center">
        
        {/* --- LOGO --- */}
        <div className="flex items-center">
          <Link to="/home" className="text-2xl font-black text-[#2D1B69] flex items-center gap-2">
            <span className="bg-yellow-400 w-10 h-10 flex items-center justify-center rounded-xl shadow-sm">🐾</span>
            VETTY
          </Link>
        </div>

        {/* --- NAVIGATION LINKS --- */}
        <div className="hidden lg:flex items-center gap-1">
          {/* Public Links */}
          <NavLink to="/home" className={navLinkClass}>Home</NavLink>
          <NavLink to="/products" className={navLinkClass}>Products</NavLink>
          <NavLink to="/services" className={navLinkClass}>Services</NavLink>

          {isAuthenticated && (
            <>
              {/* Vertical Divider */}
              <div className="h-6 w-[1px] bg-orange-200 mx-2"></div>

              {/* --- ADMIN / SELLER SECTION --- */}
              {isAdmin ? (
                <div className="flex items-center gap-1 bg-purple-50 p-1 rounded-full border border-purple-100">
                  <NavLink to="/admin" className="px-4 py-2 rounded-full font-bold bg-[#2D1B69] text-white shadow-md">
                    Seller Dashboard
                  </NavLink>
                  <NavLink to="/admin/stock" className={adminLinkClass}>Inventory</NavLink>
                  <NavLink to="/admin/approval-stats" className={adminLinkClass}>Approvals</NavLink>
                  <NavLink to="/admin/product-form" className={adminLinkClass}>+Product</NavLink>
                </div>
              ) : (
                /* --- BUYER / USER SECTION --- */
                <div className="flex items-center gap-1">
                  <NavLink to="/profile" className={navLinkClass}>Profile</NavLink>
                  <NavLink to="/dashboard" className={navLinkClass}>My Orders</NavLink>
                  <NavLink to="/profile/service-stats" className={navLinkClass}>My Services</NavLink>
                </div>
              )}
            </>
          )}
        </div>

        {/* --- AUTH ACTIONS --- */}
        <div className="flex items-center gap-3">
          {isAuthenticated ? (
            <button 
              onClick={() => dispatch(logout())} 
              className="bg-orange-600 text-white px-6 py-2 rounded-full font-bold hover:bg-orange-700 transition-transform active:scale-95 shadow-md"
            >
              Logout
            </button>
          ) : (
            <div className="flex items-center gap-2">
              <NavLink to="/login" className="text-[#2D1B69] font-bold px-4 py-2">Login</NavLink>
              <NavLink 
                to="/signup" 
                className="bg-[#2D1B69] text-white px-6 py-2 rounded-full font-bold hover:bg-purple-800 transition-all shadow-md"
              >
                Sign Up
              </NavLink>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;