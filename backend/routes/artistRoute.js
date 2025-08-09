const express = require("express");
const router = express.Router();
const artistController = require("../controllers/artistController");
const { authMiddleware, isArtist } = require("../middlewares/authMiddleware");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
router.post(
  "/verification-request",
  authMiddleware,
  isArtist,
  artistController.submitArtistVerification
);

router.post(
  "/songs",
  authMiddleware,
  isArtist,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  artistController.uploadSong
);

router.put(
  "/songs/:id",
  authMiddleware,
  isArtist,
  upload.fields([
    { name: "audio", maxCount: 1 },
    { name: "image", maxCount: 1 },
  ]),
  artistController.updateSong
);

router.get(
  "/albums/me",
  authMiddleware,
  isArtist,
  artistController.getAlbumsByArtist
);
router.get("/albums/:albumId", isArtist, artistController.getAlbumById);

router.post(
  "/albums",
  authMiddleware,
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.createAlbum
);

router.put(
  "/albums/:albumId",
  authMiddleware,
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.updateAlbumMetadata
);

router.get(
  "/playlists/me",
  authMiddleware,
  isArtist,
  artistController.getPlaylistsByArtist
);
router.get(
  "/playlists/:playlistId",
  authMiddleware,
  isArtist,
  artistController.getPlaylistById
);

router.post(
  "/playlists",
  authMiddleware,
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.createPlaylist
);

router.put(
  "/playlists/:playlistId",
  authMiddleware,
  isArtist,
  upload.fields([{ name: "coverImage", maxCount: 1 }]),
  artistController.updatePlaylistMetadata
);

router.delete(
  "/songs/:songId",
  authMiddleware,
  isArtist,
  artistController.deleteSong
);
router.delete(
  "/albums/:albumId",
  authMiddleware,
  isArtist,
  artistController.deleteAlbum
);
router.delete(
  "/playlists/:playlistId",
  authMiddleware,
  isArtist,
  artistController.deletePlaylist
);
router.get("/songs", authMiddleware, isArtist, artistController.getAllSongs);
router.get("/songs/:id", artistController.getSongById);

// View own profile
router.get(
  "/profile",
  authMiddleware,
  isArtist,
  artistController.getMyProfileById
);
// Edit own profile
router.put(
  "/profile",
  authMiddleware,
  isArtist,
  artistController.editMyProfile
);
router.put(
  "/profile/update-albums",
  isArtist,
  artistController.updateAlbumsInArtistProfile
);

router.get("/:artistId", artistController.getPublicArtistProfile); ///

module.exports = router;
