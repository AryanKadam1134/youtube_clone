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

  if (documentExists) {
    throw new apiError(500, "video already viewed!");
  }

  const viewedVideo = await ViewVideo.create({
    viewedBy: loggedUserId,
    video: video_id,
  });

  if (!viewedVideo) {
    throw new apiError(500, "couldn't view video!");
  }

  return res.status(200).json(new apiRes(200, viewedVideo, "video viewed!"));
});

export { viewVideo };


// remember you could just increase the no of views count if document does not exists.