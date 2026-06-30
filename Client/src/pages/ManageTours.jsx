import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { FaPlus, FaEdit, FaTrash, FaSearch } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const ManageTours = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all tours
  const fetchTours = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load tours");
    return data?.data?.data || [];
  };

  const { data: tours, isLoading, error } = useQuery({
    queryKey: ["admin-tours"],
    queryFn: fetchTours,
  });

  // Delete mutation
  const deleteTour = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete tour");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteTour,
    onSuccess: () => {
      toast.success("Tour deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-tours"] });
      queryClient.invalidateQueries({ queryKey: ["home"] });
    },
    onError: (err) => {
      toast.error(err.message || "Something went wrong");
    },
  });

  const handleDelete = (id, name) => {
    if (window.confirm(`Are you sure you want to delete "${name}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 font-semibold p-10">
        Error loading tours: {error.message}
      </div>
    );
  }

  // Filter tours by search term
  const filteredTours = tours.filter((t) =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-teal-800">Manage Tours 🗺️</h2>
          <p className="text-gray-500 text-sm">Add, update, or remove travel experiences</p>
        </div>
        <Link
          to="new"
          className="flex items-center gap-2 bg-teal-600 hover:bg-teal-700 text-white px-4 py-2 rounded-lg font-semibold shadow transition-all duration-200"
        >
          <FaPlus /> Create Tour
        </Link>
      </div>

      {/* Search Filter */}
      <div className="mb-6 max-w-md relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Search tours by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Tours Table */}
      {filteredTours.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No tours found matching your search.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50 border-b border-teal-100 text-teal-800 font-semibold uppercase text-xs">
                <th className="p-4">Tour Name</th>
                <th className="p-4">Duration</th>
                <th className="p-4">Difficulty</th>
                <th className="p-4">Price</th>
                <th className="p-4">Group Size</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {filteredTours.map((t) => (
                <tr key={t.id || t._id} className="hover:bg-slate-50 transition-colors">
                  <td className="p-4 font-semibold">{t.name}</td>
                  <td className="p-4">{t.duration} Days</td>
                  <td className="p-4">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase ${
                        t.difficulty === "easy"
                          ? "bg-green-100 text-green-800"
                          : t.difficulty === "medium"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {t.difficulty}
                    </span>
                  </td>
                  <td className="p-4">${t.price}</td>
                  <td className="p-4">{t.maxGroupSize} people</td>
                  <td className="p-4">
                    <div className="flex justify-center gap-3">
                      <button
                        onClick={() => navigate(`edit/${t.id || t._id}`)}
                        className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-md transition-colors"
                        title="Edit Tour"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(t.id || t._id, t.name)}
                        className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-md transition-colors"
                        title="Delete Tour"
                      >
                        <FaTrash />
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

export default ManageTours;
