const express = require("express");
const router = express.Router();
const {
  getAllVerificationRequests,
  approveArtist,
  rejectArtist,
  suspendUserController,
  activateUserController,
} = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.get(
  "/admin/verification-requests",
  authMiddleware,
  isAdmin,
  getAllVerificationRequests
);

router.post(
  "/admin/verification-requests/:requestId/approve",
  authMiddleware,
  isAdmin,
  approveArtist
);

router.post(
  "/admin/verification-requests/:requestId/reject",
  authMiddleware,
  isAdmin,
  rejectArtist
);

router.post(
  "/admin/users/:userId/suspend",
  authMiddleware,
  isAdmin,
  suspendUserController
);

router.post(
  "/admin/users/:userId/activate",
  authMiddleware,
  isAdmin,
  activateUserController
);

module.exports = router;
