const express = require("express");
const router = express.Router();
const { streamingAudio, toggleSongLikeController } = require("../controllers/musicController");
const { authMiddleware } = require('../middlewares/authMiddleware');
router.get("/songs/:id/stream", streamingAudio);
router.post('/songs/:songId/toggle-like', authMiddleware, toggleSongLikeController);

module.exports = router;