import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchUserOrders, fetchUserAppointments } from '../features/serviceSlice';

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { userOrders, userAppointments, loading } = useSelector(state => state.services);

  useEffect(() => {
    dispatch(fetchUserOrders());
    dispatch(fetchUserAppointments());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': case 'scheduled': case 'completed': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8">My History</h1>

      {/* Orders Section */}
      <section className="mb-12">
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Product Orders</h2>
        <div className="grid gap-4">
          {userOrders.map(order => (
            <div key={order.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center">
              <div>
                <p className="font-medium text-blue-600">Order #{order.id}</p>
                <p className="text-sm text-gray-500">{new Date(order.created_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Services Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4 border-b pb-2">Service Bookings</h2>
        <div className="grid gap-4">
          {userAppointments.map(appt => (
            <div key={appt.id} className="border p-4 rounded-lg shadow-sm flex justify-between items-center bg-white">
              <div>
                <p className="font-medium">{appt.service?.name || "Service Details Unavailable"}</p>
                <p className="text-sm text-gray-500">Date: {new Date(appt.appointment_date).toLocaleString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${getStatusColor(appt.status)}`}>
                {appt.status}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default UserDashboard;