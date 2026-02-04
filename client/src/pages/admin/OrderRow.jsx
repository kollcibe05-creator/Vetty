import React from 'react';

// Displays a single order in Vetty Admin Dashboard
const OrderRow = ({ order }) => {
  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '0.5rem 0' }}>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>User:</strong> {order.user || 'N/A'}</p>
      <p><strong>Amount:</strong> ${order.amount}</p>
      <p><strong>Status:</strong> {order.status || 'Pending'}</p>
    </div>
  );
};

export default OrderRow;
