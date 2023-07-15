import User from "../models/User.js";
import {
  uploadImageToCloudinary,
  deleteImageFromCloudinary,
} from "../utils/cloudinaryUpload.js";
import crypto from "crypto";

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Get User Profile
// route   GET /api/profile/user-details
// access  Private
export const getUserDetails = async (req, res) => {
  const user = req.user;

  user.password = undefined;

  res.status(200).json({
    success: true,
    message: "User Profile Fetched Successfully",
    data: {
      user,
    },
  });
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Update User Profile
// route   PUT /api/profile/update-user-details
// access  Private
export const updateUserDetails = async (req, res) => {
  const user = req.user;

  const allowedFields = ["firstName", "lastName", "password"];
  const fieldsToUpdate = {};

  let errorOccurred = false; // Flag to track if an error response has been sent

  // Extract only the allowed fields from the request body
  Object.keys(req.body).forEach((field) => {
    if (allowedFields.includes(field)) {
      let updatedValue = req.body[field];
      // handle password update
      if (field === "password") {
        // check if old password is provided
        const oldPassword = req.body?.oldPassword;
        if (!oldPassword) {
          errorOccurred = true;
          return res.status(400).json({
            success: false,
            message: "Old Password is required",
          });
        }
        // check if old password is correct
        const oldHashedPassword = crypto
          .createHmac("sha256", process.env.SECRET)
          .update(oldPassword)
          .digest("hex");
        if (oldHashedPassword !== user.password) {
          errorOccurred = true;
          return res.status(400).json({
            success: false,
            message: "Old Password is incorrect",
          });
        }
        // hash new password
        updatedValue = crypto
          .createHmac("sha256", process.env.SECRET)
          .update(updatedValue)
          .digest("hex");
      }
      fieldsToUpdate[field] = updatedValue;
    }
  });

  if (!errorOccurred) {
    try {
      // Update user details
      await User.findByIdAndUpdate(user._id, {
        $set: fieldsToUpdate,
      });

      return res.status(200).json({
        success: true,
        message: "User Details Updated Successfully",
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Upload User Profile Picture
// route   PUT /api/profile/upload-profile-picture
// access  Private
export const uploadProfilePicture = async (req, res) => {
  const user = req.user;

  if (user?.profileImage?.secure_url) {
    try {
      // Remove file from cloudinary
      await deleteImageFromCloudinary(user.profileImage?.public_id);
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Something went wrong",
      });
    }
  }

  const profilePicture = req.files?.profileImage;

  if (!profilePicture) {
    return res.status(400).json({
      success: false,
      message: "Profile Picture is required",
    });
  }

  // Check if file is an image
  if (!profilePicture.mimetype.startsWith("image")) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image file",
    });
  }

  // Check if file size is less than 1MB
  if (profilePicture.size > 1024 * 1024) {
    return res.status(400).json({
      success: false,
      message: "Please upload an image less than 1MB",
    });
  }

  try {
    // Upload file to cloudinary
    const profileImage = await uploadImageToCloudinary(
      profilePicture,
      `${user._id}/Profile`
    );

    // Update user profile picture
    user.profileImage = {
      secure_url: profileImage.secure_url,
      public_id: profileImage.public_id,
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Picture Uploaded Successfully",
    });
  } catch (error) {
    console.log("Error Uploading Profile Picture", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Remove User Profile Picture
// route   PUT /api/profile/remove-profile-picture
// access  Private
export const removeProfilePicture = async (req, res) => {
  const user = req.user;

  try {
    // Remove file from cloudinary
    await deleteImageFromCloudinary(user.profileImage?.public_id);

    // Update user profile picture
    user.profileImage = undefined;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile Picture Removed Successfully",
    });
  } catch (error) {
    console.log("Error Removing Profile Picture", error);
    return res.status(500).json({
      success: false,
      message: "Something went wrong",
    });
  }
};

// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
// * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
// - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -

// @desc   Log User Out
// route   POST /api/profile/logout
// access  Private
export const logout = async (req, res) => {
  res.clearCookie("token");
  // clear otpToken cookie if exists
  res.clearCookie("otpToken");
  res.status(200).json({
    success: true,
    message: "User Logged Out Successfully",
  });
};
