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
const getAllUsers = async (req, res, next) => {
  try {
    const users = await userService.getAllUsers();
    res.status(200).json({
      Message: "Users fetched",
      Error: 0,
      Data: users,
    });
  } catch (err) {
    next(err);
  }
};
const getMyProfile = async (req, res, next) => {
  try {
    const id = req.user._id; 
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
const followArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const data = await userService.followArtist(req.user._id, artistId);
    res.status(200).json({ Message: 'Followed artist', Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const unfollowArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const data = await userService.unfollowArtist(req.user._id, artistId);
    res.status(200).json({ Message: 'Unfollowed artist', Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};


async function topSongsThisMonth(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await userService.topSongThisMonth(limit);
    res.status(200).json({ Error: 0, Message: 'Top songs this month', Data: data });
  } catch (err) {
    next(err);
  }
}

async function topArtistsThisMonth(req, res, next) {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await userService.topArtistThisMonth(limit);
    res.status(200).json({ Error: 0, Message: 'Top artists this month', Data: data });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getProfileInfo,
  getFollowedArtists,
  updateProfileInfo,
  deleteProfileAvatar,
  getAccountInfo,
  updateAccountInfo,
  getMyProfile,
  followArtist,
  unfollowArtist,
  topSongsThisMonth,
  topArtistsThisMonth,
};
