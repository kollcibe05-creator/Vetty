import React, { useState, useEffect } from "react";

export default function AdminForm({ initialValues, onSubmit, fields }) {
  const [formData, setFormData] = useState(initialValues || {});

  useEffect(() => {
    setFormData(initialValues || {});
  }, [initialValues]);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData(initialValues || {});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {fields.map(f => (
        <div key={f.name}>
          <label className="block mb-1 font-medium">{f.label}</label>
          <input
            name={f.name}
            value={formData[f.name] || ""}
            onChange={handleChange}
            type={f.type || "text"}
            className="border px-3 py-2 rounded w-full"
          />
        </div>
      ))}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">
        Submit
      </button>
    </form>
  );
}
