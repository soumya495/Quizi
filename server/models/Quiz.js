import mongoose from "mongoose";

const QuizSchema = new mongoose.Schema(
  {
    quizAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "adminModel",
      required: true,
    },
    adminModel: {
      type: String,
      required: true,
      enum: ["User", "Group"],
    },
    quizName: {
      type: String,
      required: true,
      trim: true,
    },
    quizDescription: {
      type: String,
      required: true,
      trim: true,
    },
    quizDuration: {
      type: Number,
      required: true,
    },
    quizTopic: {
      type: String,
      required: true,
    },
    quizType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Public", "Private"],
    },
    quizStatus: {
      type: String,
      required: true,
      trim: true,
      enum: ["Draft", "Published"],
    },
    quizQuestions: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Question",
      },
    ],
    attemptedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    submittedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Quiz", QuizSchema);
