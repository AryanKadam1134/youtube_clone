import React, { useState } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [sendpayload, setSendPayload] = useState({
    userCredential: null,
    password: null,
  });

  const changePayload = (field, value) => {
    setSendPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      const res = await axios.post(
        "http://localhost:8000/api/v1/users/login",
        sendpayload,
      );

      const data = res.data;
      const token = data?.data?.accessToken;
      const user = data?.data?.user;

      if (data?.success) {
        login(user, token);
        navigate("/dashboard");
      }

      console.log("User Data: ", user);
      console.log("accesstoken: ", token);
    } catch (error) {
      console.error("Error Logging In: ", error);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white text-sm">
      <div className="flex flex-col items-center gap-3">
        <p className="text-[18px]">Login</p>

        <Input
          placeholder="username or email"
          value={sendpayload?.userCredential}
          onChange={(e) => changePayload("userCredential", e.target.value)}
        />

        <Input
          placeholder="password"
          value={sendpayload?.password}
          onChange={(e) => changePayload("password", e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-white text-black hover:bg-gray-300 rounded-lg cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-white text-black hover:bg-gray-300 rounded-lg cursor-pointer"
        >
          back
        </button>

        <p>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-500 hover:text-blue-600 cursor-pointer"
          >
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
}
