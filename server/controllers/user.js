import otpGenerator from "otp-generator";
import * as crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import mailSender from "../utils/mailSender.js";
import otpTemplate from "../utils/mailTemplates/otp.js";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Send Otp to user
// route   POST /api/user/sendOtp
// access  Public
const sendOtp = async (req, res) => {
  console.log("/api/user/sendOtp Body......", req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Email is required",
    });
  }

  // Generate a 6 digit numeric OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  //5 Minutes in miliseconds
  const ttl = 5 * 60 * 1000;
  //timestamp to 5 minutes in the future
  const expires = Date.now() + ttl;
  // email.otp.expiry_timestamp
  const data = `${email}.${otp}.${expires}`;
  // creating SHA256 hash of the data
  const hash = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(data)
    .digest("hex");
  // Hash.expires, format to send to the user
  const fullHash = `${hash}.${expires}`;

  // Sending OTP to the user via email
  try {
    const mailResponse = await mailSender(
      email,
      "OTP for Quizi",
      otpTemplate(otp)
    );
    console.log("Otp Email Sent Succesfully", mailResponse);
  } catch (error) {
    console.log("Could Not Send OTP Email", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }

  res.status(200).json({
    success: true,
    message: "Otp Sent Successfully",
    data: {
      otp: otp,
      hash: fullHash,
    },
  });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Verify Otp
const verifyOtp = (email, otp, hash) => {
  // Seperate Hash value and expires from the hash returned from the user
  let [hashValue, expires] = hash.split(".");
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) {
    return {
      success: false,
      message: "OTP has expired",
    };
  }
  // Calculate new hash with the same key and the same algorithm
  let data = `${email}.${otp}.${expires}`;
  let newCalculatedHash = crypto
    .createHmac("sha256", process.env.SECRET)
    .update(data)
    .digest("hex");
  // Match the hashes
  if (newCalculatedHash !== hashValue) {
    return {
      success: false,
      message: "Invalid OTP",
    };
  }

  return {
    success: true,
  };
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Sign New User Up
// route   POST /api/user/signup
// access  Public
const signUp = async (req, res) => {
  console.log("/api/user/signup Body......", req.body);
  const { firstName, lastName, email, password, otp, hash } = req.body;

  if (
    !firstName.trim() ||
    !lastName.trim() ||
    !email.trim() ||
    !password.trim() ||
    !otp.trim() ||
    !hash.trim()
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
  const otpVerificationResult = verifyOtp(email, otp, hash);
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

  res.status(200).json({
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
const login = async (req, res) => {
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
      expiresIn: "1d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  existingUser.password = undefined;

  res.status(200).json({
    success: true,
    message: "User Logged In Successfully",
    data: {
      user: existingUser,
    },
  });
};

export { sendOtp, signUp, login };
