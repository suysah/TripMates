import Heading from "../components/Ui/Heading";
import TourCard from "../components/TourCard";
import { useQuery } from "@tanstack/react-query";

const Booking = () => {
  const getMyBookings = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_BASE_URL}/api/v1/views/my-tours`,
      {
        method: "GET",
        headers: {
          "content-type": "application/json",
        },
        credentials: "include",
      }
    );
    const data = await res.json();
    return data;
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ["my-tours"],
    queryFn: getMyBookings,
  });

  // console.log(data);

  if (isLoading) return "Loading";

  if (error) return "error : " + error.message;

  return (
    <>
      <Heading>YOUR BOOKINGS</Heading>
      <div className="flex flex-col justify-center items-center gap-6 p-6">
        {data.tours?.map((tour, index) => (
          <TourCard tour={tour} key={index} />
        ))}
      </div>
    </>
  );
};

export default Booking;
