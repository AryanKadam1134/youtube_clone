import React, { useEffect, useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { useLocation } from "react-router-dom";
import { apiEndpoints } from "../api";

export default function VideoView() {
  const location = useLocation();
  const videoId = location?.state?.videoId;

  const [video, setVideo] = useState(null);

  const video_Id = video?._id;
  const videoTitle = video?.title;
  const videoViews = video?.views;
  const videoFile = video?.videoFile?.url;
  const videoOwnerAvatar = video?.owner?.avatar?.url;
  const isPublished = video?.isPublished;
  const ownerName = video?.owner?.username;
  const createdAt = video?.createdAt;
  const timeAgo = dayjs(createdAt).fromNow();

  const fetchVideo = async () => {
    try {
      const res = await apiEndpoints.singleVideo(videoId);

      const data = res.data;

      setVideo(data?.data);
      console.log("Video Data: ", data);
    } catch (error) {
      console.error("Error fetching Video: ", error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  return (
    <div className="flex flex-col items-start gap-2 text-sm w-full">
      <video className="w-[70%]" src={videoFile} controls />

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
      </div>
    </div>
  );
}
