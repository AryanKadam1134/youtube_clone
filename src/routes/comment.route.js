import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware";
import {
  addComment,
  deleteComment,
  getCommentsOnVideo,
} from "../controllers/comment.controller";

const commentRouter = Router();

commentRouter.route("/:video_id/add").post(verifyJWT, addComment);

commentRouter.route("/:video_id/delete").post(verifyJWT, deleteComment);

commentRouter.route("/:video_id/all").get(verifyJWT, getCommentsOnVideo);

export default commentRouter;
