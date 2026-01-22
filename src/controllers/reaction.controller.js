import apiRes from "../utils/apiRes.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";

import { Reaction } from "../models/reaction.model.js";
import { Video } from "../models/video.model.js";

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

export { likeVideo, dislikeVideo };
