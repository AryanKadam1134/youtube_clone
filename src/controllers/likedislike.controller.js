import apiRes from "../utils/apiRes.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";

import { LikeDislike } from "../models/likeDislike.model.js";

// Like Video
const likeVideo = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { video_id } = req.params;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  const likedDocument = await LikeDislike.findOne({
    video: video_id,
    owner: loggedUserId,
  });

  if (likedDocument && likedDocument.reaction === "like") {
    await LikeDislike.deleteOne({ _id: likedDocument._id });

    return res.status(200).json(new apiRes(200, {}, "no like or dislike!"));
  }

  if (likedDocument && likedDocument.reaction === "dislike") {
    likedDocument.reaction = "like";
    await likedDocument.save({ validateBeforeSave: false });

    return res.status(200).json(new apiRes(200, {}, "video like!"));
  }

  const like = await LikeDislike.create({
    owner: loggedUserId,
    video: video_id,
    reaction: "like",
  });

  if (!like) {
    throw new apiError(500, "error liking video");
  }

  return res.status(200).json(new apiRes(200, like, "video liked created!"));
});

// Unlike Video
const dislikeVideo = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { video_id } = req.params;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  const dislikedDocument = await LikeDislike.findOne({
    video: video_id,
    owner: loggedUserId,
  });

  if (dislikedDocument && dislikedDocument.reaction === "dislike") {
    await LikeDislike.deleteOne({ _id: dislikedDocument._id });

    return res.status(200).json(new apiRes(200, {}, "no like or dislike!"));
  }

  if (dislikedDocument && dislikedDocument.reaction === "like") {
    dislikedDocument.reaction = "dislike";
    await dislikedDocument.save({ validateBeforeSave: false });

    return res.status(200).json(new apiRes(200, {}, "video disliked!"));
  }

  const dislike = await LikeDislike.create({
    owner: loggedUserId,
    video: video_id,
    reaction: "dislike",
  });

  if (!dislike) {
    throw new apiError(500, "error disliking video");
  }

  return res.status(200).json(new apiRes(200, dislike, "video disliked!"));
});

export { likeVideo, dislikeVideo };
