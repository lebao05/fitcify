const User = require('../models/user');
const ArtistProfile = require('../models/artistProfile');
const ArtistVerificationRequest = require('../models/artistVerification');
const Song = require('../models/song');
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

const getVerificationRequests = async () =>
  ArtistVerificationRequest.find({ status: 'pending' })
    .populate('userId');

const processVerificationRequest = async (
  requestId,
  decision,     // "approved" | "rejected"
  adminId,
  reason = null
) => {
  const request = await ArtistVerificationRequest.findById(requestId).populate('userId');
  if (!request) {
    return {
      message: "Verification request not found",
      error: 1,
      data: null,
    };
  }

  const userId = request.userId._id;

  request.status = decision;
  request.processedAt = new Date();
  request.processedBy = adminId;
  request.notes = reason;
  await request.save();

  const user = await User.findById(userId);
  if (!user) {
    return {
      message: "User associated with this request not found",
      error: 1,
      data: null,
    };
  }

  if (decision === 'approved') {
    user.isVerified = true;
    user.role = 'artist';

    // Create or update artist profile
    let profile = await ArtistProfile.findOne({ userId });
    if (!profile) {
      profile = await ArtistProfile.create({
        userId,
        isVerified: true,
        verificationRequestDate: new Date()
      });
    } else {
      profile.isVerified = true;
      await profile.save();
    }

    if (!user.artistProfile || !user.artistProfile.equals(profile._id)) {
      user.artistProfile = profile._id;
    }

  } else if (decision === 'rejected') {
    user.isVerified = false;
    user.role = 'user';

    const profile = await ArtistProfile.findOne({ userId });
    if (profile && profile.isVerified) {
      profile.isVerified = false;
      await profile.save();
    }
  }

  await user.save();

  return {
    message: decision === "approved"
      ? "Artist approved successfully"
      : "Artist verification request rejected",
    error: 0,
    data: {
      ...request.toObject(),
      userId: user.toObject(), 
    }
  };

};

/* ───────── moderation: suspend / activate ───────── */

const suspendArtist = async (userId, adminId) => {
  try {
    const artist = await ArtistProfile.findOneAndUpdate(
      { userId },
      {
        isBanned: true,
        bannedBy: adminId,
        bannedAt: new Date()
      },
      { new: true }
    );
    return artist;
  } catch (err) {
    throw err;
  }
};

const activateArtist = async (userId, adminId) => {
  try {
    const artist = await ArtistProfile.findOneAndUpdate(
      { userId },
      {
        isBanned: false,
        bannedBy: null,
        bannedAt: null
      },
      { new: true }
    );
    return artist;
  } catch (err) {
    throw err;
  }
};

async function approveSong(songId, adminId) {
  const song = await Song.findById(songId);
  if (!song) throw new Error('Song not found');
  song.isApproved = true;
  // song.approvedAt = new Date();
  // song.approvedBy = adminId;
  return await song.save();
}

async function rejectSong(songId, adminId, reason = '') {
  const song = await Song.findById(songId);
  if (!song) throw new Error('Song not found');
  song.isApproved = false;
  // song.rejectionReason = reason;
  // song.rejectedAt = new Date();
  // song.rejectedBy = adminId;
  return await song.save();
}

module.exports = {
  getAllUsers,
  getVerificationRequests,
  processVerificationRequest,
  suspendArtist,
  activateArtist,
  suspendUser,
  activateUser,
  approveSong,
  rejectSong
};