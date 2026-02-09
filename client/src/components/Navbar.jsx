
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  

  // console.log(user)
  // console.log(isAuthenticated)
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <NavLink to="/home" className="text-white hover:text-blue-200">Vetty</NavLink>
        </div>
        <div className="flex space-x-4 items-center">
          <NavLink to="/products" className="text-white hover:text-blue-200">Products</NavLink>
          <NavLink to="/products/1" className="text-white hover:text-blue-200">Product Detail</NavLink>
          <NavLink to="/services" className="text-white hover:text-blue-200">Services</NavLink>
          <NavLink to="/services/1" className="text-white hover:text-blue-200">Service Detail</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/home" className="text-white hover:text-blue-200">Home</NavLink>
              <NavLink to="/profile" className="text-white hover:text-blue-200">Profile</NavLink>
              {(user?.role === 'Admin' || user?.role?.name === 'Admin') && <NavLink to="/admin" className="text-white hover:text-blue-200">Admin</NavLink>}
              <NavLink to="/admin/dashboard" className="text-white hover:text-blue-200">Admin Dashboard</NavLink>
              <NavLink to="/admin/stats" lassName="text-white hover:text-blue-200">Admin Stats</NavLink>
              <NavLink to="/admin/stock" className="text-white hover:text-blue-200">Stock Management</NavLink>
              <NavLink to="/admin/product-form" className="text-white hover:text-blue-200">Add Product</NavLink>
              <NavLink to="/admin/service-form" className="text-white hover:text-blue-200">Add Service</NavLink>
              <NavLink to="/admin/approval-stats" className="text-white hover:text-blue-200">Approval Stats</NavLink>
              <NavLink to="/admin/order-row" className="text-white hover:text-blue-200">Order Row</NavLink>
              <NavLink to="/mpesaForm" className="text-white hover:text-blue-200">Mpesa</NavLink>
              <NavLink to="/profile/account" className="text-white hover:text-blue-200">Account Details</NavLink>
              <NavLink to="/profile/service-stats" className="text-white hover:text-blue-200">Service Stats</NavLink>
              <NavLink to="/profile/product-stats" className="text-white hover:text-blue-200">Product Stats</NavLink>

              

              <button 
                onClick={() => dispatch(logout())} 
                className="bg-white text-blue-600 px-4 py-2 rounded hover:bg-blue-100"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className="text-white hover:text-blue-200">Login</NavLink>
              <NavLink to="/signup" className="text-white hover:text-blue-200">Signup</NavLink>
              



              
      
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;