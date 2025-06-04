import Heading from "../components/Ui/Heading";
import ReviewCard from "../components/ReviewCard";

const MyReviews = () => {
  return (
    <div className="pt-2">
      <Heading>YOUR REVIEWS</Heading>
      <div className="flex flex-wrap justify-center items-center p-6 gap-6 "></div>
    </div>
  );
};

export default MyReviews;
