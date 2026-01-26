import jwt from "jsonwebtoken";

import apiError from "../utils/apiError.js";
import asynchandler from "../utils/asyncHandler.js";

import { User } from "../models/user.model.js";

export const verifyJWT = asynchandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new apiError(401, "access token missing!");
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // This give use the decodedToken which contains the user id and other information

  const user = await User.findById(decodedToken?._id).select(
    "-password -refreshToken"
  );

  if (!user) {
    throw new apiError(404, "user not found!");
  }

  req.user = user;

  next();
});
