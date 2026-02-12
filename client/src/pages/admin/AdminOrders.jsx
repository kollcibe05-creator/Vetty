
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  updateAdminOrderStatus,
  deleteAdminOrder,
} from "../../features/adminSlice";

const AdminOrders = () => {
  const dispatch = useDispatch();
  const { allOrders, loading } = useSelector((state) => state.admin);

  const [filter, setFilter] = useState("All");
  const [sortKey, setSortKey] = useState("created_at");
  const [sortOrder, setSortOrder] = useState("desc");

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateAdminOrderStatus({ orderId, status: newStatus }));
  };

  const handleDelete = (orderId) => {
    if (confirm("Are you sure you want to delete this order?")) {
      dispatch(deleteAdminOrder(orderId));
    }
  };

  const formatDate = (dateString) => new Date(dateString).toLocaleString();

  const statusColor = (status) => {
    switch (status) {
      case "Pending": return "bg-yellow-100 text-yellow-800";
      case "Paid": return "bg-blue-100 text-blue-800";
      case "Shipped": return "bg-purple-100 text-purple-800";
      case "Completed": return "bg-green-100 text-green-800";
      case "Cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Filter orders
  const filteredOrders = (allOrders || []).filter((order) => {
    if (filter === "All") return true;
    return order.status === filter;
  });

  // Sort orders
  const sortedOrders = [...filteredOrders].sort((a, b) => {
    const aValue = a[sortKey];
    const bValue = b[sortKey];
    if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
    if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
    return 0;
  });

  const toggleSort = (key) => {
    if (sortKey === key) setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    else {
      setSortKey(key);
      setSortOrder("asc");
    }
  };

  if (loading) return <div>Loading orders...</div>;

  return (
    <div className="bg-white shadow rounded-lg p-6 overflow-x-auto">
      <h1 className="text-2xl font-bold mb-4">Admin Orders</h1>

      {/* Mini-navbar */}
      <div className="flex flex-wrap gap-2 mb-6">
        {["All", "Pending", "Approved",  "Cancelled", "Out for Delivery", "Delivered", 'Paid'].map(
          (cat) => (
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
          )
        )}
      </div>

      <table className="min-w-full divide-y divide-gray-200 table-auto">
        <thead className="bg-gray-50">
          <tr>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("id")}
            >
              Order ID
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("user.username")}
            >
              Customer
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("total_amount")}
            >
              Total
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("status")}
            >
              Status
            </th>
            <th
              className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase cursor-pointer"
              onClick={() => toggleSort("created_at")}
            >
              Created
            </th>
            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>

        <tbody className="bg-white divide-y divide-gray-200">
          {sortedOrders.length === 0 ? (
            <tr>
              <td colSpan={6} className="px-4 py-6 text-center text-gray-500">
                No orders found for "{filter}"
              </td>
            </tr>
          ) : (
            sortedOrders.map((order, idx) => (
              <tr
                key={order.id}
                className={idx % 2 === 0 ? "bg-gray-50" : "bg-white"}
              >
                <td className="px-4 py-3 text-sm font-medium text-gray-900">
                  #{order.id}
                </td>
                <td className="px-4 py-3 text-sm">
                  {order.user?.username || "Unknown"}
                </td>
                <td className="px-4 py-3 text-sm">Ksh. {order.total_amount?.toFixed(2) || "0.00"}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm">{formatDate(order.created_at)}</td>
                <td className="px-4 py-3 text-sm flex gap-2">
                  <select
                    value={order.status}
                    onChange={(e) => handleStatusChange(order.id, e.target.value)}
                    className="border border-gray-300 rounded px-2 py-1 text-sm hover:border-gray-400 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Paid">Paid</option>
                    <option value="Out For Delivery">Out For Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                    
                  </select>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className="text-red-600 hover:text-red-900 text-sm font-medium"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminOrders;
