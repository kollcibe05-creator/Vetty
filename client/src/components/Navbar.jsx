import React from 'react';
import { NavLink as RouterNavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';
import { selectCart } from '../features/cartSlice';


const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const {items = []} = useSelector(selectCart);

  const alerts = useSelector((state) => state.admin?.inventoryAlerts || []); 
  
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const role = user?.role?.name || user?.role;
  const isAdmin = role === 'Admin';

  return (
    <nav className="bg-[#FFFBF0] py-6 px-6 sticky top-0 z-50 transition-all border-b border-orange-50">
      <div className="container mx-auto flex justify-between items-center">

        {/* 1. LOGO SECTION */}
        <div 
          onClick={() => navigate('/home')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center text-[#2D1B69] transform group-hover:rotate-12 transition-transform shadow-sm">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
              <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
            </svg>
          </div>
          <span className="text-2xl font-black text-[#2D1B69] tracking-tighter uppercase">Vetty</span>
        </div>

        {/* 2. CENTER NAVIGATION */}
        <div className="hidden md:flex items-center gap-2 bg-white/50 px-2 py-2 rounded-full border border-orange-100/50 backdrop-blur-sm">
           <ThemeNavLink to="/home">Home</ThemeNavLink>
           <ThemeNavLink to="/products">Products</ThemeNavLink>
           <ThemeNavLink to="/services">Services</ThemeNavLink>
        </div>

        {/* 3. RIGHT SECTION (Auth & Actions) */}
        <div className="flex items-center gap-6">

          {isAuthenticated ? (
            <>
              {/* --- USER ACTIONS --- */}
              {!isAdmin && (
                <div className="flex items-center gap-4">
                  {/* Cart Icon */}
                  <RouterNavLink to="/cart" className="relative group p-2">
                    <div className="text-[#2D1B69] group-hover:text-orange-500 transition-colors">
                      <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    {items?.length > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-[#FFFBF0]">
                        {items.length}
                      </span>
                    )}
                  </RouterNavLink>

                  {/* User Dashboard Link */}
                  <RouterNavLink to="/dashboard" className="hidden lg:block text-sm font-bold text-[#2D1B69] hover:text-orange-600">
                    My Dashboard
                  </RouterNavLink>
                </div>
              )}

              {/* --- ADMIN ACTIONS --- */}
              {isAdmin && (
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-orange-500 uppercase tracking-widest hidden xl:block">Admin Mode</span>
                  <div className="flex gap-2">
                    <AdminIconLink to="/admin/dashboard" title="Dashboard">📊</AdminIconLink>
                    <AdminIconLink to="/admin/products" title="Products">📦</AdminIconLink>
                    <AdminIconLink to="/admin/orders" title="Orders">📃</AdminIconLink>
                    
                    {/* Inventory Alert */}
                    <RouterNavLink to="/admin/inventory-alert" className="relative w-10 h-10 bg-red-50 text-red-600 rounded-full flex items-center justify-center hover:bg-red-100 transition-colors">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                      {alerts.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-600 w-3 h-3 rounded-full border-2 border-white"></span>
                      )}
                    </RouterNavLink>
                  </div>
                </div>
              )}

              {/* Profile & Logout */}
              <div className="pl-4 border-l border-gray-200 flex items-center gap-4">
                 <RouterNavLink to="/profile" className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center text-[#2D1B69] font-bold hover:bg-purple-200 transition-colors">
                    {user?.username?.charAt(0).toUpperCase() || 'U'}
                 </RouterNavLink>
                 <button
                  onClick={() => dispatch(logout())}
                  className="text-sm font-bold text-gray-400 hover:text-red-500 transition-colors"
                >
                  Log Out
                </button>
              </div>
            </>
          ) : (
            /* --- GUEST ACTIONS --- */
            <>
              <RouterNavLink 
                to="/login" 
                className="font-bold text-[#2D1B69] hover:text-orange-600 transition-colors text-sm"
              >
                Login
              </RouterNavLink>
              <RouterNavLink 
                to="/signup" 
                className="px-6 py-3 bg-[#2D1B69] text-white rounded-full font-bold text-sm hover:bg-purple-900 transition-all shadow-lg hover:shadow-purple-200 transform hover:-translate-y-0.5"
              >
                Sign Up
              </RouterNavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};



const ThemeNavLink = ({ to, children }) => {
  return (
    <RouterNavLink
      to={to}
      className={({ isActive }) =>
        `px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
          isActive
            ? "bg-blue-600 text-white shadow-md transform scale-105"
            : "text-gray-500 hover:text-[#2D1B69] hover:bg-orange-50"
        }`
      }
    >
      {children}
    </RouterNavLink>
  );
};

const AdminIconLink = ({ to, title, children }) => (
  <RouterNavLink 
    to={to} 
    title={title}
    className={({ isActive }) => 
      `w-10 h-10 rounded-full flex items-center justify-center transition-all ${
        isActive ? "bg-[#2D1B69] text-white shadow-lg" : "bg-gray-100 text-gray-500 hover:bg-orange-100 hover:text-orange-600"
      }`
    }
  >
    {children}
  </RouterNavLink>
);

export default Navbar;