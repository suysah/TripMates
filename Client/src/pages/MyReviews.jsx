import Heading from "../components/Ui/Heading";
import ReviewCard from "../components/ReviewCard";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";

const fetchReviews = async () => {
  const res = await fetch(
    `${import.meta.env.VITE_BASE_URL}/api/v1/reviews/reviewsByUser`,
    {
      method: "GET",
      credentials: "include",
    }
  );

  if (!res.ok) throw new Error("Error");
  return await res.json();
};

const MyReviews = () => {
  const {
    data: reviews,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["user-reviews"],
    queryFn: fetchReviews,
  });

  // console.log("rev", reviews);

  if (isLoading) return <Spinner />;
  if (error) return "Error: " + error.message;

  return (
    <div className="pt-2">
      <Heading>YOUR REVIEWS</Heading>
      <div className="flex flex-wrap justify-center items-center p-6 gap-6">
        {reviews?.data.length === 0 ? (
          <Heading>NO reviews yet!</Heading>
        ) : (
          reviews.data.map((rev, ind) => (
            <ReviewCard rev={rev} key={ind} inReviews={true} />
          ))
        )}
      </div>
    </div>
  );
};

export default MyReviews;
