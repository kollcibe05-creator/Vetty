import React, { useState } from 'react';

// Admin page to add or edit products
const ProductForm = () => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic
    console.log({ name, price, stock });
  };

  return (
    <div>
      <h1>Product Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Product Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label>Price:</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label>Stock Quantity:</label>
          <input
            type="number"
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
        <button type="submit">Save Product</button>
      </form>
    </div>
  );
};

export default ProductForm;
