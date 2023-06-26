import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import fileUpload from "express-fileupload";
import connect from "./config/database.js";
import cloudinaryConnect from "./config/cloudinary.js";
import auth from "./middlewares/auth.js";
import validateQuizAdmin from "./middlewares/quiz.js";
import userRoutes from "./routes/user.js";
import groupRoutes from "./routes/group.js";
import quizRoutes from "./routes/quiz.js";

const app = express();

// Loading environment variables from .env file
dotenv.config();

// Setting up port number
const PORT = process.env.PORT || 4000;

// Connecting to database
connect();

// Connect to Cloudinary
cloudinaryConnect();

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// App Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/group", auth, groupRoutes);
app.use("/api/v1/quiz", auth, validateQuizAdmin, quizRoutes);

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
