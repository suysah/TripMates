import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./useAuth";

const fetchUser = async () => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/users/me`, {
    credentials: "include",
  });

  if (!res.ok) throw new Error("Not authenticated");
  return res.json();
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const { data, error } = useQuery({
    queryKey: ["userinfo"],
    queryFn: fetchUser,
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
  console.log("data", data);

  useEffect(() => {
    if (data?.data) {
      setUser(data.data.data);
      setLoading(false);
    } else if (error) {
      setUser(null);
      setLoading(false);
    }
  }, [data, error]);

  console.log("user", user?.name);

  return (
    <AuthContext.Provider value={{ setUser, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
