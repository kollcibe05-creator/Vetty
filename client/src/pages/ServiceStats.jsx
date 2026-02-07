import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchAppointments } from '../features/serviceSlice';

const ServiceStats = () => {
  const dispatch = useDispatch();
  const { user } = useSelector(state => state.auth);
  const [stats, setStats] = useState({
    total: 0,
    completed: 0,
    upcoming: 0,
    revenue: 0
  });

  useEffect(() => {
    // Mock service statistics - in real app, this would come from API
    setStats({
      total: 12,
      completed: 8,
      upcoming: 4,
      revenue: 45000
    });
  }, [dispatch]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Service Statistics</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Total Services</h3>
          <p className="text-3xl font-bold text-blue-600">{stats.total}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Completed</h3>
          <p className="text-3xl font-bold text-green-600">{stats.completed}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Upcoming</h3>
          <p className="text-3xl font-bold text-orange-600">{stats.upcoming}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-600">Revenue</h3>
          <p className="text-3xl font-bold text-purple-600">${stats.revenue.toLocaleString()}</p>
        </div>
      </div>
      
      <div className="mt-8 bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4">Recent Services</h3>
        <div className="space-y-4">
          <div className="border-l-4 border-blue-500 pl-4">
            <h4 className="font-semibold">Pet Training Session</h4>
            <p className="text-gray-600">Completed on Jan 15, 2024</p>
          </div>
          <div className="border-l-4 border-green-500 pl-4">
            <h4 className="font-semibold">Grooming Service</h4>
            <p className="text-gray-600">Completed on Jan 10, 2024</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ServiceStats;
