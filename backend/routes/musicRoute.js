const express = require("express");
const router = express.Router();
const {
  streamingAudio,
  toggleSongLikeController,
  getLikedTracksController,
} = require("../controllers/musicController");
const { authMiddleware } = require("../middlewares/authMiddleware");
const musicController = require("../controllers/musicController");
router.get("/songs/:id/stream", streamingAudio);
router.post(
  "/songs/:songId/toggle-like",
  authMiddleware,
  toggleSongLikeController
);
router.get("/songs/liked", authMiddleware, getLikedTracksController);

router.get("/albums/:albumId", musicController.getAlbumById);

router.get("/artists/:artistId/albums", musicController.getAlbumsOfAnArtist);

router.post(
  "/play/album/:albumId",
  authMiddleware,
  musicController.playAnAlbumController
);

router.post(
  "/play/playlist/:playlistId",
  authMiddleware,
  musicController.playAPlaylist
);

router.post(
  "/play/artist/:artistId",
  authMiddleware,
  musicController.playAnArtistController
);

router.post("/previous", authMiddleware, musicController.previousTrack);
router.post("/play-song", authMiddleware, musicController.playASong);
router.post("/next", authMiddleware, musicController.nextTrack);

router.get('/top/songs', musicController.getTopSongs);
module.exports = router;
