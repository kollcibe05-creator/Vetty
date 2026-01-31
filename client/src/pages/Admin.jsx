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

      <p>More features (users list, products, orders, etc.) can be added here.</p>
    </div>
  );
};

export default Admin;