import React from "react";
import { House, Menu, History } from "lucide-react";

export default function Sidebar() {
  return (
    <div className="flex flex-col items-start gap-2 px-4 py-4 text-white bg-[#0f0f0f] text-sm">
      <div className="flex items-center gap-5 w-40 px-3 py-2 hover:bg-[#3D3D3D] rounded-md cursor-pointer">
        <p>
          <House size={20} />
        </p>
        <p>Home</p>
      </div>

      <div className="flex items-center gap-5 w-40 px-3 py-2 hover:bg-[#3D3D3D] rounded-md cursor-pointer">
        <p>
          <History size={20} />
        </p>
        <p>History</p>
      </div>

      <div className="flex items-center gap-5 w-40 px-3 py-2 hover:bg-[#3D3D3D] rounded-md cursor-pointer">
        <p>
          <House size={20} />
        </p>
        <p>Subscriptions</p>
      </div>
    </div>
  );
}
