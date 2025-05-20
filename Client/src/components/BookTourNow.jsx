import React from "react";
import Heading from "./Ui/Heading";
import { Link } from "react-router-dom";

const BookTourNow = ({ id, images, duration, locations }) => {
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div className="flex relative h-1/3 w-3/4 bg-white rounded-lg overflow-hidden">
      {/* Image group */}
      <div className="flex items-center">
        <img
          src={`${BASE_URL}/tours/${images[0]}`}
          alt="imgxd"
          className="absolute z-20 h-32 w-32 rounded-full -left-12"
        />
        <img
          src={`${BASE_URL}/tours/${images[1]}`}
          alt="imgxd"
          className="relative z-10 h-32 w-32 rounded-full -left-4"
        />
        <img
          src={`${BASE_URL}/tours/${images[2]}`}
          alt="imgxd"
          className="relative z-0 h-32 w-32 rounded-full -left-28"
        />
      </div>

      <div className=" flex justify-center items-center gap-12 ">
        <div>
          <Heading>WHAT ARE YOU WAITING FOR?</Heading>
          <p>
            {duration} days. {locations.length} adventure. Infinite memories.
            Make it yours today!
          </p>
        </div>
        <Link to={`/payment/${id}`}>
          <button className="bg-teal-700 rounded-full text-white py-4 px-6 font-semibold">
            BOOK TOUR NOW!
          </button>
        </Link>
      </div>
    </div>
  );
};

export default BookTourNow;
