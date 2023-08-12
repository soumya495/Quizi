import { create } from "zustand";

export const useQuiz = create((set) => ({
  quizDetails: {},
  questions: [],
  previewQuestion: {},
  totalPages: 1,
  currentPage: 1,
  setQuizDetails: (data) => set({ quizDetails: data }),
  setQuestions: (data) => set({ questions: data }),
  setPreviewQuestion: (data) => set({ previewQuestion: data }),
  setTotalPages: (data) => set({ totalPages: data }),
  setCurrentPage: (data) => set({ currentPage: data }),
}));
