import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import ShowRating from "./ShowRating";
import { Link } from "react-router-dom";

const ReviewCard = ({ rev, inReviews = false }) => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const queryClient = useQueryClient();
  console.log(rev.id);

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
          <Link to={`/review/${rev.tour}`}>
            <button className="bg-teal-900 text-white px-4 py-1 rounded-md">
              Update
            </button>
          </Link>
          <button
            onClick={handleDelete}
            className="bg-teal-900 text-white px-4 py-1 rounded-md"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewCard;
