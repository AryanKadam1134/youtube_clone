import mongoose from "mongoose";
import jwt from "jsonwebtoken";

import { options } from "../constants.js";

import apiRes from "../utils/apiRes.js";
import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";

import { User } from "../models/user.model.js";

// Generate Access & Refresh Token
const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    // console.log("accessToken: ", accessToken);
    // console.log("refreshToken: ", refreshToken);

    user.refreshToken = refreshToken;
    // console.log("userId: ", userId);

    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("Error generating Access token and Refresh token: ", error);
    throw new apiError(501, "Couldn't generate Refresh token and Access token");
  }
};

// Register User
const registerUser = asynchandler(async (req, res) => {
  // For sucessfully registering the user =>
  // 1. Get the user details form the frontend (for testing => postman)
  // 2. Validation => Validate if required fields are not empty or null
  // 3. Check if user already exists or not... (Check username and email for unique user)
  // 4. Check for images => Avatar is required
  // 5. If images and avatar exists, upload to cloudinary => first multer check and then cloudinary check
  // 6. After the above following is sucessfull, send an object to mongo to create a user
  // 7. Remove the password and response token fields form the response
  // Check for user creation (if user is created => return the response, response should not be null)

  // 1. Done
  const { fullName, username, email, password } = req.body; // The request will come through this

  // console.log("Email: ", email);
  // console.log("Password: ", password);
  // console.log("Request through Postman: ", req.body);

  // 2. Done
  if (
    [fullName, username, email, password].some(
      (field) => typeof field == "string" && field?.trim() === ""
    )
  ) {
    throw new apiError(400, "all fields are required!");
  }

  // 3. Done
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new apiError(409, "user already exists with same email or username!");
  }

  // 4. Done
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  // console.log("Cloudinary files: ", req?.files);

  // 5. Done
  if (!avatarLocalPath) {
    throw new apiError(400, "avatar field is required!"); // Multer check
  }

  const avatarUploaded = await uploadToCloudinary(avatarLocalPath);
  const coverImageUploaded = await uploadToCloudinary(coverImageLocalPath);

  if (!avatarUploaded) {
    throw new apiError(404, "uplaoded avatar url not found!"); // Cloudinary check
  }

  // 6. Done
  const user = await User.create({
    fullName,
    avatar: {
      url: avatarUploaded?.secure_url,
      public_id: avatarUploaded?.public_id,
      resource_type: avatarUploaded?.resource_type,
    },
    coverImage: coverImageUploaded
      ? {
          url: coverImageUploaded?.secure_url,
          public_id: coverImageUploaded?.public_id,
          resource_type: coverImageUploaded?.resource_type,
        }
      : undefined,
    username: username.toLowerCase(),
    email,
    password,
  });

  // 7. Done
  const createdUser = await User.findById(user._id)?.select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "error creating user!");
  }

  return res
    .status(201)
    .json(new apiRes(201, createdUser, "user registered successfully!"));
});

// Login User
const loginUser = asynchandler(async (req, res) => {
  // For Logging in the user =>
  // 1. Get the response from req.body
  // 2. Validate => username or email & pasword is not empty => if not res
  // 3. Check username or email exist => if not res
  // 4. If userName check Password is correct or not
  // 5. If password correct => generate accesstoken and refreshtoken
  // 6. Send in cookies

  // 1. Done
  const { username, email, password } = req.body;

  // 2. Done
  if (!(username || email)) {
    throw new apiError(400, "username or email is required!");
  }

  // 3. Done
  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!userExist) {
    throw new apiError(404, "user not found!");
  }

  // 4. Done
  const isPasswordCorrect = await userExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new apiError(401, "invalid password!");
  }

  // 5. Done
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExist?._id
  );

  if (!accessToken || !refreshToken) {
    throw new apiError(500, "couldn't get accestoken or refreshToken");
  }

  // 6. Done
  const loggedInUser = await User.findById(userExist._id).select(
    "-password -refreshToken"
  );

  if (!loggedInUser) {
    throw new apiError(500, "error logging in user!");
  }

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiRes(
        200,
        { user: loggedInUser, accessToken, refreshToken },
        "user logged successfully!"
      )
    );
});

// Logout User
const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  return res
    .status(204)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiRes(204, {}, "user logged out successfully!"));
});

// Refresh Access Token
const refeshAccessToken = asynchandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "token missing!");
  }
  // console.log("incomingRefreshToken: ", incomingRefreshToken);

  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );
  // console.log("decodedToken: ", decodedToken);

  const user = await User.findById(decodedToken._id);
  // console.log("User: ", user);

  if (!user) {
    throw new apiError(404, "user not found!");
  }

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new apiError(401, "refresh token is expired or used!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiRes(
        200,
        { accessToken, refreshToken },
        "access token is refreshed successfully!"
      )
    );
});

// Change User password
const changeUserPassword = asynchandler(async (req, res) => {
  const loggedUser = await User.findById(req.user?._id);

  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    throw new apiError(400, "all fields are required!");
  }

  const isPasswordCorrect = await loggedUser.isPasswordCorrect(oldPassword);

  if (oldPassword == newPassword) {
    throw new apiError(409, "old password cannot be same as new password!");
  }

  if (!isPasswordCorrect) {
    throw new apiError(401, "invalid password!");
  }

  loggedUser.password = newPassword;

  await loggedUser.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new apiRes(200, {}, "password changed successfully!"));
});

// Update User details
const updateUserDetails = asynchandler(async (req, res) => {
  const updatedFields = {};

  const { username, fullName, email } = req.body;

  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new apiError(
      409,
      "user already exist with current username or email!"
    );
  }

  if (username) updatedFields.username = username;
  if (fullName) updatedFields.fullName = fullName;
  if (email) updatedFields.email = email;

  if (Object.keys(updatedFields).length === 0) {
    throw new apiError(400, "no fields provided to update!");
  }

  const updatedUser = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updatedFields,
    },
    { new: true }
  ).select("-password -refreshToken");

  return res
    .status(200)
    .json(new apiRes(200, updatedUser, "user details changed successfully!"));
});

// Update User avatar
const updateUserAvatar = asynchandler(async (req, res) => {
  // Get _id form token
  const loggedUserId = req.user?._id;

  // Get Logged User
  const loggedUser = await User.findById(loggedUserId);

  // Get File Path
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "missing avatar file path!");
  }

  // Upload to Cloudinary
  const updatedAvatar = await uploadToCloudinary(avatarLocalPath);

  if (!updatedAvatar?.secure_url) {
    throw new apiError(500, "error while updating avatar on cloudinary!");
  }

  // Delete the old image
  if (loggedUser?.avatar?.public_id) deleteFromCloudinary(loggedUser?.avatar);

  // Update the User
  const updatedUser = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: {
        avatar: {
          url: updatedAvatar?.secure_url,
          public_id: updatedAvatar?.public_id,
          resource_type: updatedAvatar?.resource_type,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  // Send Response
  return res
    .status(200)
    .json(new apiRes(200, updatedUser, "user avatar updated successfully!"));
});

// Update User coverImage
const updateUserCoverImage = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const loggedUser = await User.findById(loggedUserId);

  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    throw new apiError(400, "missing coverImage file path!");
  }

  const updatedCoverImage = await uploadToCloudinary(coverImageLocalPath);

  if (!updatedCoverImage?.secure_url) {
    throw new apiError(500, "error while updating coverImage on cloudinary!");
  }

  if (loggedUser?.coverImage?.public_id)
    deleteFromCloudinary(loggedUser?.coverImage);

  const user = await User.findByIdAndUpdate(
    loggedUserId,
    {
      $set: {
        coverImage: {
          url: updatedCoverImage?.secure_url,
          public_id: updatedCoverImage?.public_id,
          resource_type: updatedCoverImage?.resource_type,
        },
      },
    },
    { new: true }
  ).select("-password -refreshToken");

  res
    .status(200)
    .json(new apiRes(200, user, "user cover image updated successfully!"));
});

// Fetch Current User
const getCurrentUser = asynchandler(async (req, res) => {
  return res
    .status(200)
    .json(new apiRes(200, req.user, "current user fetched successfully!"));
});

// Fetch Current User Channel Details
const getCurrentUserChannelDetails = asynchandler(async (req, res) => {
  const channel = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(req.user?._id) },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "subscriber",
        as: "subscribedTo",
      },
    },
    {
      $addFields: {
        subscribersCount: {
          $size: "$subscribers",
        },
        subscribedChannelsCount: {
          $size: "$subscribedTo",
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribers: 1,
        subscribedTo: 1,
        subscribersCount: 1,
        subscribedChannelsCount: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(500, "error while fetching channel details!");
  }
  // console.log("Channel: ", channel);

  res
    .status(200)
    .json(new apiRes(200, channel[0], "channel details fetched successfully!"));
});

// Current user watch history
const getCurrentUserWatchHistory = asynchandler(async (req, res) => {
  const history = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(req.user?._id),
      },
    },
    // Into users
    {
      $lookup: {
        form: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          // Into videos
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                // Into users again
                {
                  $project: {
                    username: 1,
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
        ],
      },
    },
  ]);

  if (!history?.length) {
    throw new apiError(500, "error fetching watch history!");
  }

  res
    .status(200)
    .json(
      new apiRes(
        200,
        history[0].watchHistory,
        "watch history fetched successfully!"
      )
    );
});

// Fetch Any User Channel Details
const getChannelDetails = asynchandler(async (req, res) => {
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "userId is required!");
  }

  const channelUser = await User.findById(userId);

  if (!channelUser) {
    throw new apiError(404, "user not found!");
  }

  const channel = await User.aggregate([
    {
      $match: { _id: new mongoose.Types.ObjectId(userId) },
    },
    {
      $lookup: {
        from: "subscriptions",
        localField: "_id",
        foreignField: "channel",
        as: "subscribers",
      },
    },
    {
      $addFields: {
        isSubscribed: {
          $cond: {
            if: { $in: [req.user?._id, "$subscribers.subscriber"] },
            then: true,
            else: false,
          },
        },
        subscribersCount: {
          $size: "$subscribers",
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        email: 1,
        avatar: 1,
        coverImage: 1,
        subscribers: 1,
        subscribersCount: 1,
        isSubscribed: 1,
      },
    },
  ]);

  if (!channel?.length) {
    throw new apiError(500, "error while fetching channel details!");
  }
  // console.log("Channel: ", channel);

  res
    .status(200)
    .json(new apiRes(200, channel[0], "channel details fetched successfully!"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  refeshAccessToken,
  changeUserPassword,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getCurrentUser,
  getCurrentUserChannelDetails,
  getChannelDetails,
};
