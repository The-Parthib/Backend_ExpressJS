import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import {
  getPublicIdFromUrl,
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponses.js";
import { options } from "../constants.js";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

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
// =========== End of Function to handle AccessToken and RefreshToken generation ===========

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
      $unset: {
        refreshToken: 1, // this removes the field from DB document
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
    .json(new ApiResponse(200, {}, "User logged out successfully"));
});
// ======== End of user logout controller ========

// ======== refresh<>Access Token controller ========
const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken =
    req.cookies?.refreshToken || req.body?.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized access - Wrong refresh token");
  }

  try {
    // decode the payload from incoming refresh token
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
      throw new ApiError(
        401,
        "Unauthorized access - User not found or invalid refresh token"
      );
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Unauthorized access - Invalid refresh token");
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

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
      );
  } catch (error) {
    new ApiError(
      401,
      error?.message || "Unauthorized access - Invalid refresh token"
    );
  }
});
// ======== End of refresh Access Token controller ========

// ======== User Password change controller ========
const changeCurrentPassword = asyncHandler(async (req, res) => {
  // hold old and new passwords from request body
  const { oldPassword, newPassword } = req.body;
  // Identify the user from req.user -> set by verifyJWT middleware
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Old password is incorrect");
  }

  user.password = newPassword; // will be hashed by mongoose middleware
  await user.save({ validateBeforeSave: false }); // to skip other field validations || save to DB

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});
// ======== End of User Password change controller ========

// ======== Get Current User Controller ========
const getCurrentUser = asyncHandler(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});
// ======== End of Get Current User Controller ========

// ======== Update User Account Controller ========
const updateUserAccount = asyncHandler(async (req, res) => {
  const { fullName, email } = req.body;

  // Check if at least one field is provided
  if (!fullName && !email) {
    throw new ApiError(
      400,
      "At least one field (fullName or email) is required"
    );
  }

  // Build update object with only provided fields
  const updateFields = {};
  if (fullName) updateFields.fullName = fullName;
  if (email) updateFields.email = email;

  // Get the user from req.user -> set by verifyJWT middleware
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: updateFields,
    },
    { new: true } // to get updated user document in response
  ).select("-password");

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User account updated successfully"));
});
// ======== End of Update User Account Controller ========

/*
  NOTE:
      1. Update Files controlers should be handled separately
      2. For updating files use multer middleware to handle file uploads
      3. Then upload the files to cloudinary using uploadOnCloudinary function
      4. Then update the user document with new file URLs
*/

// ======== Update User Avatar Controller ========
const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path; // multer middleware will set the file in req.file
  if (!avatarLocalPath) {
    throw new ApiError(400, "Avatar file is required");
  }

  // get old avatar url to delete from cloudinary
  const oldAvatarUrl = await User.findById(req.user?._id).select("avatar");
  const oldAvatarPublicId = getPublicIdFromUrl(oldAvatarUrl?.avatar);

  // upload on cloudinary
  const avatarUPloadResponse = await uploadOnCloudinary(avatarLocalPath);
  if (!avatarUPloadResponse?.secure_url) {
    throw new ApiError(500, "Error while uploading avatar to cloudinary");
  }
  // update the avatar url in user document in DB
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        avatar: avatarUPloadResponse.secure_url,
      },
    },
    { new: true } // to get updated user document in response
  ).select("-password");

  // delete old avatar from cloudinary
  await deleteFromCloudinary(oldAvatarPublicId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User avatar updated successfully"));
});
// ======== End of Update User Avatar Controller ========

// ======== Update User CoverImage Controller ========
const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path; // multer middleware will set the file in req.file
  if (!coverImageLocalPath) {
    throw new ApiError(400, "CoverImage file is required");
  }

  // get old coverImage url to delete from cloudinary
  const oldCoverImageUrl = await User.findById(req.user?._id).select(
    "coverImage"
  );
  const oldCoverImagePublicId = getPublicIdFromUrl(
    oldCoverImageUrl?.coverImage
  );

  // upload on cloudinary
  const coverImageResponse = await uploadOnCloudinary(coverImageLocalPath);
  if (!coverImageResponse?.secure_url) {
    throw new ApiError(500, "Error while uploading cover Image to cloudinary");
  }
  // update the avatar url in user document in DB
  const user = await User.findByIdAndUpdate(
    req.user?._id,
    {
      $set: {
        coverImage: coverImageResponse.secure_url,
      },
    },
    { new: true } // to get updated user document in response
  ).select("-password");

  // delete old coverImage from cloudinary
  await deleteFromCloudinary(oldCoverImagePublicId);

  return res
    .status(200)
    .json(new ApiResponse(200, user, "User Cover Image updated successfully"));
});
// ======== End of Update User coverImage Controller ========

// ========== get user channel profile controller ==========
const getUserChannelProfile = asyncHandler(async (req, res) => {
  const { username } = req.params;

  if (!username?.trim()) {
    throw new ApiError(400, "Username is required");
  }

  // User.find({username})
  const channel = await User.aggregate([
    {
      $match: {
        username: username?.toLowerCase(),
      },
    },
    {
      $lookup: {
        from: "subscriptions", // collection name in DB
        localField: "_id", // field from users collection
        foreignField: "channel", // field from subscriptions collection
        as: "subscribers", // alias for the joined data [Subscriber of a channel <- User ]
      },
    },
    {
      $lookup: {
        from: "subscriptions", // collection name in DB
        localField: "_id", // field from users collection
        foreignField: "subscriber", // field from subscriptions collection
        as: "subscribedTo", // alias for the joined data [ User -> subdcribed which channels ]
      },
    },
    {
      $addFields: {
        subscriberCount: { $size: "$subscribers" },
        channelsSubscribedToCount: { $size: "$subscribedTo" },
        isSubscribed: {
          $cond: {
            if: {
              $in: [req.user?._id, "$subscribers.subscriber"], // check if current user id is in subscribers list
            },
            then: true,
            else: false,
          },
        },
      },
    },
    {
      $project: {
        fullName: 1,
        username: 1,
        subscriberCount: 1,
        channelsSubscribedToCount: 1,
        isSubscribed: 1,
        avatar: 1,
        coverImage: 1,
        email: 1,
      },
    },
  ]);

  // TODO -> console.log(channel); see the structure of channel
  console.log(channel);

  if (!channel?.length) {
    throw new ApiError(404, "Channel not found with given username");
  }
  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        channel[0],
        "User channel profile fetched successfully"
      )
    );
});
// ========== End of get user channel profile controller ==========

// ========== get user watch history controller ==========
const getWatchHistory = asyncHandler(async (req, res) => {
  // convert req.user._id to ObjectId -> as req.user._id is string on correct mongodb so I have to convert it
  const userId = new mongoose.Types.ObjectId(String(req.user._id));
  const user = await User.aggregate([
    {
      $match: {
        _id: userId,
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "watchHistory",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner", //TODO make the pipeline outside and see the result
              pipeline: [
                {
                  $project: {
                    fullName: 1,
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: {
                $first: "$owner",
              },
            },
          },
        ],
      },
    },
  ]);

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        user[0]?.watchHistory,
        "User watch history fetched successfully"
      )
    );
});

export {
  registerUser,
  loginUser,
  logOutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
  updateUserAccount,
  updateUserAvatar,
  updateUserCoverImage,
  getUserChannelProfile,
  getWatchHistory,
};
