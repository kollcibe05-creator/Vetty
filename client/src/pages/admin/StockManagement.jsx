import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setInventoryAlerts } from '../../features/adminSlice';

// Admin page to manage inventory alerts and stock levels
const StockManagement = () => {
  const dispatch = useDispatch();
  const { inventoryAlerts } = useSelector((state) => state.admin);

  // Load demo inventory alerts (replace with real API call later)
  useEffect(() => {
    const demoAlerts = [
      { id: 1, productName: 'Cat Food', stock: 5, threshold: 10 },
      { id: 2, productName: 'Dog Vaccine', stock: 2, threshold: 5 },
    ];
    dispatch(setInventoryAlerts(demoAlerts));
  }, [dispatch]);

  return (
    <div>
      <h1>Stock Management</h1>
      <h3>Low-stock Alerts</h3>
      <ul>
        {inventoryAlerts.map((item) => (
          <li key={item.id}>
            {item.productName}: {item.stock} in stock (Threshold: {item.threshold})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StockManagement;
