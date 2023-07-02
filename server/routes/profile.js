import { Router } from "express";
import {
  getUserDetails,
  updateUserDetails,
  uploadProfilePicture,
  removeProfilePicture,
  logout,
} from "../controllers/profile.js";

const router = Router();

router.get("/user-details", getUserDetails);
router.put("/update-user-details", updateUserDetails);
router.put("/upload-profile-picture", uploadProfilePicture);
router.put("/remove-profile-picture", removeProfilePicture);
router.post("/logout", logout);

export default router;
