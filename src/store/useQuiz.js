import { create } from "zustand";

export const useQuiz = create((set) => ({
  quizDetails: {},
  questions: [],
  previewQuestion: {},
  setQuizDetails: (data) => set({ quizDetails: data }),
  setQuestions: (data) => set({ questions: data }),
  setPreviewQuestion: (data) => set({ previewQuestion: data }),
}));
