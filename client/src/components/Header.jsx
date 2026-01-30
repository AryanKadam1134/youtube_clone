import React from "react";

import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu } from "lucide-react";

function Header() {
  const { user, token, logout } = useAuth();

  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center px-4 py-2 w-full text-sm text-white bg-[#0f0f0f]">
      <div className="flex items-center gap-5">
        <Menu
          size={34}
          className="p-2 hover:bg-[#3D3D3D] rounded-full cursor-pointer transition-colors"
        />

        {/* Logo & Header */}
        <div
          onClick={() => navigate(token ? "/dashboard" : "/home")}
          className="flex justify-center items-center gap-2 cursor-pointer"
        >
          <img
            src="images/youtube-icon-5.svg"
            alt="Youtube Logo"
            className="size-[30px]"
          />
          <p>Youtube</p>
        </div>
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
              className="px-3 py-2 text-[12px] text-white hover:text-black hover:bg-slate-300 border border-slate-300 rounded-md transition-colors cursor-pointer"
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
