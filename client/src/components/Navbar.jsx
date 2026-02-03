
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector(state => state.auth);
  const dispatch = useDispatch();
  

  
  return (
    <nav>
      {isAuthenticated ? (
        <>
          <NavLink to="/profile">Profile</NavLink>
          {user?.role === 'admin' && <NavLink to="/admin">Admin</NavLink>}
          <button onClick={() => dispatch(logout())}>Logout</button>
        </>
      ) : (
        <>
          <NavLink to="/login">Login</NavLink>
          <NavLink to="/signup">Signup</NavLink>
        </>
      )}
    </nav>
  );
};

export default Navbar;