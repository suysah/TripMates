import React from "react";
import Heading from "../components/Ui/Heading";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";

const addBooking = async (booking) => {
  const res = await fetch(`${import.meta.env.BASE_URL}/api/v1/bookings/`, {
    method: "POST",
    body: JSON.stringify(booking),
    headers: {
      "content-type": "application/json",
    },
    credentials: "include",
  });

  return res.json();
};

const Payment = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const fetchDetails = async () => {
    const res = await fetch(`${import.meta.env.BASE_URL}/api/v1/tours/${id}`, {
      method: "GET",
      headers: {
        "content-type": "application/json",
      },
      credentials: "include",
    });
    const data = await res.json();
    return data.data.data;
  };

  const {
    data: tour,
    error,
    isLoading,
  } = useQuery({
    queryKey: ["detail"],
    queryFn: fetchDetails,
  });

  const mutateBooking = useMutation({
    mutationFn: addBooking,
    onSuccess: () => {
      // console.log("item added", data);
      toast.success("Booking successfull 🎉");
      navigate("/account/bookings");
    },
    onError: (error) => {
      toast.error("Error: " + error.message);
    },
  });

  if (isLoading) return "Loading";
  if (error) return "error" + error.message;

  const BASE_URL = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = () => {
    // e.preventDefault();
    // add the bbooking in Bookings and navigate there
    mutateBooking.mutate({ tour: tour.id, price: tour.price });
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex flex-col  items-center bg-white h-1/2 w-96 p-4">
        <div>
          <img src={`${BASE_URL}/tours/${tour.imageCover}`} alt={tour.name} />
          <div className="flex flex-col gap-2 mt-6 ">
            <Heading>{tour.name}</Heading>
            <Heading>Price: ${tour.price} </Heading>
          </div>
        </div>
      </div>
      <div className="bg-white h-1/2 w-96 p-4">
        <Heading>Account Details</Heading>
        <form action={handleSubmit} className="flex flex-col p-6 gap-4">
          <label className="flex flex-col items-start gap-2">
            Account no
            <input
              type="password"
              placeholder="*******"
              className="p-2  w-full bg-slate-200"
              required
            />
          </label>
          <label className="flex flex-col items-start gap-2">
            cvv
            <input
              required
              type="password"
              placeholder="*******"
              className="p-2  w-full bg-slate-200"
            />
          </label>
          <div className="flex w-full justify-end ">
            <button
              className="bg-teal-700 rounded-full text-white py-3 px-4 font-semibold"
              disabled={mutateBooking.isLoading}
            >
              {mutateBooking.isLoading ? "Processing..." : "PROCEED"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
