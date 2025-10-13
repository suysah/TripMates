import {
  FaUser,
  FaMapMarkerAlt,
  FaFlag,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import ModalAddUpdate from "./Ui/ModalAddUpdate";
import StarRating from "./StarRating";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";

const TourCard = ({ tour, inBooking = false }) => {
  const dateStr = tour.startDates[0];
  const date = new Date(dateStr);
  const { user } = useAuth();

  const formatted = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // Modal + review state
  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  const [reviewExist, setReviewExist] = useState(false);
  const reviewID = useRef(null);

  const handleDetailsClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/details/${tour.id}`);
    }
  };

  // Fetch tour details when opening modal to detect existing review
  const fetchDetails = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/${tour.id}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    return data?.data?.data;
  };

  const openReviewModal = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      const t = await fetchDetails();
      if (t && user?._id) {
        const existing = t.reviews?.find((r) => r?.user?._id === user._id);
        if (existing) {
          reviewID.current = existing._id;
          setReviewExist(true);
          setRating(existing.rating);
          setReview(existing.review);
        } else {
          reviewID.current = null;
          setReviewExist(false);
          setRating(3);
          setReview("");
        }
      }
      setIsOpen(true);
    } catch (e) {
      toast.error("Failed to prepare review editor");
    }
  };

  const postReview = async (payload) => {
    if (!payload.review || !payload.rating) {
      throw new Error("Review text and rating are required.");
    }
    const res = await fetch(`${BASE_URL}/api/v1/reviews/${tour.id}`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to post review");
    return data;
  };

  const patchReviewFunction = async ({ id, reviewData }) => {
    const res = await fetch(`${BASE_URL}/api/v1/reviews/${id}`, {
      method: "PATCH",
      body: JSON.stringify(reviewData),
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to update review");
    return data;
  };

  const addReviewMutation = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      setIsUploading(false);
      toast.success("Review uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", tour.id] });
      queryClient.invalidateQueries({ queryKey: ["detail", tour.id] });
      setIsOpen(false);
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(`Error: ${error.message}`);
    },
  });

  const patchReview = useMutation({
    mutationFn: patchReviewFunction,
    onSuccess: () => {
      setIsUploading(false);
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", tour.id] });
      queryClient.invalidateQueries({ queryKey: ["detail", tour.id] });
      setIsOpen(false);
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleSubmitReview = (e) => {
    e.preventDefault();
    setIsUploading(true);
    if (reviewExist && reviewID.current) {
      patchReview.mutate({
        id: reviewID.current,
        reviewData: { review, rating },
      });
    } else {
      addReviewMutation.mutate({ review, rating });
    }
  };

  return (
    <div className="border h-max w-[23rem] bg-white p-5 flex flex-col rounded-xl shadow-md  space-y-3">
      <img
        className="h-40 w-full object-cover rounded-xl"
        src={`${BASE_URL}/public/img/tours/${tour.imageCover}`}
        alt={`Cover image for ${tour.name}`}
        loading="lazy"
      />
      <h2 className="text-xl font-bold">{tour.name}</h2>
      <h3>
        {tour.difficulty} {tour.duration}-DAYS TOUR
      </h3>
      <p className="text-sm italic">{tour.summary}</p>

      <div className="flex flex-row justify-center gap-6">
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaMapMarkerAlt />
          {tour.startLocation.description}
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaRegCalendarAlt />
          {formatted}
        </div>
      </div>

      <div className="flex flex-row justify-center gap-6">
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaFlag />
          {tour.locations.length} stops
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaUser />
          {tour.maxGroupSize} people
        </div>
      </div>

      <div className="font-bold">$ {tour.price} per person</div>
      <div className="text-sm">Rating: {tour.ratingsAverage.toFixed(1)}</div>

      <div className="flex justify-evenly">
        <button
          onClick={handleDetailsClick}
          className="bg-teal-900 text-white px-4 py-1 rounded-md"
        >
          Details
        </button>

        {inBooking && (
          <button
            onClick={openReviewModal}
            className="bg-teal-900 text-white px-4 py-1 rounded-md"
          >
            {reviewExist ? "Edit Review" : "Add Review"}
          </button>
        )}
      </div>

      <ModalAddUpdate isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSubmitReview} className="flex flex-col gap-3">
          <h3 className="text-lg font-semibold">
            {reviewExist ? "Edit your review" : "Add a review"}
          </h3>
          <div className="text-sm text-gray-700">
            Tour: <span className="font-semibold">{tour.name}</span>
          </div>
          <textarea
            placeholder="Write here..."
            className="bg-orange-200 p-2 h-24 border-none"
            name="review"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <div className="flex justify-center items-center ">
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                isUploading ||
                addReviewMutation.isLoading ||
                patchReview.isLoading
              }
              className="bg-teal-900 text-white px-4 py-1 rounded-md"
            >
              {isUploading ||
              addReviewMutation.isLoading ||
              patchReview.isLoading
                ? reviewExist
                  ? "Updating..."
                  : "Uploading..."
                : reviewExist
                ? "Update"
                : "Upload"}
            </button>
          </div>
        </form>
      </ModalAddUpdate>
    </div>
  );
};

export default TourCard;
