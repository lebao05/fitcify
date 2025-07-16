const userService = require("../services/userSevice");

// Lấy thông tin hồ sơ
const getProfileInfo = async (req, res, next) => {
  try {
    const { id } = req.params; // Extract user ID from route parameter
    const data = await userService.getProfileInfo(id);
    res.status(200).json({
      Message: "Profile fetched",
      Error: 0,
      Data: data,
    });
  } catch (err) {
    next(err);
  }
};
const getMyProfile = async (req, res, next) => {
  try {
    const id = req.user._id; // Extract user ID from route parameter
    const data = await userService.getProfileInfo(id);
    res.status(200).json({
      Message: "Profile fetched",
      Error: 0,
      Data: data,
    });
  } catch (err) {
    next(err);
  }
};
// Danh sách nghệ sĩ đã follow
const getFollowedArtists = async (req, res, next) => {
  try {
    const data = await userService.getFollowedArtists(req.user._id);
    res.status(200).json({ Message: "Artists fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

// Cập-nhật username / avatar
const updateProfileInfo = async (req, res, next) => {
  try {
    const data = await userService.updateProfileInfo(
      req.user._id,
      req.body,
      req.file
    );
    res.status(200).json({ Message: "Profile updated", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

// Xoá avatar
const deleteProfileAvatar = async (req, res, next) => {
  try {
    await userService.deleteProfileAvatar(req.user._id);
    res.status(200).json({ Message: "Avatar deleted", Error: 0, Data: "" });
  } catch (err) {
    next(err);
  }
};

// Thông tin tài khoản
const getAccountInfo = async (req, res, next) => {
  try {
    const data = await userService.getAccountInfo(req.user._id);
    res.status(200).json({ Message: "Account fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

// Cập-nhật email / giới tính / DOB
const updateAccountInfo = async (req, res, next) => {
  try {
    const data = await userService.updateAccountInfo(req.user._id, req.body);
    res.status(200).json({ Message: "Account updated", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProfileInfo,
  getFollowedArtists,
  updateProfileInfo,
  deleteProfileAvatar,
  getAccountInfo,
  updateAccountInfo,
  getMyProfile,
};
