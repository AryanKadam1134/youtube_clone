import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import asynchandler from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Subscription } from "../models/subcription.model.js";

const subscribeChannel = asynchandler(async (req, res) => {
  // Check user exists
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(400, "user not found! Unauthorised Access!");
  }

  // Check channelUserId exists and not the same as userId
  const { channelUserId } = req.params;

  if (!channelUserId) {
    throw new apiError(400, "channelUserId is required!");
  }

  if (userId.toString() === channelUserId.toString()) {
    throw new apiError(400, "You cannot subscribe to your own channel!");
  }

  // Check channelUser exists
  const channelUser = await User.findById(channelUserId);

  if (!channelUser) {
    throw new apiError(400, "channel user does not exist!");
  }

  // Check if user have not already subscribed
  const alreadySubscribed = await Subscription.findOne({
    subscriber: userId,
    channel: channelUserId,
  });

  if (alreadySubscribed) {
    throw new apiError(400, "User is already subscribed!");
  }

  // Create the document
  const subscribed = await Subscription.create({
    subscriber: userId,
    channel: channelUserId,
  });

  if (!subscribed) {
    throw new apiError(400, "Failed to subscribe to channel");
  }

  res.status(200).json(new apiRes(200, {}, "Subscribed successfully!"));
});

const unsubscribeChannel = asynchandler(async (req, res) => {
  // Check user exists
  const userId = req.user?._id;

  if (!userId) {
    throw new apiError(400, "user not found! Unauthorised Access!");
  }

  // Check channelUserId exists and not the same as userId
  const { channelUserId } = req.params;

  if (!channelUserId) {
    throw new apiError(400, "channelUserId is required!");
  }

  // Check if document exists and delete
  const alreadySubscribed = await Subscription.findOneAndDelete({
    subscriber: userId,
    channel: channelUserId,
  });

  if (!alreadySubscribed) {
    throw new apiError(400, "Error unsubscribing the channel!");
  }

  res.status(200).json(new apiRes(200, {}, "Unsubscribed successfully!"));
});

export { subscribeChannel, unsubscribeChannel };
