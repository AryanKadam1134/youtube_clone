import React, { useState } from "react";

import { Input } from "antd";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, Search, Video, Bell, User } from "lucide-react";

function Header({ toggleSidebar }) {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (value) => {
    console.log("Search:", value);
    // Add your search logic here later
  };

  return (
    <div className="flex justify-between items-center px-4 py-2 w-full bg-[#0f0f0f] sticky top-0 z-50 border-b border-[#272727]">
      {/* Left Section */}
      <div className="flex items-center gap-4 flex-shrink-0">
        <button
          onClick={toggleSidebar}
          className="p-2 hover:bg-[#3D3D3D] rounded-full transition-colors"
        >
          <Menu size={24} className="text-white" />
        </button>

        {/* Logo */}
        <div
          onClick={() => navigate(token ? "/dashboard" : "/home")}
          className="flex items-center gap-2 cursor-pointer group"
        >
          <img
            src="images/youtube-icon-5.svg"
            alt="Youtube Logo"
            className="size-7"
          />
          <span className="text-white font-semibold text-xl tracking-tight hidden sm:block">
            YouTube
          </span>
        </div>
      </div>

      {/* Center - Search */}
      <div className="flex items-center justify-center flex-1 max-w-[600px] mx-4">
        <div className="flex items-center w-full">
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onPressEnter={(e) => handleSearch(e.target.value)}
            placeholder="Search"
            className="h-10 bg-[#121212] border border-[#303030] rounded-l-full text-white placeholder-[#888888] px-4"
            style={{
              background: "#121212",
              color: "white",
            }}
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            className="h-10 px-6 bg-[#222222] border border-[#303030] border-l-0 rounded-r-full hover:bg-[#3D3D3D] transition-colors"
          >
            <Search size={20} className="text-white" />
          </button>
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {token ? (
          <>
            {/* Create Video Button */}
            <button
              onClick={() => navigate("/upload")}
              className="p-2 hover:bg-[#3D3D3D] rounded-full transition-colors"
              title="Create"
            >
              <Video size={24} className="text-white" />
            </button>

            {/* Notifications */}
            <button
              className="p-2 hover:bg-[#3D3D3D] rounded-full transition-colors relative"
              title="Notifications"
            >
              <Bell size={24} className="text-white" />
              {/* Notification badge */}
              <span className="absolute top-1.5 right-1.5 size-2 bg-red-600 rounded-full"></span>
            </button>

            {/* User Avatar */}
            <div className="relative group">
              <img
                src={user?.avatar?.url}
                alt="User Avatar"
                className="size-8 rounded-full object-cover cursor-pointer border-2 border-transparent hover:border-[#3ea6ff] transition-colors"
                onClick={() => navigate("/profile-page")}
              />
            </div>

            {/* Logout Button */}
            <button
              onClick={logout}
              className="px-4 py-1.5 ml-2 bg-transparent hover:bg-[#3D3D3D] text-[#3ea6ff] border border-[#3ea6ff] rounded-full text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 px-4 py-2 text-[#3ea6ff] border border-[#3ea6ff] rounded-full hover:bg-[#263850] transition-colors"
            >
              <User size={18} />
              <span className="text-sm font-medium">Sign in</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default Header;