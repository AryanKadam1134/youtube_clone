import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Home, 
  History, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  ListVideo,
  TrendingUp,
  Music,
  Gamepad2,
  Trophy,
  Lightbulb
} from "lucide-react";

export default function Sidebar({ isOpen }) {
  const navigate = useNavigate();

  const mainMenuItems = [
    { icon: Home, label: "Home", path: "/dashboard" },
    { icon: TrendingUp, label: "Trending", path: "/trending" },
    { icon: PlaySquare, label: "Subscriptions", path: "/subscriptions" },
  ];

  const libraryItems = [
    { icon: ListVideo, label: "Library", path: "/library" },
    { icon: History, label: "History", path: "/history" },
    { icon: Clock, label: "Watch Later", path: "/watch-later" },
    { icon: ThumbsUp, label: "Liked Videos", path: "/liked" },
  ];

  const exploreItems = [
    { icon: Music, label: "Music", path: "/music" },
    { icon: Gamepad2, label: "Gaming", path: "/gaming" },
    { icon: Trophy, label: "Sports", path: "/sports" },
    { icon: Lightbulb, label: "Learning", path: "/learning" },
  ];

  const SidebarItem = ({ icon: Icon, label, path, onClick }) => (
    <div
      onClick={() => onClick ? onClick() : navigate(path)}
      className={`flex items-center gap-6 px-3 py-2.5 hover:bg-[#3D3D3D] rounded-lg cursor-pointer transition-colors group ${
        !isOpen && "justify-center"
      }`}
    >
      <Icon size={20} className="text-white flex-shrink-0" />
      {isOpen && (
        <span className="text-white text-sm font-medium">{label}</span>
      )}
      {!isOpen && (
        <div className="absolute left-full ml-2 px-2 py-1 bg-[#3D3D3D] text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50">
          {label}
        </div>
      )}
    </div>
  );

  const SidebarSection = ({ items, title }) => (
    <div className="flex flex-col gap-1">
      {isOpen && title && (
        <h3 className="px-3 pt-2 pb-1 text-[#aaaaaa] text-xs font-semibold uppercase tracking-wider">
          {title}
        </h3>
      )}
      {items.map((item, idx) => (
        <SidebarItem key={idx} {...item} />
      ))}
    </div>
  );

  return (
    <div
      className={`flex flex-col gap-3 py-3 bg-[#0f0f0f] h-[calc(100vh-57px)] overflow-y-auto transition-all duration-300 border-r border-[#272727] ${
        isOpen ? "w-64 px-3" : "w-20 px-2"
      }`}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "#3D3D3D #0f0f0f",
      }}
    >
      {/* Main Menu */}
      <SidebarSection items={mainMenuItems} />

      {/* Divider */}
      <div className="border-t border-[#3D3D3D] my-2"></div>

      {/* Library */}
      <SidebarSection items={libraryItems} title="Library" />

      {/* Divider */}
      <div className="border-t border-[#3D3D3D] my-2"></div>

      {/* Explore */}
      <SidebarSection items={exploreItems} title="Explore" />
    </div>
  );
}