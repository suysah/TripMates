import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { FaSearch, FaCheckCircle, FaTimesCircle, FaTrashAlt } from "react-icons/fa";
import Spinner from "../components/Spinner";
import { toast } from "react-toastify";

const ManageBookings = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch bookings
  const fetchBookings = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings`, {
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load bookings");
    return data?.data?.data || [];
  };

  const { data: bookings, isLoading, error } = useQuery({
    queryKey: ["admin-bookings"],
    queryFn: fetchBookings,
  });

  // Delete booking mutation
  const deleteBooking = async (id) => {
    const res = await fetch(`${BASE_URL}/api/v1/bookings/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) {
      const data = await res.json();
      throw new Error(data.message || "Failed to delete booking");
    }
  };

  const deleteMutation = useMutation({
    mutationFn: deleteBooking,
    onSuccess: () => {
      toast.success("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-bookings"] });
    },
    onError: (err) => {
      toast.error(err.message || "Failed to delete booking");
    },
  });

  const handleDelete = (id, tourName, userName) => {
    if (
      window.confirm(
        `Are you sure you want to delete the booking of "${tourName}" for user "${userName}"?`
      )
    ) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 font-semibold p-10">
        Error loading bookings: {error.message}
      </div>
    );
  }

  // Filter bookings
  const filteredBookings = bookings.filter(
    (b) =>
      b.tour?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.user?.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-teal-800">Manage Bookings 🎫</h2>
        <p className="text-gray-500 text-sm">View purchase logs and update customer registrations</p>
      </div>

      {/* Search Input */}
      <div className="mb-6 max-w-md relative">
        <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-400">
          <FaSearch />
        </span>
        <input
          type="text"
          placeholder="Search by tour name, user, or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
        />
      </div>

      {/* Bookings Table */}
      {filteredBookings.length === 0 ? (
        <div className="text-center py-10 bg-gray-50 rounded-xl border border-dashed border-gray-300">
          <p className="text-gray-500">No bookings found matching search query.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md border overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-teal-50 border-b border-teal-100 text-teal-800 font-semibold uppercase text-xs">
                <th className="p-4">Tour</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Date Booked</th>
                <th className="p-4">Price Paid</th>
                <th className="p-4 text-center">Status</th>
                <th className="p-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y text-gray-700">
              {filteredBookings.map((b) => {
                const date = b.createdAt ? new Date(b.createdAt) : null;
                const formattedDate = date
                  ? date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : "N/A";

                return (
                  <tr key={b.id || b._id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 font-semibold">{b.tour?.name || "Deleted Tour"}</td>
                    <td className="p-4 font-medium">{b.user?.name || "Deleted User"}</td>
                    <td className="p-4">{b.user?.email || "N/A"}</td>
                    <td className="p-4 text-sm text-gray-500">{formattedDate}</td>
                    <td className="p-4 font-semibold text-teal-700">${b.price}</td>
                    <td className="p-4 text-center">
                      <div className="flex justify-center">
                        {b.paid ? (
                          <span className="flex items-center gap-1 text-green-700 bg-green-50 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border border-green-200">
                            <FaCheckCircle className="text-green-500" /> Paid
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-red-700 bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border border-red-200">
                            <FaTimesCircle className="text-red-500" /> Unpaid
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex justify-center">
                        <button
                          onClick={() =>
                            handleDelete(
                              b.id || b._id,
                              b.tour?.name || "Tour",
                              b.user?.name || "User"
                            )
                          }
                          className="flex items-center gap-1 px-2 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded border border-red-100 transition-colors text-sm font-semibold"
                          title="Cancel Booking"
                        >
                          <FaTrashAlt /> Cancel
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ManageBookings;
