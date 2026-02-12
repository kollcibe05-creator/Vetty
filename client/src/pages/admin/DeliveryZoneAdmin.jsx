import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminForm from "./AdminForm";
import AdminList from "./AdminList";
import {
  fetchDeliveryZones,
  createDeliveryZone,
  updateDeliveryZone,
  deleteDeliveryZone
} from "../../features/adminSlice";

export default function DeliveryZoneAdmin() {
  const dispatch = useDispatch();
  const zones = useSelector(state => state.admin.deliveryZones);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchDeliveryZones());
  }, [dispatch]);

  const handleSubmit = (data) => {
    if (editing) {
      dispatch(updateDeliveryZone({ id: editing.id, data }));
    } else {
      dispatch(createDeliveryZone(data));
    }
    setEditing(null);
  };

  const columns = [
    { header: "Zone Name", accessor: "zone_name" },
    { header: "Delivery Fee", accessor: "delivery_fee" },
  ];

  const fields = [
    { label: "Zone Name", name: "zone_name", type: "text" },
    { label: "Delivery Fee", name: "delivery_fee", type: "number" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Manage Delivery Zones</h2>
      <AdminForm initialValues={editing} onSubmit={handleSubmit} fields={fields} />
      <AdminList data={zones} columns={columns} onEdit={setEditing} onDelete={(id) => dispatch(deleteDeliveryZone(id))} />
    </div>
  );
}
