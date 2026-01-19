import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import asynchandler from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Subscription } from "../models/subcription.model.js";

const subscribeChannel = asynchandler(async (req, res) => {
  const userId = req.user?._id;

  // Check channelUserId exists and not the same as userId
  const { channelUserId } = req.params;

  if (!channelUserId) {
    throw new apiError(400, "channelUserId is required!");
  }

  if (userId.toString() === channelUserId.toString()) {
    throw new apiError(403, "you cannot subscribe to your own channel!");
  }

  // Check channelUser exists
  const channelUser = await User.findById(channelUserId);

  if (!channelUser) {
    throw new apiError(400, "channel not found!");
  }

  // Check if user have not already subscribed
  const alreadySubscribed = await Subscription.findOne({
    subscriber: userId,
    channel: channelUserId,
  });

  if (alreadySubscribed) {
    throw new apiError(403, "user is already subscribed!");
  }

  // Create the document
  const subscribed = await Subscription.create({
    subscriber: userId,
    channel: channelUserId,
  });

  if (!subscribed) {
    throw new apiError(500, "failed to subscribe to channel!");
  }

  res.status(202).json(new apiRes(202, {}, "Subscribed successfully!"));
});

const unsubscribeChannel = asynchandler(async (req, res) => {
  const userId = req.user?._id;

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
    throw new apiError(500, "error unsubscribing the channel!");
  }

  res.status(202).json(new apiRes(202, {}, "Unsubscribed successfully!"));
});

export { subscribeChannel, unsubscribeChannel };
