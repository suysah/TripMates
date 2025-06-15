import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Spinner from "./Spinner";
import { toast } from "react-toastify";
import Heading from "./Ui/Heading";
import { useParams } from "react-router-dom";

const AddReview = () => {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [review, setReview] = useState("");
  // const [rating, setRating] = useState(5);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchDetails = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data;
  };

  const postReview = async (review) => {
    const res = await fetch(`${BASE_URL}/api/v1/reviews/${id}`, {
      method: "POST",
      body: JSON.stringify(review),
      headers: { "content-type": "application/json" },
      credentials: "include",
    });

    console.log(await res.json());

    return res.json();
  };

  const { data, error, isLoading } = useQuery({
    queryKey: [`detail`, id],
    queryFn: fetchDetails,
  });

  const addReview = useMutation({
    mutationFn: postReview,
    onSuccess: (data) => {
      console.log("review", data);
      queryClient.invalidateQueries(["reviews"]);
      toast.success("Review uploaded successfully");
    },
    onError: (error) => {
      toast.error("Error :", error.message);
    },
  });

  console.log(data);

  const handleChange = (e) => {
    setReview(e.target.value);
    //setRating
    console.log(review);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const reviewData = {
      review,
      rating: 4,
    };
    addReview.mutate(reviewData);
  };

  if (isLoading) return <Spinner />;
  if (error) return "error" + error.message;
  const tour = data?.data.data;

  return (
    <div className="h-screen flex flex-col gap-20 justify-center items-center">
      <Heading> Add/Update reviews </Heading>
      <div className="border h-max w-[23rem] bg-white p-5 flex flex-col rounded-xl shadow-md  space-y-3 ">
        <img
          className="h-40 w-full object-cover rounded-xl"
          src={`${BASE_URL}/public/img/tours/${tour.imageCover}`}
          alt={`Cover image for ${tour.name}`}
          loading="lazy"
        />
        <h2 className="text-xl font-bold"> {tour.name} </h2>
        <textarea
          placeholder="Write here..."
          className="bg-orange-200 p-2 h-24 border-none"
          name="review"
          value={review}
          onChange={handleChange}
        />

        <button
          onClick={handleSubmit}
          className="bg-teal-900 text-white px-4 py-1 rounded-md"
        >
          Upload
        </button>
      </div>
    </div>
  );
};

export default AddReview;
