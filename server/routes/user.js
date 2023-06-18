import { Router } from "express";
import rateLimit from "express-rate-limit";
import { login, sendOtp, signUp } from "../controllers/user.js";

const router = Router();

// Limiting the number of requests from an IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 4, // Max number of requests allowed within the windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

router.post("/sendOtp", limiter, sendOtp);
router.post("/signup", signUp);
router.post("/login", login);

export default router;
