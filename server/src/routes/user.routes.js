import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeUserPassword,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getCurrentUserDetails,
  getCurrentUserWatchHistory,
  getCurrentUserChannelDetails,
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

userRouter.route("/refreshtoken").post(refreshAccessToken);

userRouter.route("/change-password").patch(verifyJWT, changeUserPassword);

userRouter.route("/me/update").patch(verifyJWT, updateUserDetails);

userRouter
  .route("/me/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

userRouter
  .route("/me/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

userRouter.route("/me").get(verifyJWT, getCurrentUserDetails);

userRouter
  .route("/me/watch-history")
  .get(verifyJWT, getCurrentUserWatchHistory);

userRouter.route("/me/channel").get(verifyJWT, getCurrentUserChannelDetails);

userRouter.route("/:userId/channel").get(verifyJWT, getUserChannelDetails);

export default userRouter;
