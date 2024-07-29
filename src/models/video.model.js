import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
    videoFile: String,
    thumbnail: String,
    title: String,
    description: String,
    duration: String,
    duration: Number,
    views: {
        type: Number,
        default: 0,
    },
    isPublished: {
        type: Boolean,
        default: true,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    }
}, {
    timestamps: true,
});

const VideoModel = mongoose.models.Video || mongoose.model("Video", videoSchema);

export default VideoModel;