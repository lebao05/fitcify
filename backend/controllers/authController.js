require("dotenv").config();
const passport = require("passport");
const authService = require("../services/authService");

/* ───── Cookie Options ───── */
const cookieOpts = (req) => ({
  remember: Boolean(req.body.remember),
  secure: process.env.NODE_ENV === "production",
});

/* ───── Helper: Determine Redirect Target ───── */
const getRedirectUrl = (req) => {
  const fromQuery = req.query.redirect || req.query.redirectUrl;
  // OPTIONAL: Add security filter to allow only trusted URLs
  // const ALLOWED = [process.env.CLIENT_URL];
  // if (fromQuery && !ALLOWED.includes(fromQuery)) return fallback;
  return fromQuery;
};
exports.checkEmailExists = async (req, res, next) => {
  try {
    const user = await authService.checkUserExists(req.body.email);
    res.json({ Error: 0, Message: "Email exists" });
  } catch (err) {
    next(err);
  }
};
/* ───── Email / Password ───── */
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
    const { user, token } = await authService.verifyLoginOtp(
      req.body.email,
      req.body.otp
    );
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
  res.clearCookie("accessToken");
  req.logout(() => res.json({ Error: 0, Message: "Logged out" }));
};
// ─── Google OAuth helpers ───
const encodeRedirect = (url) =>
  url ? Buffer.from(url).toString("base64") : undefined;

const decodeRedirect = (state) =>
  state ? Buffer.from(state, "base64").toString("utf8") : null;

const buildPassportOptions = (redirectRaw) => ({
  scope: ["profile", "email"],
  accessType: "offline",
  prompt: "consent",
  state: encodeRedirect(redirectRaw),
});

// ─── Initiate Google login ───
exports.googleInit = (req, res, next) => {
  redirectRaw = decodeRedirect(req.query.redirect);
  passport.authenticate("google", buildPassportOptions(redirectRaw))(
    req,
    res,
    next
  );
};

// ─── Handle Google callback ───
exports.googleCallback = (req, res, next) => {
  passport.authenticate("google", { session: false }, (err, user) => {
    if (err || !user) return next(err || new Error("Google auth failed"));
    const token = authService.generateAccessToken({
      id: user._id,
      role: user.role,
      username: user.username,
    });
    authService.setCookie(res, "accessToken", token, { secure: true });

    const redirect = decodeRedirect(req.query.state);
    res.redirect(redirect);
  })(req, res, next);
};

exports.facebookInit = (req, res, next) => {
  redirectRaw = decodeRedirect(req.query.redirect);
  passport.authenticate("facebook", {
    scope: ["email", "profile"],
    state: encodeRedirect(redirectRaw),
  })(req, res, next);
};
exports.facebookCallback = (req, res, next) => {
  passport.authenticate("facebook", { session: false }, (err, user) => {
    if (err || !user) return next(err || new Error("Facebook auth failed"));

    const token = authService.generateAccessToken({
      id: user._id,
      role: user.role,
      username: user.username,
    });
    authService.setCookie(res, "accessToken", token, { secure: true });
    const redirect = decodeRedirect(req.query.state);
    res.redirect(redirect);
  })(req, res, next);
};

/* ───── Auth Guard ───── */
exports.requireAuth = (req, res, next) => {
  const token = req.cookies?.accessToken;
  if (!token)
    return res.status(401).json({ Error: 1, Message: "Not authenticated" });

  try {
    req.user = authService.isAuthenticated(token);
    next();
  } catch {
    res.status(401).json({ Error: 1, Message: "Invalid / expired token" });
  }
};