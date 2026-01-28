import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "antd";

export default function Register() {
  const navigate = useNavigate();

  const [sendpayload, setSendPayload] = useState({
    username: null,
    password: null,
    avatar: null,
  });

  console.log("Register Paylaod: ", sendpayload);

  const changePayload = (field, value) => {
    setSendPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="flex justify-center items-center h-screen bg-[#0f0f0f] text-white text-sm">
      <div className="flex flex-col items-center gap-3">
        <p className="text-[18px]">Register</p>

        <Input
          placeholder="username or email"
          value={sendpayload?.username}
          onChange={(e) => changePayload("username", e.target.value)}
        />

        <Input.Password
          placeholder="password"
          value={sendpayload?.password}
          onChange={(e) => changePayload("password", e.target.value)}
        />

        <Input
          type="file"
          placeholder="Choose Avatar"
          value={sendpayload?.avatar}
          onChange={(e) => changePayload("avatar", e.target.value)}
          allowClear
        />

        <button className="px-3 py-1 bg-white text-black hover:bg-gray-300 rounded-lg cursor-pointer">
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
