import mongoose from "mongoose";

const QuestionSchema = new mongoose.Schema(
  {
    quizId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Quiz",
      required: true,
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    questionImage: {
      type: String,
    },
    questionType: {
      type: String,
      required: true,
      trim: true,
      enum: ["Single Correct", "Multiple Correct"],
    },
    options: {
      type: [
        {
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
      ],
      required: true,
    },
    points: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Question", QuestionSchema);
