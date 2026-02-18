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

export default function VideoCard({ video, refresh }) {
  const { user, token } = useAuth();

  const navigate = useNavigate();

  const { _id, title, views, isPublished, createdAt, thumbnail, owner } = video;
  const { url: thumbnailUrl } = thumbnail || {};
  const { username, avatar, _id: ownerId } = owner || {};
  const { url: avatarUrl } = avatar || {};

  const isOwner = user?._id === ownerId;

  const timeAgo = dayjs(createdAt).fromNow();

  const updateVideoDetails = async () => {
    try {
      const res = await apiEndpoints.updateVideoDetails(_id, {
        isPublished: isPublished ? "false" : "true",
      });

      const data = res.data;

      refresh();
      console.log("Video details updated: ", data);
    } catch (error) {
      console.error("Error updating video details: ", error);
    }
  };

  const copyVideoLink = () => {
    const videoUrl = `${window.location.origin}/video-view?id=${_id}`;
    navigator.clipboard.writeText(videoUrl);
    // You can add a toast notification here
  };

  const overflowItems = [
    {
      icon: isPublished ? <Ban size={13} /> : <ExternalLink size={13} />,
      name: isPublished ? `Unpublish` : `Publish`,
      display: isOwner,
      func: updateVideoDetails,
    },
    {
      icon: <Clipboard size={13} />,
      name: "Copy Link",
      display: true,
      func: copyVideoLink,
    },
  ];

  const overflowContent = <OverflowMenu overflowItems={overflowItems} />;

  return (
    <div
      onClick={() => navigate("/video-view", { state: { video_id: _id } })}
      className="cursor-pointer group"
    >
      <div className="flex flex-col gap-3">
        {/* Thumbnail */}
        <div className="relative aspect-video rounded-xl overflow-hidden bg-[#272727]">
          <img
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
            src={thumbnailUrl}
            alt={title}
          />

          {/* Unpublished Badge */}
          {!isPublished && isOwner && (
            <div className="absolute top-2 left-2 px-2 py-1 bg-red-500/90 backdrop-blur-sm text-white text-xs font-medium rounded">
              Unpublished
            </div>
          )}
        </div>

        {/* Video Info */}
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <img
            src={avatarUrl}
            alt={username}
            onClick={(e) => {
              e.stopPropagation();
              navigate("/user-channel", { state: { id: ownerId } });
            }}
            className="size-9 rounded-full object-cover flex-shrink-0 mt-0.5"
          />

          {/* Details */}
          <div className="flex-1 min-w-0 pr-6">
            <h3 className="text-white font-medium text-sm line-clamp-2 leading-snug mb-1 group-hover:text-[#3ea6ff] transition-colors">
              {title}
            </h3>

            <p
              onClick={(e) => {
                e.stopPropagation();
                navigate("/user-channel", { state: { id: ownerId } });
              }}
              className="text-[#aaaaaa] hover:text-white text-xs mb-0.5 cursor-pointer transition-colors"
            >
              {username}
            </p>

            <div className="flex items-center gap-1 text-[#aaaaaa] text-xs">
              <span>{views?.toLocaleString()} views</span>
              <span>•</span>
              <span>{timeAgo}</span>
            </div>
          </div>

          {/* Overflow Menu */}
          {token && (
            <div
              onClick={(e) => e.stopPropagation()}
              className="opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <Popover
                content={overflowContent}
                trigger="click"
                overlayInnerStyle={{ padding: "0px" }}
              >
                <button className="p-1.5 hover:bg-[#3A3A3A] rounded-full transition-colors">
                  <EllipsisVertical size={18} className="text-white" />
                </button>
              </Popover>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
