import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
    name: String,
    username: String,
    email: String,
    password: String,
    avatar: String,
    coverImage: String,
    watchHistory: [{
        type: mongoose.Types.ObjectId,
        ref: "Video"
    }],
    refreshToken: String,
}, {
    timestamps: true,
})
userSchema.pre("save", async function(next) {
    if(!this.isModified("password")) return next();

    this.password = await bcrypt.hash(this.password, 10);
    next();
})
userSchema.methods.isPasswordCorrect = async function(password) {
    return await bcrypt.compare(password, this.password);
}
userSchema.methods.generateAccessToken = function() {
    return jwt.sign({
            _id: this._id,
            email: this.email,
            username: this.username,
            name: this.name,
        }, 
        process.env.ACCESS_TOKEN_SECRET, { 
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY
    })
}
userSchema.methods.generateRefreshToken = function() {
    return jwt.sign({
            _id: this._id
        },
        process.env.REFRESH_TOKEN_SECRET, { 
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    })
}

const UserModel = mongoose.models.User || mongoose.model("User", userSchema);

export default UserModel;