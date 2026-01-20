import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import asynchandler from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";
import { Subscription } from "../models/subcription.model.js";

const subscribeChannel = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  // Check userId exists and not the same as loggedUserId
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "userId is required!");
  }

  if (loggedUserId.toString() === userId.toString()) {
    throw new apiError(403, "you cannot subscribe to your own channel!");
  }

  // Check channelUser exists
  const channelUser = await User.findById(userId);

  if (!channelUser) {
    throw new apiError(400, "channel not found!");
  }

  // Check if user have not already subscribed
  const alreadySubscribed = await Subscription.findOne({
    subscriber: loggedUserId,
    channel: userId,
  });

  if (alreadySubscribed) {
    throw new apiError(403, "user is already subscribed!");
  }

  // Create the document
  const subscribed = await Subscription.create({
    subscriber: loggedUserId,
    channel: userId,
  });

  if (!subscribed) {
    throw new apiError(500, "failed to subscribe to channel!");
  }

  res.status(202).json(new apiRes(202, {}, "Subscribed successfully!"));
});

const unsubscribeChannel = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  // Check userId exists and not the same as loggedUserId
  const { userId } = req.params;

  if (!userId) {
    throw new apiError(400, "userId is required!");
  }

  // Check if document exists and delete
  const alreadySubscribed = await Subscription.findOneAndDelete({
    subscriber: loggedUserId,
    channel: userId,
  });

  if (!alreadySubscribed) {
    throw new apiError(500, "error unsubscribing the channel!");
  }

  res.status(202).json(new apiRes(202, {}, "Unsubscribed successfully!"));
});

export { subscribeChannel, unsubscribeChannel };
