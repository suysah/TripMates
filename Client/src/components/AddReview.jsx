import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import Spinner from "./Spinner";
import Heading from "./Ui/Heading";
import StarRating from "./StarRating";
import useAuth from "../context/useAuth";

const AddReview = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(3);
  const [isUploading, setIsUploading] = useState(false);
  const [reviewExist, setReviewExist] = useState(false);
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { user } = useAuth();
  const reviewID = useRef(null);
  const navigate = useNavigate();
  // console.log(user);

  //functions ------------------------------------------------------------

  const fetchDetails = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/${id}`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  };

  const postReview = async (review) => {
    if (!review.review || !review.rating) {
      throw new Error("Review text and rating are required.");
    }

    const res = await fetch(`${BASE_URL}/api/v1/reviews/${id}`, {
      method: "POST",
      headers: {
        "content-Type": "application/json",
      },
      body: JSON.stringify(review),
      credentials: "include",
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.message || "Failed to post review");
    }

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

  // -----------------------------------------------------

  //Fetching tour detail
  const { data, error, isLoading } = useQuery({
    queryKey: ["detail", id],
    queryFn: fetchDetails,
  });

  const tour = data?.data?.data;
  // console.log(tour);

  //checking if review already exist by user
  useEffect(() => {
    if (!tour || !user?._id) return;

    const revByUserExist = tour?.reviews.find(
      (rev) => rev?.user?._id && user._id === rev.user._id
    );

    if (revByUserExist) {
      reviewID.current = revByUserExist._id;
      setReviewExist(true);
      setRating(revByUserExist.rating);
      setReview(revByUserExist.review);
    }
  }, [tour, user]);

  //Uploading review
  const addReview = useMutation({
    mutationFn: postReview,
    onSuccess: () => {
      setIsUploading(false);
      setReview("");
      setRating(0);
      toast.success("Review uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["detail", id] });
      navigate("/account/reviews");
    },
    onError: (error) => {
      setIsUploading(false);
      // console.log(error);

      toast.error(`Error: ${error}`);
    },
  });

  //Updating review
  const patchReview = useMutation({
    mutationFn: patchReviewFunction,
    onSuccess: () => {
      setIsUploading(false);
      setReview("");
      setRating(0);
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["detail", id] });
    },
    onError: (error) => {
      setIsUploading(false);
      toast.error(`Error: ${error.message}`);
    },
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    // console.log("rat: ", rating);
    // console.log("review: ", review);
    setIsUploading(true);
    patchReview.mutate({
      id: reviewID.current,
      reviewData: { review, rating },
    });
  };

  const handleUpload = (e) => {
    e.preventDefault();
    setIsUploading(true);
    addReview.mutate({ review, rating });
  };

  if (isLoading) return <Spinner />;
  if (error) return "Error: " + error.message;

  // console.log("tour:  ", tour);

  return (
    <div className="h-screen flex flex-col gap-20 justify-center items-center">
      <Heading> Add a review </Heading>
      <div className="border h-max w-[23rem] bg-white p-5 flex flex-col rounded-xl shadow-md  space-y-3 ">
        <img
          className="h-40 w-full object-cover rounded-xl"
          src={`${BASE_URL}/public/img/tours/${tour.imageCover}`}
          alt={`Cover image for ${tour.name}`}
          loading="lazy"
        />
        <h2 className="text-xl font-bold"> {tour.name} </h2>
        <textarea
          placeholder="Write here..."
          className="bg-orange-200 p-2 h-24 border-none"
          name="review"
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
        <div className="flex justify-center items-center ">
          <StarRating rating={rating} setRating={setRating} />
        </div>
        {reviewExist ? (
          <button
            onClick={handleUpdate}
            disabled={isUploading}
            className="bg-teal-900 text-white px-4 py-1 rounded-md"
          >
            {isUploading ? "Updating..." : "Update"}
          </button>
        ) : (
          <button
            onClick={handleUpload}
            disabled={isUploading}
            className="bg-teal-900 text-white px-4 py-1 rounded-md"
          >
            {isUploading ? "Uploading..." : "Upload"}
          </button>
        )}
      </div>
    </div>
  );
};

export default AddReview;
