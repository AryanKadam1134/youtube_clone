import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Input } from "antd";
import { ThumbsUp, ThumbsDown } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

import { apiEndpoints } from "../api";
import SideVideoBar from "./SideVideoBar";

export default function VideoView() {
  const location = useLocation();
  const videoId = location?.state?.video_id;

  const [video, setVideo] = useState({});
  const [comments, setComments] = useState(null);
  const [addComment, setAddComment] = useState("");

  const {
    _id,
    title,
    views,
    isLiked,
    likesCount,
    isDisliked,
    dislikesCount,
    createdAt,
    videoFile,
    owner,
  } = video;

  const { url: viedoUrl } = videoFile || {};

  const { username, avatar } = owner || {};

  const { url: avatarUrl } = avatar || {};

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

      setAddComment("");
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
    <div className="flex gap-6 p-6 bg-[#0f0f0f] min-h-screen">
      {/* Main Content */}
      <div className="flex flex-col gap-4 flex-1 max-w-[1280px]">
        {/* Video Player */}
        <div className="bg-black rounded-xl overflow-hidden">
          <video className="w-full aspect-video" src={viedoUrl} controls />
        </div>

        {/* Video Info */}
        <div className="flex flex-col gap-3">
          <h1 className="text-white text-xl font-semibold">{title}</h1>

          <div className="flex items-center justify-between">
            {/* Channel Info */}
            <div className="flex items-center gap-3">
              <img
                src={avatarUrl}
                alt="User Avatar"
                className="size-10 rounded-full object-cover"
              />

              <div className="flex flex-col">
                <p className="text-white font-medium text-sm">{username}</p>
                <p className="text-[#aaaaaa] text-xs">
                  {views?.toLocaleString()} views • {timeAgo}
                </p>
              </div>
            </div>

            {/* Like/Dislike Buttons */}
            <div className="flex items-center gap-1 bg-[#272727] rounded-full overflow-hidden">
              <button
                onClick={() => likeDislikeVideo("like", videoId)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#3d3d3d] transition-colors"
              >
                <ThumbsUp
                  size={20}
                  className={`${
                    isLiked ? "fill-white" : ""
                  } text-white cursor-pointer`}
                />
                <span className="text-white text-sm font-medium">
                  {likesCount}
                </span>
              </button>

              <div className="w-[1px] h-6 bg-[#3d3d3d]" />

              <button
                onClick={() => likeDislikeVideo("dislike", videoId)}
                className="flex items-center gap-2 px-4 py-2 hover:bg-[#3d3d3d] transition-colors"
              >
                <ThumbsDown
                  size={20}
                  className={`${
                    isDisliked ? "fill-white" : ""
                  } text-white cursor-pointer`}
                />
                <span className="text-white text-sm font-medium">
                  {dislikesCount}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="flex flex-col gap-6 mt-4">
          <h2 className="text-white text-lg font-semibold">
            {comments?.length || 0} Comments
          </h2>

          {/* Add Comment */}
          <div className="flex items-start gap-3">
            <div className="flex-1">
              <Input
                value={addComment}
                placeholder="Add a comment..."
                onChange={(e) => setAddComment(e.target.value)}
                onPressEnter={addVideoComment}
                className="bg-transparent border-0 border-b border-[#3d3d3d] text-white placeholder-[#aaaaaa] rounded-none focus:border-white"
                style={{
                  background: "transparent",
                  color: "white",
                }}
              />
            </div>

            <button
              onClick={addVideoComment}
              disabled={!addComment.trim()}
              className="px-4 py-2 bg-[#3ea6ff] hover:bg-[#3ea6ff]/90 disabled:bg-[#3d3d3d] disabled:text-[#717171] disabled:cursor-not-allowed text-black font-medium rounded-full transition-colors"
            >
              Comment
            </button>
          </div>

          {/* Comments List */}
          <div className="flex flex-col gap-4">
            {comments?.map((comment, idx) => {
              const commentId = comment?._id;
              const videoComment = comment?.comment;
              const commentsLikes = comment?.likesCount;
              const commentsDislikes = comment?.dislikesCount;
              const isCommentLiked = comment?.isLiked;
              const isCommentDisliked = comment?.isDisliked;

              return (
                <div
                  key={idx}
                  className="flex items-start gap-3 p-3 rounded-lg hover:bg-[#272727] transition-colors"
                >
                  <div className="flex-1 flex flex-col gap-2">
                    <p className="text-white text-sm leading-relaxed">
                      {videoComment}
                    </p>

                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => likeDislikeComment("like", commentId)}
                        className="flex items-center gap-1.5 hover:bg-[#3d3d3d] px-2 py-1 rounded-full transition-colors"
                      >
                        <ThumbsUp
                          size={16}
                          className={`${
                            isCommentLiked ? "fill-white" : ""
                          } text-white cursor-pointer`}
                        />
                        <span className="text-[#aaaaaa] text-xs font-medium">
                          {commentsLikes || 0}
                        </span>
                      </button>

                      <button
                        onClick={() => likeDislikeComment("dislike", commentId)}
                        className="flex items-center gap-1.5 hover:bg-[#3d3d3d] px-2 py-1 rounded-full transition-colors"
                      >
                        <ThumbsDown
                          size={16}
                          className={`${
                            isCommentDisliked ? "fill-white" : ""
                          } text-white cursor-pointer`}
                        />
                        <span className="text-[#aaaaaa] text-xs font-medium">
                          {commentsDislikes || 0}
                        </span>
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => deleteVideoComment(commentId)}
                    className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 text-sm font-medium rounded-full transition-colors"
                  >
                    Delete
                  </button>
                </div>
              );
            })}

            {comments?.length === 0 && (
              <div className="text-center py-8 text-[#aaaaaa]">
                No comments yet. Be the first to comment!
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Side Video Bar */}
      <div className="w-[400px] flex-shrink-0">
        <SideVideoBar currentVideoId={videoId} />
      </div>
    </div>
  );
}
