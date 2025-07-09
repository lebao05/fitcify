const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middlewares/authMiddleware');
const artistSongCtrl = require('../controllers/artistController');

router.use(authMiddleware);

router.post('/songs', artistSongCtrl.createSong);

router.get('/songs', artistSongCtrl.listMySongs);

module.exports = router;