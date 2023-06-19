import { Router } from "express";
import {
  acceptJoinGroup,
  createGroup,
  getGroupDetails,
  rejectJoinGroup,
  requestJoinGroup,
} from "../controllers/group.js";

const router = Router();

router.post("/create", createGroup);
router.get("/:groupId", getGroupDetails);
router.post("/join", requestJoinGroup);
router.post("/accept", acceptJoinGroup);
router.post("/reject", rejectJoinGroup);

export default router;
