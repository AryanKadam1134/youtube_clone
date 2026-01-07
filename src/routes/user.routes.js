import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refeshAccessToken,
  changeUserPassword,
  getCurrentUser,
  changeUserDetails,
  changeUserAvatar,
  getUserChannelDetails,
} from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
      name: "coverImage",
      maxCount: 1,
    },
  ]),
  registerUser
);

userRouter.route("/login").post(loginUser);

userRouter.route("/logout").post(verifyJWT, logoutUser);

userRouter.route("/refreshtoken").post(refeshAccessToken);

userRouter.route("/change_password").post(verifyJWT, changeUserPassword);

userRouter.route("/currentUser").get(verifyJWT, getCurrentUser);

userRouter.route("/changeUserDetails").post(verifyJWT, changeUserDetails);

userRouter
  .route("/changeUserAvatar")
  .post(verifyJWT, upload.single("avatar"), changeUserAvatar);

userRouter
  .route("/getUserChannelDetails")
  .post(verifyJWT, getUserChannelDetails);

export default userRouter;
