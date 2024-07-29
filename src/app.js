import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import userRoute from "./routes/user.route.js";
export const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
}))
app.use(express.json({limit: "100kb"}));
app.use(express.urlencoded({extended: true, limit: "100kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.use('/api/v1/users', userRoute);