import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    } else if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, isAuthenticated, user, navigate]);

  if (loading) return <p>Loading profile...</p>;
  if (!user) return <p>No user data available</p>;

  return (
    <div>
      <h2>Welcome, {user.username}!</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Vetting Status: {user.vetting_status}</p>

      {user.vetting_status === 'not_started' && (
        <p>You can start your background verification process from here (coming soon).</p>
      )}
    </div>
  );
};

export default Profile;