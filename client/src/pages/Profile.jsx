import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { checkSession } from '../features/authSlice';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useSelector(state => state.auth);

  useEffect(() => {
    if (!isAuthenticated) navigate('/login');
    else if (!user) dispatch(checkSession());
  }, [dispatch, isAuthenticated, user, navigate]);

  if (loading) return <p className="text-center mt-10">Loading profile...</p>;
  if (!user) return <p className="text-center mt-10">No user data available</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.name || 'User'}!</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <p className="text-sm text-gray-600">User ID:</p>
              <p className="font-medium">{user?.id}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Email:</p>
              <p className="font-medium">{user?.email}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Role:</p>
              <p className="font-medium">{user?.role?.name || 'None'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Account created:</p>
              <p className="font-medium">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">Last updated:</p>
              <p className="font-medium">{user?.updated_at ? new Date(user.updated_at).toLocaleDateString() : 'Unknown'}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
