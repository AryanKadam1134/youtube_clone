import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { apiEndpoints } from "../api";

export default function SideVideoBar({ currentVideoId }) {
  const navigate = useNavigate();

  const [videos, setVideos] = useState(null);

  const fetchAllVideos = async () => {
    try {
      const res = await apiEndpoints.getAllVideos();

      const data = res.data;
      setVideos(data?.data?.videos);
    } catch (error) {
      console.error("Error fetching all videos: ", error);
    }
  };

  useEffect(() => {
    fetchAllVideos();
  }, []);

  // Filter out current video
  const filteredVideos = videos?.filter(
    (video) => video._id !== currentVideoId,
  );

  return (
    <div className="flex flex-col gap-2">
      {filteredVideos?.map((video, idx) => {
        const { _id, title, views, createdAt, thumbnail, owner } = video;
        const { url: thumbnailUrl } = thumbnail || {};
        const { username, avatar } = owner || {};
        const { url: avatarUrl } = avatar || {};

        const timeAgo = dayjs(createdAt).fromNow();

        return (
          <div
            key={idx}
            onClick={() =>
              navigate("/video-view", { state: { video_id: _id } })
            }
            className="flex gap-2 p-2 rounded-lg hover:bg-[#272727] cursor-pointer transition-colors group"
          >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0 w-[168px] aspect-video rounded-lg overflow-hidden bg-[#272727]">
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Video Info */}
            <div className="flex flex-col flex-1 min-w-0">
              <h3 className="text-white text-sm font-medium line-clamp-2 leading-snug mb-1 group-hover:text-[#3ea6ff] transition-colors">
                {title}
              </h3>

              <p className="text-[#aaaaaa] text-xs hover:text-white cursor-pointer mb-0.5">
                {username}
              </p>

              <div className="flex items-center gap-1 text-[#aaaaaa] text-xs">
                <span>{views?.toLocaleString()} views</span>
                <span>•</span>
                <span>{timeAgo}</span>
              </div>
            </div>
          </div>
        );
      })}

      {filteredVideos?.length === 0 && (
        <div className="text-center py-8 text-[#aaaaaa] text-sm">
          No more videos available
        </div>
      )}
    </div>
  );
}
