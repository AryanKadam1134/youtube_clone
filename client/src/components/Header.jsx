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
            <div className="rounded-full border border-black hover:border-white cursor-pointer">
              <img
                src={user?.avatar?.url}
                alt="User Logo"
                className="size-[30px] rounded-full object-contain"
                onClick={() => navigate("/profile-page")}
              />
            </div>

            <button
              onClick={logout}
              className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded-md cursor-pointer"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="px-3 py-2 text-white hover:text-black hover:bg-slate-300 border border-slate-300 rounded-md transition-colors cursor-pointer"
            >
              Sign In / Sign up
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;
