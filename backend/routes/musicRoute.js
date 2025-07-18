// routes/songRoutes.js
const express = require('express');
const router = express.Router();
const { toggleSongLikeController } = require('../controllers/musicController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/songs/:songId/toggle-like', authMiddleware, toggleSongLikeController);

module.exports = router;
