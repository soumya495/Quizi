import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import connect from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";
import auth from "./middlewares/auth.js";
import userRoutes from "./routes/user.js";
import profileRoutes from "./routes/profile.js";
import groupRoutes from "./routes/group.js";
import quizRoutes from "./routes/quiz.js";

const app = express();

// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 4000;

const allowedOrigins = ['https://quiziquizzes.netlify.app'];
// const allowedOrigins = ['http://localhost:5173'];

// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.set("trust proxy",1);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
    safeFileNames: true,
  })
);

// Connecting to database
connect();

// Connect to Cloudinary
cloudinaryConnect();

app.use('*', (req, res, next) => {
  //print details of incoming request
  console.log(`Incoming request: ${req.method} ${req.originalUrl}`);
  //move to next middleware
  next();
})

// App Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/profile", auth, profileRoutes);
app.use("/api/v1/group", auth, groupRoutes);
app.use("/api/v1/quiz", auth, quizRoutes);

// Test Route
app.get("/", (req, res) => {
  return res.json({
    success: true,
    message: "Your server is up and running ...",
  });
});

// Listening to the server
app.listen(PORT, () => {
  console.log(`App is listening at ${PORT}`);
});
