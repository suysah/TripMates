import React from "react";
import {
  FaUser,
  FaMapMarkerAlt,
  FaFlag,
  FaRegCalendarAlt,
  FaStar,
  FaArrowUp,
  FaArrowAltCircleUp,
} from "react-icons/fa";
import Heading from "./Ui/Heading";

const QuickFacts = ({
  difficulty,
  maxGroupSize,
  ratingsAverage,
  startDates,
}) => {
  const date = new Date(startDates[1]);
  const formatted = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });
  return (
    <div>
      <div className="flex  flex-col  items-start  gap-4 ">
        <Heading>QUICK FACTS</Heading>
        <div className="flex justify-center items-center gap-3 text-gray-600">
          <FaRegCalendarAlt />
          <span className="font-bold text-black">NEXT DATE</span> {formatted}{" "}
        </div>
        <div className="flex justify-center items-center gap-3 text-gray-600">
          <FaArrowAltCircleUp />
          <span className="font-bold text-black">DIFFICULTY</span> {difficulty}{" "}
        </div>
        <div className="flex justify-center items-center gap-3 text-gray-600">
          <FaUser />
          <span className="font-bold text-black">PARTICIPANTS</span>{" "}
          {maxGroupSize} People{" "}
        </div>
        <div className="flex justify-center items-center gap-3 text-gray-600">
          <FaStar />
          <span className="font-bold text-black">RATING</span> {ratingsAverage}
          /5{" "}
        </div>
      </div>
    </div>
  );
};

export default QuickFacts;
