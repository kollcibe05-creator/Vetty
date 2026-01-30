import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSalesStats, setAllOrders } from '../../features/adminSlice';

const Dashboard = () => {
  const dispatch = useDispatch();
  const adminData = useSelector((state) => state.admin);

  const { salesStats, allOrders } = adminData;

  // Load initial dashboard data (will later be replaced with real API calls)
  useEffect(() => {
    const demoSales = [{ month: 'January', total: 1000 }];
    const demoOrders = [{ id: 1, amount: 500 }];

    dispatch(setSalesStats(demoSales));
    dispatch(setAllOrders(demoOrders));
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
    </div>
  );
};

export default Dashboard;
