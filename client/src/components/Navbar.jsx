import React from 'react';
import NavLink from './NavLink';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

import { Link } from 'react-router-dom';

// import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { selectCart } from '../features/cartSlice';


const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const { items } = useSelector(selectCart);
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

              {/* --- USER / SELLER LINKS --- */}
              <NavLink to="/profile/user-dashboard" className="hover:text-blue-200">Profile</NavLink>
              
              {!isAdmin && (
                <>
                   <NavLink to="/profile/user-dashboard" className="hover:text-blue-200">Dashboard</NavLink>
                </>
               )}
`
              {isAdmin && (
                <div className="flex space-x-3 border-l border-blue-400 pl-3">
                  <NavLink to="/admin" className="text-yellow-300 hover:text-white">Seller Dashboard</NavLink>
                  <NavLink to="/admin/stock" className="hover:text-blue-200">Inventory</NavLink>
                  <NavLink to="/admin/approval-stats" className="hover:text-blue-200">Approvals</NavLink>
                  <NavLink to="/admin/product-form" className="hover:text-blue-200">+Product</NavLink>
                </div>
              )}

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