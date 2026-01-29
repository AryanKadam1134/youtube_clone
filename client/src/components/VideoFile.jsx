import React from "react";

import { Popover } from "antd";
import { EllipsisVertical, ExternalLink, Clipboard, Ban } from "lucide-react";

import OverflowMenu from "./OverflowMenu";
import { useAuth } from "../context/AuthContext";

export default function VideoFile({ video }) {
  const { user } = useAuth();

  const isOwner = user?._id === video?.owner?._id;

  const videoId = video?._id;
  const videoTitle = video?.title;
  const videoViews = video?.views;
  const thumbnail = video?.thumbnail?.url;
  const videoOwnerAvatar = video?.owner?.avatar?.url;
  const isPublished = video?.isPublished;

  const overflowItems = [
    {
      icon: isPublished ? <Ban size={13} /> : <ExternalLink size={13} />,
      name: isPublished ? `Unpublish` : `Publish`,
      display: isOwner,
      // func: "", // The function for particular function goes here...
    },
    {
      icon: <Clipboard size={13} />,
      name: "Copy Link",
      display: true,
      // func: "", // The function for particular function goes here...
    },
  ];

  const overflowContent = <OverflowMenu overflowItems={overflowItems} />;

  return (
    <div className="flex flex-col gap-2 text-sm">
      <img className="h-[250px] rounded-lg object-cover" src={thumbnail} />

      <div className="flex items-center justify-between">
        <div className="flex justify-start items-start gap-2">
          <img
            src={videoOwnerAvatar}
            alt="User Avatar"
            className="size-[30px] rounded-full object-cover"
          />

          <div className="flex flex-col justify-center items-start gap-1 text-white">
            <p className="font-semibold text-[14px]">{videoTitle}</p>
            <p className="text-[12px]">{videoViews} views</p>
          </div>
        </div>

        <Popover
          content={overflowContent}
          trigger="click"
          styles={{
            padding: 0,
          }}
        >
          <div className="p-1 hover:bg-gray-800 rounded-full transition-colors cursor-pointer">
            <EllipsisVertical size={18} className="text-white" />
          </div>
        </Popover>
      </div>
    </div>
  );
}
