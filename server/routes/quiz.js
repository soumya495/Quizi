import { Router } from "express";
import {
  createQuiz,
  getCreatedQuizzes,
  getQuizDetails,
  editQuiz,
  addQuizQuestion,
  editQuizQuestion,
  deleteQuizQuestion,
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
router.delete(
  "/delete-question/:quizId/:questionId",
  validateQuizAdmin,
  deleteQuizQuestion
);

export default router;
