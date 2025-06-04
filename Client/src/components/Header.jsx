import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Header = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [isloggedin, setIsLoggedin] = useState(false);
  const { user, setUser } = useAuth();
  // console.log("header", user);

  useEffect(() => {
    if (user) {
      setIsLoggedin(true);
    } else {
      setIsLoggedin(false);
    }
  }, [user]);

  const BASE_URL = import.meta.env.VITE_BASE_URL;

  const handleLogout = async () => {
    try {
      await fetch(`${BASE_URL}/api/v1/users/logout`, {
        method: "GET",
        credentials: "include",
      });
      setUser(null);
      setIsLoggedin(false);
      queryClient.invalidateQueries({ queryKey: ["userinfo"] });
      toast.success("Logout successfull!");
      navigate("/");
    } catch (error) {
      toast.error("Logout unsuccessfull!", error.message);
      // console.error("Logout failed", error);
    }
  };

  return (
    <header className="bg-gray-900  py-4 px-6">
      <div className="container mx-auto text-white flex justify-between items-center">
        <div className="text-2xl font-bold">
          <Link to="/">
            <h1 className="flex items-center justify-center">
              <span>
                <img
                  src="/Images/icon.png"
                  alt="logo"
                  height="40px"
                  width="40px"
                />
              </span>
              TripMates
            </h1>
          </Link>
        </div>

        {isloggedin ? (
          <div className="flex items-center space-x-4">
            <button
              onClick={handleLogout}
              className="border border-white px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition"
            >
              Logout
            </button>

            <Link to="/account">
              <div className="flex gap-2 justify-center items-center text-white px-4 py-2 rounded hover:text-lg transition ">
                <img
                  src={`${BASE_URL}/public/img/users/${user?.photo}`}
                  alt="user DP"
                  className="h-8 w-8 rounded-full"
                />{" "}
                {user.name}
              </div>
            </Link>
          </div>
        ) : (
          <div className="flex items-center space-x-4">
            <Link to="/login">
              <button className="border border-white px-2 py-1 rounded hover:bg-white hover:text-gray-900 transition">
                Login
              </button>
            </Link>

            <Link to="/signup">
              <button className="bg-white text-gray-900 px-2 py-1 rounded hover:bg-gray-200 transition">
                Sign Up
              </button>
            </Link>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
