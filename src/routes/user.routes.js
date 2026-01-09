import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refeshAccessToken,
  changeUserPassword,
  getCurrentUser,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
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

userRouter.route("/getCurrentUser").get(verifyJWT, getCurrentUser);

userRouter.route("/updateUserDetails").post(verifyJWT, updateUserDetails);

userRouter
  .route("/updateUserAvatar")
  .post(verifyJWT, upload.single("avatar"), updateUserAvatar);

userRouter
  .route("/updateUserCoverImage")
  .post(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

userRouter
  .route("/getUserChannelDetails")
  .post(verifyJWT, getUserChannelDetails);

export default userRouter;
