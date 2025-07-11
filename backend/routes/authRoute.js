// routes/authRoutes.js
const express = require("express");
const passport = require("passport");
const authCtrl = require("../controllers/authController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const router = express.Router();

/* email/password */
router.post("/signup", authCtrl.signup);
router.post("/login", authCtrl.login);
router.post("/logout", authCtrl.logout);

/* OTP */
router.post("/otp/login/send", authCtrl.sendLoginOtp);
router.post("/otp/login/verify", authCtrl.verifyLoginOtp);
router.post("/otp/forgot/send", authCtrl.sendForgotOtp);
router.post("/otp/forgot/verify", authCtrl.verifyForgotOtp);

/* password change */
router.post("/change-password", authCtrl.changePassword);
router.post("/check-user-exists", authCtrl.checkEmailExists);
router.get("/google", authCtrl.googleInit); // start Google login
router.get("/google/callback", authCtrl.googleCallback); // handle callback

/* Facebook OAuth */

router.get("/facebook", authCtrl.facebookInit);
router.get("/facebook/callback", authCtrl.facebookCallback);

/* protected example */
router.get("/me", authMiddleware, authCtrl.requireAuth, (req, res) =>
  res.json({ Error: 0, Message: "Authenticated", Data: { user: req.user } })
);

module.exports = router;
