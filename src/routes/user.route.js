import { Router } from "express";
import { 
    registerUser, loginUser, logoutUser, refreshAccessToken 
} from "../controllers/user.controller.js";
import { authorizeUser } from "../middleware/auth.middleware.js";
const router = Router();

router.route("/register").post(registerUser);
router.route("/login").post(loginUser);

// secured routes
router.route("/logout").post(authorizeUser, logoutUser);
router.route("/refresh-token").post(refreshAccessToken);

export default router;