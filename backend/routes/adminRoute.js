const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.use(authMiddleware);

router.get("/users", isAdmin, adminController.getAllUsers);
router.get("/verification-requests", isAdmin, adminController.getAllArtistVerificationRequests);
router.patch("/verification-requests/:id/approve", isAdmin, adminController.approveArtistRequest);
router.patch("/verification-requests/:id/reject", isAdmin, adminController.rejectArtistRequest);

router.patch("/artists/:userId/suspend", isAdmin, adminController.suspendArtist);
router.patch("/artists/:userId/activate", isAdmin, adminController.activateArtist);


module.exports = router;
