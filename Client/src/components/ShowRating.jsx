import React from "react";
import { FaStar } from "react-icons/fa";

const ShowRating = ({ rating }) => {
  const starCount = [1, 2, 3, 4, 5];
  return (
    <>
      <div className="flex gap-1">
        {starCount.map((val, ind) => {
          return <FaStar color={val <= rating ? "teal" : "grey"} key={ind} />;
        })}
      </div>
    </>
  );
};

export default ShowRating;
