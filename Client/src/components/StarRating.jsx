import { FaStar } from "react-icons/fa";

const StarRating = ({ rating, setRating }) => {
  const starCount = [1, 2, 3, 4, 5];
  return (
    <>
      <div className="flex gap-1">
        {starCount.map((val, ind) => {
          return (
            <FaStar
              color={val <= rating ? "teal" : "grey"}
              key={ind}
              onClick={() => {
                setRating(ind + 1);
              }}
            />
          );
        })}
      </div>
    </>
  );
};

export default StarRating;
