import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../utils/mailTemplates/otp.js";
import { createOtp, verifyOtp } from "../utils/otp.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Send Otp to user
// route   POST /api/user/send-otp
// access  Public
export const sendOtp = async (req, res) => {
  console.log("/api/user/sendOtp Body......", req.body);
  const { email, type } = req.body;

  // Check if type is valid
  if (!type || (type !== "signup" && type !== "forgot-password")) {
    return res.status(400).json({
      success: false,
      message: "Invalid type",
    });
  }

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  const { otp, otpToken } = createOtp(email, type);

  // Sending OTP to the user via email
  try {
    const mailResponse = await mailSender(
      email,
      "OTP for Quizi",
      otpTemplate(otp, type)
    );
    console.log("Otp Email Sent Succesfully", mailResponse);
  } catch (error) {
    console.log("Could Not Send OTP Email", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  // set otptoken in cookie and send response
  res
    .cookie("otpToken", otpToken, {
      domain: ".netlify.app",
      path: "/",
      httpOnly: true,
      maxAge: 5 * 60 * 1000,
    })
    .status(200)
    .json({
      success: true,
      message: "Otp Sent Successfully",
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Sign New User Up
// route   POST /api/user/signup
// access  Public
export const signUp = async (req, res) => {
  console.log("/api/user/signup Body......", req.body);
  const { firstName, lastName, email, password, otp } = req.body;

  const otpToken = req.cookies?.otpToken;

  if (!otpToken) {
    return res.status(400).json({
      success: false,
      message: "OTP Token not found",
    });
  }

  if (
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !otp.trim()
  ) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: "User already exists",
    });
  }

  // Verify OTP
  const otpVerificationResult = verifyOtp(otpToken, email, otp, "signup");
  if (!otpVerificationResult.success) {
    return res.status(400).json(otpVerificationResult);
  }

  // hash the password
  const hashedPassword = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(password)
    .digest("hex");

  // Create new user
  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
  });

  // Save user to the database
  try {
    await newUser.save();
  } catch (error) {
    console.log("Error Saving User to Database", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  // clear otpToken cookie and send response
  res.clearCookie("otpToken").status(200).json({
    success: true,
    message: "User Signed Up Successfully",
  });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Log User In
// route   POST /api/user/login
// access  Public
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email.trim() || !password.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check if user exists
  const existingUser = await User.findOne({ email });
  if (!existingUser) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }

  // Verify password
  const hashedPassword = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(password)
    .digest("hex");

  if (hashedPassword !== existingUser.password) {
    return res.status(400).json({
      success: false,
      message: "Invalid Password",
    });
  }

  // Create JWT
  const token = jwt.sign(
    {
      id: existingUser._id,
      email: existingUser.email,
    },
    process.env.SECRET,
    {
      // set expiry to 1 day
      expiresIn: "1d",
    }
  );

  res
    .cookie("token", token, {
      domain: ".netlify.app",
      path: "/",
      httpOnly: true,
      secure: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    })
    .status(200)
    .json({
      success: true,
      message: "User Logged In Successfully",
    });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Forgot Password
// route   POST /api/user/forgot-password
// access  Public
export const forgotPassword = async (req, res) => {
  const { email, password, otp } = req.body;

  console.log(req.body);

  const otpToken = req.cookies?.otpToken;

  if (!otpToken) {
    return res.status(400).json({
      success: false,
      message: "OTP Token not found",
    });
  }

  if (!email.trim() || !password.trim() || !otp.trim()) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  // Check if user exists
  const user = User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "User does not exist",
    });
  }

  // Verify OTP
  const otpVerificationResult = verifyOtp(
    otpToken,
    email,
    otp,
    "forgot-password"
  );
  if (!otpVerificationResult.success) {
    return res.status(400).json(otpVerificationResult);
  }

  // hash the password
  const hashedPassword = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(password)
    .digest("hex");

  // Update user password
  try {
    await user.updateOne({ password: hashedPassword });

    // clear otpToken cookie and send response
    res.clearCookie("otpToken").status(200).json({
      success: true,
      message: "Password Updated Successfully",
    });
  } catch (error) {
    console.log("Error Updating User Password", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};
