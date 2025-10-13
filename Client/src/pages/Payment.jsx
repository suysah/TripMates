import Heading from "../components/Ui/Heading";
import { useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Spinner from "../components/Spinner";
import { useState } from "react";

const addBooking = async (booking) => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/bookings/`, {
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
  const queryClient = useQueryClient();
  const BASE_URL = import.meta.env.VITE_BASE_URL;
  const { id } = useParams();
  const navigate = useNavigate();
  const [cardNo, setCardNo] = useState("");
  const [cvv, setCvv] = useState("");

  const fetchDetails = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/tours/${id}`, {
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
    queryKey: ["payment_details"],
    queryFn: fetchDetails,
  });

  const mutateBooking = useMutation({
    mutationFn: addBooking,
  });

  const createPayment = async (payload) => {
    const res = await fetch(`${BASE_URL}/api/v1/payments`, {
      method: "POST",
      headers: { "content-type": "application/json" },
      credentials: "include",
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Payment failed");
    }
    return data;
  };

  const mutatePayment = useMutation({ mutationFn: createPayment });

  if (isLoading) return <Spinner />;
  if (error) return "error" + error.message;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    const digitsOnly = /^\d+$/;
    if (!digitsOnly.test(cardNo) || cardNo.length < 12 || cardNo.length > 19) {
      toast.error("Invalid card number");
      return;
    }
    if (!digitsOnly.test(cvv) || (cvv.length !== 3 && cvv.length !== 4)) {
      toast.error("Invalid CVV");
      return;
    }

    try {
      // Create a payment record first
      const paymentId = `PMT-${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}`;
      await mutatePayment.mutateAsync({
        card_no: cardNo,
        cvv,
        payment_id: paymentId,
        tour_name: tour.name,
        tour_price: String(tour.price),
      });

      // Then create the booking
      await mutateBooking.mutateAsync({ tour: tour.id, price: tour.price });

      queryClient.invalidateQueries("my-tours");
      toast.success("Payment successful and booking created 🎉");
      navigate("/account/bookings");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="flex flex-col  items-center bg-white h-1/2 w-96 p-4">
        <div>
          {isLoading ? (
            "Loading.."
          ) : (
            <img
              src={`${BASE_URL}/public/img/tours/${tour.imageCover}`}
              alt={tour.name}
              loading="lazy"
            />
          )}
          <div className="flex flex-col gap-2 mt-6 ">
            <Heading>{tour.name}</Heading>
            <Heading>Price: ${tour.price} </Heading>
          </div>
        </div>
      </div>
      <div className="bg-white h-1/2 w-96 p-4">
        <Heading>Account Details</Heading>
        <form onSubmit={handleSubmit} className="flex flex-col p-6 gap-4">
          <label className="flex flex-col items-start gap-2">
            Card number
            <input
              type="password"
              placeholder="Enter card number"
              className="p-2  w-full bg-slate-200"
              required
              value={cardNo}
              onChange={(e) => setCardNo(e.target.value)}
            />
          </label>
          <label className="flex flex-col items-start gap-2">
            cvv
            <input
              required
              type="password"
              placeholder="CVV"
              className="p-2  w-full bg-slate-200"
              value={cvv}
              onChange={(e) => setCvv(e.target.value)}
            />
          </label>
          <div className="flex w-full justify-end ">
            <button
              className="bg-teal-700 rounded-full text-white py-3 px-4 font-semibold"
              disabled={mutateBooking.isLoading || mutatePayment.isLoading}
            >
              {mutateBooking.isLoading || mutatePayment.isLoading
                ? "Processing..."
                : "PROCEED"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Payment;
