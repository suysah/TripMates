import Heading from "../components/Ui/Heading";
import { useQuery } from "@tanstack/react-query";
import Spinner from "../components/Spinner";

const Billing = () => {
  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const fetchBills = async () => {
    const res = await fetch(`${BASE_URL}/api/v1/payments/me`, {
      method: "GET",
      headers: { "content-type": "application/json" },
      credentials: "include",
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Failed to load bills");
    return data.data?.payments || [];
  };

  const {
    data: bills = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["billing"],
    queryFn: fetchBills,
  });

  if (isLoading) return <Spinner />;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="p-6">
      <Heading>Your Bills</Heading>
      <div className="mt-4 flex flex-col gap-3">
        {bills.length === 0 && <div>No bills yet.</div>}
        {bills.map((bill) => (
          <div key={bill._id} className="border rounded p-4 bg-white">
            <div className="font-semibold">{bill.tour_name}</div>
            <div>Payment ID: {bill.payment_id}</div>
            <div>Amount: ${bill.tour_price}</div>
            <div>Date: {new Date(bill.date).toLocaleString()}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Billing;
