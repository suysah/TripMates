import { useMutation } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const [loginInfo, setLoginInfo] = useState({
    email: "",
    password: "",
  });

  const mutateLogin = useMutation({
    mutationFn: async (loginInfo) => {
      const res = await fetch("http://localhost:8000/api/v1/users/login", {
        method: "POST",
        body: JSON.stringify(loginInfo),
        headers: {
          "content-type": "application/json",
        },
        credentials: "include", // Optional but common if you use cookies/session
      });

      if (!res.ok) throw new Error("Incorrect email or password ");

      return res.json();
    },
    onSuccess: (data) => {
      setUser(data.data.user);
      toast.success("Login successfull");
      // console.log("Login successful", data);
      setTimeout(() => {
        navigate("/");
      }, 2000);
    },
    onError: (error) => {
      toast.error("Error:" + error.message);
      // console.log("There was an error:", error.message);
    },
  });

  if (user) {
    navigate("/");
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateLogin.mutate(loginInfo);
  };

  return (
    <div className="h-full mt-24 flex justify-center items-center">
      <div className="w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 p-5 flex flex-col rounded-xl shadow-md space-y-3 sm:border">
        <h2 className="text-xl font-bold my-4">Login</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <input
            className="px-2 py-1 border-2"
            type="email"
            name="email"
            value={loginInfo.email}
            placeholder="Email"
            onChange={handleChange}
            required
          />
          <input
            className="px-2 py-1 border-2"
            type="password"
            name="password"
            value={loginInfo.password}
            placeholder="Password"
            onChange={handleChange}
            required
          />
          <button
            type="submit"
            className="bg-green-500 text-white px-4 py-1 rounded-md"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
