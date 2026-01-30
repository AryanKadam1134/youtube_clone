import React from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { Popover } from "antd";
import { EllipsisVertical, ExternalLink, Clipboard, Ban } from "lucide-react";

import OverflowMenu from "./OverflowMenu";

import { apiEndpoints } from "../api";

import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function VideoFile({ video, refresh }) {
  const { user, token } = useAuth();

  const navigate = useNavigate();

  const isOwner = user?._id === video?.owner?._id;

  const videoId = video?._id;
  const videoTitle = video?.title;
  const videoViews = video?.views;
  const thumbnail = video?.thumbnail?.url;
  const videoOwnerAvatar = video?.owner?.avatar?.url;
  const isPublished = video?.isPublished;
  const ownerName = video?.owner?.username;
  const createdAt = video?.createdAt;
  const timeAgo = dayjs(createdAt).fromNow();

  console.log("createdAt: ", createdAt);

  const updateVideoDetails = async () => {
    try {
      const res = await apiEndpoints.updateVideoDetails(videoId, {
        isPublished: isPublished ? "false" : "true",
      });

      const data = res.data;

      refresh();
      console.log("Video details updated: ", data);
    } catch (error) {
      console.error("Error updating video details: ", error);
    }
  };

  const overflowItems = [
    {
      icon: isPublished ? <Ban size={13} /> : <ExternalLink size={13} />,
      name: isPublished ? `Unpublish` : `Publish`,
      display: isOwner,
      func: updateVideoDetails, // The function for particular function goes here...
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
    <div
      onClick={() => navigate("/video-view", { state: { videoId: videoId } })}
      className="flex items-center justify-center p-2 rounded-md hover:bg-[#212121] cursor-pointer"
    >
      <div className="flex flex-col gap-2 text-sm">
        <img
          className="w-full max-w-[35em] aspect-video overflow-hidden rounded-lg"
          src={thumbnail}
          alt="Video Thumbnail"
        />

        <div className="flex items-start justify-between">
          <div className="flex justify-start items-start gap-2">
            <img
              src={videoOwnerAvatar}
              alt="User Avatar"
              className="size-[30px] mt-1 rounded-full object-cover"
            />

            <div className="flex flex-col justify-center items-start gap-0.5 text-white">
              <p className="font-semibold text-[14px]">{videoTitle}</p>
              <p className="text-[#aaaaaa] hover:text-white text-[11px] cursor-pointer">
                {ownerName}
              </p>
              <p className="text-[#aaaaaa] text-[11px]">
                {videoViews} views • {timeAgo}
              </p>
            </div>
          </div>

          {token && (
            <div onClick={(e) => e.stopPropagation()}>
              <Popover
                content={overflowContent}
                trigger="click"
                overlayInnerStyle={{ padding: "0px" }}
              >
                <div className="p-1 hover:bg-[#3A3A3A] rounded-full transition-colors cursor-pointer">
                  <EllipsisVertical size={18} className="text-white" />
                </div>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
