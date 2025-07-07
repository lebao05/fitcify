const {
  getVerificationRequests,
  approveArtistRequest,
  rejectArtistRequest,
  suspendUser,
  activateUser,
} = require("../services/adminService");

const getAllVerificationRequests = async (req, res) => {
  const result = await getVerificationRequests();
  return res.status(result.status).json({
    message: result.message,
    data: result.data || null,
  });
};

const approveArtist = async (req, res) => {
  const { requestId } = req.params;
  const result = await approveArtistRequest(requestId);
  return res.status(result.status).json({
    message: result.message,
    data: result.data || null,
  });
};

const rejectArtist = async (req, res) => {
  const { requestId } = req.params;
  const { notes } = req.body;
  const adminId = req.user._id;

  const result = await rejectArtistRequest(requestId, adminId, notes);
  return res.status(result.status).json({
    message: result.message,
    data: result.data || null,
  });
};

const suspendUserController = async (req, res) => {
  const { userId } = req.params;
  const { reason } = req.body;
  const adminId = req.user._id;

  const result = await suspendUser(userId, reason, adminId);
  return res.status(result.status).json({
    message: result.message,
    data: result.data || null,
  });
};

const activateUserController = async (req, res) => {
  const { userId } = req.params;
  const adminId = req.user._id;

  const result = await activateUser(userId, adminId);
  return res.status(result.status).json({
    message: result.message,
    data: result.data || null,
  });
};

module.exports = {
  getAllVerificationRequests,
  approveArtist,
  rejectArtist,
  suspendUserController,
  activateUserController,
};
