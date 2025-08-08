import {
  FaUser,
  FaMapMarkerAlt,
  FaFlag,
  FaRegCalendarAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";

const TourCard = ({ tour, inBooking = false }) => {
  const dateStr = tour.startDates[0];
  const date = new Date(dateStr);
  const { user } = useAuth();

  const formatted = date.toLocaleString("en-US", {
    month: "long",
    year: "numeric",
  });

  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const navigate = useNavigate();

  const handleDetailsClick = () => {
    if (!user) {
      navigate("/login");
    } else {
      navigate(`/details/${tour.id}`);
    }
  };

  return (
    <div className="border h-max w-[23rem] bg-white p-5 flex flex-col rounded-xl shadow-md  space-y-3">
      <img
        className="h-40 w-full object-cover rounded-xl"
        src={`${BASE_URL}/public/img/tours/${tour.imageCover}`}
        alt={`Cover image for ${tour.name}`}
        loading="lazy"
      />
      <h2 className="text-xl font-bold">{tour.name}</h2>
      <h3>
        {tour.difficulty} {tour.duration}-DAYS TOUR
      </h3>
      <p className="text-sm italic">{tour.summary}</p>

      <div className="flex flex-row justify-center gap-6">
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaMapMarkerAlt />
          {tour.startLocation.description}
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaRegCalendarAlt />
          {formatted}
        </div>
      </div>

      <div className="flex flex-row justify-center gap-6">
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaFlag />
          {tour.locations.length} stops
        </div>
        <div className="text-gray-600 flex justify-center items-center gap-1">
          <FaUser />
          {tour.maxGroupSize} people
        </div>
      </div>

      <div className="font-bold">$ {tour.price} per person</div>
      <div className="text-sm">Rating: {tour.ratingsAverage.toFixed(1)}</div>

      <div className="flex justify-evenly">
        <button
          onClick={handleDetailsClick}
          className="bg-teal-900 text-white px-4 py-1 rounded-md"
        >
          Details
        </button>

        {inBooking && (
          <Link to={`/review/${tour.id}`}>
            <button className="bg-teal-900 text-white px-4 py-1 rounded-md">
              Add Review
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default TourCard;
