import TourCard from "../components/TourCard";
import { useQuery } from "@tanstack/react-query";
import { useCallback } from "react";
import Spinner from "../components/Spinner";

const Home = () => {
  const fetchHomeData = useCallback(async () => {
    const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/tours/`);
    return res.json();
  }, []);

  const { data, error, isLoading } = useQuery({
    queryKey: ["home"],
    queryFn: fetchHomeData,
  });

  console.log(data);

  if (isLoading) return <Spinner />;

  if (error) return "An error has occurred " + error.message;

  return (
    <>
      <div className=" flex flex-wrap justify-center items-center gap-6 m-6">
        {data.data.data.map((tour) => (
          <TourCard tour={tour} key={tour.id} />
        ))}
      </div>
    </>
  );
};

export default Home;
