// controllers/songController.js
const musicService = require('../services/musicService');

const toggleSongLikeController = async (req, res) => {
  const userId = req.user._id;
  const { songId } = req.params;

  if (!songId) {
    return res.status(400).json({ message: 'Missing userId or songId' });
  }

  try {
    const result = await musicService.toggleSongLike(userId, songId);
    res.status(200).json({
      message: result.liked ? 'Song liked' : 'Song unliked',
      liked: result.liked
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

module.exports = {
  toggleSongLikeController
};
