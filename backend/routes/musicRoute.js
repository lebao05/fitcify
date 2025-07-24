const express = require("express");
const router = express.Router();
const { streamingAudio, toggleSongLikeController, getLikedTracksController } = require("../controllers/musicController");
const { authMiddleware } = require('../middlewares/authMiddleware');

router.get("/songs/:id/stream", streamingAudio);
router.post('/songs/:songId/toggle-like', authMiddleware, toggleSongLikeController);
router.get('/songs/liked', authMiddleware, getLikedTracksController);


router.get('/albums/:albumId', musicController.getAlbumById);

router.get('/artists/:artistId/albums', musicController.getAlbumsOfAnArtist);
module.exports = router;