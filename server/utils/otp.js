import otpGenerator from "otp-generator";
import { decryptData, encryptData } from "./decodeEncode.js";

// Create 6 digit OTP
// Generates a otp token and returns otp and otp token
export const createOtp = (email, type) => {
  // Generate a 6 digit numeric OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });
  // 5 minutes in miliseconds
  const ttl = 5 * 60 * 1000;
  //timestamp to 5 minutes in the future
  const expires = Date.now() + ttl;
  // email.otp.expiry_timestamp
  const data = {
    email,
    otp,
    expires,
    type,
  };
  // Create a base64 encoded string
  const otpToken = encryptData(JSON.stringify(data));

  return {
    otp,
    otpToken,
  };
};

// @desc   Verify OTP function
export const verifyOtp = (otpToken, userEmail, userOtp, userType) => {
  // Decrypt the base64 encoded string
  const { email, otp, expires, type } = JSON.parse(decryptData(otpToken));
  // Check if expiry time has passed
  let now = Date.now();
  if (now > parseInt(expires)) {
    return {
      success: false,
      message: "OTP has expired",
    };
  }
  // Check if OTPs match
  if (userEmail !== email || userOtp !== otp || userType !== type) {
    return {
      success: false,
      message: "Invalid Otp",
    };
  }

  return {
    success: true,
  };
};
