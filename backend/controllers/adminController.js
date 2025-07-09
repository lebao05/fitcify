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

// Get all pending artist verification requests
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

// Approve an artist request by ID
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

// Reject an artist request by ID
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

// Suspend an artist account
const suspendArtist = async (req, res, next) => {
  try {
    const result = await adminService.suspendArtist(
      req.params.id,
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

// Activate a previously suspended artist
const activateArtist = async (req, res, next) => {
  try {
    const result = await adminService.activateArtist(
      req.params.id,
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
module.exports = {
  getAllUsers,
  getAllArtistVerificationRequests,
  approveArtistRequest,
  rejectArtistRequest,
  suspendArtist,
  activateArtist,
  suspendUser,
  activateUser,
  approveSong,
  rejectSong
};