import React, { useState } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiEndpoints } from "../../api";

export default function Login() {
  const { login } = useAuth();

  const navigate = useNavigate();

  const [sendPayload, setSendPayload] = useState({
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
      const res = await apiEndpoints.login(sendPayload);

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
    <div className="flex justify-center items-center p-20 bg-[#0f0f0f] text-white text-sm">
      <div className="flex flex-col items-center justify-center gap-5">
        <p className="text-[18px]">Login</p>

        <Input
          placeholder="username or email"
          value={sendPayload?.userCredential}
          onChange={(e) => changePayload("userCredential", e.target.value)}
          allowClear
        />

        <Input.Password
          placeholder="password"
          value={sendPayload?.password}
          onChange={(e) => changePayload("password", e.target.value)}
          allowClear
        />

        <button
          onClick={handleSubmit}
          className="px-3 py-1 bg-white text-black hover:bg-gray-300 w-full rounded-md cursor-pointer"
        >
          Login
        </button>

        <button
          onClick={() => navigate(-1)}
          className="px-3 py-1 bg-white text-black hover:bg-gray-300 rounded-md cursor-pointer"
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
