import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Heading from "./Ui/Heading";
import { toast } from "react-toastify";

const PasswordChange = () => {
  const [password, setPassword] = useState({
    currentPassword: "",
    newPassword: "",
    passwordConfirm: "",
  });

  const mutatePassword = useMutation({
    mutationKey: ["password"],
    mutationFn: async (password) => {
      const res = await fetch(
        `${import.meta.env.VITE_BASE_URL}/api/v1/users/updatePassword`,
        {
          method: "PATCH",
          body: JSON.stringify(password),
          headers: { "content-type": "application/json" },
          credentials: "include",
        }
      );

      if (!res.ok)
        throw new Error("Password updation failed! please try again");
      return res.json();
    },
    onSuccess: () => {
      //   console.log(data, "password updated successfully");
      toast.success("Password changed successfull");
    },
    onError: (error) => {
      //   console.log("Error:", error.message);
      toast.success("Error : " + error.message);
    },
  });

  const handleChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setPassword((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutatePassword.mutate(password);
    setPassword({ currentPassword: "", newPassword: "", passwordConfirm: "" });
  };

  return (
    <div>
      <div className=" h-max w-96 p-6   flex flex-col gap-6 items-start">
        <Heading>PASSWORD CHANGE</Heading>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 w-full">
          <label className="flex flex-col items-start gap-2">
            Current password
            <input
              type="password"
              onChange={handleChange}
              name="currentPassword"
              value={password.currentPassword}
              placeholder="*******"
              className="p-2  w-full"
            />
          </label>
          <label className="flex flex-col items-start gap-2">
            New Password
            <input
              type="password"
              onChange={handleChange}
              name="newPassword"
              value={password.newPassword}
              placeholder="*******"
              className="p-2  w-full"
            />
          </label>

          <label className="flex flex-col items-start gap-2">
            Confirm Password
            <input
              type="password"
              onChange={handleChange}
              name="passwordConfirm"
              value={password.passwordConfirm}
              placeholder="*******"
              className="p-2  w-full"
            />
          </label>
          <div className="flex w-full justify-end ">
            <button className="bg-teal-700 rounded-full text-white py-3 px-4 font-semibold">
              SAVE PASSWORD
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChange;
