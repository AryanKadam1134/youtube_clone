import { User } from "../models/user.model";
import apiError from "../utils/apiError";
import apiRes from "../utils/apiRes";
import asynchandler from "../utils/asyncHandler";
import jwt from "jsonwebtoken";

export const verifyJWT = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    const user = User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new Error(400, "Invalid Access token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new apiError(401, error || "Invald Access token");
  }
});
