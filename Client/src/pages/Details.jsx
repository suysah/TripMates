import Header from "../components/Header";
import AboutTour from "../components/AboutTour";
import { FaClock, FaMapMarkerAlt } from "react-icons/fa";
import QuickFacts from "../components/QuickFacts";
import TourGuidesInfo from "../components/TourGuidesInfo";
import ReviewCard from "../components/ReviewCard";
import BookTourNow from "../components/BookTourNow";
import Footer from "../components/Footer";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import MapView from "../components/Ui/MapView";

const Details = () => {
  const { id } = useParams();

  const fetchDetails = async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}/api/v1/tours/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  };

  const fetchReviews = async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}/api/v1/reviews/`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    const rev = data.data.data.filter((review) => review.tour === id);
    return rev;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["detail"],
    queryFn: fetchDetails,
  });

  const {
    data: reviews,
    error: reviewError,
    isLoading: isLoadingReviews,
  } = useQuery({
    queryKey: ["reviews"],
    queryFn: fetchReviews,
  });

  if (isLoading || isLoadingReviews) return "Loading...";

  if (error) return "An error has occurred " + error.message;
  if (reviewError)
    return (
      "An error has occurred while fetching reviews " + reviewError.message
    );

  const tour = data?.data?.data;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  return (
    <div>
      <Header />
      <div
        className={`gap-10 rounded-br-[18vw] flex flex-col justify-center items-center bg-cover  bg-no-repeat relative w-full h-64 md:h-96`}
      >
        <img
          src={`${BASE_URL}/tours/${tour.imageCover}`}
          alt="Tour Cover"
          className="absolute inset-0 w-full h-full object-cover rounded-br-[18vw]"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black opacity-40 rounded-br-[18vw]"></div>

        <div className="flex flex-col justify-center gap-10 relative z-10 h-full text-white p-8">
          <h1 className="text-3xl font-bold">{tour.name}</h1>
          <div className="flex gap-14 ">
            <span className=" flex justify-center items-center gap-2 ">
              <FaClock /> {tour.duration} Days
            </span>
            <span className=" flex justify-center items-center gap-2 ">
              <FaMapMarkerAlt /> {tour.startLocation.description}
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1   md:grid-cols-2 gap-4 h-auto md:h-max">
        <div className="grid grid-rows-2 pb-10 bg-slate-100 pt-6  md:ps-24">
          <div className=" p-6 ">
            <QuickFacts
              difficulty={tour.difficulty}
              maxGroupSize={tour.maxGroupSize}
              ratingsAverage={tour.ratingsAverage}
              startDates={tour.startDates}
            />
          </div>
          <div className=" p-6">
            <TourGuidesInfo guides={tour.guides} />
          </div>
        </div>

        <div className="p-6 md:p-12 ">
          <AboutTour description={tour.description} />
        </div>
      </div>

      <div className="flex flex-col z-10 md:flex-row bg-black text-white transform skew-y-6 h-auto md:h-64">
        {tour.images.map((imageName, index) => (
          <div key={index} className="flex-1 h-64 md:h-full overflow-hidden">
            <img
              src={`${BASE_URL}/tours/${imageName}`}
              alt={imageName}
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        ))}
      </div>

      <div className="relative z-0 h-screen md:h-[100vh] transform skew-y-6 pt-20 overflow-hidden -my-20">
        <MapView
          locations={tour.locations}
          startLocation={tour.startLocation}
        />
      </div>

      <div className="flex justify-center items-center relative h-screen px-12">
        <div className="absolute inset-0 transform skew-y-6 bg-slate-200 z-0"></div>

        <div className="relative z-10 overflow-x-auto p-4 flex gap-20">
          {reviews.map((review) => (
            <ReviewCard key={review._id} rev={review} />
          ))}
        </div>
      </div>

      <div className="flex justify-center items-center h-screen">
        <BookTourNow
          id={id}
          images={tour.images}
          duration={tour.duration}
          locations={tour.locations}
        />
      </div>
      <Footer />
    </div>
  );
};

export default Details;
