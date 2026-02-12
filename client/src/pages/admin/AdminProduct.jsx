import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AdminList from "./AdminList";
import AdminForm from "./AdminForm";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  fetchCategories
} from "../../features/adminSlice";

export default function ProductAdmin() {
  const dispatch = useDispatch();
  const products = useSelector(state => state.admin.products);
  const categories = useSelector(state => state.admin.categories);
  const [editing, setEditing] = useState(null);

  useEffect(() => {
    dispatch(fetchProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleSubmit = (data) => {
    if (editing) {
      dispatch(updateProduct({ id: editing.id, data }));
    } else {
      dispatch(createProduct(data));
    }
    setEditing(null);
  };

  const columns = [
    { header: "Name", accessor: "name" },
    { header: "Price", accessor: "price" },
    { header: "Stock", accessor: "stock_quantity" },
    { header: "Category", accessor: "category_name" },
  ];

  const fields = [
    { label: "Name", name: "name" },
    { label: "Description", name: "description" },
    { label: "Price", name: "price", type: "number" },
    { label: "Stock Quantity", name: "stock_quantity", type: "number" },
    {
      label: "Category",
      name: "category_id",
      type: "number",
    },
    { label: "Image URL", name: "image_url" },
  ];

  return (
    <div className="space-y-6">
      <AdminForm initialValues={editing} onSubmit={handleSubmit} fields={fields} />
      <AdminList
        data={products.map(p => ({ ...p, category_name: p.category?.name || "Uncategorized" }))}
        columns={columns}
        onEdit={setEditing}
        onDelete={(id) => dispatch(deleteProduct(id))}
      />
    </div>
  );
}
