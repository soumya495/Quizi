import mongoose from "mongoose";

const OptionSchema = new mongoose.Schema(
  {
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Question",
      required: true,
    },
    option: {
      type: String,
      required: true,
      trim: true,
    },
    optionImage: {
      type: String,
    },
    correct: {
      type: Boolean,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Option", OptionSchema);
