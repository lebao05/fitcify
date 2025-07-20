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

router.get("/albums/me", isArtist, artistController.getAlbumsByArtist);

router.post(
  "/albums",
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.createAlbum
);

router.patch(
  "/albums/:albumId",
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.updateAlbumMetadata
);

router.get("/playlists/me", isArtist, artistController.getPlaylistsByArtist);

router.post(
  "/playlists",
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.createPlaylist
);

router.patch(
  "/playlists/:playlistId",
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.updatePlaylistMetadata
);

router.delete("/songs/:songId",isArtist, artistController.deleteSong);
router.delete("/albums/:albumId", isArtist, artistController.deleteAlbum);
router.delete("/playlists/:playlistId", isArtist, artistController.deletePlaylist);

module.exports = router;
