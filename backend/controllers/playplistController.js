// backend/controllers/playlistController.js
const playlistService = require("../services/playplistService");

const createPlaylist = async (req, res, next) => {
  try {
    const data = await playlistService.createPlaylist(
      req.user._id,
      req.body,
      req.file
    );
    res.status(200).json({ Message: "Playlist created", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const updatePlaylistDetails = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const data = await playlistService.updatePlaylistDetails(
      playlistId,
      req.user._id,
      req.body,
      req.file
    );
    res.status(200).json({ Message: "Playlist updated", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const addSongToPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songId } = req.body;
    const data = await playlistService.addSongToPlaylist(
      playlistId,
      req.user._id,
      songId
    );
    res.status(200).json({ Message: "Song added", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const removeSongFromPlaylist = async (req, res, next) => {
  try {
    const { playlistId, songId } = req.params;
    const data = await playlistService.removeSongFromPlaylist(
      playlistId,
      req.user._id,
      songId
    );
    res.status(200).json({ Message: "Song removed", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const data = await playlistService.deletePlaylist(playlistId, req.user._id);
    res.status(200).json({ Message: "Playlist deleted", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};
const getUserPlaylists = async (req, res, next) => {
  try {
    const data = await playlistService.getUserPlaylists(req.user._id);
    res
      .status(200)
      .json({ Message: "Playlists fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};
const getUserPlaylistsOfAUser = async (req, res, next) => {
  try {
    const data = await playlistService.getUserPlaylists(req.params.userId);
    res
      .status(200)
      .json({ Message: "Playlists fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};
const getPlaylistById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const data = await playlistService.getPlaylistById(playlistId);
    res.status(200).json({ Message: "Playlist fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  getUserPlaylistsOfAUser,
  createPlaylist,
  updatePlaylistDetails,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getUserPlaylists,
  getPlaylistById,
};
