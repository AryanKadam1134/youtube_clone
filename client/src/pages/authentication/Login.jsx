import React, { useState } from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiEndpoints } from "../../api";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [switchForm, setSwitchForm] = useState(false);

  const [sendPayload, setSendPayload] = useState({
    userCredential: null,
    fullName: null,
    username: null,
    email: null,
    password: null,
    avatar: null,
    coverImage: null,
  });

  const changePayload = (field, value) => {
    setSendPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleLogin = async () => {
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

  const handleRegister = async () => {
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
        setSwitchForm(false);
      }
    } catch (error) {
      console.error("Error Registering:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-black text-white">
      <div className="w-full max-w-sm px-6">
        <div className="bg-zinc-900 rounded-lg p-8 border border-zinc-800">
          <h2 className="text-xl font-medium text-center mb-8">
            {switchForm ? "Register" : "Login"}
          </h2>

          <div className="flex flex-col gap-3">
            {switchForm && (
              <Input
                type="text"
                placeholder="Full Name"
                value={sendPayload?.fullName}
                onChange={(e) => changePayload("fullName", e.target.value)}
                allowClear
                style={{
                  backgroundColor: "black",
                  borderColor: "#27272a",
                  color: "white",
                }}
              />
            )}

            <Input
              placeholder={switchForm ? "Username" : "Username or Email"}
              value={
                switchForm ? sendPayload?.username : sendPayload?.userCredential
              }
              onChange={(e) =>
                changePayload(
                  switchForm ? "username" : "userCredential",
                  e.target.value,
                )
              }
              allowClear
              style={{
                backgroundColor: "black",
                borderColor: "#27272a",
                color: "white",
              }}
            />

            {switchForm && (
              <Input
                type="email"
                placeholder="Email"
                value={sendPayload?.email}
                onChange={(e) => changePayload("email", e.target.value)}
                allowClear
                style={{
                  backgroundColor: "black",
                  borderColor: "#27272a",
                  color: "white",
                }}
              />
            )}

            <Input.Password
              placeholder="Password"
              value={sendPayload?.password}
              onChange={(e) => changePayload("password", e.target.value)}
              allowClear
              style={{
                backgroundColor: "black",
                borderColor: "#27272a",
                color: "white",
              }}
            />

            {switchForm && (
              <Input
                type="file"
                placeholder="Choose Avatar"
                onChange={(e) => changePayload("avatar", e.target.files[0])}
                className="bg-black border-zinc-800 text-white"
              />
            )}

            {switchForm && (
              <Input
                type="file"
                placeholder="Choose Cover Image"
                onChange={(e) => changePayload("coverImage", e.target.files[0])}
                className="bg-black border-zinc-800 text-white"
              />
            )}

            <button
              onClick={switchForm ? handleRegister : handleLogin}
              className="w-full px-4 py-2 bg-white text-black hover:bg-zinc-200 rounded-md font-medium transition-colors mt-6 cursor-pointer"
            >
              {switchForm ? "Register" : "Login"}
            </button>

            <button
              onClick={() => navigate(-1)}
              className="w-full px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded-md font-medium transition-colors cursor-pointer"
            >
              Back
            </button>

            <p className="text-center text-zinc-400 text-sm pt-4">
              {switchForm
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <span
                onClick={() => setSwitchForm((prev) => !prev)}
                className="text-white hover:text-zinc-300 cursor-pointer font-medium"
              >
                {switchForm ? "Sign in" : "Sign up"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
