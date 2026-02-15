import React, { useState } from "react";
import { Input, message } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { apiEndpoints } from "../../api";
import { Eye, EyeOff, Upload, X } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [switchForm, setSwitchForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [coverPreview, setCoverPreview] = useState(null);

  const [sendPayload, setSendPayload] = useState({
    userCredential: "",
    fullName: "",
    username: "",
    email: "",
    password: "",
    avatar: null,
    coverImage: null,
  });

  const changePayload = (field, value) => {
    setSendPayload((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFileChange = (field, file) => {
    if (file) {
      changePayload(field, file);
      const reader = new FileReader();
      reader.onloadend = () => {
        if (field === "avatar") {
          setAvatarPreview(reader.result);
        } else {
          setCoverPreview(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const removeFile = (field) => {
    changePayload(field, null);
    if (field === "avatar") {
      setAvatarPreview(null);
    } else {
      setCoverPreview(null);
    }
  };

  const handleLogin = async () => {
    if (!sendPayload.userCredential || !sendPayload.password) {
      message.error("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await apiEndpoints.login(sendPayload);

      const data = res.data;
      const token = data?.data?.accessToken;
      const user = data?.data?.user;

      if (data?.success) {
        login(user, token);
        message.success("Login successful!");
        navigate("/dashboard");
      }

      console.log("User Data: ", user);
      console.log("accesstoken: ", token);
    } catch (error) {
      console.error("Error Logging In: ", error);
      message.error(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    if (
      !sendPayload.fullName ||
      !sendPayload.username ||
      !sendPayload.email ||
      !sendPayload.password
    ) {
      message.error("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
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
        message.success("Registration successful! Please login.");
        setSwitchForm(false);
        // Clear form
        setSendPayload({
          userCredential: "",
          fullName: "",
          username: "",
          email: "",
          password: "",
          avatar: null,
          coverImage: null,
        });
        setAvatarPreview(null);
        setCoverPreview(null);
      }
    } catch (error) {
      console.error("Error Registering:", error);
      message.error(error.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (switchForm) {
      handleRegister();
    } else {
      handleLogin();
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#0f0f0f] text-white p-4">
      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="flex items-center justify-center gap-3 mb-8">
          <img
            src="images/youtube-icon-5.svg"
            alt="Youtube Logo"
            className="size-12"
          />
          <span className="text-white font-semibold text-3xl tracking-tight">
            YouTube
          </span>
        </div>

        {/* Form Card */}
        <div className="bg-[#272727] rounded-2xl p-8 border border-[#3d3d3d] shadow-2xl">
          <h2 className="text-2xl font-semibold text-center mb-2">
            {switchForm ? "Create Account" : "Welcome Back"}
          </h2>
          <p className="text-center text-[#aaaaaa] text-sm mb-8">
            {switchForm
              ? "Sign up to start sharing videos"
              : "Sign in to continue to YouTube"}
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* Full Name */}
            {switchForm && (
              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                  Full Name *
                </label>
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  value={sendPayload?.fullName}
                  onChange={(e) => changePayload("fullName", e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: "#121212",
                    borderColor: "#3d3d3d",
                    color: "white",
                  }}
                />
              </div>
            )}

            {/* Username or Email */}
            <div>
              <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                {switchForm ? "Username *" : "Username or Email *"}
              </label>
              <Input
                placeholder={
                  switchForm ? "Choose a username" : "Enter username or email"
                }
                value={
                  switchForm
                    ? sendPayload?.username
                    : sendPayload?.userCredential
                }
                onChange={(e) =>
                  changePayload(
                    switchForm ? "username" : "userCredential",
                    e.target.value,
                  )
                }
                className="h-11"
                style={{
                  backgroundColor: "#121212",
                  borderColor: "#3d3d3d",
                  color: "white",
                }}
              />
            </div>

            {/* Email */}
            {switchForm && (
              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                  Email *
                </label>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={sendPayload?.email}
                  onChange={(e) => changePayload("email", e.target.value)}
                  className="h-11"
                  style={{
                    backgroundColor: "#121212",
                    borderColor: "#3d3d3d",
                    color: "white",
                  }}
                />
              </div>
            )}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                Password *
              </label>
              <Input.Password
                placeholder="Enter your password"
                value={sendPayload?.password}
                onChange={(e) => changePayload("password", e.target.value)}
                className="h-11"
                iconRender={(visible) =>
                  visible ? <Eye size={16} /> : <EyeOff size={16} />
                }
                style={{
                  backgroundColor: "#121212",
                  borderColor: "#3d3d3d",
                  color: "white",
                }}
              />
            </div>

            {/* Avatar Upload */}
            {switchForm && (
              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                  Profile Picture
                </label>
                {avatarPreview ? (
                  <div className="relative">
                    <img
                      src={avatarPreview}
                      alt="Avatar preview"
                      className="w-24 h-24 rounded-full object-cover border-2 border-[#3d3d3d]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("avatar")}
                      className="absolute top-0 right-0 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 h-24 border-2 border-dashed border-[#3d3d3d] rounded-lg cursor-pointer hover:border-[#3ea6ff] transition-colors">
                    <Upload size={20} className="text-[#aaaaaa]" />
                    <span className="text-[#aaaaaa]">Upload Avatar</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange("avatar", e.target.files[0])
                      }
                    />
                  </label>
                )}
              </div>
            )}

            {/* Cover Image Upload */}
            {switchForm && (
              <div>
                <label className="block text-sm font-medium text-[#aaaaaa] mb-2">
                  Cover Image
                </label>
                {coverPreview ? (
                  <div className="relative">
                    <img
                      src={coverPreview}
                      alt="Cover preview"
                      className="w-full h-32 rounded-lg object-cover border-2 border-[#3d3d3d]"
                    />
                    <button
                      type="button"
                      onClick={() => removeFile("coverImage")}
                      className="absolute top-2 right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center justify-center gap-2 h-32 border-2 border-dashed border-[#3d3d3d] rounded-lg cursor-pointer hover:border-[#3ea6ff] transition-colors">
                    <Upload size={20} className="text-[#aaaaaa]" />
                    <span className="text-[#aaaaaa]">Upload Cover Image</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        handleFileChange("coverImage", e.target.files[0])
                      }
                    />
                  </label>
                )}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-11 bg-[#3ea6ff] text-white hover:bg-[#3ea6ff]/90 disabled:bg-[#3d3d3d] disabled:text-[#717171] disabled:cursor-not-allowed rounded-full font-medium transition-colors mt-2"
            >
              {loading
                ? "Please wait..."
                : switchForm
                  ? "Create Account"
                  : "Sign In"}
            </button>

            {/* Back Button */}
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-full h-11 bg-transparent border border-[#3d3d3d] text-white hover:bg-[#3d3d3d] rounded-full font-medium transition-colors"
            >
              Back
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 pt-6 border-t border-[#3d3d3d] text-center">
            <p className="text-[#aaaaaa] text-sm">
              {switchForm
                ? "Already have an account?"
                : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setSwitchForm((prev) => !prev);
                  // Clear form when switching
                  setSendPayload({
                    userCredential: "",
                    fullName: "",
                    username: "",
                    email: "",
                    password: "",
                    avatar: null,
                    coverImage: null,
                  });
                  setAvatarPreview(null);
                  setCoverPreview(null);
                }}
                className="text-[#3ea6ff] hover:text-[#3ea6ff]/90 font-medium ml-1"
              >
                {switchForm ? "Sign in" : "Sign up"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[#717171] text-xs mt-6">
          By continuing, you agree to YouTube's Terms of Service and Privacy
          Policy
        </p>
      </div>
    </div>
  );
}
