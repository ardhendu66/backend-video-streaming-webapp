import { asyncHandler, promiseHandler } from "../utils/asyncHandler.js";
import { ApiError, ApiResponse } from "../utils/Api.js";
import UserModel from "../models/user.model.js";

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