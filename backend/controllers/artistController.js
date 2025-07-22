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

const getSongById = async (req, res, next) => {
  try {
    const result = await artistService.getSongById(req.params.id, req.user._id);
    res.status(200).json({
      Message: "Song fetched successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const getAllSongs = async (req, res, next) => {
  try {
    const result = await artistService.getAllSongs(req.user._id);
    res.status(200).json({
      Message: "All songs fetched successfully",
      Error: 0,
      Data: result,
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
  getSongById,
  getAllSongs
};
