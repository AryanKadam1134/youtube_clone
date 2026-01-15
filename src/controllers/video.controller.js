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
  // 1. Check if user is logged in or not
  // 2. Check if localpath is there or not
  // 3. Upload to cloudinary

  const userId = req.user?._id;

  const loggedUser = await User.findById(userId);

  if (!loggedUser) {
    throw new apiError(401, "user not found! Invalid Token!");
  }

  const { title, description, isPublished } = req.body;

  if (!title || !description) {
    throw new apiError(400, "All fields are required!");
  }

  const parsedIsPublished = Boolean(isPublished);

  if (typeof parsedIsPublished !== "boolean") {
    throw new apiError(400, "isPublished should be a boolean value!");
  }

  const videoLocalpath = req.files?.videoFile[0]?.path;
  const thumbnailLocalpath = req.files?.thumbnail[0]?.path;

  if (!videoLocalpath || !thumbnailLocalpath) {
    throw new apiError(400, "Video and Thumbnail is required!");
  }

  const uploadVideo = await uploadToCloudinary(videoLocalpath);
  const uploadThumbnail = await uploadToCloudinary(thumbnailLocalpath);

  if (!uploadVideo?.secure_url) {
    throw new apiError(500, "Failed to uplaod video to cloudinary!");
  }

  if (!uploadThumbnail?.secure_url) {
    throw new apiError(500, "Failed to uplaod thumnail to cloudinary!");
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
    throw new apiError(500, "Failed to upload video!");
  }

  res
    .status(200)
    .json(new apiRes(200, createdVideo, "Video uplaoded succesfully!"));
});

const deleteVideo = asynchandler(async (req, res) => {
  const userId = req.user?._id;

  // Check Logged User
  const loggedUser = await User.findById(userId);

  if (!loggedUser) {
    throw new apiError(401, "User not found! Unauthorised Access!");
  }

  // Get video_id
  const { video_id } = req.body;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  const video = await Video.findById(video_id);

  if (!video) {
    throw new apiError(404, "Video not found");
  }

  if (video?.owner?.toString() !== userId?.toString()) {
    throw new apiError(403, "You are not allowed to delete this video");
  }

  if (!video?.videoFile?.public_id) {
    await deleteFromCloudinary(video?.videoFile);
  }

  if (!video?.thumbnail?.public_id) {
    await deleteFromCloudinary(video?.thumbnail);
  }

  await Video.findByIdAndDelete(video_id);

  res.status(200).json(new apiRes(200, {}, "Video Deleted Successfully!"));
});

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
    throw new apiError(400, "Error fetching all videos!");
  }

  res.status(200).json(new apiRes(200, videos, "Videos fetched successfully!"));
});

const getChannelVideos = asynchandler(async (req, res) => {
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(400, "User not found! Unauthorised Access!");
  }

  const { channelUserId } = req.body;

  const channelUser = await User.findById(channelUserId);

  if (!channelUser) {
    throw new apiError(401, "User not found! Unauthorised Access!");
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
    .json(new apiRes(200, userVideos, "User Video fetched successfully!"));
});

const updateVideoDetails = asynchandler(async (req, res) => {
  const userId = req.user?._id;

  const updatedFields = {};

  // Check Logged User
  const loggedUser = await User.findById(userId);

  if (!loggedUser) {
    throw new apiError(401, "User not found! Unauthorised Access!");
  }

  // Get video_id
  const { video_id, title, description, isPublished } = req.body;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  // Later also check if isPublished is undefined or null the api still works
  if (!(title || description || isPublished)) {
    throw new apiError(401, "All fields cannot be empty!");
  }

  const checkBoolean = Boolean(isPublished);

  if (typeof checkBoolean !== "boolean") {
    throw new apiError(400, "isPublished should be a boolean value!");
  }

  const parsedIsPublished =
    (isPublished == "true" && true) || (isPublished == "false" && false);

  if (title) updatedFields.title = title;
  if (description) updatedFields.description = description;
  if (isPublished) updatedFields.isPublished = parsedIsPublished;

  const video = await Video.findById(video_id);

  if (!video) {
    throw new apiError(404, "Video not found");
  }

  if (video?.owner?.toString() !== userId?.toString()) {
    throw new apiError(403, "You are not allowed to update this video details");
  }

  const updatedVideo = await Video.findByIdAndUpdate(
    video_id,
    {
      $set: updatedFields,
    },
    { new: true }
  );

  if (!updatedVideo) {
    throw new apiError(400, "Couldn't update video details!");
  }

  res
    .status(200)
    .json(new apiRes(200, updatedVideo, "Video Details updated successfully!"));
});

// Delete Video
// Fetch All Videos
// Fetch User Videos

export {
  uploadVideo,
  deleteVideo,
  getAllVideos,
  getChannelVideos,
  updateVideoDetails,
};
