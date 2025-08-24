require("dotenv").config();
const passport = require("passport");
const authService = require("../services/authService");

/* ───── Cookie Options ───── */
const cookieOpts = (req) => {
  const isProd = process.env.BUILD_MODE === "PRODUCTION";
  return {
    httpOnly: true,
    secure: isProd, 
    sameSite: isProd ? "None" : "Lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  };
};
/* ───── Base64 encode/decode helpers ───── */
const encodeRedirect = (redirect, fail) =>
  Buffer.from(JSON.stringify({ redirect, fail })).toString("base64");

const decodeRedirect = (state) => {
  try {
    return JSON.parse(Buffer.from(state, "base64").toString("utf8"));
  } catch {
    return {};
  }
};

/* ───── Email / Password ───── */
exports.checkEmailExists = async (req, res, next) => {
  try {
    const user = await authService.checkUserExists(req.body.email);
    res.json({ Error: 0, Message: "Email exists" });
  } catch (err) {
    next(err);
  }
};

exports.signup = async (req, res, next) => {
  try {
    const { user, token } = await authService.signUpWithEmail(req.body);
    authService.setCookie(res, "accessToken", token, cookieOpts(req));
    res
      .status(201)
      .json({ Error: 0, Message: "Signup success", Data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { user, accessToken } = await authService.loginWithEmailPassword(
      req.body
    );
    authService.setCookie(res, "accessToken", accessToken, cookieOpts(req));
    res.json({ Error: 0, Message: "Login success", Data: { user } });
  } catch (err) {
    next(err);
  }
};

/* ───── OTP ───── */
exports.sendLoginOtp = async (req, res, next) => {
  try {
    await authService.sendOtpForLogin(req.body.email);
    res.json({ Error: 0, Message: "OTP sent" });
  } catch (err) {
    next(err);
  }
};

exports.verifyLoginOtp = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    const { user, token } = await authService.verifyLoginOtp(email, otp);
    authService.setCookie(res, "accessToken", token, cookieOpts(req));
    res.json({ Error: 0, Message: "Logged in with OTP", Data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.sendForgotOtp = async (req, res, next) => {
  try {
    await authService.sendOtpForForgotPassword(req.body.email);
    res.json({ Error: 0, Message: "OTP sent" });
  } catch (err) {
    next(err);
  }
};

exports.verifyForgotOtp = async (req, res, next) => {
  try {
    const { user, accessToken } = await authService.verifyForgotOtp(
      req.body.email,
      req.body.otp
    );
    authService.setCookie(res, "accessToken", accessToken, cookieOpts(req));
    res.json({ Error: 0, Message: "OTP verified", Data: { user } });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    await authService.changePassword(req.body.email, req.body.newPassword);
    res.json({ Error: 0, Message: "Password changed" });
  } catch (err) {
    next(err);
  }
};

/* ───── Logout ───── */
exports.logout = (req, res) => {
  const isProd = process.env.BUILD_MODE === "PRODUCTION";

  res.cookie("accessToken", "", {
    httpOnly: true,
    secure: isProd, // true only in production
    sameSite: isProd ? "None" : "Lax", // None for prod, Lax for dev
    path: "/", // same path as original cookie
    maxAge: 0, // expire immediately
  });

  // Passport logout
  req.logout(() => {
    res.json({ Error: 0, Message: "Logged out" });
  });
};

/* ───── Google OAuth ───── */
exports.googleInit = (req, res, next) => {
  const redirect = Buffer.from(
    decodeURIComponent(req.query.redirect || ""),
    "base64"
  ).toString("utf8");
  const fail = Buffer.from(
    decodeURIComponent(req.query.failureUrl || ""),
    "base64"
  ).toString("utf8");
  const state = encodeRedirect(redirect, fail);

  passport.authenticate("google", {
    scope: ["profile", "email"],
    accessType: "offline",
    prompt: "consent",
    state,
  })(req, res, next);
};

exports.googleCallback = (req, res, next) => {
  const { redirect, fail } = decodeRedirect(req.query.state);
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) {
      console.log(err);
      return res.redirect(fail);
    }

    const token = authService.generateAccessToken({
      id: user._id,
      role: user.role,
      username: user.username,
    });

    authService.setCookie(res, "accessToken", token, cookieOpts(req));
    console.log(redirect);
    res.redirect(redirect);
  })(req, res, next);
};

/* ───── Facebook OAuth ───── */
exports.facebookInit = (req, res, next) => {
  const redirect = Buffer.from(
    decodeURIComponent(req.query.redirect || ""),
    "base64"
  ).toString("utf8");
  const fail = Buffer.from(
    decodeURIComponent(req.query.failureUrl || ""),
    "base64"
  ).toString("utf8");
  const state = encodeRedirect(redirect, fail);

  passport.authenticate("facebook", {
    scope: ["email", "public_profile"],
    state,
  })(req, res, next);
};

exports.facebookCallback = (req, res, next) => {
  const { redirect, fail } = decodeRedirect(req.query.state);

  passport.authenticate("facebook", { session: false }, (err, user) => {
    if (err || !user) {
      return res.redirect(fail);
    }

    const token = authService.generateAccessToken({
      id: user._id,
      role: user.role,
      username: user.username,
    });

    authService.setCookie(res, "accessToken", token, cookieOpts(req));
    res.redirect(redirect);
  })(req, res, next);
};

/* ───── Auth Guard ───── */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token) {
    return res.status(401).json({ Error: 1, Message: "Not authenticated" });
  }

  try {
    req.user = authService.isAuthenticated(token);
    next();
  } catch {
    res.status(401).json({ Error: 1, Message: "Invalid / expired token" });
  }
};
