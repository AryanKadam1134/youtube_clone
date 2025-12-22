import asynchandler from "../utils/asyncHandler.js";
import apiError from "../utils/apiError.js";
import apiRes from "../utils/apiRes.js";
import { User } from "../models/user.model.js";
import uploadToCloudinary from "../utils/cloudinary.js";

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
  // console.log("Request through Postman: ", req.body);

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

export default registerUser;
