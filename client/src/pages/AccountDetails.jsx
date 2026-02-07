import React from 'react';
import { useSelector } from 'react-redux';

const AccountDetails = () => {
  const { user } = useSelector(state => state.auth);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Account Details</h2>
      <div className="bg-white rounded-lg shadow p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Username</label>
            <p className="mt-1 text-lg">{user?.name || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <p className="mt-1 text-lg">{user?.email || 'N/A'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Role</label>
            <p className="mt-1 text-lg">{user?.role || 'User'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Vetting Status</label>
            <p className="mt-1 text-lg capitalize">{user?.vetting_status?.replace('_', ' ') || 'Not Started'}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Member Since</label>
            <p className="mt-1 text-lg">{user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountDetails;
