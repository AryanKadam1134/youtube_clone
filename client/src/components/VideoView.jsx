import React, { useEffect, useState } from "react";
import { ThumbsUp, ThumbsDown } from "lucide-react";
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
  const isLiked = video?.isLiked;
  const likesCount = video?.likesCount;
  const isDisliked = video?.isDisliked;
  const dislikesCount = video?.dislikesCount;
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

  const likeDislikeVideo = async (reaction, videoId) => {
    try {
      let res;
      if (reaction == "like") {
        res = await apiEndpoints.likeVideo(videoId);
      } else if (reaction == "dislike") {
        res = await apiEndpoints.dislikeVideo(videoId);
      }

      const data = res.data;

      fetchVideo();
      console.log(`${data?.message}: `, data);
    } catch (error) {
      console.error("Couldn't like or dislike video: ", error);
    }
  };

  useEffect(() => {
    fetchVideo();
  }, [videoId]);

  return (
    <div className="flex flex-col items-start gap-2 text-sm w-[70%]">
      <video className="w-full" src={videoFile} controls />

      <div className="flex items-start justify-between w-full">
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

        <div className="flex items-center gap-5 px-2 py-1.5 text-white bg-[#3d3d3d] rounded-full">
          <div className="flex items-center justify-center gap-2">
            <ThumbsUp
              onClick={() => likeDislikeVideo("like", videoId)}
              size={22}
              className={`${isLiked && `fill-white`} cursor-pointer`}
            />
            <p className="font-semibold text-[12px]">{likesCount}</p>
          </div>

          <div className="flex items-center justify-center gap-2">
            <ThumbsDown
              onClick={() => likeDislikeVideo("dislike", videoId)}
              size={22}
              className={`${isDisliked && `fill-white`} cursor-pointer`}
            />
            <p className="font-semibold text-[12px]">{dislikesCount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
