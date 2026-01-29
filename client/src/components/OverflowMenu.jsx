import React from "react";

export default function OverflowMenu({ overflowItems }) {
  return (
    <div
      className="flex flex-col justify-between items-start px-2 py-2 w-[160px]
    bg-gray-800 rounded-sm shadow-xl"
    >
      {overflowItems?.map((items, index) => {
        if (!items?.display) return;

        return (
          <button
            key={index}
            onClick={items.func}
            className="flex justify-start items-center gap-1 p-1
          text-[#aaaaaa] hover:text-black hover:bg-[#aaaaaa] rounded-sm w-full cursor-pointer"
          >
            {items.icon} <span className="text-[12px]">{items.name}</span>
          </button>
        );
      })}
    </div>
  );
}
