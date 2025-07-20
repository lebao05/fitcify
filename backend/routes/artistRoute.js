const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const { authMiddleware, isArtist } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);

router.post("/verification-request",isArtist, artistController.submitArtistVerification);

router.post(
    "/songs",
    isArtist,
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  artistController.uploadSong
);

router.patch(
    "/songs/:id",
    isArtist,
  upload.fields([{ name: "audio", maxCount: 1 }, { name: "image", maxCount: 1 }]),
  artistController.updateSong
);

router.delete("/songs/:songId",isArtist, artistController.deleteSong);
router.get("/songs", isArtist, artistController.getAllSongs);
router.get("/songs/:id", isArtist, artistController.getSongById);

module.exports = router;
