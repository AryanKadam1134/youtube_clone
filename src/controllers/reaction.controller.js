import apiRes from "../utils/apiRes.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";

import { Reaction } from "../models/reaction.model.js";
import { Video } from "../models/video.model.js";
import { Comment } from "../models/comment.model.js";

const deleteReactionDocument = async (field, id) => {
  if (!field || !id) return;

  const deleteDocument = await Reaction.deleteMany({
    [field]: id,
    owner: req.user?._id,
  });

  return deleteDocument;
};

// Like Video
const likeVideo = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  // Check video_id exists
  const { video_id } = req.params;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  // Check if reaction already exists
  const reaction = await Reaction.findOne({
    video: video_id,
    owner: loggedUserId,
  });

  // If "like" then unlike => decrease the count and save
  if (reaction?.reaction === "like") {
    await Reaction.deleteOne({ _id: reaction._id });

    await Video.findByIdAndUpdate(video_id, {
      $inc: { likesCount: -1 },
    });

    return res.status(200).json(new apiRes(200, {}, "no like or dislike!"));
  }

  // If "dislike" then undislike => then like and save => increase and decrease the count respectively
  if (reaction?.reaction === "dislike") {
    reaction.reaction = "like";
    await reaction.save({ validateBeforeSave: false });

    await Video.findByIdAndUpdate(video_id, {
      $inc: { likesCount: 1, dislikesCount: -1 },
    });

    return res.status(200).json(new apiRes(200, {}, "video liked!"));
  }

  const like = await Reaction.create({
    owner: loggedUserId,
    video: video_id,
    reaction: "like",
  });

  if (!like) {
    throw new apiError(500, "error liking video!");
  }

  const video = await Video.findByIdAndUpdate(
    video_id,
    {
      $inc: { likesCount: 1 },
    },
    { new: true }
  );

  return res.status(200).json(new apiRes(200, video, "video liked!"));
});

// Unlike Video
const dislikeVideo = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  // Check video_id exists
  const { video_id } = req.params;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  // Check if reaction already exists
  const reaction = await Reaction.findOne({
    video: video_id,
    owner: loggedUserId,
  });

  // If "like" then undislike => decrease the count and save
  if (reaction && reaction.reaction === "dislike") {
    await Reaction.deleteOne({ _id: reaction._id });

    await Video.findByIdAndUpdate(video_id, {
      $inc: { dislikesCount: -1 },
    });

    return res.status(200).json(new apiRes(200, {}, "no like or dislike!"));
  }

  // If "dislike" then unlike => then dislike and save => increase and decrease the count respectively
  if (reaction && reaction.reaction === "like") {
    reaction.reaction = "dislike";
    await reaction.save({ validateBeforeSave: false });

    await Video.findByIdAndUpdate(video_id, {
      $inc: { likesCount: -1, dislikesCount: 1 },
    });

    return res.status(200).json(new apiRes(200, {}, "video disliked!"));
  }

  const dislike = await Reaction.create({
    owner: loggedUserId,
    video: video_id,
    reaction: "dislike",
  });

  if (!dislike) {
    throw new apiError(500, "error disliking video");
  }

  const video = await Video.findByIdAndUpdate(
    video_id,
    {
      $inc: { dislikesCount: 1 },
    },
    { new: true }
  );

  return res.status(200).json(new apiRes(200, video, "video disliked!"));
});

// Like Comment
const likeComment = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  // Check video_id exists
  const { comment_id } = req.params;

  if (!comment_id) {
    throw new apiError(400, "comment_id is required!");
  }

  // Check if reaction already exists
  const reaction = await Reaction.findOne({
    comment: comment_id,
    owner: loggedUserId,
  });

  // If "like" then unlike => decrease the count and save
  if (reaction?.reaction === "like") {
    await Reaction.deleteOne({ _id: reaction._id });

    await Comment.findByIdAndUpdate(comment_id, {
      $inc: { likesCount: -1 },
    });

    return res.status(200).json(new apiRes(200, {}, "no like or dislike!"));
  }

  // If "dislike" then undislike => then like and save => increase and decrease the count respectively
  if (reaction?.reaction === "dislike") {
    reaction.reaction = "like";
    await reaction.save({ validateBeforeSave: false });

    await Comment.findByIdAndUpdate(comment_id, {
      $inc: { likesCount: 1, dislikesCount: -1 },
    });

    return res.status(200).json(new apiRes(200, {}, "comment liked!"));
  }

  const like = await Reaction.create({
    owner: loggedUserId,
    comment: comment_id,
    reaction: "like",
  });

  if (!like) {
    throw new apiError(500, "error liking comment!");
  }

  const comment = await Comment.findByIdAndUpdate(
    comment_id,
    {
      $inc: { likesCount: 1 },
    },
    { new: true }
  );

  return res.status(200).json(new apiRes(200, comment, "comment liked!"));
});

// Unlike Comment
const dislikeComment = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  // Check comment_id exists
  const { comment_id } = req.params;

  if (!comment_id) {
    throw new apiError(400, "comment_id is required!");
  }

  // Check if reaction already exists
  const reaction = await Reaction.findOne({
    comment: comment_id,
    owner: loggedUserId,
  });

  // If "like" then undislike => decrease the count and save
  if (reaction && reaction.reaction === "dislike") {
    await Reaction.deleteOne({ _id: reaction._id });

    await Comment.findByIdAndUpdate(comment_id, {
      $inc: { dislikesCount: -1 },
    });

    return res.status(200).json(new apiRes(200, {}, "no like or dislike!"));
  }

  // If "dislike" then unlike => then dislike and save => increase and decrease the count respectively
  if (reaction && reaction.reaction === "like") {
    reaction.reaction = "dislike";
    await reaction.save({ validateBeforeSave: false });

    await Comment.findByIdAndUpdate(comment_id, {
      $inc: { likesCount: -1, dislikesCount: 1 },
    });

    return res.status(200).json(new apiRes(200, {}, "comment disliked!"));
  }

  const dislike = await Reaction.create({
    owner: loggedUserId,
    comment: comment_id,
    reaction: "dislike",
  });

  if (!dislike) {
    throw new apiError(500, "error disliking comment");
  }

  const comment = await Comment.findByIdAndUpdate(
    comment_id,
    {
      $inc: { dislikesCount: 1 },
    },
    { new: true }
  );

  return res.status(200).json(new apiRes(200, comment, "comment disliked!"));
});

export { likeVideo, dislikeVideo, likeComment, dislikeComment };
