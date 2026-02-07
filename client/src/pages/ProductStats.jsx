import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../features/productSlice';

const ProductStats = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    sold: 0,
    inStock: 0,
    revenue: 0
  });

  useEffect(() => {
    // Mock product statistics - in real app, this would come from API
    setStats({
      total: 156,
      sold: 89,
      inStock: 67,
      revenue: 125000
    });
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Product Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Products</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Sold</h3>
          <p className="text-3xl font-bold text-green-600">{stats.sold}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">In Stock</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.inStock}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Top Products</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Premium Dog Food</h4>
              <p className="text-gray-600">45 units sold</p>
            </div>
            <span className="text-green-600 font-bold">$2,069</span>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Cat Food Premium</h4>
              <p className="text-gray-600">32 units sold</p>
            </div>
            <span className="text-green-600 font-bold">$1,151</span>
          </div>
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-semibold">Pet Carrier</h4>
              <p className="text-gray-600">12 units sold</p>
            </div>
            <span className="text-green-600 font-bold">$359</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductStats;
