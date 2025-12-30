import asynchandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import { User } from "../models/user.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";
import jwt from "jsonwebtoken";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    console.log("userId: ", userId);

    // Problem is here
    await user.save({ validateBeforeSave: false });

    console.log("refreshToken: ", refreshToken);
    console.log("accessToken: ", accessToken);

    return { accessToken, refreshToken };
  } catch (error) {
    console.log("error: ", error);

    throw new apiError(
      501,
      "Something went wrong while generating access and refresh token"
    );
  }
};

const registerUser = asynchandler(async (req, res, next) => {
  // For sucessfully registering the user =>
  // 1. Get the user details form the frontend (for testing => postman)
  // 2. Validation => Validate if required fields are not empty or null
  // 3. Check if user already exists or not... (Check username and email for unique user)
  // 4. Check for images => Avatar is required
  // 5. If images and avatar exists, upload to cloudinary => first multer check and then cloudinary check
  // 6. After the above following is sucessfull, send an object to mongo to create a user
  // 7. Remove the password and response token fields form the response
  // Check for user creation (if user is created => return the response, response should not be null)

  // 1. Done
  const { fullName, username, email, password } = req.body; // The request will come through this

  // console.log("Email: ", email);
  // console.log("Password: ", password);
  console.log("Request through Postman: ", req.body);

  // 2. Done
  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required!");
  }

  // 3. Done
  const userExists = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new apiError(409, "User with username or email already exists!");
  }

  // 4. Done
  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  console.log("Cloudinary files: ", req?.files);

  // 5. Done
  if (!avatarLocalPath) {
    throw new apiError(400, "avatar field is required!"); // Multer check
  }

  const avatarUploaded = await uploadToCloudinary(avatarLocalPath);
  const coverImageUploaded = await uploadToCloudinary(coverImageLocalPath);

  if (!avatarUploaded) {
    throw new apiError(400, "avatar field is required!"); // Cloudinary check
  }

  // 6. Done
  const user = await User.create({
    fullName,
    avatar: avatarUploaded?.url,
    coverImage: coverImageUploaded?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  // 7. Done
  const createdUser = await User.findById(user._id)?.select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Error while creating the user!");
  }

  return res
    .status(201)
    .json(new apiRes(200, createdUser, "User registered successfully!"));
});

const loginUser = asynchandler(async (req, res, next) => {
  // For Logging in the user =>
  // 1. Get the response from req.body
  // 2. Validate => username or email & pasword is not empty => if not res
  // 3. Check username or email exist => if not res
  // 4. If userName check Password is correct or not
  // 5. If password correct => generate accesstoken and refreshtoken
  // 6. Send in cookies

  // 1. Done
  const { username, email, password } = req.body;

  // 2. Done
  if (!(username || email)) {
    throw new apiError(400, "username or email is required!");
  }

  // 3. Done
  const userExist = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!userExist) {
    throw new apiError(401, "user does not exist!");
  }

  // 4. Done
  const isPasswordCorrect = await userExist.isPasswordCorrect(password);

  if (!isPasswordCorrect) {
    throw new apiError(402, "Password Invalid!");
  }

  // 5. Done
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    userExist?._id
  );

  if (!accessToken || !refreshToken) {
    throw new apiError(500, "Couldn't get accestoken and refreshToken");
  }

  // 6. Done
  const loggedInUser = await User.findById(userExist._id).select(
    "-password -refreshToken"
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new apiRes(200, { user: loggedInUser, accessToken, refreshToken }));
});

const logoutUser = asynchandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set: { refreshToken: undefined },
    },
    {
      new: true,
    }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new apiRes(200, {}, "User Logged Out"));
});

const refeshAccessToken = asynchandler(async (req, res, next) => {
  const incomingRefreshToken = req.cookies?.refreshToken;

  if (!incomingRefreshToken) {
    throw new apiError(401, "bad request!");
  }

  console.log("incomingRefreshToken: ", incomingRefreshToken);


  const decodedToken = jwt.verify(
    incomingRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  console.log("decodedToken: ", decodedToken);


  const user = await User.findById(decodedToken._id);

  if (!user) {
    throw new apiError(401, "Invalid token!");
  }

  console.log("User: ", user);

  if (incomingRefreshToken !== user?.refreshToken) {
    throw new apiError(401, "Refresh token is Expired or used!");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new apiRes(
        201,
        { accessToken, refreshToken },
        "Access token is refreshed successfully!"
      )
    );
});

export { registerUser, loginUser, logoutUser, refeshAccessToken };
