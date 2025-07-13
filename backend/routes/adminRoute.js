const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

// Authenticate and authorize
router.use(authMiddleware);
router.use(isAdmin);

// User management
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/activate", adminController.activateUser);

// Artist verification flows
router.get(
  "/verification-requests",
  adminController.getAllArtistVerificationRequests
);
router.patch(
  "/verification-requests/:id/approve",
  adminController.approveArtistRequest
);
router.patch(
  "/verification-requests/:id/reject",
  adminController.rejectArtistRequest
);

// Artist account suspension/activation
router.patch("/artists/:userId/suspend", adminController.suspendArtist);
router.patch("/artists/:userId/activate", adminController.activateArtist);

// Song approval/rejection
router.get('/songs', adminController.getAllSongs);
router.post('/songs/:songId/approve', adminController.approveSong);
router.post('/songs/:songId/reject', adminController.rejectSong);

// Content verification approval/rejection
router.get(
  '/content-verifications',
  adminController.getContentVerificationRequests
);
router.post(
  '/content-verifications/:requestId/approve',
  adminController.approveContentVerification
);
router.post(
  '/content-verifications/:requestId/reject',
  adminController.rejectContentVerification
);


module.exports = router;
