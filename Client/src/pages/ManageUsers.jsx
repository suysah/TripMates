import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaUserTag, FaTrashAlt } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const ManageUsers = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all users
  const fetchUsers = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load users");
    return data?.data?.data || [];
  };

  const { data: users, isLoading, error } = useQuery({
    queryKey: ["admin-users"],
    queryFn: fetchUsers,
  });

  // Update user role mutation
  const updateUserRole = async ({ id, role }) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role }),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update role");
    return data;
  };

  const roleMutation = useMutation({
    mutationFn: updateUserRole,
    onSuccess: (data, variables) => {
      toast.success(`Role updated successfully to "${variables.role}"`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
      // Invalidate userinfo query just in case the admin edited their own role
      queryClient.invalidateQueries({ queryKey: ["userinfo"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to update role");
    },
  });

  // Delete user mutation
  const deleteUser = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/users/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete user");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: () => {
      toast.success("User deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete user");
    },
  });

  const handleRoleChange = (id, currentRole, newRole, userName) => {
    if (currentRole === newRole) return;
    if (
      window.confirm(
        `Are you sure you want to change "${userName}"'s role from "${currentRole}" to "${newRole}"?`
      )
    ) {
      roleMutation.mutate({ id, role: newRole });
    }
  };

  const handleDeleteUser = (id, name) => {
    if (window.confirm(`Are you sure you want to delete user "${name}"?`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 font-semibold p-10">
        Error loading users: {error.message}
      </div>
    );
  }

  // Filter users by search query
  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-teal-800">Manage Users 👥</h2>
        <p className="text-gray-500 text-sm">View registered accounts and modify authorization roles</p>
      </div>

      {/* Search Input */}
      <div className="mb-6 max-w-md relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Search by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Users List Table */}
      {filteredUsers.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No users found matching your search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50 border-b border-teal-100 text-teal-800 font-semibold uppercase text-xs">
                <th className="p-4">Avatar</th>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {filteredUsers.map((u) => (
                <tr key={u.id || u._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4">
                    <img
                      src={`${BASE_URL}/public/img/users/${u.photo || "default.jpg"}`}
                      alt={u.name}
                      onError={(e) => {
                        e.target.src = `${BASE_URL}/public/img/users/default.jpg`;
                      }}
                      className="w-10 h-10 object-cover rounded-full border border-teal-100"
                    />
                  </td>
                  <td className="p-4 font-semibold">{u.name}</td>
                  <td className="p-4">{u.email}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-1.5">
                      <FaUserTag className="text-teal-600 w-3.5 h-3.5" />
                      <select
                        value={u.role}
                        onChange={(e) =>
                          handleRoleChange(u.id || u._id, u.role, e.target.value, u.name)
                        }
                        className="border rounded-md px-2 py-1 text-sm bg-white focus:outline-none focus:ring-1 focus:ring-teal-500 font-medium"
                      >
                        <option value="user">User</option>
                        <option value="guide">Guide</option>
                        <option value="lead-guide">Lead Guide</option>
                        <option value="admin">Admin</option>
                      </select>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      <button
                        onClick={() => handleDeleteUser(u.id || u._id, u.name)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors text-sm font-semibold"
                        title="Delete User Account"
                      >
                        <FaTrashAlt /> Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageUsers;
