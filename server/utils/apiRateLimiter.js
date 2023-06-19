import rateLimit from "express-rate-limit";

// Limiting the number of requests from an IP
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 4, // Max number of requests allowed within the windowMs
  message: "Too many requests from this IP, please try again after 15 minutes",
});

export default limiter;
