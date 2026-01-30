import React, { useState } from 'react';

// Admin page to add or edit veterinary services
const ServiceForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log({ name, price });
  };

  return (
    <div>
      <h1>Service Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Service Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Base Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <button type="submit">Save Service</button>
      </form>
    </div>
  );
};

export default ServiceForm;
