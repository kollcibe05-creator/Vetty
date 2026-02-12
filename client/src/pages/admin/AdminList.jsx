import React from "react";

export default function AdminList({ data, onEdit, onDelete, columns }) {
  return (
    <table className="min-w-full border">
      <thead>
        <tr>
          {columns.map(col => <th key={col.accessor} className="px-4 py-2 border">{col.header}</th>)}
          <th className="px-4 py-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.id} className="hover:bg-gray-100">
            {columns.map(col => <td key={col.accessor} className="px-4 py-2 border">{item[col.accessor]}</td>)}
            <td className="px-4 py-2 border">
              <button onClick={() => onEdit(item)} className="mr-2 text-blue-600">Edit</button>
              <button onClick={() => onDelete(item.id)} className="text-red-600">Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
