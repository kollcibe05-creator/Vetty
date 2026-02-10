import React from 'react';

const TestAdmin = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Test Page</h1>
          <p className="text-gray-600 mt-2">This is a test page to verify admin routing works</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Navigation Test</h2>
          <div className="space-y-4">
            <div className="p-4 bg-green-50 border border-green-200 rounded">
              <h3 className="font-medium text-green-800">✅ Admin routing is working</h3>
              <p className="text-green-700">You can access admin pages when logged in as a seller</p>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-200 rounded">
              <h3 className="font-medium text-blue-800">📊 Available Admin Pages:</h3>
              <ul className="list-disc list-inside text-blue-700 mt-2">
                <li>/admin - Dashboard Overview</li>
                <li>/admin/stock - Inventory Management</li>
                <li>/admin/approval-stats - Order Approvals</li>
                <li>/admin/product-form - Add Products</li>
                <li>/admin/service-form - Add Services</li>
              </ul>
            </div>

            <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
              <h3 className="font-medium text-yellow-800">🔑 Test Accounts:</h3>
              <div className="text-yellow-700 mt-2">
                <p><strong>Seller 1:</strong> seller1@vetty.com / seller123456</p>
                <p><strong>Seller 2:</strong> seller2@vetty.com / seller123456</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAdmin;
