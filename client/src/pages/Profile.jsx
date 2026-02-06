import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../features/authSlice';
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
      <h2>Welcome, {user?.name || 'User'}!</h2>
      <p>User ID: {user?.id}</p>
      <p>Account created: {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
      <p>Last updated: {user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}</p>
    </div>
  );
};

export default Profile;
