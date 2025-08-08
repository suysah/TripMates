import { Outlet } from "react-router-dom";
import useAuth from "../context/useAuth";

const PrivateRoute = () => {
  const { user, loading } = useAuth();

  // console.log("User", user);

  if (loading) return <p>Loading...</p>;

  return user ? <Outlet /> : null;
};

export default PrivateRoute;
