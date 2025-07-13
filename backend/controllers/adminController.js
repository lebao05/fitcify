const adminService = require("../services/adminService");
const getAllUsers = async (req, res, next) => {
  try {
    const users = await adminService.getAllUsers();
    res.status(200).json({
      Message: "Users fetched successfully",
      Error: 0,
      Data: users,
    });
  } catch (err) {
    next(err);
  }
};

const getAllArtistVerificationRequests = async (req, res, next) => {
  try {
    const result = await adminService.getVerificationRequests();
    res.status(200).json({
      Message: "Verification requests fetched successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const approveArtistRequest = async (req, res, next) => {
  try {
    const result = await adminService.processVerificationRequest(
      req.params.id,
      "approved",
      req.user._id
    );
    res.status(200).json({
      Message: "Artist approved successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const rejectArtistRequest = async (req, res, next) => {
  try {
    const result = await adminService.processVerificationRequest(
      req.params.id,
      "rejected",
      req.user._id,
      req.body.reason
    );
    res.status(200).json({
      Message: "Artist request rejected",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const suspendArtist = async (req, res, next) => {
  try {
    const result = await adminService.suspendArtist(
      req.params.userId,
      req.user._id
    );
    res.status(200).json({
      Message: "Artist suspended successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const activateArtist = async (req, res, next) => {
  try {
    const result = await adminService.activateArtist(
      req.params.userId,
      req.user._id
    );
    res.status(200).json({
      Message: "Artist activated successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

const suspendUser = async (req, res, next) => {
  try {
    const result = await adminService.suspendUser(
      req.params.id,
      req.user._id,
      req.body.reason
    );
    res.status(200).json({
      Message: "User suspended successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

// Activate a previously suspended user
const activateUser = async (req, res, next) => {
  try {
    const result = await adminService.activateUser(req.params.id, req.user._id);
    res.status(200).json({
      Message: "User activated successfully",
      Error: 0,
      Data: result,
    });
  } catch (err) {
    next(err);
  }
};

async function getAllSongs(req, res, next) {
  try {
    const songs = await adminService.getAllSongs();
    res.status(200).json({
      Error: 0,
      Message: 'Songs fetched successfully',
      Data: songs
    });
  } catch (err) {
    next(err);
  }
}

async function approveSong(req, res, next) {
  try {
    const song = await adminService.approveSong(req.params.songId, req.user._id);
    res.json({ Message: 'Song approved', Error: 0, Data: song });
  } catch (err) {
    next(err);
  }
}

async function rejectSong(req, res, next) {
  try {
    const reason = req.body.reason || '';
    const song = await adminService.rejectSong(req.params.songId, req.user._id, reason);
    res.json({ Message: 'Song rejected', Error: 0, Data: song });
  } catch (err) {
    next(err);
  }
}

exports.getContentVerificationRequests = async (req, res, next) => {
  try {
    const requests = await adminService.getContentVerificationRequests();
    res.status(200).json({
      Error: 0,
      Message: 'Verification requests fetched',
      Data: requests
    });
  } catch (err) {
    next(err);
  }
};

exports.approveContentVerification = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const adminId = req.user.id;
    const updated = await adminService.approveContentVerification(requestId, adminId);
    res.status(200).json({
      Error: 0,
      Message: 'Verification request approved',
      Data: updated
    });
  } catch (err) {
    next(err);
  }
};

exports.rejectContentVerification = async (req, res, next) => {
  try {
    const { requestId } = req.params;
    const adminId = req.user.id;
    const notes = req.body.notes || '';
    const updated = await adminService.rejectContentVerification(requestId, adminId, notes);
    res.status(200).json({
      Error: 0,
      Message: 'Verification request rejected',
      Data: updated
    });
  } catch (err) {
    next(err);
  }
};

async function getContentVerificationRequests(req, res, next) {
  try {
    const requests = await adminService.getContentVerificationRequests();
    res.status(200).json({
      Error: 0,
      Message: 'Verification requests fetched',
      Data: requests
    });
  } catch (err) {
    next(err);
  }
}

async function approveContentVerification(req, res, next) {
  try {
    const { requestId } = req.params;
    const adminId = req.user._id;
    const updated = await adminService.approveContentVerification(
      requestId,
      adminId
    );
    res.status(200).json({
      Error: 0,
      Message: 'Verification request approved',
      Data: updated
    });
  } catch (err) {
    next(err);
  }
}

async function rejectContentVerification(req, res, next) {
  try {
    const { requestId } = req.params;
    const adminId = req.user._id;
    const notes = req.body.notes || '';
    const updated = await adminService.rejectContentVerification(
      requestId,
      adminId,
      notes
    );
    res.status(200).json({
      Error: 0,
      Message: 'Verification request rejected',
      Data: updated
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getAllArtistVerificationRequests,
  approveArtistRequest,
  rejectArtistRequest,
  suspendArtist,
  activateArtist,
  suspendUser,
  activateUser,
  getAllSongs,
  approveSong,
  rejectSong,
  getContentVerificationRequests,
  approveContentVerification,
  rejectContentVerification
};