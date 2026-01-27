import React from "react";
import { Input } from "antd";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center p-2 bg-[#0f0f0f] text-white text-sm">
      {/* Logo & Header */}
      <div className="flex justify-center items-center gap-3">
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
        <button
          onClick={() => navigate("/login")}
          className="px-3 py-2 bg-red-500 rounded-lg cursor-pointer"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Header;
