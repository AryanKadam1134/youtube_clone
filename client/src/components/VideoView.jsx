import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { apiEndpoints } from "../api";
import { Input } from "antd";

export default function VideoView() {
  const location = useLocation();
  const videoId = location?.state?.video_id;

  const [video, setVideo] = useState(null);
  const [comments, setComments] = useState(null);
  const [addComment, setAddComment] = useState(null);

  const video_Id = video?._id;
  const videoTitle = video?.title;
  const videoViews = video?.views;
  const videoFile = video?.videoFile?.url;
  const videoOwnerAvatar = video?.owner?.avatar?.url;
  const isLiked = video?.isLiked;
  const likesCount = video?.likesCount;
  const isDisliked = video?.isDisliked;
  const dislikesCount = video?.dislikesCount;
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

  const fetchVideoComments = async () => {
    try {
      const res = await apiEndpoints.allComments(videoId);

      const data = res.data;

      setComments(data?.data?.comments);
      console.log("Comments on Video: ", data);
    } catch (error) {
      console.error("Error fetching Comments: ", error);
    }
  };

  const addVideoComment = async () => {
    try {
      const res = await apiEndpoints.addComment(videoId, {
        comment: addComment,
      });

      const data = res.data;

      fetchVideoComments();
      console.log("Comment Added: ", data);
    } catch (error) {
      console.error("Comment Added: ", error);
    }
  };

  const deleteVideoComment = async (commentId) => {
    try {
      const res = await apiEndpoints.deleteComment(commentId);

      const data = res.data;

      fetchVideoComments();
      console.log("Comment deleted: ", data);
    } catch (error) {
      console.error("Comment deleted: ", error);
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

  const likeDislikeComment = async (reaction, commentId) => {
    try {
      let res;
      if (reaction == "like") {
        res = await apiEndpoints.likeComment(commentId);
      } else if (reaction == "dislike") {
        res = await apiEndpoints.dislikeComment(commentId);
      }

      const data = res.data;

      fetchVideoComments();
      console.log(`${data?.message}: `, data);
    } catch (error) {
      console.error("Error liking or disliking the comment: ", error);
    }
  };

  const viewVideo = async () => {
    try {
      const res = await apiEndpoints.viewVideo(videoId);

      const data = res.data;

      console.log("View Video Data: ", data);
    } catch (error) {
      console.error("Error Viewing video: ", error);
    }
  };

  useEffect(() => {
    fetchVideo();
    fetchVideoComments();
    viewVideo();
  }, [videoId]);

  return (
    <div className="flex flex-col gap-5 w-[70%]">
      <div className="flex flex-col items-start gap-2 text-sm">
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

      <div className="flex justify-start items-center gap-3">
        <Input
          style={{ width: 200 }}
          placeholder="Add Comment"
          onChange={(e) => setAddComment(e.target.value)}
        />

        <button
          onClick={addVideoComment}
          className="px-2 py-1 text-white hover:bg-[#3d3d3d] border border-white rounded-sm cursor-pointer"
        >
          Add
        </button>
      </div>

      <div className="flex flex-col justify-start gap-4">
        {comments?.map((comment, idx) => {
          const commentId = comment?._id;
          const videoComment = comment?.comment;
          const commentsLikes = comment?.likesCount;
          const commentsDislikes = comment?.dislikesCount;

          return (
            <div
              key={idx}
              className="flex items-center justify-between gap-3 text-white"
            >
              <div className="flex flex-col gap-1">
                <p>{videoComment}</p>
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    <ThumbsUp
                      onClick={() => likeDislikeComment("like", commentId)}
                      size={18}
                      className={`${commentsLikes && `fill-white`} cursor-pointer`}
                    />
                    <p className="font-semibold text-[12px]">{commentsLikes}</p>
                  </div>
                  <div className="flex items-center gap-1">
                    <ThumbsDown
                      onClick={() => likeDislikeComment("dislike", commentId)}
                      size={18}
                      className={`${commentsDislikes && `fill-white`} cursor-pointer`}
                    />
                    <p className="font-semibold text-[12px]">
                      {commentsDislikes}
                    </p>
                  </div>
                </div>
              </div>
              <button
                onClick={() => deleteVideoComment(commentId)}
                className="px-2 py-1 bg-red-500 hover:bg-red-600 rounded-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
