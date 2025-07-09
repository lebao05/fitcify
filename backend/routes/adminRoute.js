// routes/admin.routes.js
const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { isAdmin } = require("../middlewares/authMiddleware");
router.use(isAdmin);
router.get("/users", adminController.getAllUsers);
router.patch("/users/:id/suspend", adminController.suspendUser);
router.patch("/users/:id/activate", adminController.activateUser);
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
router.patch("/artists/:userId/suspend", adminController.suspendArtist);
router.patch("/artists/:userIdid/activate", adminController.activateArtist);
router.post('/songs/:songId/approve', adminController.approveSong);
router.post('/songs/:songId/reject', adminController.rejectSong);

module.exports = router;
