import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  subscribeChannel,
  unsubscribeChannel,
} from "../controllers/subscription.controller.js";

const subscriptionRouter = Router();

subscriptionRouter
  .route("/:channelUserId/subscribe")
  .post(verifyJWT, subscribeChannel);

subscriptionRouter
  .route("/:channelUserId/unsubscribe")
  .post(verifyJWT, unsubscribeChannel);

export default subscriptionRouter;
