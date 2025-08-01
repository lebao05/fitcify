const User = require("../models/user");
const cloudinary = require("../configs/cloudinary");
const { uploadToCloudinary } = require("./cloudinaryService");
const extractCloudinaryPublicId = require("../helpers/extractPublicId");
const PlayHistory = require('../models/playHistory'); // schema should include itemType: ['song','album','playlist']
const Song = require('../models/song');
const Album = require('../models/album');
const Playlist = require('../models/playlist');
const mongoose = require("mongoose");
/** ------------------------- PUBLIC API ------------------------- **/

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
    .select("username avatarUrl")
    .sort({ _id: -1 })
    .lean();
}

async function updateProfileInfo(userId, { username }, file) {
  const updates = {};

  if (username?.trim()) updates.username = username.trim();

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
    const err = new Error('Invalid artist id');
    err.status = 400;
    throw err;
  }

  const artist = await User.findById(artistId).select('role');
  if (!artist || artist.role !== 'artist') {
    const err = new Error('Target user is not an artist');
    err.status = 404;
    throw err;
  }

  const [me, him] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { followees: artistId } },
      { new: true, select: '_id followees' }
    ),
    User.findByIdAndUpdate(
      artistId,
      { $addToSet: { followers: userId } },
      { new: true, select: '_id followers' }
    ),
  ]);

  return { userId: me._id, followees: me.followees };
};

const unfollowArtist = async (userId, artistId) => {
  if (!mongoose.isValidObjectId(artistId)) {
    const err = new Error('Invalid artist id');
    err.status = 400;
    throw err;
  }

  const [me, him] = await Promise.all([
    User.findByIdAndUpdate(
      userId,
      { $pull: { followees: artistId } },
      { new: true, select: '_id followees' }
    ),
    User.findByIdAndUpdate(
      artistId,
      { $pull: { followers: userId } },
      { new: true, select: '_id followers' }
    ),
  ]);

  return { userId: me._id, followees: me.followees };
};

async function recommendRecentlyPlayed(userId, limit = 3) {
  if (!mongoose.isValidObjectId(userId)) throw new Error('Invalid user ID');

  // Fetch recent play history sorted descending
  const history = await PlayHistory.find({ userId })
    .sort({ playedAt: -1 })
    .lean()
    .exec();

  const seen = new Set();
  const recommendations = [];

  for (const entry of history) {
    const key = `${entry.itemType}:${entry.itemId.toString()}`;
    if (seen.has(key)) continue;
    seen.add(key);

    let doc = null;
    if (entry.itemType === 'song') {
      doc = await Song.findById(entry.itemId)
        .populate('artistId', 'name')
        .lean();
    } else if (entry.itemType === 'album') {
      doc = await Album.findById(entry.itemId)
        .populate('artistId', 'name')
        .lean();
    } else if (entry.itemType === 'playlist') {
      doc = await Playlist.findById(entry.itemId)
        .populate('owner', 'username')
        .lean();
    }

    if (doc) {
      recommendations.push({
        itemType: entry.itemType,
        data: doc,
        playedAt: entry.playedAt,
      });
    }

    if (recommendations.length >= limit) break;
  }

  return recommendations;
};

async function topSongThisMonth(limit = 10) {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const startOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const pipeline = [
    {
      $match: {
        itemType: 'song',
        playedAt: { $gte: startOfMonth, $lt: startOfNextMonth },
      },
    },
    {
      $group: {
        _id: '$itemId',
        playsThisMonth: { $sum: 1 },
      },
    },
    { $sort: { playsThisMonth: -1 } },
    { $limit: limit },
    {
      $lookup: {
        from: 'songs',
        localField: '_id',
        foreignField: '_id',
        as: 'song',
      },
    },
    { $unwind: '$song' },
    {
      $lookup: {
        from: 'artistprofiles',
        localField: 'song.artistId',
        foreignField: 'userId',
        as: 'artistProfile',
      },
    },
    { $unwind: { path: '$artistProfile', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        song: {
          _id: '$song._id',
          title: '$song.title',
          audioUrl: '$song.audioUrl',
          imageUrl: '$song.imageUrl',
          duration: '$song.duration',
          playCount: '$song.playCount',
          isApproved: '$song.isApproved',
        },
        playsThisMonth: 1,
        artist: {
          userId: '$artistProfile.userId',
          isVerified: '$artistProfile.isVerified',
          bio: '$artistProfile.bio',
        },
      },
    },
  ];

  const results = await PlayHistory.aggregate(pipeline).exec();
  return results;
}


module.exports = {
  getAllUsers,
  getProfileInfo,
  getFollowedArtists,
  updateProfileInfo,
  deleteProfileAvatar,
  getAccountInfo,
  updateAccountInfo,
  followArtist,
  unfollowArtist,
  recommendRecentlyPlayed,
  topSongThisMonth
};
