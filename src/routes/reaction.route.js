import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { dislikeVideo, likeVideo } from "../controllers/reaction.controller.js";

const reactionRouter = Router();

reactionRouter.route("/video/:video_id/like").post(verifyJWT, likeVideo);

reactionRouter.route("/video/:video_id/dislike").post(verifyJWT, dislikeVideo);

export default reactionRouter;
