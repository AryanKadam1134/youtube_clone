import React from "react";

import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Header() {
  const { user, token, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-2 bg-[#0f0f0f] text-white text-sm">
      {/* Logo & Header */}
      <div
        onClick={() => navigate(token ? "/dashboard" : "/home")}
        className="flex justify-center items-center gap- cursor-pointer"
      >
        <img
          src="https://static.vecteezy.com/system/resources/thumbnails/018/930/572/small/youtube-logo-youtube-icon-transparent-free-png.png"
          alt="Youtube Logo"
          className="size-[50px]"
        />
        <p>Youtube</p>
      </div>

      <div className="flex justify-center items-center">
        <Input.Search placeholder="search" />
      </div>

      <div className="flex justify-between items-center gap-3">
        {token ? (
          <>
            <img
              src={user?.avatar?.url}
              alt="User Logo"
              className="size-[50px] object-contain cursor-pointer"
              onClick={() => navigate("/profile-page")}
            />

            <button
              onClick={logout}
              className="px-3 py-2 bg-red-500 rounded-lg cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-2 hover:bg-gray-900 rounded-full cursor-pointer"
            >
              Sign In
            </button>

            <button
              onClick={() => navigate("/register")}
              className="px-3 py-2 bg-gray-600 hover:bg-gray-400 rounded-full cursor-pointer"
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
