import { useState, useEffect, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { AuthContext } from "./useAuth";

const fetchUser = async () => {
  const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/v1/users/me`, {
    method: "GET",
    credentials: "include", // ✅ must include this
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
    staleTime: 5 * 60 * 1000,
  });

  useEffect(() => {
    if (data?.data) {
      setUser(data.data.data);
      setLoading(false);
    } else if (error) {
      setUser(null);
      setLoading(false);
    }
  }, [data, error]);

  const value = useMemo(() => ({ setUser, user, loading }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthProvider;
