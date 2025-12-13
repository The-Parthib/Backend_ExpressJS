import { asyncHandler } from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import validator from "validator";
import { User } from "../models/user.model.js";
import {uploadOnCloudinary} from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponses.js";

const registerUser = asyncHandler( async (req,res)=>{
    // steps to register user below:
    // 1. get user data from frontend
    // 2. validation - non empty fields
    // 3. check if user already exists : userName and Password
    // 4. check for images and avatar upload to cloudinary -> avatar[must]
    // 5. create user object ->  create entry in DB
    // 6. remove password and refreshToken from response
    // 7. check for user creation success -> send response

    const {fullName, email, username, password} = req.body;
    console.log("Email : ", email);

    // validation of non empty fields
    /*
    if(fullName === "" || email === "" || username === "" || password === ""){
        throw new ApiError(400, "All fields are required");
    }
    */
    if([fullName, email, username, password].some((filed)=> filed?.trim() === "")){
        throw new ApiError(400, "All fields are required");
    }
    if(!validator.isEmail(email)){
        throw new ApiError(400, "Invalid email address");
    }

    // ============ check if user already exists ==================
    const userExist = User.findOne({
        $or: [{email}, {username}]
    })
    if(userExist){
        throw new ApiError(409, "User already exists with given email or username");
    }
    // =============================================================
    // Handling file uploads using multer middleware
    // =============================================================
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverPhoto[0]?.path;

    if(!avatarLocalPath){
        throw new ApiError(400, "Avatar is required");
    }

    // ====== upload images to cloudinary ======
    const avatarUploadResponse = await uploadOnCloudinary(avatarLocalPath); // take time so await -> asyncHandler is used for this
    const coverImageUploadResponse = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatarUploadResponse){
        throw new ApiError(400, "Avatar file is required");
    }
    // ============= create user object and store in DB ==============
    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullName,
        avatar: avatarUploadResponse.url,
        coverImage: coverImageUploadResponse?.url || "",
        password

    })

    const createduser = await user.findById(user._id).select(
        "-password -refreshToken"
    )
    if(!createduser){
        throw new ApiError(500, "something went wrong while creating the user");
    }

    // ============= send response ==============
    res.status(201).json(
        new ApiResponse(200, createduser, "User registered successfully")
    )

})

export { registerUser };