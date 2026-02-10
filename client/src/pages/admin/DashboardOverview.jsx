import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAdminStats, fetchInventory } from '../../features/adminSlice';

const DashboardOverview = () => {
  const dispatch = useDispatch();
  const { salesStats, inventoryAlerts, loading, error } = useSelector((state) => state.admin);

  useEffect(() => {
    dispatch(fetchAdminStats());
    dispatch(fetchInventory());
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-gray-600">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-red-600">Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
          <p className="text-gray-600 mt-2">Overview of your business performance and inventory</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Stats Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Business Statistics</h2>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Revenue:</span>
                <span className="text-2xl font-bold text-green-600">
                  ${salesStats.revenue ? salesStats.revenue.toFixed(2) : '0.00'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pending Orders:</span>
                <span className="text-2xl font-bold text-orange-600">
                  {salesStats.pending_orders || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Low Stock Items:</span>
                <span className="text-2xl font-bold text-red-600">
                  {salesStats.low_stock || 0}
                </span>
              </div>
            </div>
          </div>

          {/* Inventory Alert Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Inventory Alerts</h2>
            {inventoryAlerts.length === 0 ? (
              <div className="text-gray-500 text-center py-8">
                No inventory alerts. All products are well stocked.
              </div>
            ) : (
              <div className="space-y-2">
                {inventoryAlerts.slice(0, 5).map((item) => (
                  <div key={item.id} className="flex items-center justify-between p-3 bg-red-50 rounded">
                    <div>
                      <div className="font-medium text-gray-900">{item.productName}</div>
                      <div className="text-sm text-gray-600">Stock: {item.stock}</div>
                    </div>
                    <div className="text-red-600 font-medium">
                      Low Stock - Order Soon!
                    </div>
                  </div>
                ))}
                {inventoryAlerts.length > 5 && (
                  <div className="text-center text-gray-500 pt-2">
                    ... and {inventoryAlerts.length - 5} more items
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;
