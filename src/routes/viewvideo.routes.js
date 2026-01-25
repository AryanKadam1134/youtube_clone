import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { viewVideo } from "../controllers/viewvideo.controller.js";

const viewVideoRouter = Router();

viewVideoRouter.route("/:video_id").patch(verifyJWT, viewVideo);

export default viewVideoRouter;
