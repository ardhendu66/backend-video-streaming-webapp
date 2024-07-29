import { promiseHandler } from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/Api.js";
import UserModel from "../models/user.model.js";
import jwt from "jsonwebtoken";

const options = {
    httpOnly: true, 
    secure: true,
}

export const registerUser = promiseHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    if([name, username, email, password].some(field => field?.trim() === "")) {
        throw new ApiError(400, "All fields are required");
    }

    const existedUser = await UserModel.findOne({$or: [{email}, {username}]});
    if(existedUser) {
        throw new ApiError(409, "User with email or username already exists");
    }

    const user = await UserModel.create({name, username, email, password});
    const createdUser = await UserModel.findById(user._id).select("-password -refreshToken");
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering user");
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
});

export const loginUser = promiseHandler(async (req, res) => {
    const { email, username, password } = req.body;

    if(!email && !username) {
        throw new ApiError(400, "username or email required");
    }

    const user = await UserModel.findOne({$or: [{email}, {username}]});
    if(!user) {
        throw new ApiError(404, "user does not exist");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);
    if(!isPasswordValid) {
        throw new ApiError(401, "Invalid user credentials");
    }

    const { accessToken, refreshToken } = await generateAccessAndRefreshToken(user._id);
    const loggedInUser = await UserModel.findById(user._id).select("-password -refreshToken");

    return res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(
        200, { 
            user: loggedInUser, 
            accessToken, 
            refreshToken 
        }, 
        "User logged in successfully"
    ));
})

export const logoutUser = promiseHandler(async (req, res) => {
    await UserModel.findByIdAndUpdate(req.user._id, {
        $unset: {
            refreshToken: 1,
        }
    }, {
        new: true
    });

    return res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
})

export const refreshAccessToken = promiseHandler(async (req, res) => {
    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken) {
        throw new ApiError(401, "Unauthorized request");
    }

    try {
        const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
        const user = await UserModel.findById(decodedToken?._id);
    
        if(!user) {
            throw new ApiError(401, "Invalid refresh token");
        }
        
        if(incomingRefreshToken !== user?.refreshToken) {
            throw new ApiError(401, "Refresh token is expired or used");
        }
    
        const { accessToken, newRefreshToken } = await generateAccessAndRefreshToken(user._id);
    
        return res.status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", newRefreshToken, options)
        .json(new ApiResponse(
            200, { 
                accessToken, 
                refreshToken: newRefreshToken 
            },
            "Access-Token refreshed"
        ))
    } 
    catch(err) {
        throw new ApiError(401, err?.message || "Invalid Refresh-Token");
    }
})

const generateAccessAndRefreshToken = async (userId) => {
    try {
        const user = await UserModel.findById(userId);

        const accessToken = await user.generateAccessToken();
        const refreshToken = await user.generateRefreshToken();

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false });

        return { accessToken, refreshToken };
    }
    catch(err) {
        throw new ApiError(500, "something went wrong while generating access and refresh token");
    }
}