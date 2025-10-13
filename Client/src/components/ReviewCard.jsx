import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ShowRating from "./ShowRating";
import ModalAddUpdate from "./Ui/ModalAddUpdate";
import StarRating from "./StarRating";
import { useState } from "react";

const ReviewCard = ({ rev, inReviews = false }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const queryClient = useQueryClient();
  // console.log(rev.id);

  const [isOpen, setIsOpen] = useState(false);
  const [review, setReview] = useState(rev?.review || "");
  const [rating, setRating] = useState(rev?.rating || 0);

  const deleteReview = useMutation({
    mutationFn: async (id) => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/reviews/${id}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      if (res.status !== 204) throw new Error("Failed to delete review");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["detail"] });
      toast.success("Review deleted");
    },
    onError: (error) => toast.error(error.message),
  });

  const handleDelete = () => {
    deleteReview.mutate(rev.id);
  };

  const patchReview = useMutation({
    mutationFn: async ({ id, reviewData }) => {
      const res = await fetch(`${BASE_URL}/api/v1/reviews/${id}`, {
        method: "PATCH",
        body: JSON.stringify(reviewData),
        headers: { "content-type": "application/json" },
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update review");
      return data;
    },
    onSuccess: () => {
      toast.success("Review updated successfully");
      queryClient.invalidateQueries({ queryKey: ["user-reviews"] });
      queryClient.invalidateQueries({ queryKey: ["reviews"] });
      queryClient.invalidateQueries({ queryKey: ["detail"] });
      setIsOpen(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const handleSave = (e) => {
    e.preventDefault();
    patchReview.mutate({ id: rev.id, reviewData: { review, rating } });
  };

  return (
    <div className="flex flex-col justify-center items-center min-h-72 max-h-max min-w-72 max-w-72 gap-10 bg-white text-slate-700 p-4">
      {rev.user ? (
        <div className="flex justify-center items-center gap-4">
          <img
            src={`${BASE_URL}/public/img/users/${rev?.user?.photo}`}
            alt="reviwer"
            className="h-8 w-8 rounded-full"
          />
          <p className="text-black font-bold">{rev?.user?.name}</p>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-4">
          <img
            src="/Images/defaultUser.png"
            alt="reviwer"
            className="h-8 w-8 rounded-full"
          />
          <p className="text-black font-bold">Anonymous</p>
        </div>
      )}
      <div>{rev?.review} </div>
      <div className="flex">
        <ShowRating rating={rev?.rating} />
      </div>
      {inReviews && (
        <div className="flex gap-6 ">
          <button
            onClick={() => setIsOpen(true)}
            className="bg-teal-900 text-white px-4 py-1 rounded-md"
          >
            Edit
          </button>
          <button
            onClick={handleDelete}
            className="bg-teal-900 text-white px-4 py-1 rounded-md"
          >
            Delete
          </button>
        </div>
      )}

      <ModalAddUpdate isOpen={isOpen} onClose={() => setIsOpen(false)}>
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-semibold">Your review</span>
            <textarea
              className="border rounded p-2"
              rows={4}
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </label>
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">Your rating:</span>
            <StarRating rating={rating} setRating={setRating} />
          </div>
          <div className="flex justify-end gap-2 mt-2">
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="px-4 py-2 rounded border"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={patchReview.isLoading}
              className="bg-teal-700 text-white px-4 py-2 rounded"
            >
              {patchReview.isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </ModalAddUpdate>
    </div>
  );
};

export default ReviewCard;
