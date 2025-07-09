const artistService = require("../services/artistService");


const submitArtistVerification = async (req, res, next) => {
  try {
    const result = await artistService.submitArtistVerificationRequest(
      req.user._id,
      req.body.notes || null
    );
    res.status(200).json({
      message: "Verification request submitted",
      error: 0,
      data: result,
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
        message: "Missing required fields (title, audio)",
        error: 1,
        data: null,
      });
    }

    const result = await artistService.uploadSong({
      artistUserId: req.user._id,
      title,
      albumId,
      audioPath,
      imagePath,
    });

    res.status(200).json(result);
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

    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
};

const deleteSong = async (req, res, next) => {
  try {
    const result = await artistService.deleteSong(req.params.songId, req.user._id);
    res.status(result.error ? 400 : 200).json({
      Message: result.message,
      Error: result.error,
      Data: result.data,
    });
  } catch (err) {
    next(err);
  }
};
module.exports = {
  submitArtistVerification,
  uploadSong,
  updateSong,
  deleteSong
};
