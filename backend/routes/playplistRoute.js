// backend/routes/playlistRoute.js
const express = require("express");
const router = express.Router();

const { authMiddleware } = require("../middlewares/authMiddleware");
const playlistController = require("../controllers/playplistController");

const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.use(authMiddleware);

router.post("/", upload.single("cover"), playlistController.createPlaylist);

router.put(
  "/:playlistId",
  upload.single("cover"),
  playlistController.updatePlaylistDetails
);

router.post("/:playlistId/songs", playlistController.addSongToPlaylist);

router.delete(
  "/:playlistId/songs/:songId",
  playlistController.removeSongFromPlaylist
);

router.delete("/:playlistId", playlistController.deletePlaylist);

router.get("/", playlistController.getUserPlaylists);
router.get("/user/:userId", playlistController.getUserPlaylistsOfAUser);
router.get("/:playlistId", playlistController.getPlaylistById);
module.exports = router;
