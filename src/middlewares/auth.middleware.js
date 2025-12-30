import { User } from "../models/user.model.js";
import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import asynchandler from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

export const verifyJWT = asynchandler(async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      throw new apiError(401, "Unauthorized request");
    }

    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET); // This give use the decodedToken which contains the user id and other information

    const user = User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new Error(402, "Invalid Access token");
    }

    req.user = user;

    next();
  } catch (error) {
    throw new apiError(403, error || "Invald Access token");
  }
});
