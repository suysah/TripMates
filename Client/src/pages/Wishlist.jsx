import React from "react";
import { useQuery } from "@tanstack/react-query";
import TourCard from "../components/TourCard";
import Spinner from "../components/Spinner";

const Wishlist = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchWishlist = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/users/wishlist`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load wishlist");
    return data?.data?.wishlist || [];
  };

  const { data: wishlist, isLoading, error } = useQuery({
    queryKey: ["user-wishlist"],
    queryFn: fetchWishlist,
  });

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 font-semibold p-10">
        Error loading wishlist: {error.message}
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold text-teal-800 mb-6">My Wishlist 💖</h2>
      {wishlist.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-gray-500">
          <p className="text-lg font-medium">Your wishlist is empty.</p>
          <p className="text-sm mt-1">Click the heart icon on any tour card to add it here!</p>
        </div>
      ) : (
        <div className="flex flex-wrap gap-6">
          {wishlist.map((tour) => (
            <TourCard tour={tour} key={tour.id || tour._id} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
