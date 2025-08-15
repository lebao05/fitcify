// backend/routes/playlistRoute.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const playlistController = require("../controllers/playplistController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.post(
  "/",
  authMiddleware,
  upload.single("cover"),
  playlistController.createPlaylist
);

router.put(
  "/:playlistId",
  authMiddleware,
  upload.single("cover"),
  playlistController.updatePlaylistDetails
);

router.post(
  "/:playlistId/songs",
  authMiddleware,
  playlistController.addSongToPlaylist
);

router.delete(
  "/:playlistId/songs/:songId",
  authMiddleware,
  playlistController.removeSongFromPlaylist
);

router.delete(
  "/:playlistId",
  authMiddleware,
  playlistController.deletePlaylist
);

router.get("/", authMiddleware, playlistController.getUserPlaylists);
router.get("/user/:userId", playlistController.getUserPlaylistsOfAUser);
router.get("/:playlistId", playlistController.getPlaylistById);
module.exports = router;
