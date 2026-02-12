import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminList from "./AdminList";
import { fetchInventoryAlerts } from "../../features/adminSlice";

export default function InventoryAlertAdmin() {
  const dispatch = useDispatch();
  const alerts = useSelector(state => state.admin.inventoryAlerts);

  useEffect(() => {
    dispatch(fetchInventoryAlerts());
  }, [dispatch]);

  const columns = [
    { header: "Product", accessor: "productName" },
    { header: "Stock", accessor: "stock" },
    { header: "Threshold", accessor: "threshold" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Inventory Alerts</h2>
      {alerts.length === 0 ? (
        <p>No low-stock products</p>
      ) : (
        <AdminList data={alerts} columns={columns} />
      )}
    </div>
  );
}
