import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProfile } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (!user) dispatch(fetchProfile());
  }, [dispatch, isAuthenticated, user, navigate]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10">No user data available</p>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Welcome, {user.username}!</h2>
      <p className="mb-2"><strong>Email:</strong> {user.email}</p>
      <p className="mb-2"><strong>Role:</strong> {user.role}</p>
      <p className="mb-4"><strong>Vetting Status:</strong> {user.vetting_status}</p>

      {user.vetting_status === 'not_started' && (
        <p className="text-yellow-600 font-medium">You can start your background verification process from here (coming soon).</p>
      )}
    </div>
  );
};

export default Profile;
