// CategoryAdmin.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminList from "./AdminList";
import AdminForm from "./AdminForm";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../features/adminSlice";

export default function CategoryAdmin() {
  const dispatch = useDispatch();
  const categories = useSelector((state) => state.admin.categories);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (data) => {
    if (editing) {
      dispatch(updateCategory({ id: editing.id, data }));
    } else {
      dispatch(createCategory(data));
    }
    setEditing(null);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Type", accessor: "category_type" },
  ];

  const fields = [
    { label: "Category Name", name: "name" },
    { label: "Category Type", name: "category_type" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">Manage Categories</h2>
      <AdminForm initialValues={editing} onSubmit={handleSubmit} fields={fields} />
      <AdminList
        data={categories}
        columns={columns}
        onEdit={setEditing}
        onDelete={(id) => dispatch(deleteCategory(id))}
      />
    </div>
  );
}
