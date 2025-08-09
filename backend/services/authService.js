// services/authService.js
require("dotenv").config();
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { sendMail } = require("../services/emailService");

/* ─── JWT helpers ─── */
const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE,
  });

const isAuthenticated = (token) => jwt.verify(token, process.env.JWT_SECRET);

/* ─── cookie helper ─── */
const setCookie = (
  res,
  name,
  token,
  { remember = false, sameSite = "Lax", secure = false } = {}
) => {
  const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;
  res.cookie(name, token, { httpOnly: true, sameSite, secure, maxAge });
};
const verifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch (err) {
    throw err;
  }
};
/* ─── email / password flows ─── */
async function signUpWithEmail(body) {
  const { username, email, password, dateOfBirth, gender } = body;
  if (await User.findOne({ email })) throw new Error("Email already in use");

  const user = await User.create({
    username,
    email,
    password,
    dateOfBirth,
    gender,
    authProvider: "email",
  });

  const token = generateAccessToken({
    id: user._id,
    role: user.role,
    username: user.username,
  });
  return { user, token };
}

async function loginWithEmailPassword({ email, password }) {
  const user = await User.findOne({ email });
  if (!user || user.authProvider !== "email")
    throw new Error("Invalid credentials");

  const ok = await user.comparePassword(password);
  if (!ok) throw new Error("Invalid credentials");
  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
    username: user.username,
  });
  return { user, accessToken };
}

/* ─── OTP flows ─── */
async function sendOtpForLogin(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account with that email");

  const otp = user.generateOtp("login");
  await user.save();
  await sendMail(
    email,
    `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    "Login OTP"
  );
  return otp;
}

async function sendOtpForForgotPassword(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account with that email");

  const otp = user.generateOtp("forgot");
  await user.save();
  await sendMail(
    email,
    `<p>Your OTP is <strong>${otp}</strong>. It expires in 10 minutes.</p>`,
    "Forgot Password!"
  );
  return otp;
}

async function verifyLoginOtp(email, otp) {
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyOtp("login", otp)))
    throw new Error("Invalid or expired OTP");

  const token = generateAccessToken({
    id: user._id,
    role: user.role,
    username: user.username,
  });
  return { user, token };
}

async function verifyForgotOtp(email, otp) {
  const user = await User.findOne({ email });
  if (!user || !(await user.verifyOtp("forgot", otp)))
    throw new Error("Invalid or expired OTP");

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
    username: user.username,
  });
  return { user, accessToken };
}

async function changePassword(email, newPassword) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("User with email not found");

  user.password = newPassword; // hashed by pre‑save hook
  await user.save();
  return true;
}
async function checkUserExists(email) {
  const user = await User.findOne({ email });
  if (!user) throw new Error("No account with that email");
  return user;
}
module.exports = {
  checkUserExists,
  /* helpers */
  generateAccessToken,
  isAuthenticated,
  setCookie,

  /* email / pwd */
  signUpWithEmail,
  loginWithEmailPassword,

  /* otp */
  sendOtpForLogin,
  sendOtpForForgotPassword,
  verifyLoginOtp,
  verifyForgotOtp,

  /* misc */
  changePassword,
  verifyToken,
};
