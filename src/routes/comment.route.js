import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  addComment,
  deleteComment,
  getCommentsOnVideo,
} from "../controllers/comment.controller.js";

const commentRouter = Router();

commentRouter.route("/:video_id/add").post(verifyJWT, addComment);

commentRouter.route("/:comment_id/delete").delete(verifyJWT, deleteComment);

commentRouter.route("/:video_id/all").get(verifyJWT, getCommentsOnVideo);

export default commentRouter;
