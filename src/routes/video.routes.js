import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  uploadVideo,
  updateVideoDetails,
  deleteVideo,
  getAllVideos,
  getUserChannelVideos,
  getCurrentUserChannelVideos,
} from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/uploadVideo").post(
  verifyJWT,
  upload.fields([
    {
      name: "videoFile",
      maxCount: 1,
    },
    {
      name: "thumbnail",
      maxCount: 1,
    },
  ]),
  uploadVideo
);

videoRouter.route("/updateVideoDetails").patch(verifyJWT, updateVideoDetails);

videoRouter.route("/deleteVideo").delete(verifyJWT, deleteVideo);

videoRouter.route("/getAllVideos").get(getAllVideos);

videoRouter.route("/getUserChannelVideos").get(getUserChannelVideos);

videoRouter
  .route("/getCurrentUserChannelVideos")
  .get(verifyJWT, getCurrentUserChannelVideos);

export default videoRouter;
