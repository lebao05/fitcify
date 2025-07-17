const express = require('express');
const router = express.Router();
const musicController = require('../controllers/musicController');
const { authMiddleware } = require('../middlewares/authMiddleware');

router.post('/like/:songId', authMiddleware, musicController.toggleSongLike);
router.get('/stream-url/:songId', authMiddleware, musicController.getAudioStreamUrl);
router.post('/queue/add/:songId', authMiddleware, musicController.addToQueue);
router.post('/queue/skip', authMiddleware, musicController.skipToNext);
router.get('/queue', authMiddleware, musicController.getQueue);
router.post('/repeat/toggle', authMiddleware, musicController.toggleRepeatMode);

module.exports = router;
