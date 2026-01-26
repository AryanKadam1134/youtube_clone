import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  dislikeComment,
  dislikeVideo,
  likeComment,
  likeVideo,
} from "../controllers/reaction.controller.js";

const reactionRouter = Router();

reactionRouter.route("/video/:video_id/like").post(verifyJWT, likeVideo);

reactionRouter.route("/video/:video_id/dislike").post(verifyJWT, dislikeVideo);

reactionRouter.route("/comment/:comment_id/like").post(verifyJWT, likeComment);

reactionRouter
  .route("/comment/:comment_id/dislike")
  .post(verifyJWT, dislikeComment);

export default reactionRouter;
