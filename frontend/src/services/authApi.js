// src/api/authApi.js
import axiosInstance from "../configs/axios";

/* ───── Email / Password ───── */
export const signup = async (formData) => {
  const res = await axiosInstance.post("/auth/signup", formData);
  return res.data;
};

export const login = async (formData) => {
  const res = await axiosInstance.post("/auth/login", formData);
  return res.data;
};

export const logout = async () => {
  const res = await axiosInstance.post("/auth/logout");
  return res.data;
};

/* ───── OTP ───── */
export const sendLoginOtp = async (email) => {
  const res = await axiosInstance.post("/auth/otp/login/send", { email });
  return res.data;
};

export const verifyLoginOtp = async (formData) => {
  const res = await axiosInstance.post("/auth/otp/login/verify", formData);
  return res.data;
};

export const sendForgotOtp = async (email) => {
  const res = await axiosInstance.post("/auth/otp/forgot/send", { email });
  return res.data;
};

export const verifyForgotOtp = async (email, otp) => {
  const res = await axiosInstance.post("/auth/otp/forgot/verify", {
    email,
    otp,
  });
  return res.data;
};

/* ───── Password ───── */
export const changePassword = async (email, newPassword) => {
  const res = await axiosInstance.post("/auth/change-password", {
    email,
    newPassword,
  });
  return res.data;
};

/* ───── OAuth URLs ───── */
// utils/oauth.js

export const getGoogleOAuthUrl = (redirectUrl, failureUrl) => {
  const red = encodeURIComponent(btoa(redirectUrl));
  const fail = encodeURIComponent(btoa(failureUrl));
  return `${axiosInstance.defaults.baseURL}/auth/google?redirect=${red}&fail=${fail}`;
};

export const getFacebookOAuthUrl = (redirectUrl, failureUrl) => {
  const red = encodeURIComponent(btoa(redirectUrl));
  const fail = encodeURIComponent(btoa(failureUrl));
  return `${axiosInstance.defaults.baseURL}/auth/facebook?redirect=${red}&fail=${fail}`;
};

/* ───── Protected ───── */
export const getMe = async () => {
  const res = await axiosInstance.get("/auth/me");
  return res.data;
};
