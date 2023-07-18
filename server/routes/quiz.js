import { Router } from "express";
import {
  createQuiz,
  getCreatedQuizzes,
  getQuizDetails,
  editQuiz,
  addQuizQuestion,
  editQuizQuestion,
  uploadQuestionImage,
  deleteQuizQuestion,
  deleteQuestionImage,
  attemptQuiz,
  submitQuiz,
} from "../controllers/quiz.js";
import { assignQuizAdmin, validateQuizAdmin } from "../middlewares/quiz.js";

const router = Router();

router.post("/create", assignQuizAdmin, createQuiz);
router.get("/created-quizzes", getCreatedQuizzes);
router.get("/quiz-details/:quizId", validateQuizAdmin, getQuizDetails);
router.put("/edit/:quizId", validateQuizAdmin, editQuiz);
router.post("/add-question/:quizId", validateQuizAdmin, addQuizQuestion);
router.put(
  "/edit-question/:quizId/:questionId",
  validateQuizAdmin,
  editQuizQuestion
);
router.put(
  "/upload-question-image/:quizId/:questionId",
  validateQuizAdmin,
  uploadQuestionImage
);
router.delete(
  "/remove-question-image/:quizId/:questionId",
  validateQuizAdmin,
  deleteQuestionImage
);
router.delete(
  "/delete-question/:quizId/:questionId",
  validateQuizAdmin,
  deleteQuizQuestion
);
router.post("/attempt/:quizId", validateQuizAdmin, attemptQuiz);
router.post("/submit/:quizId", validateQuizAdmin, submitQuiz);

export default router;
