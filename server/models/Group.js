import mongoose from "mongoose";
import { nanoid } from "nanoid";

const GroupSchema = new mongoose.Schema(
  {
    joiningLink: {
      type: String,
      required: true,
      unique: true,
      default: nanoid(10),
    },
    groupName: {
      type: String,
      required: true,
      trim: true,
    },
    groupDescription: {
      type: String,
      required: true,
      trim: true,
    },
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    groupMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    requestedMembers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupProfileImage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Group", GroupSchema);
