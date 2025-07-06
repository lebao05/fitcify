const User = require('../models/user');
const suspendUser = async (userId, adminId, reason) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      isSuspended: true,
      suspensionReason: reason,
      processedBy: adminId,
      processedAt: new Date(),
    },
    { new: true }
  );
};

const activateUser = async (userId, adminId) => {
  return await User.findByIdAndUpdate(
    userId,
    {
      isSuspended: false,
      suspensionReason: null,
      processedBy: null,
      processedAt: null,
    },
    { new: true }
  );
};
const getAllUsers = async () => User.find();

module.exports = {
  getAllUsers,
  suspendUser,
  activateUser,
};