import Header from "../components/Header";
import { Link, Outlet } from "react-router-dom";
import { FaShoppingBag, FaCog, FaStar, FaMoneyBill } from "react-icons/fa";

const Account = () => {
  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow min-h-0">
        <div className="w-1/4 bg-teal-700 text-white font-semibold">
          <div className="flex flex-col justify-start items-start gap-8 p-10">
            <Link
              to="settings"
              className="flex gap-2 justify-center items-center"
            >
              <FaCog /> SETTING
            </Link>
            <Link
              to="bookings"
              className="flex gap-2 justify-center items-center"
            >
              <FaShoppingBag /> BOOKING
            </Link>
            <Link
              to="reviews"
              className="flex gap-2 justify-center items-center"
            >
              <FaStar /> MY REVIEWS
            </Link>
            <Link
              to="billing"
              className="flex gap-2 justify-center items-center"
            >
              <FaMoneyBill /> BILLING
            </Link>
          </div>
        </div>
        <div className="flex-grow  overflow-y-auto min-h-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Account;
