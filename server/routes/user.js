import { Router } from "express";
import limiter from "../utils/apiRateLimiter.js";
import { sendOtp, signUp, login } from "../controllers/user.js";

const router = Router();

router.post("/sendOtp", limiter, sendOtp);
router.post("/signup", signUp);
router.post("/login", login);

export default router;
