
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  

  
  return (
    <nav className="bg-blue-600 text-white p-4 shadow-lg">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-xl font-bold">
          <NavLink to="/home" className="text-white hover:text-blue-200">Vetty</NavLink>
        </div>
        <div className="flex space-x-4 items-center">
          <NavLink to="/products" className="text-white hover:text-blue-200">Products</NavLink>
          <NavLink to="/services" className="text-white hover:text-blue-200">Services</NavLink>
          {isAuthenticated ? (
            <>
              <NavLink to="/home" className="text-white hover:text-blue-200">Home</NavLink>
              <NavLink to="/profile" className="text-white hover:text-blue-200">Profile</NavLink>
              {user?.role === 'Admin' && <NavLink to="/admin" className="text-white hover:text-blue-200">Admin</NavLink>}
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