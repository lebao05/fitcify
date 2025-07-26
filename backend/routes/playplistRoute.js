// backend/routes/playlistRoute.js
const express = require('express');
const router = express.Router();

const { authMiddleware } = require('../middlewares/authMiddleware');
const playlistController = require('../controllers/playplistController');

const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

router.use(authMiddleware);

router.post(
  '/',
  upload.single('cover'),    
  playlistController.createPlaylist
);

router.patch(
  '/:playlistId',
  upload.single('cover'),
  playlistController.updatePlaylistDetails
);

router.post('/:playlistId/songs', playlistController.addSongToPlaylist);

router.delete('/:playlistId/songs/:songId', playlistController.removeSongFromPlaylist);

router.delete('/:playlistId', playlistController.deletePlaylist);

module.exports = router;
