require("dotenv").config();

const { verifyToken } = require("../services/authService");
const User = require("../models/user");
const { validObjectId } = require("../helpers/validateObjectId");
const PUBLIC_ROUTES = [
  { method: "POST", path: "/api/auth/login/password" },
  { method: "POST", path: "/api/auth/register" },
  { method: "POST", path: "/api/auth/signup-gmail" },
  { method: "POST", path: "/api/auth/send-otp" },

  { method: "GET", path: "/api/auth/google" },
  { method: "GET", path: "/api/auth/google/callback" },
  { method: "GET", path: "/api/auth/facebook" },
  { method: "GET", path: "/api/auth/facebook/callback" }

];

function isPublic(req) {
  return PUBLIC_ROUTES.some(
    (r) => r.method === req.method && r.path === req.path
  );
}
const authMiddleware = async (req, res, next) => {
  try {
    if (req.method === "OPTIONS") return res.sendStatus(200);
    if (isPublic(req)) return next();
    const token = req.cookies.accessToken;
    let payload;
    try {
      payload = verifyToken(token);
    } catch (e) {
      return res
        .status(401)
        .json({ Error: 1, Message: "Invalid or expired token" });
    }

    validObjectId(payload.id);
    const user = await User.findById(payload.id);
    if (!user) {
      return res
        .status(401)
        .json({ ER: 1, EM: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ ER: 1, EM: "Authentication error" });
  }
};
const isAdmin = async (req, res, next) => {
  if (req.user.role === "admin") next();
  else next(new Error("This is not admin"));
};
const isArtist = async (req, res, next) => {
  if (req.user.role === "artist") next();
  else next(new Error("This is not artist"));
};
module.exports = { authMiddleware, isAdmin, isArtist };
