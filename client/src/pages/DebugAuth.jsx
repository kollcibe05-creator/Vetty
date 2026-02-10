import React from 'react';
import { useSelector } from 'react-redux';

const DebugAuth = () => {
  const { user, isAuthenticated, loading, error } = useSelector(state => state.auth);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6">Authentication Debug</h1>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded">
              <h3 className="font-medium text-blue-800">Authentication Status</h3>
              <div className="mt-2 text-sm">
                <p><strong>Is Authenticated:</strong> {isAuthenticated ? 'YES' : 'NO'}</p>
                <p><strong>Loading:</strong> {loading ? 'YES' : 'NO'}</p>
                <p><strong>Error:</strong> {error || 'None'}</p>
              </div>
            </div>

            <div className="p-4 bg-green-50 rounded">
              <h3 className="font-medium text-green-800">User Info</h3>
              <div className="mt-2 text-sm">
                <p><strong>Name:</strong> {user?.name || 'Not logged in'}</p>
                <p><strong>Email:</strong> {user?.email || 'Not logged in'}</p>
                <p><strong>Role:</strong> {user?.role?.name || 'Not logged in'}</p>
                <p><strong>User ID:</strong> {user?.id || 'Not logged in'}</p>
              </div>
            </div>

            <div className="p-4 bg-yellow-50 rounded">
              <h3 className="font-medium text-yellow-800">Test Links</h3>
              <div className="mt-2 space-y-2">
                <a href="/login" className="block text-blue-600 hover:underline">Go to Login</a>
                <a href="/admin" className="block text-blue-600 hover:underline">Go to Admin Dashboard</a>
                <a href="/admin/stock" className="block text-blue-600 hover:underline">Go to Inventory</a>
                <a href="/products" className="block text-blue-600 hover:underline">Go to Products</a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DebugAuth;
