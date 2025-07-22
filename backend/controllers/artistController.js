const artistService = require("../services/artistService");

const submitArtistVerification = async (req, res, next) => {
  try {
    const result = await artistService.submitArtistVerificationRequest(
      req.user._id,
      req.body.notes || null
    );
    res.status(200).json({
      Message: "Verification request submitted",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const uploadSong = async (req, res, next) => {
  try {
    const { title, albumId } = req.body;
    const audioPath = req.files?.audio?.[0]?.path;
    const imagePath = req.files?.image?.[0]?.path || null;

    if (!title || !audioPath) {
      return res.status(400).json({
        Message: "Missing required fields (title, audio)",
        Error: 1,
        Data: null,
      });
    }

    const result = await artistService.uploadSong({
      artistUserId: req.user._id,
      title,
      albumId,
      audioPath,
      imagePath,
    });

    res.status(200).json({
      Message: "Song uploaded successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateSong = async (req, res, next) => {
  try {
    const { title, albumId } = req.body;
    const audioPath = req.files?.audio?.[0]?.path || null;
    const imagePath = req.files?.image?.[0]?.path || null;

    const result = await artistService.updateSong(req.params.id, req.user._id, {
      title,
      albumId,
      audioPath,
      imagePath,
    });

    res.status(200).json({
      Message: "Song updated successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const result = await artistService.deleteSong(
      req.params.songId,
      req.user._id
    );
    res.status(200).json({
      Message: "Song deleted successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const album = await artistService.getAlbumById(albumId);
    res.status(200).json({
      Message: "Get album by id successfully",
      Error: 0,
      Data: album,
    });
  } catch (err) {
    next(err);
  }
};

const getAlbumsByArtist = async (req, res, next) => {
  try {
    const artistUserId = req.user._id;
    const albums = await artistService.getAlbumsByArtist(artistUserId);
    res.json({ success: true, data: albums });
  } catch (err) {
    next(err);
  }
};

const createAlbum = async (req, res, next) => {
  try {
    const { title, releaseDate, description, songIds } = req.body;
    const coverImagePath = req.files?.coverImage?.[0]?.path || null;
    const album = await artistService.createAlbum({
      artistUserId: req.user._id,
      title,
      coverImagePath,
      releaseDate,
      description,
      songIds: songIds,
    });
    res.status(200).json({
      Message: "Album created successfully",
      Error: 0,
      Data: album,
    });
  } catch (err) {
    next(err);
  }
};

const deleteAlbum = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const result = await artistService.deleteAlbum({
      artistUserId: req.user._id,
      albumId,
    });
    res.status(200).json({
      Message: "Album deleted successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updateAlbumMetadata = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { title, description, releaseDate, songIds } = req.body;
    const coverImagePath = req.files?.coverImage?.[0]?.path || null;
    const updated = await artistService.updateAlbumMetadata({
      artistUserId: req.user._id,
      albumId,
      title,
      description,
      releaseDate,
      coverImagePath,
      songIds,
    });
    res.status(200).json({
      Message: "Album metadata updated successfully",
      Error: 0,
      Data: updated,
    });
  } catch (err) {
    next(err);
  }
};

const getPlaylistById = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const playlist = await artistService.getPlaylistById(playlistId);
    res.status(200).json({
      Message: "Get playlist by id successfully",
      Error: 0,
      Data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

const getPlaylistsByArtist = async (req, res, next) => {
  try {
    const artistUserId = req.user._id;
    const playlists = await artistService.getPlaylistsByArtist(artistUserId);
    res.status(200).json({
      Message: "Get playlists successfully",
      Error: 0,
      Data: playlists,
    });
  } catch (err) {
    next(err);
  }
};

const createPlaylist = async (req, res, next) => {
  try {
    const { name, description, songIds } = req.body;
    const coverImagePath = req.files?.coverImage?.[0]?.path || null;
    const playlist = await artistService.createPlaylist({
      artistUserId: req.user._id,
      name,
      coverImagePath,
      description,
      songIds,
    });
    res.status(200).json({
      Message: "Playlist created successfully",
      Error: 0,
      Data: playlist,
    });
  } catch (err) {
    next(err);
  }
};

const deletePlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const result = await artistService.deletePlaylist({
      artistUserId: req.user._id,
      playlistId,
    });
    res.status(200).json({
      Message: "Playlist deleted successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const updatePlaylistMetadata = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { name, description, songIds } = req.body;
    const coverImagePath = req.files?.coverImage?.[0]?.path || null;
    const updated = await artistService.updatePlaylistMetadata({
      artistUserId: req.user._id,
      playlistId,
      name,
      description,
      coverImagePath,
      songIds,
    });
    res.status(200).json({
      Message: "Playlist metadata updated successfully",
      Error: 0,
      Data: updated,
    });
  } catch (err) {
    next(err);
  }
};


module.exports = {
  submitArtistVerification,
  uploadSong,
  updateSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  updateAlbumMetadata,
  getAlbumsByArtist,
  getAlbumById,
  getPlaylistsByArtist,
  createPlaylist,
  deletePlaylist,
  updatePlaylistMetadata,
  getPlaylistById,
};
