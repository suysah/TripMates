import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const SignUp = () => {
  const navigate = useNavigate();
  const [disableBtn, setDisableBtn] = useState(false);

  const [signupInfo, setSignupInfo] = useState({
    name: "",
    email: "",
    password: "",
    passwordConfirm: "",
  });

  const mutateSignup = useMutation({
    mutationFn: async (signupInfo) => {
      setDisableBtn(true);
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/signup`,
        {
          method: "POST",
          body: JSON.stringify(signupInfo),
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        }
      );

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Signup failed");
      }

      return res.json();
    },
    onSuccess: () => {
      setDisableBtn(false);
      toast.success("Signup successful!");
      navigate("/login");
    },
    onError: (error) => {
      setDisableBtn(false);
      toast.error("Error: " + error.message);
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSignupInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutateSignup.mutate(signupInfo);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md p-8 rounded-xl bg-white shadow-xl">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Sign Up
        </h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={signupInfo.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={signupInfo.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={signupInfo.password}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <input
            type="password"
            name="passwordConfirm"
            placeholder="Confirm Password"
            value={signupInfo.passwordConfirm}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-400 outline-none"
          />
          <button
            type="submit"
            disabled={disableBtn}
            className="w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-2 rounded-lg transition duration-300"
          >
            {disableBtn ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center mt-4 text-sm text-gray-600">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-green-600 hover:underline cursor-pointer"
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignUp;
