const User = require("../models/user");
const cloudinary = require("../configs/cloudinary");
const { uploadToCloudinary } = require("./cloudinaryService");
const extractCloudinaryPublicId = require("../helpers/extractPublicId");
const Song = require('../models/song');
const ArtistProfile = require('../models/artistProfile');
const PlayHistory = require('../models/playHistory');
const mongoose = require("mongoose");
const { normalizeString } = require("../helpers/normolize");
/** ------------------------- PUBLIC API ------------------------- **/
// Lấy role của user hiện tại
async function getCurrentUserRole(userId) {
  const user = await User.findById(userId).select("role");
  if (!user) throw new Error("User not found");
  return user.role;
}

async function getProfileInfo(userId) {
  const user = await User.findById(userId).populate("followees").lean();
  if (!user) throw new Error("User not found");
  return user;
}
const getAllUsers = async () => {
  try {
    const users = await User.find().lean();
    return users;
  } catch (error) {
    throw new Error("Failed to fetch users");
  }
};

async function getFollowedArtists(userId) {
  const me = await User.findById(userId).select("followees");
  if (!me || !me.followees.length) return [];

  return User.find({ _id: { $in: me.followees }, role: "artist" })
    .select("_id username avatarUrl")
    .sort({ _id: -1 })
    .lean();
}
async function getArtistFollowers(artistId) {
  if (!mongoose.isValidObjectId(artistId)) {
    const err = new Error("Invalid artist id");
    err.status = 400;
    throw err;
  }
  const artist = await User.findById(artistId).select("followers");
  if (!artist) {
    const err = new Error("Artist not found");
    err.status = 404;
    throw err;
  }
  if (!artist.followers || !artist.followers.length) return [];
  return User.find({ _id: { $in: artist.followers } })
    .select("_id username avatarUrl")
    .sort({ _id: -1 })
    .lean();
}

async function updateProfileInfo(userId, { username }, file) {
  const updates = {};

  if (username?.trim()) {
    const trimmedUsername = username.trim();
    updates.username = trimmedUsername;
    updates.usernameNormalized = normalizeString(trimmedUsername); // ✅ add this line
  }
  /* ---------- avatar upload logic ---------- */
  if (file) {
    // Fetch the old avatar URL first before uploading
    const user = await User.findById(userId).select("avatarUrl");
    const oldUrl = user?.avatarUrl;

    // Upload new avatar to Cloudinary
    const { secure_url, public_id } = await uploadToCloudinary(
      file.path,
      "avatars"
    );

    // Delete old image from Cloudinary if it exists and is different
    if (oldUrl) {
      const oldId = extractCloudinaryPublicId(oldUrl);
      if (oldId && oldId !== public_id) {
        try {
          await cloudinary.uploader.destroy(oldId, { invalidate: true });
        } catch (error) {
          console.warn(
            "⚠️ Failed to destroy old avatar:",
            oldId,
            error.message
          );
        }
      }
    }

    updates.avatarUrl = secure_url;
  }

  /* ---------- update user ---------- */
  const me = await User.findByIdAndUpdate(userId, updates, {
    new: true,
    runValidators: true,
  });

  if (!me) throw new Error("Use not found");

  return me;
}

async function deleteProfileAvatar(userId) {
  const user = await User.findById(userId).select("avatarUrl");
  if (!user) throw new Error("Use not found");

  if (user.avatarUrl) {
    const id = extractCloudinaryPublicId(user.avatarUrl);
    if (id) await cloudinary.uploader.destroy(id, { invalidate: true });
    user.avatarUrl = "";
    await user.save();
  }
  return "";
}

async function getAccountInfo(userId) {
  const me = await User.findById(userId).select(
    "username email gender dateOfBirth"
  );
  if (!me) throw new Error("Use not found");
  return me;
}

async function updateAccountInfo(userId, payload) {
  const { email, gender, dateOfBirth } = payload;
  const updates = {};

  if (email) updates.email = email.toLowerCase().trim();
  if (["male", "female", "other"].includes(gender)) updates.gender = gender;
  if (dateOfBirth && !Number.isNaN(Date.parse(dateOfBirth)))
    updates.dateOfBirth = new Date(dateOfBirth);

  try {
    const me = await User.findByIdAndUpdate(userId, updates, {
      new: true,
      runValidators: true,
      select: "username email gender dateOfBirth",
    });
    if (!me) throw new Error("Use not found");
    return me;
  } catch (err) {
    if (err.code === 11000) throw new Error("EMAIL_DUPLICATE");
    throw err;
  }
}
const followArtist = async (userId, artistId) => {
  if (!mongoose.isValidObjectId(artistId)) {
    const err = new Error("Invalid artist id");
    err.status = 400;
    throw err;
  }

  const artist = await User.findById(artistId).select("role");
  if (!artist || artist.role !== "artist") {
    const err = new Error("Target user is not an artist");
    err.status = 404;
    throw err;
  }

  const [me, him] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { followees: artistId } },
      { new: true, select: "_id followees" }
    ),
    User.findByIdAndUpdate(
      artistId,
      { $addToSet: { followers: userId } },
      { new: true, select: "_id followers" }
    ),
  ]);

  return { userId: me._id, followees: me.followees };
};

const unfollowArtist = async (userId, artistId) => {
  if (!mongoose.isValidObjectId(artistId)) {
    const err = new Error("Invalid artist id");
    err.status = 400;
    throw err;
  }

  const [me, him] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $pull: { followees: artistId } },
      { new: true, select: "_id followees" }
    ),
    User.findByIdAndUpdate(
      artistId,
      { $pull: { followers: userId } },
      { new: true, select: "_id followers" }
    ),
  ]);

  return { userId: me._id, followees: me.followees };
};

async function topSongThisMonth(limit = 10) {
  const now          = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNext  = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const history = await PlayHistory.find({
    itemType: 'song',
    playedAt: { $gte: startOfMonth, $lt: startOfNext }
  }).lean();

  const countMap = {};
  history.forEach(({ itemId, playCount }) => {
    const key = itemId.toString();
    countMap[key] = (countMap[key] || 0) + (playCount || 0);
  });

  const topEntries = Object.entries(countMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  const results = [];
  for (const [songId, playsThisMonth] of topEntries) {
    if (!mongoose.Types.ObjectId.isValid(songId)) continue;
    const song = await Song.findById(songId)
      .select('title audioUrl imageUrl duration playCount artistId')
      .lean();
    if (!song) continue;

    const artistProfile = await ArtistProfile.findOne({ userId: song.artistId })
      .select('userId isVerified totalPlays bio')
      .lean();

    results.push({
      song: {
        _id:       song._id,
        title:     song.title,
        audioUrl:  song.audioUrl,
        imageUrl:  song.imageUrl,
        duration:  song.duration,
        playCount: song.playCount || 0
      },
      playsThisMonth,
      artist: artistProfile && {
        userId:     artistProfile.userId,
        isVerified: artistProfile.isVerified,
        totalPlays: artistProfile.totalPlays || 0,
        bio:        artistProfile.bio
      }
    });
  }

  return results;
}

async function topArtistThisMonth(limit = 10) {
  const now          = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNext  = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const history = await PlayHistory.find({
    itemType: 'artist',
    playedAt: { $gte: startOfMonth, $lt: startOfNext }
  }).lean();

  const countMap = {};
  history.forEach(({ itemId, playCount }) => {
    const key = itemId.toString();
    countMap[key] = (countMap[key] || 0) + (playCount || 0);
  });

  const topEntries = Object.entries(countMap)
    .sort(([, a], [, b]) => b - a)
    .slice(0, limit);

  const results = [];
  for (const [artistId, viewsThisMonth] of topEntries) {
    if (!mongoose.Types.ObjectId.isValid(artistId)) continue;
    const profile = await ArtistProfile.findOne({ userId: artistId })
      .select('userId isVerified totalPlays bio')
      .lean();
    if (!profile) continue;

    results.push({
      artist: {
        userId:     profile.userId,
        isVerified: profile.isVerified,
        totalPlays: profile.totalPlays || 0,
        bio:        profile.bio
      },
      viewsThisMonth
    });
  }

  return results;
}


module.exports = {
  getAllUsers,
  getProfileInfo,
  getFollowedArtists,
  getArtistFollowers,
  updateProfileInfo,
  deleteProfileAvatar,
  getAccountInfo,
  updateAccountInfo,
  followArtist,
  unfollowArtist,
  topSongThisMonth,
  topArtistThisMonth,
  getCurrentUserRole,
};
