import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponses.js";
import {options} from "../constants.js"
import jwt from "jsonwebtoken";

// =========== Function to handle AccessToken and RefreshToken generation ===========
const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId); // got user by its _id
    const accessToken = user.generateAccessToken(); // got the AccessToken by jwt sign
    const refreshToken = user.generateRefreshToken(); // got the RefreshToken by jwt sign
    user.refreshToken = refreshToken; // store refreshToken in DB for the user -> DB model
    await user.save(); // save the user with refreshToken in DB

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(500, "Error while generating access and refresh tokens");
  }
};

// ======== User Registration Controller ========
const registerUser = asyncHandler(async (req, res) => {
  // steps to register user below:
  // 1. get user data from frontend
  // 2. validation - non empty fields
  // 3. check if user already exists : userName and Password
  // 4. check for images and avatar upload to cloudinary -> avatar[must]
  // 5. create user object ->  create entry in DB
  // 6. remove password and refreshToken from response
  // 7. check for user creation success -> send response

  const { fullName, email, username, password } = req.body;
  //console.log("Email : ", email);

  // validation of non empty fields
  /*
    if(fullName === "" || email === "" || username === "" || password === ""){
        throw new ApiError(400, "All fields are required");
    }
    */
  if (
    [fullName, email, username, password].some((filed) => filed?.trim() === "")
  ) {
    throw new ApiError(400, "All fields are required");
  }
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email address");
  }

  // ============ check if user already exists ==================
  const userExist = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (userExist) {
    throw new ApiError(409, "User already exists with given email or username");
  }
  // =============================================================
  // Handling file uploads using multer middleware
  // =============================================================
  // console.log(req.files);
  const avatarLocalPath = req.files?.avatar[0]?.path;
  //const coverImageLocalPath = req.files?.coverImage[0]?.path; // but can handle undefined
  let coverImageLocalPath;

  if (
    req.files &&
    Array.isArray(req.files.coverImage) &&
    req.files.coverImage.length > 0
  ) {
    coverImageLocalPath = req.files.coverImage[0].path;
  }

  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar is required");
  }

  // ====== upload images to cloudinary ======
  const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath); // take time so await -> asyncHandler is used for this
  const coverImageUploadResponse =
    await uploadOnCloudinary(coverImageLocalPath);

  if (!avatarUploadResponse) {
    throw new ApiError(400, "Avatar file is required");
  }
  // ============= create user object and store in DB ==============
  const user = await User.create({
    username: username.toLowerCase(),
    email,
    fullName,
    avatar: avatarUploadResponse.secure_url,
    coverImage: coverImageUploadResponse?.secure_url || "",
    password,
  });

  const createduser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  if (!createduser) {
    throw new ApiError(500, "something went wrong while creating the user");
  }

  // ============= send response ==============
  res
    .status(201)
    .json(new ApiResponse(200, createduser, "User registered successfully"));
});
// ======== End of User Registration Controller ========

// ======== User Login Controller ========
const loginUser = asyncHandler(async (req, res) => {
  // steps to login user below:
  // 1. get data from frontend (req.body)
  // 2. validation - non empty fields (useername, password)
  // 3. check if the user is exists in DB
  // 4. compare password (password hashing check)
  // 5. access and refresh token generation (jwt)
  // 6. send cookies and response

  const { username, email, password } = req.body;

  // validation - non empty fields | blank spaces
  if (!(username || email)) {
    throw new ApiError(400, "Username or Email is required");
  }

  // Find user in DB
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    throw new ApiError(404, "User not found with given username or email");
  }

  // password comparison
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials - password is incorrect");
  }

  // generate access and refresh tokens
  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(
    user._id
  ); // calling the function defined above

  // fetch filtered userData  -> remove password and refreshToken from response
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );
  // setting options for cookies
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  // ============= send response ==============
  return res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions) // set accessToken in cookie("name", value, options)
    .cookie("refreshToken", refreshToken, cookieOptions) // set refreshToken in cookie("name", value, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});
// ======== End of User Login Controller ========

// ======== user logout controller ========
const logOutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        refreshToken: undefined,
      },
    },
    {
      new: true, // new value in the response
    }
  );

  // cookies options
  const cookieOptions = {
    httpOnly: true,
    secure: true,
  };

  // clear cookies 
  return res
  .status(200)
  .clearCookie("accessToken", cookieOptions)
  .clearCookie("refreshToken", cookieOptions)
  .json(
    new ApiResponse(200, {}, "User logged out successfully")
  )
});
// ======== End of user logout controller ========

// ======== refresh Access Token controller ========
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

  if(!incomingRefreshToken){
    throw new ApiError(401, "Unauthorized access - Wrong refresh token");
  }

try {
    // decode the payload from incoming refresh token
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
  
    const user = await User.findById(decodedToken?._id).select(
      "-password"
    )
  
    if(!user){
      throw new ApiError(401, "Unauthorized access - User not found or invalid refresh token");
    }
  
    if(incomingRefreshToken !== user?.refreshToken){
      throw new ApiError(401, "Unauthorized access - Invalid refresh token");
    }
  
    const { accessToken, newRefreshToken } = await generateAccessAndRefreshTokens(user._id);
  
    return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", newRefreshToken, options)
    .json(
      new ApiResponse(
        200,
        { accessToken, refreshToken: newRefreshToken },
        "Access token refreshed successfully"
      )
    )
} catch (error) {
  new ApiError(401,error?.message || "Unauthorized access - Invalid refresh token");
}
});
// ======== End of refresh Access Token controller ========

export { registerUser, loginUser, logOutUser, refreshAccessToken };
