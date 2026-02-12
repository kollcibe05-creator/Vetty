// AdminUsers.jsx

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  updateUserRole,
  deleteUser
} from "../../features/adminSlice";

export default function AdminUsers() {
  const dispatch = useDispatch();
  const users = useSelector(state => state.admin.users);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleRoleChange = (userId, roleId) => {
    dispatch(updateUserRole({ id: userId, role_id: roleId }));
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold">User Management</h2>

      <table className="min-w-full border">
        <thead>
          <tr>
            <th className="border px-4 py-2">Username</th>
            <th className="border px-4 py-2">Email</th>
            <th className="border px-4 py-2">Role</th>
            <th className="border px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user.id}>
              <td className="border px-4 py-2">{user.username}</td>
              <td className="border px-4 py-2">{user.email}</td>

              <td className="border px-4 py-2">
                <select
                  value={user.role}
                  onChange={(e) =>
                    handleRoleChange(user.id, e.target.value)
                  }
                  className="border px-2 py-1"
                >
                  <option value="1">User</option>
                  <option value="2">Admin</option>
                </select>
              </td>

              <td className="border px-4 py-2">
                <button
                  onClick={() => dispatch(deleteUser(user.id))}
                  className="text-red-600"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
