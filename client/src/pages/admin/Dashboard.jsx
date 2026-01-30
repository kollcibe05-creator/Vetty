import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSalesStats,
  setAllOrders,
  setPendingApprovals,
  setInventoryAlerts,
} from '../../features/adminSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin);

  const { salesStats, allOrders, pendingApprovals, inventoryAlerts } = adminData;

  // Load initial dashboard data (demo, replace with API calls later)
  useEffect(() => {
    const demoSales = [{ month: 'January', total: 1000 }];
    const demoOrders = [{ id: 1, amount: 500 }];
    const demoApprovals = [
      { id: 1, type: 'product', name: 'Cat Food' },
      { id: 2, type: 'service', name: 'Dog Vaccination' },
    ];
    const demoInventory = [
      { id: 1, productName: 'Fish Pellets', stock: 5, threshold: 10 },
    ];

    dispatch(setSalesStats(demoSales));
    dispatch(setAllOrders(demoOrders));
    dispatch(setPendingApprovals(demoApprovals));
    dispatch(setInventoryAlerts(demoInventory));
  }, [dispatch]);

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <section>
        <h3>Sales Summary</h3>
        <pre>{JSON.stringify(salesStats, null, 2)}</pre>
      </section>

      <section>
        <h3>Orders Overview</h3>
        <pre>{JSON.stringify(allOrders, null, 2)}</pre>
      </section>

      <section>
        <h3>Pending Approvals</h3>
        <pre>{JSON.stringify(pendingApprovals, null, 2)}</pre>
      </section>

      <section>
        <h3>Inventory Alerts</h3>
        <pre>{JSON.stringify(inventoryAlerts, null, 2)}</pre>
      </section>
    </div>
  );
};

export default Dashboard;
