import { Router } from "express";
import limiter from "../utils/apiRateLimiter.js";
import { sendOtp, signUp, login, forgotPassword } from "../controllers/user.js";

const router = Router();

router.post("/send-otp", limiter, sendOtp);
router.post("/signup", signUp);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);

export default router;
