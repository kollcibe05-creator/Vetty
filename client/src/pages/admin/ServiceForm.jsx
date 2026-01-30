import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { setPendingApprovals } from '../../features/adminSlice';

// Admin page to add or edit veterinary services
const ServiceForm = () => {
  const dispatch = useDispatch();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();

    // Create a new service object (demo, replace with API call later)
    const newService = {
      id: Date.now(), // simple unique id for demo
      type: 'service',
      name,
      basePrice: price,
    };

    // Add this new service to pending approvals
    dispatch((prev) =>
      dispatch(setPendingApprovals((prev) => [...prev, newService]))
    );

    console.log('Service submitted:', newService);

    // Clear form
    setName('');
    setPrice('');
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
            placeholder="Enter service name"
          />
        </div>
        <div>
          <label>Base Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter base price"
          />
        </div>
        <button type="submit">Save Service</button>
      </form>
    </div>
  );
};

export default ServiceForm;
