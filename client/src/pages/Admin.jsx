import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Admin = () => {
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get('http://localhost:5000/users', { withCredentials: true });
        setStats({
          total_users: res.data.length,
          total_admins: res.data.filter(u => u.role === 'admin').length,
          timestamp: new Date(),
        });
      } catch (err) {
        setError('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'Admin') fetchStats();
  }, [user]);

  if (loading) return <p className="text-center mt-10">Loading admin dashboard...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold mb-4">Admin Dashboard</h2>
      <p className="mb-6">Logged in as: <strong>{user?.username}</strong> (Admin)</p>

      {stats && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold mb-2">Quick Stats</h3>
          <p>Total users: {stats.total_users}</p>
          <p>Total admins: {stats.total_admins}</p>
          <p>Last updated: {new Date(stats.timestamp).toLocaleString()}</p>
        </div>
      )}

      <div>
        <h3 className="text-xl font-semibold mb-2">Management</h3>
        <ul className="space-y-2">
          <li><Link to="/admin/users" className="text-indigo-600 hover:underline">Manage Users</Link></li>
          <li><Link to="/admin/products" className="text-indigo-600 hover:underline">Manage Products</Link></li>
          <li><Link to="/admin/services" className="text-indigo-600 hover:underline">Manage Services</Link></li>
          <li><Link to="/admin/orders" className="text-indigo-600 hover:underline">View Orders</Link></li>
          <li><Link to="/admin/appointments" className="text-indigo-600 hover:underline">View Appointments</Link></li>
          <li><Link to="/admin/reviews" className="text-indigo-600 hover:underline">Manage Reviews</Link></li>
          <li><Link to="/admin/categories" className="text-indigo-600 hover:underline">Manage Categories</Link></li>
          <li><Link to="/admin/delivery-zones" className="text-indigo-600 hover:underline">Manage Delivery Zones</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;
