

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboard } from "../../features/adminSlice";
import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  CartesianGrid, BarChart, Bar, ResponsiveContainer
} from "recharts";

export default function AdminDashboard() {
  const dispatch = useDispatch();

  const { dashboard, loading } = useSelector(state => state.admin);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (loading) return <div className="p-6 text-center text-gray-500">Loading dashboard...</div>;

  const hasData = dashboard && Object.keys(dashboard).length > 0;
  if (!hasData) return <div className="p-6 text-center text-gray-500">No dashboard data available.</div>;

  const summary = dashboard.summary || {};
  const order_status_breakdown = dashboard.order_status_breakdown || {};
  const monthly_sales = dashboard.monthly_sales || [];

  const orderStatusData = Object.keys(order_status_breakdown).map(key => ({
    status: key,
    count: order_status_breakdown[key]
  }));

  return (
    <div className="p-6 space-y-10 bg-gray-50 min-h-screen">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <Card title="Revenue" value={`KES ${Number(summary.total_revenue || 0).toLocaleString()}`} color="border-blue-500" />
        <Card title="Users" value={summary.total_users || 0} />
        <Card title="Orders" value={summary.total_orders || 0} />
        <Card title="Products" value={summary.total_products || 0} />
        <Card title="Services" value={summary.total_services || 0} />
        <Card title="Low Stock" value={summary.low_stock_products || 0} color="text-red-600 border-red-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Monthly Revenue Trends</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={monthly_sales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Line type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} dot={{ r: 6 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>


        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <h2 className="text-xl font-bold mb-6 text-gray-800">Order Status Distribution</h2>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="status" axisLine={false} tickLine={false} dy={10} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{fill: '#f8fafc'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }} />
                <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function Card({ title, value, color = "" }) {
  return (
    <div className={`bg-white shadow-sm p-5 rounded-2xl border-l-4 ${color}`}>
      <h3 className="text-gray-400 text-xs font-bold uppercase tracking-wider">{title}</h3>
      <p className={`text-2xl font-black mt-1 ${color.includes('text-red') ? 'text-red-600' : 'text-gray-900'}`}>
        {value}
      </p>
    </div>
  );
}