import { Router } from "express";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

import {
  uploadVideo,
  updateVideoDetails,
  deleteVideo,
  getAllVideos,
  getChannelVideos,
  getCurrentUserChannelVideos,
  viewVideo,
  getSingleVideo,
} from "../controllers/video.controller.js";

const videoRouter = Router();

videoRouter.route("/me/upload_video").post(
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

videoRouter
  .route("/:video_id/update_video")
  .patch(verifyJWT, updateVideoDetails);

videoRouter.route("/:video_id/delete_video").delete(verifyJWT, deleteVideo);

videoRouter.route("/all").get(getAllVideos);

videoRouter.route("/:userId").get(getChannelVideos);

videoRouter.route("/me/all").get(verifyJWT, getCurrentUserChannelVideos);

videoRouter.route("/:video_id/view").patch(verifyJWT, viewVideo);

videoRouter.route("/:video_id/single").get(verifyJWT, getSingleVideo);

export default videoRouter;
