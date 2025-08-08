import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../context/useAuth";
import { toast } from "react-toastify";

const Login = () => {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const [disableBtn, setDisableBtn] = useState(false);

  const [loginInfo, setLoginInfo] = useState({
    email: "test@gmail.com",
    password: "22222222",
  });

  const mutateLogin = useMutation({
    mutationFn: async (loginInfo) => {
      setDisableBtn(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/login`,
        {
          method: "POST",
          body: JSON.stringify(loginInfo),
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) throw new Error("Incorrect email or password");

      return res.json();
    },
    onSuccess: (data) => {
      setDisableBtn(false);
      setUser(data.data.user);
      toast.success("Login successful");
      toast.info(
        "This site uses third-party cookies.please enable them on your browser."
      );
      setTimeout(() => navigate("/"), 2000);
    },
    onError: (error) => {
      setDisableBtn(false);
      toast.error("Error: " + error.message);
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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-white shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Login
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              name="email"
              value={loginInfo.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <div>
            <input
              type="password"
              name="password"
              value={loginInfo.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
              className="w-full mt-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
            />
          </div>

          <button
            type="submit"
            disabled={disableBtn}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {disableBtn ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
