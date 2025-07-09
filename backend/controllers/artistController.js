const artistService = require('../services/artistService');
async function createSong(req, res, next) {
  try {
    const userId = req.user._id;
    const data = req.body;
    const song = await artistService.createSong(userId, data);
    res.status(201).json({ message: 'Song submitted for approval', Error: 0, data: song });
  } catch (err) {
    next(err);
  }
}

async function listMySongs(req, res, next) {
  try {
    const userId = req.user._id;
    const songs = await artistService.getMySongs(userId);
    res.json({ message: 'My songs fetched', Error: 0, data: songs });
   } catch (err) {
    next(err);
  }
}

module.exports = { createSong, listMySongs };