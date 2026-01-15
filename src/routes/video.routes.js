import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  uploadVideo,
  deleteVideo,
  getAllVideos,
  getChannelVideos,
  updateVideoDetails,
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

videoRouter.route("/deleteVideo").delete(verifyJWT, deleteVideo);

videoRouter.route("/getAllVideos").get(verifyJWT, getAllVideos);

videoRouter.route("/getChannelVideos").get(verifyJWT, getChannelVideos);

videoRouter.route("/updateVideoDetails").patch(verifyJWT, updateVideoDetails);

export default videoRouter;
