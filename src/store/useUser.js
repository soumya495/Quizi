import { create } from "zustand";

export const useUser = create((set) => ({
  signupData: null,
  setSignupData: (data) => set({ signupData: data }),
}));
