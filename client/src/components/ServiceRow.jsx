import React from 'react';

// Shows a single service in admin dashboard
const ServiceRow = ({ service }) => {
  return (
    <div style={{ borderBottom: '1px solid #ccc', padding: '8px 0' }}>
      <p><strong>ID:</strong> {service.id}</p>
      <p><strong>Name:</strong> {service.name}</p>
      <p><strong>Base Price:</strong> ${service.base_price}</p>
      <p><strong>Category:</strong> {service.category_id || 'N/A'}</p>
    </div>
  );
};

export default ServiceRow;
