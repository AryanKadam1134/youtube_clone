import asynchandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import { User } from "../models/user.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";

const registerUser = asynchandler(async (req, res) => {
  // For sucessfully registering the user =>
  // Get the user details form the frontend (for testing => postman)
  // Validation => Validate if required fields are not empty or null
  // Check if user already exists or not... (Check username and email for unique user)
  // Check for images => Avatar is required
  // If images and avatar exists, upload to cloudinary => first multer check and then cloudinary check
  // after the above following is sucessfull, send an object to mongo to create a user
  // remove the password and response token fields form the response
  // Check for user creation (if user is created => return the response, response should not be null)

  const { fullName, username, email, password } = req.body;

  console.log("Email: ", email);
  console.log("Password: ", password);

  if (
    [fullName, username, email, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All fields are required!");
  }

  const userExists = User.findOne({
    $or: [{ username }, { email }],
  });

  if (userExists) {
    throw new apiError(409, "User with username or email already exists!");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "avatar field is required!");
  }

  const avatarUploaded = await uploadToCloudinary(avatarLocalPath);

  const coverImageUploaded = await uploadToCloudinary(coverImageLocalPath);

  if (!avatarUploaded) {
    throw new apiError(400, "avatar field is required!");
  }

  const user = await User.create({
    fullName,
    avatar: avatarUploaded?.url,
    coverImage: coverImageUploaded?.url || "",
    username: username.toLowerCase(),
    email,
    password,
  });

  const createdUser = User.findById(user._id)?.select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    throw new apiError(500, "Error while creating the user!");
  }

  return res
    .status(201)
    .json(new apiRes(200, createdUser, "User registered successfully!"));
});

export default registerUser;
