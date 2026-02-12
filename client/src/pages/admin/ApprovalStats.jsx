import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAdminAppointments,
  updateAdminAppointmentStatus,
} from "../../features/adminSlice";

const AdminAppointments = () => {
  const dispatch = useDispatch();
  const { pendingAppointments, loading } = useSelector((state) => state.admin);
  
  const [sortKey, setSortKey] = useState("appointment_date");
  const [sortOrder, setSortOrder] = useState("asc");
  const [filter, setFilter] = useState("All"); 

  useEffect(() => {
    dispatch(fetchAdminAppointments());
  }, [dispatch]);

  const handleStatusChange = (appointmentId, newStatus) => {
    dispatch(updateAdminAppointmentStatus({ appointmentId, status: newStatus }));
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  const statusColor = (status) => {
    switch (status) {
      case "Scheduled":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Completed":
        return "bg-green-100 text-green-800";
      case "Cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };


  const filteredAppointments = (pendingAppointments || []).filter((appt) => {
    const now = new Date();
    if (filter === "Upcoming") return new Date(appt.appointment_date) > now;
    if (filter === "Completed") return appt.status === "Completed";
    if (filter === "Cancelled") return appt.status === "Cancelled";
    if (filter === "Deleted") return appt.deleted_at; 
    return true; 
  });

 
  const sortedAppointments = [...filteredAppointments].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (loading) return <div>Loading appointments...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Appointment Approvals</h1>

      {/* Mini-navbar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Upcoming", "Completed", "Cancelled", "Deleted"].map((cat) => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-3 py-1 rounded-full font-medium text-sm border transition ${
              filter === cat
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("user.username")}
            >
              User
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("service.name")}
            >
              Service
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("appointment_date")}
            >
              Date
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("status")}
            >
              Status
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Action
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {sortedAppointments.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-6 text-center text-gray-500">
                No appointments found for "{filter}"
              </td>
            </tr>
          ) : (
            sortedAppointments.map((appt, idx) => (
              <tr
                key={appt.id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  {appt.user?.username || "Unknown"}
                </td>
                <td className="px-4 py-3 text-sm">{appt.service?.name || "Unknown"}</td>
                <td className="px-4 py-3 text-sm">{formatDate(appt.appointment_date)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor(
                      appt.status
                    )}`}
                  >
                    {appt.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">
                  <select
                    value={appt.status}
                    onChange={(e) => handleStatusChange(appt.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Scheduled">Scheduled</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminAppointments;
