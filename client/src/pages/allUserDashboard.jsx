// import React, { useState, useEffect } from 'react';
// import { useSelector, useDispatch } from 'react-redux';
// import { showNotification } from '../features/uiSlice';
// import { fetchAppointments } from '../features/serviceSlice';

// const UserDashboard = () => {
//   const dispatch = useDispatch();
//   const [appointments, setAppointments] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [filter, setFilter] = useState('All'); // 'All', 'Scheduled', 'Completed', 'Cancelled'
  
//   const user = useSelector(state => state.auth.user);
//   const appointmentsFromStore = useSelector(state => state.services.appointments);

//   useEffect(() => {
//     if (user?.id) {
//       dispatch(fetchAppointments(user.id));
//     }
//   }, [dispatch, user?.id]);

//   useEffect(() => {
//     if (appointmentsFromStore) {
//       setAppointments(appointmentsFromStore);
//       setLoading(false);
//     }
//   }, [appointmentsFromStore]);

//   const formatDate = (dateString) => {
//     return new Date(dateString).toLocaleString();
//   };

//   const getStatusColor = (status) => {
//     switch (status) {
//       case 'Scheduled':
//         return 'bg-yellow-100 text-yellow-800';
//       case 'Cancelled':
//         return 'bg-red-100 text-red-800';
//       case 'Completed':
//         return 'bg-green-100 text-green-800';
//       default:
//         return 'bg-gray-100 text-gray-800';
//     }
//   };

//   const filteredAppointments = appointments.filter(appointment => {
//     if (filter === 'All') return true;
//     return appointment.status === filter;
//   });

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-gray-600">Loading your appointments...</div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
//           <p className="text-gray-600 mt-2">Manage your service bookings and appointments</p>
//         </div>

//         {/* Filter Tabs */}
//         <div className="mb-6 flex space-x-4">
//           {['All', 'Scheduled', 'Completed', 'Cancelled'].map((filterOption) => (
//             <button
//               key={filterOption}
//               onClick={() => setFilter(filterOption)}
//               className={`px-4 py-2 rounded-lg font-medium transition-colors ${
//                 filter === filterOption
//                   ? 'bg-blue-600 text-white'
//                   : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
//               }`}
//             >
//               {filterOption}
//             </button>
//           ))}
//         </div>

//         {filteredAppointments.length === 0 ? (
//           <div className="bg-white rounded-lg shadow-md p-8 text-center">
//             <div className="text-gray-500 text-lg">No appointments found</div>
//             <p className="text-gray-400 mt-2">When you book services, they will appear here.</p>
//             <button
//               onClick={() => window.location.href = '/services'}
//               className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Browse Services
//             </button>
//           </div>
//         ) : (
//           <div className="bg-white rounded-lg shadow-md overflow-hidden">
//             <div className="overflow-x-auto">
//               <table className="min-w-full divide-y divide-gray-200">
//                 <thead className="bg-gray-50">
//                   <tr>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Service Name
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Appointment Date
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Status
//                     </th>
//                     <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                       Notes
//                     </th>
//                   </tr>
//                 </thead>
//                 <tbody className="bg-white divide-y divide-gray-200">
//                   {filteredAppointments.map((appointment) => (
//                     <tr key={appointment.id}>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {appointment.service?.name || 'Unknown Service'}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                         {formatDate(appointment.appointment_date)}
//                       </td>
//                       <td className="px-6 py-4 whitespace-nowrap">
//                         <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
//                           {appointment.status}
//                         </span>
//                       </td>
//                       <td className="px-6 py-4 text-sm text-gray-900">
//                         {appointment.notes || '-'}
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default UserDashboard;
