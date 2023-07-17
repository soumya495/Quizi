import { Router } from "express";
import {
  addQuizQuestion,
  attemptQuiz,
  createQuiz,
  deleteQuizQuestion,
  editQuiz,
  editQuizQuestion,
  submitQuiz,
} from "../controllers/quiz.js";
import { assignQuizAdmin, validateQuizAdmin } from "../middlewares/quiz.js";

const router = Router();

router.post("/create", assignQuizAdmin, createQuiz);
router.put("/edit/:quizId", validateQuizAdmin, editQuiz);
router.post("/add-question/:quizId", validateQuizAdmin, addQuizQuestion);
router.put(
  "/edit-question/:quizId/:questionId",
  validateQuizAdmin,
  editQuizQuestion
);
router.delete(
  "/delete-question/:quizId/:questionId",
  validateQuizAdmin,
  deleteQuizQuestion
);
router.post("/attempt/:quizId", validateQuizAdmin, attemptQuiz);
router.post("/submit/:quizId", validateQuizAdmin, submitQuiz);

export default router;
