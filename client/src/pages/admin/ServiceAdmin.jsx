
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminList from "./AdminList";
import AdminForm from "./AdminForm";
import {
  fetchServices,
  createService,
  updateService,
  deleteService,
  fetchCategories,
} from "../../features/adminSlice";

export default function ServiceAdmin() {
  const dispatch = useDispatch();
  const services = useSelector((state) => state.admin.services);
  const categories = useSelector((state) => state.admin.categories);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchServices());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (data) => {
    if (editing) {
      dispatch(updateService({ id: editing.id, data }));
    } else {
      dispatch(createService(data));
    }
    setEditing(null);
  };


  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Description", accessor: "description" },
    { header: "Base Price", accessor: "base_price" },
    { header: "Category", accessor: "category_name" },
    { header: "Image", accessor: "image_url", render: (url) => (
      url ? <img src={url} alt="service" className="w-12 h-12 object-cover rounded" /> : "No Image"
    )},
  ];


  const fields = [
    { label: "Service Name", name: "name", type: "text" },
    { label: "Description", name: "description", type: "text" },
    { label: "Base Price", name: "base_price", type: "number" },
    { label: "Image URL", name: "image_url", type: "text" }, 
    {
      label: "Category",
      name: "category_id",
      type: "select",
      options: categories.map((c) => ({ value: c.id, label: c.name })),
    },
  ];

 
  const customFields = fields.map((f) => {
    if (f.type === "select") {
      return {
        ...f,
        render: (value, onChange) => (
          <select
            name={f.name}
            value={value || ""}
            onChange={(e) =>
              onChange({ target: { name: f.name, value: e.target.value } })
            }
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">Select Category</option>
            {f.options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ),
      };
    }
    return f;
  });

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Manage Services</h2>

      <AdminForm
        initialValues={editing}
        onSubmit={handleSubmit}
        fields={customFields}
      />

      <AdminList
        data={services.map((s) => ({
          ...s,
          category_name: s.category?.name || "Uncategorized",
        }))}
        columns={columns}
        onEdit={setEditing}
        onDelete={(id) => dispatch(deleteService(id))}
      />
    </div>
  );
}
