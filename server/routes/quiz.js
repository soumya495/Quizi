import { Router } from "express";
import {
  addQuizQuestion,
  attemptQuiz,
  createQuiz,
  deleteQuizQuestion,
  editQuiz,
  editQuizQuestion,
  submitQuiz,
} from "../controllers/quiz";

const router = Router();

router.post("/create", createQuiz);
router.put("/edit/:quizId", editQuiz);
router.post("/add-question/:quizId", addQuizQuestion);
router.put("/edit-question/:quizId/:questionId", editQuizQuestion);
router.delete("/delete-question/:quizId/:questionId", deleteQuizQuestion);
router.post("/attempt/:quizId", attemptQuiz);
router.post("/submit/:quizId", submitQuiz);

export default router;
