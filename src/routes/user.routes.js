import { Router } from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  refeshAccessToken,
  changeUserPassword,
  updateUserDetails,
  updateUserAvatar,
  updateUserCoverImage,
  getCurrentUser,
  getCurrentUserChannelDetails,
  getChannelDetails,
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

userRouter.route("/change-password").patch(verifyJWT, changeUserPassword);

userRouter.route("/me/update").patch(verifyJWT, updateUserDetails);

userRouter
  .route("/me/update-avatar")
  .patch(verifyJWT, upload.single("avatar"), updateUserAvatar);

userRouter
  .route("/me/update-coverImage")
  .patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage);

userRouter.route("/me").get(verifyJWT, getCurrentUser);

userRouter.route("/me/channel").get(verifyJWT, getCurrentUserChannelDetails);

userRouter.route("/:userId/channel").get(verifyJWT, getChannelDetails);

export default userRouter;
