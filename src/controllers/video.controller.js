import jwt from "jsonwebtoken";

import apiRes from "../utils/apiRes.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";

import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";

import mongoose from "mongoose";

const uploadVideo = asynchandler(async (req, res) => {
  const userId = req.user?._id;

  const { title, description, isPublished } = req.body;

  const videoLocalpath = req.files?.videoFile[0]?.path;
  const thumbnailLocalpath = req.files?.thumbnail[0]?.path;

  if (!title || !description || !videoLocalpath || !thumbnailLocalpath) {
    throw new apiError(400, "all fields are required!");
  }

  const parsedIsPublished = Boolean(isPublished);

  if (typeof parsedIsPublished !== "boolean") {
    throw new apiError(400, "isPublished should be a boolean value!");
  }

  const uploadVideo = await uploadToCloudinary(videoLocalpath);
  const uploadThumbnail = await uploadToCloudinary(thumbnailLocalpath);

  if (!uploadVideo?.secure_url) {
    throw new apiError(500, "failed to uplaod video to cloudinary!");
  }

  if (!uploadThumbnail?.secure_url) {
    throw new apiError(500, "failed to uplaod thumnail to cloudinary!");
  }

  const createdVideo = await Video.create({
    owner: userId,
    title: title,
    description: description,
    videoFile: {
      url: uploadVideo?.secure_url,
      public_id: uploadVideo?.public_id,
      resource_type: uploadVideo?.resource_type,
    },
    duration: uploadVideo?.duration,
    thumbnail: {
      url: uploadThumbnail?.secure_url,
      public_id: uploadThumbnail?.public_id,
      resource_type: uploadThumbnail?.resource_type,
    },
    isPublished: parsedIsPublished,
  });

  if (!createdVideo) {
    throw new apiError(500, "failed to upload video!");
  }

  res
    .status(201)
    .json(new apiRes(201, createdVideo, "video uplaoded succesfully!"));
});

// Update logged User video details
const updateVideoDetails = asynchandler(async (req, res) => {
  const updatedFields = {};

  // Get video_id
  const { video_id, title, description, isPublished } = req.body;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  if (!(title || description || isPublished)) {
    throw new apiError(400, "all fields cannot be empty!");
  }

  const checkBoolean = Boolean(isPublished);

  if (isPublished && typeof checkBoolean !== "boolean") {
    throw new apiError(400, "isPublished should be a boolean value!");
  }

  const parsedIsPublished =
    (isPublished == "true" && true) || (isPublished == "false" && false);

  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (isPublished) updatedFields.isPublished = parsedIsPublished;

  const video = await Video.findById(video_id);

  if (!video) {
    throw new apiError(404, "video not found!");
  }

  // Check if the user is the owner of the video
  if (video?.owner?.toString() !== req.user?._id?.toString()) {
    throw new apiError(403, "you are not allowed to update this video details");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    video_id,
    {
      $set: updatedFields,
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new apiError(500, "couldn't update video details!");
  }

  res
    .status(200)
    .json(new apiRes(200, updatedVideo, "video details updated successfully!"));
});

const deleteVideo = asynchandler(async (req, res) => {
  // Get video_id
  const { video_id } = req.body;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  const video = await Video.findById(video_id);

  if (!video) {
    throw new apiError(404, "video not found");
  }

  if (video?.owner?.toString() !== req.user?._id?.toString()) {
    throw new apiError(403, "you are not allowed to delete this video");
  }

  if (!video?.videoFile?.public_id) {
    await deleteFromCloudinary(video?.videoFile);
  }

  if (!video?.thumbnail?.public_id) {
    await deleteFromCloudinary(video?.thumbnail);
  }

  await Video.findByIdAndDelete(video_id);

  res.status(200).json(new apiRes(200, {}, "video deleted successfully!"));
});

// Contains all the videos uploaded by users
const getAllVideos = asynchandler(async (req, res) => {
  const videos = await Video.aggregate([
    {
      $match: {
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!videos) {
    throw new apiError(500, "error fetching all videos!");
  }

  res.status(200).json(new apiRes(200, videos, "videos fetched successfully!"));
});

// Fetch other User Channel Videos
const getUserChannelVideos = asynchandler(async (req, res) => {
  const { channelUserId } = req.body;

  const channelUser = await User.findById(channelUserId);

  if (!channelUser) {
    throw new apiError(404, "channel not found!");
  }

  const userVideos = await Video.aggregate([
    {
      $match: {
        owner: new mongoose.Types.ObjectId(channelUserId),
        isPublished: true,
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!userVideos?.length) {
    throw new apiError(500, "Error fetching user Videos!");
  }

  res
    .status(200)
    .json(
      new apiRes(
        200,
        { videos: userVideos },
        "User Video fetched successfully!"
      )
    );
});

// Fetch other User Channel Videos
const getCurrentUserChannelVideos = asynchandler(async (req, res) => {
  const { isPublished = "all" } = req.query; // all, true, false

  if (!["all", "true", "false"].includes(isPublished)) {
    throw new apiError(400, "isPublished must be one of: all, true, false");
  }

  const matchStage = {
    owner: new mongoose.Types.ObjectId(req.user?._id),
  };

  if (isPublished !== "all") {
    matchStage.isPublished = isPublished === "true";
  }

  const userVideos = await Video.aggregate([
    {
      $match: matchStage,
    },
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [
          {
            $project: {
              _id: 1,
              username: 1,
              email: 1,
              avatar: 1,
            },
          },
        ],
      },
    },
    {
      $addFields: {
        owner: {
          $first: "$owner",
        },
      },
    },
  ]);

  if (!userVideos?.length) {
    throw new apiError(500, "error fetching channel videos!");
  }

  res
    .status(200)
    .json(
      new apiRes(
        200,
        { videos: userVideos },
        "channel video fetched successfully!"
      )
    );
});

// Get Current User Channel Details (Looged User Channel Details)
// Get Other User Channel details

export {
  uploadVideo,
  updateVideoDetails,
  deleteVideo,
  getAllVideos,
  getUserChannelVideos,
  getCurrentUserChannelVideos,
};
