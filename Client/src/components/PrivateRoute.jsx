import { Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";
import Login from "../pages/Login";
import Spinner from "./Spinner";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // console.log("User", user);

  if (loading)
    return (
      <p>
        <Spinner />
      </p>
    );

  return user ? <Outlet /> : <Login />;
};

export default PrivateRoute;
