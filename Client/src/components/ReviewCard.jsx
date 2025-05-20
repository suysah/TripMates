import React from "react";
import { FaStar } from "react-icons/fa";

const ReviewCard = ({ rev }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="flex flex-col justify-center items-center h-72 min-w-72 max-w-72 gap-10 bg-white text-slate-700 p-4">
      {rev.user ? (
        <div className="flex justify-center items-center gap-4">
          <img
            src={`${BASE_URL}/users/${rev?.user?.photo}`}
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
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
    </div>
  );
};

export default ReviewCard;
