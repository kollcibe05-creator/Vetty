import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import NavLink from '../components/NavLink';
import axios from 'axios';
import { showNotification } from '../features/uiSlice';

const API_URL = 'http://127.0.0.1:5555';

const Admin = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated and has admin role
    if (!user || user.role?.name !== 'Admin') {
      dispatch(showNotification({ 
        type: 'error', 
        title: 'Access Denied', 
        message: 'Admin access required' 
      }));
      navigate('/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const res = await axios.get(`${API_URL}/admin/stats`, {
          withCredentials: true
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [user, dispatch, navigate]);

  if (loading) return <p className="text-center mt-10">Loading admin dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Seller Dashboard</h2>
          <p className="text-gray-600 mt-2">Logged in as: {user?.name || 'Admin'} (Seller)</p>
        </div>

        {stats && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h3 className="text-xl font-semibold mb-4">Quick Stats</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded">
                <p className="text-green-800 font-medium">Revenue</p>
                <p className="text-2xl font-bold text-green-900">${stats.revenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="p-4 bg-yellow-50 rounded">
                <p className="text-yellow-800 font-medium">Pending Orders</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pending_orders || 0}</p>
              </div>
              <div className="p-4 bg-red-50 rounded">
                <p className="text-red-800 font-medium">Low Stock Items</p>
                <p className="text-2xl font-bold text-red-900">{stats.low_stock || 0}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-semibold mb-4">Management</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <NavLink to="/admin/stock" className="block p-4 bg-blue-50 hover:bg-blue-100 rounded text-blue-700 font-medium">
              📦 Inventory Management
            </NavLink>
            <NavLink to="/admin/approval-stats" className="block p-4 bg-yellow-50 hover:bg-yellow-100 rounded text-yellow-700 font-medium">
              ⏰ Order Approvals
            </NavLink>
            <NavLink to="/admin/product-form" className="block p-4 bg-green-50 hover:bg-green-100 rounded text-green-700 font-medium">
              ➕ Add Product
            </NavLink>
            <NavLink to="/admin/service-form" className="block p-4 bg-purple-50 hover:bg-purple-100 rounded text-purple-700 font-medium">
              🏥 Add Service
            </NavLink>
            <NavLink to="/admin/dashboard" className="block p-4 bg-indigo-50 hover:bg-indigo-100 rounded text-indigo-700 font-medium">
              📅 Appointments
            </NavLink>
            <NavLink to="/admin/test" className="block p-4 bg-gray-50 hover:bg-gray-100 rounded text-gray-700 font-medium">
              🧪 Test Admin
            </NavLink>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
