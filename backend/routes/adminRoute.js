const express = require("express");
const router = express.Router();
const adminController = require("../controllers/adminController");
const { authMiddleware, isAdmin } = require("../middlewares/authMiddleware");

router.use(authMiddleware);
router.use(isAdmin);

/* Users */
router.get("/users", adminController.getAllUsers);


/* Verification Requests */
router.get("/verification-requests", adminController.getAllArtistVerificationRequests);
router.patch("/verification-requests/:id/approve", adminController.approveArtistRequest);
router.patch("/verification-requests/:id/reject", adminController.rejectArtistRequest);

/* Artists */
router.patch("/artists/:userId/suspend", adminController.suspendArtist);
router.patch("/artists/:userId/activate", adminController.activateArtist); 


module.exports = router;
