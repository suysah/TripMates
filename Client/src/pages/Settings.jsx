import { useState } from "react";
import Heading from "../components/Ui/Heading";
import useAuth from "../context/useAuth";
import PasswordChange from "../components/PasswordChange";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";

const Settings = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const BASE_URL = import.meta.env.VITE_API_BASE_URL;
  const [userInfo, setUserInfo] = useState({
    name: user.name,
    email: user.email,
    photo: user.photo,
  });

  const mutateUser = useMutation({
    mutationFn: async (formData) => {
      const res = await fetch(
        `${import.meta.env.BASE_URL}/api/v1/users/updateMe`,
        {
          method: "PATCH",
          body: formData,
          credentials: "include",
        }
      );
      if (!res.ok) throw new Error("Updation failed!");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries("userinfo");
      toast.success("updation successfull");
      // console.log("updation successfull", data);
    },
    onError: (error) => {
      // console.log("Error" + error.message);
      toast.success("Error : " + error.message);
    },
  });

  const handlechange = (e) => {
    e.preventDefault();
    const { name, value, files } = e.target;
    if (name === "photo") setUserInfo((prev) => ({ ...prev, photo: files[0] }));
    else setUserInfo((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", userInfo.name);
    formData.append("email", userInfo.email);
    formData.append("photo", userInfo.photo);
    mutateUser.mutate(formData);
  };

  return (
    <div className="px-20 py">
      <div className=" -6 h-max w-max p-6 flex flex-col gap-6 items-start mb-20">
        <Heading>YOUR ACCOUNT SETTINGS</Heading>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6 ">
          <label className="flex flex-col items-start gap-2">
            Name
            <input
              name="name"
              value={userInfo.name}
              onChange={handlechange}
              placeholder={user.name}
              className="p-2 w-full"
            />
          </label>
          <label className="flex flex-col items-start gap-2">
            Email address
            <input
              name="email"
              value={userInfo.email}
              onChange={handlechange}
              placeholder={user.email}
              className="p-2  w-full"
            />
          </label>
          <div className="flex justify-center items-center gap-6">
            <img
              src={`${BASE_URL}/users/${user.photo}`}
              alt="user DP"
              className="h-16 w-16 rounded-full"
            />{" "}
            <input
              type="file"
              onChange={handlechange}
              name="photo"
              accept="image/*"
            />
          </div>
          <div className="flex justify-end">
            <button className="bg-teal-700 rounded-full text-white py-3 px-4 font-semibold">
              SAVE SETTINGS
            </button>
          </div>
        </form>
      </div>
      <PasswordChange />
    </div>
  );
};

export default Settings;
