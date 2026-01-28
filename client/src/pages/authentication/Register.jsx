import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";
import { apiEndpoints } from "../../api";

export default function Register() {
  const navigate = useNavigate();

  const [sendPayload, setSendPayload] = useState({
    fullName: null,
    username: null,
    email: null,
    password: null,
    avatar: null,
    coverImage: null,
  });
  console.log("Register Paylaod: ", sendPayload);

  const changePayload = (field, value) => {
    setSendPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const formData = new FormData();

      formData.append("fullName", sendPayload.fullName);
      formData.append("username", sendPayload.username);
      formData.append("email", sendPayload.email);
      formData.append("password", sendPayload.password);

      if (sendPayload.avatar) {
        formData.append("avatar", sendPayload.avatar);
      }

      if (sendPayload.coverImage) {
        formData.append("coverImage", sendPayload.coverImage);
      }

      const res = await apiEndpoints.register(formData);

      if (res.data?.success) {
        navigate("/login");
      }
    } catch (error) {
      console.error("Error Registering:", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white text-sm">
      <div className="flex flex-col items-center gap-3">
        <p className="text-[18px]">Register</p>

        <Input
          type="name"
          placeholder="fullName"
          value={sendPayload?.fullName}
          onChange={(e) => changePayload("fullName", e.target.value)}
        />

        <Input
          type="username"
          placeholder="username"
          value={sendPayload?.username}
          onChange={(e) => changePayload("username", e.target.value)}
        />

        <Input
          type="email"
          placeholder="email"
          value={sendPayload?.email}
          onChange={(e) => changePayload("email", e.target.value)}
        />

        <Input.Password
          type="password"
          placeholder="password"
          value={sendPayload?.password}
          onChange={(e) => changePayload("password", e.target.value)}
        />

        <Input
          type="file"
          placeholder="Choose Avatar"
          onChange={(e) => changePayload("avatar", e.target.files[0])}
        />

        <Input
          type="file"
          placeholder="Choose Cover Image"
          onChange={(e) => changePayload("coverImage", e.target.files[0])}
        />

        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-white text-black hover:bg-gray-300 rounded-lg cursor-pointer"
        >
          Register
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-white text-black hover:bg-gray-300 rounded-lg cursor-pointer"
        >
          back
        </button>

        <p>
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            Sign in
          </span>
        </p>
      </div>
    </div>
  );
}
