const BASE_URL = import.meta.env.VITE_BASE_URL;

// User APIs
export const SIGNUP = `${BASE_URL}/user/signup`;
export const LOGIN = `${BASE_URL}/user/login`;
export const SEND_OTP = `${BASE_URL}/user/send-otp`;
export const FORGOT_PASSWORD = `${BASE_URL}/user/forgot-password`;

// Profile APIs
export const GET_USER = `${BASE_URL}/profile/user-details`;
export const UPDATE_USER = `${BASE_URL}/profile/update-user-details`;
export const UPLOAD_PROFILE_PIC = `${BASE_URL}/profile/upload-profile-picture`;
export const REMOVE_PROFILE_PIC = `${BASE_URL}/profile/remove-profile-picture`;
export const LOGOUT = `${BASE_URL}/profile/logout`;

// Quiz APIs
export const CREATE_QUIZ = `${BASE_URL}/quiz/create`;
