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

module.exports = {
  getAllUsers,
  suspendUser,
  activateUser,
};