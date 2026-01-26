import { User } from "../models/user.model.js";
import { Video } from "../models/video.model.js";
import { ViewVideo } from "../models/viewVideo.model.js";

import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import asynchandler from "../utils/asyncHandler.js";

const viewVideo = asynchandler(async (req, res) => {
  const loggedUserId = req.user?._id;

  const { video_id } = req.params;

  if (!video_id) {
    throw new apiError(400, "video_id is required!");
  }

  const videoExists = await Video.findById(video_id);

  if (!videoExists) {
    throw new apiError(404, "video does not exists!");
  }

  const documentExists = await ViewVideo.findOne({
    viewedBy: loggedUserId,
    video: video_id,
  });

  if (!documentExists) {
    await ViewVideo.create({
      viewedBy: loggedUserId,
      video: video_id,
    });

    await Video.findByIdAndUpdate(video_id, {
      $inc: { views: 1 },
    });

    await User.findByIdAndUpdate(loggedUserId, {
      $push: {
        watchHistory: video_id,
      },
    });
  }

  const video = await Video.findById(video_id);

  return res
    .status(200)
    .json(new apiRes(200, video, "video viewed successfully"));
});

export { viewVideo };
