import Header from "../components/Header";
import { Link, Outlet } from "react-router-dom";
import { FaShoppingBag, FaCog, FaStar, FaMoneyBill, FaHeart, FaMap, FaUsers, FaChartBar, FaBook } from "react-icons/fa";
import useAuth from "../context/useAuth";

const Account = () => {
  const { user } = useAuth();

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex flex-grow min-h-0">
        <div className="w-1/4 bg-teal-700 text-white font-semibold overflow-y-auto">
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
              to="wishlist"
              className="flex gap-2 justify-center items-center"
            >
              <FaHeart /> WISHLIST
            </Link>
            <Link
              to="billing"
              className="flex gap-2 justify-center items-center"
            >
              <FaMoneyBill /> BILLING
            </Link>

            {(user?.role === "admin" || user?.role === "lead-guide") && (
              <>
                <div className="w-full border-t border-teal-600 my-2"></div>
                <h4 className="text-xs uppercase tracking-wider text-teal-200 font-bold">
                  Admin Panel
                </h4>
                <Link
                  to="admin-dashboard"
                  className="flex gap-2 justify-center items-center"
                >
                  <FaChartBar /> DASHBOARD
                </Link>
                <Link
                  to="manage-tours"
                  className="flex gap-2 justify-center items-center"
                >
                  <FaMap /> MANAGE TOURS
                </Link>
                <Link
                  to="manage-bookings"
                  className="flex gap-2 justify-center items-center"
                >
                  <FaBook /> BOOKINGS
                </Link>
                <Link
                  to="manage-users"
                  className="flex gap-2 justify-center items-center"
                >
                  <FaUsers /> MANAGE USERS
                </Link>
              </>
            )}
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
