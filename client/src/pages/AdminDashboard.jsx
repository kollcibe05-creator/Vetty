import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { showNotification } from '../features/uiSlice';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All'); // 'All', 'Scheduled', 'Cancelled'
  
  const user = useSelector(state => state.auth.user);

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

    fetchAppointments();
  }, [user, dispatch, navigate]);

  const fetchAppointments = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/admin/appointments', {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      } else {
        const error = await response.json();
        dispatch(showNotification({ type: 'error', message: error.error || 'Failed to fetch appointments' }));
      }
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: 'Server error. Try again later.' }));
    } finally {
      setLoading(false);
    }
  };

  const updateAppointmentStatus = async (appointmentId, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5555/admin/appointments/${appointmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
        credentials: 'include'
      });

      if (response.ok) {
        dispatch(showNotification({ type: 'success', message: `Appointment ${newStatus.toLowerCase()} successfully!` }));
        fetchAppointments(); // Refresh the list
      } else {
        const error = await response.json();
        dispatch(showNotification({ type: 'error', message: error.error || 'Failed to update appointment' }));
      }
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: 'Server error. Try again later.' }));
    }
  };

  const deleteAppointment = async (appointmentId) => {
    if (!window.confirm('Are you sure you want to delete this appointment?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:5555/admin/appointments/${appointmentId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        dispatch(showNotification({ type: 'success', message: 'Appointment deleted successfully!' }));
        fetchAppointments(); // Refresh the list
      } else {
        const error = await response.json();
        dispatch(showNotification({ type: 'error', message: error.error || 'Failed to delete appointment' }));
      }
    } catch (error) {
      dispatch(showNotification({ type: 'error', message: 'Server error. Try again later.' }));
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'Cancelled':
        return 'bg-red-100 text-red-800';
      case 'Completed':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (filter === 'All') return true;
    return appointment.status === filter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage service bookings and appointments</p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6 flex space-x-4">
          {['All', 'Scheduled', 'Cancelled'].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === filterOption
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {filterOption}
            </button>
          ))}
        </div>

        {filteredAppointments.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <div className="text-gray-500 text-lg">No bookings found</div>
            <p className="text-gray-400 mt-2">When customers book services, they will appear here.</p>
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Service Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Appointment Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAppointments.map((appointment) => (
                    <tr key={appointment.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.user?.username || 'Unknown'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.service?.name || 'Unknown Service'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(appointment.appointment_date)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        {appointment.status !== 'Completed' && appointment.status !== 'Cancelled' && (
                          <>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'Completed')}
                              className="text-green-600 hover:text-green-900 mr-3"
                            >
                              Complete
                            </button>
                            <button
                              onClick={() => updateAppointmentStatus(appointment.id, 'Cancelled')}
                              className="text-red-600 hover:text-red-900 mr-3"
                            >
                              Cancel
                            </button>
                          </>
                        )}
                        <button
                          onClick={() => deleteAppointment(appointment.id)}
                          className="text-gray-600 hover:text-gray-900"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;