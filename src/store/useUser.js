import { create } from "zustand";

const getLocalUser = () => {
  const isLoggedInLocal = localStorage.getItem("auth");
  if (!isLoggedInLocal) return false;
  const isLoggedIn = JSON.parse(localStorage.getItem("auth"));
  if (typeof isLoggedIn === "boolean") return isLoggedIn;
  return false;
};

const setLocalUser = (data) => {
  localStorage.setItem("auth", JSON.stringify(data));
};

export const useUser = create((set) => ({
  otpType: null, // store either signup or forgot-password
  payload: null, // store either signup data or forgot password data
  isAuthenticated: getLocalUser(),
  setOtpType: (data) => set({ otpType: data }),
  setPayload: (data) => set({ payload: data }),
  setIsAuthenticated: (data) => {
    setLocalUser(data);
    set({ isAuthenticated: data });
  },
}));
