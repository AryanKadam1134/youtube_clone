import { Comment } from "../models/comment.model";
import { Video } from "../models/video.model";
import apiError from "../utils/apiError";
import apiRes from "../utils/apiRes";
import asynchandler from "../utils/asyncHandler";

const addComment = asynchandler(async (req, res) => {
  const { video_id } = req.params;

  const { comment } = req.body;

  if (!video_id || !comment) {
    throw new apiError(400, "video_id and comment is required!");
  }

  const videoExists = await Video.findById(video_id);

  if (!videoExists) {
    throw new apiError(404, "video not found!");
  }

  const createComment = await Comment.create({
    owner: req.user?._id,
    video: video_id,
    comment: comment,
  });

  if (!createComment) {
    throw new apiError(500, "couldn't create a comment!");
  }

  return res
    .status(200)
    .json(new apiRes(200, createComment, "comment created successfully!"));
});

const deleteComment = asynchandler(async (req, res) => {
  const { comment_id } = req.params;

  if (!comment_id) {
    throw new apiError(400, "comment_id is required!");
  }

  const deleteComment = await Comment.deleteOne(comment_id);

  if (!deleteComment) {
    throw new apiError(500, "couldn't delete comment!");
  }

  return res.status(200).josn(new apiRes(200, {}, "comment deleted!"));
});

const getCommentsOnVideo = asynchandler(async (req, res) => {
  const { video_id } = req.params;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  const comments = await Comment.find({
    owner: req.user?._id,
    video: video_id,
  });

  if (!comments) {
    throw new apiError(500, "couldn't get comments!");
  }

  return res
    .status(200)
    .josn(new apiRes(200, comments, "comments fetched successfully!"));
});

export { addComment, deleteComment, getCommentsOnVideo };
