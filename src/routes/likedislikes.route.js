import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  dislikeVideo,
  likeVideo,
} from "../controllers/likedislike.controller.js";

const likedislikesRouter = Router();

likedislikesRouter.route("/:video_id/like").post(verifyJWT, likeVideo);

likedislikesRouter.route("/:video_id/dislike").post(verifyJWT, dislikeVideo);

export default likedislikesRouter;
