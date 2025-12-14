// This middleware checks if the user is authenticated or not
// [Bengali] : eta verify kore je user ache kina || "Yes" or "No"

import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";


export const verifyJWT = asyncHandler( async(req,res,next)=>{
    try {
        // get token from cookies or headers(mobile apps)
        // req has the access token in cookies or headers
        const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","");
        if(!token){
            throw new ApiError(401, "Unauthorized request - No token provided");
        }
    
        // verify token through JWT
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    
        // Database call -> got the decoded user from token
        const user = await User.findById(decodedToken?._id).select(
            "-password -refreshToken" // exclude password and refreshToken from user object
        )
    
        if(!user){
            // TODO: Discussion about frontend handling of such cases
            throw new ApiError(401, "Unauthorized request - User not found - Invalid Access Token");
        }
    
        // setting the user in req object for further use in next middlewares or controllers
        req.user = user;
        next(); // pass the control to next middleware or controller
    } catch (error) {
        throw new ApiError(401, error?.message || "Unauthorized request - Invalid Access Token");
    }
});