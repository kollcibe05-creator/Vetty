import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';

const Admin = () => {
  const { user } = useSelector(state => state.auth);

  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/admin/stats', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setStats(res.data);
      } catch (err) {
        setError('Failed to load admin stats');
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === 'admin') {
      fetchStats();
    }
  }, [user]);

  if (loading) return <p>Loading admin dashboard...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Logged in as: {user?.username} (Admin)</p>

      {stats && (
        <div>
          <h3>Quick Stats</h3>
          <p>Total users: {stats.total_users}</p>
          <p>Total admins: {stats.total_admins}</p>
          <p>Last updated: {new Date(stats.timestamp).toLocaleString()}</p>
        </div>
     )}

      <div>
        <h2>Management</h2>
        <ul>
          <li><Link to="/admin/users">Manage Users</Link></li>
          <li><Link to="/admin/products">Manage Products</Link></li>
          <li><Link to="/admin/services">Manage Services</Link></li>
          <li><Link to="/admin/orders">View Orders</Link></li>
          <li><Link to="/admin/appointments">View Appointments</Link></li>
          <li><Link to="/admin/reviews">Manage Reviews</Link></li>
          <li><Link to="/admin/categories">Manage Categories</Link></li>
          <li><Link to="/admin/delivery-zones">Manage Delivery Zones</Link></li>
        </ul>
      </div>
    </div>
  );
};

export default Admin;