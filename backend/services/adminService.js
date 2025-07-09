const User = require('../models/user');
const ArtistProfile = require('../models/artistProfile');
const ArtistVerificationRequest = require('../models/artistVerificationRequest');
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
  decision,      // 'approve' | 'reject'
  adminId,
  reason = null
) => {
  const req = await ArtistVerificationRequest.findById(requestId);
  if (!req) throw new Error('Verification request not found');

  req.status = decision;
  req.processedAt = new Date();
  req.processedBy = adminId;
  req.notes = reason;
  await req.save();

  if (decision === 'approve') {
    const user = await User.findByIdAndUpdate(
      req.userId,
      { isVerified: true, role: 'artist' },
      { new: true }
    );

    let profile = await ArtistProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await ArtistProfile.create({ userId: user._id, isVerified: true });
    } else if (!profile.isVerified) {
      profile.isVerified = true;
      await profile.save();
    }

    if (!user.artistProfile || !user.artistProfile.equals(profile._id)) {
      user.artistProfile = profile._id;
      await user.save();
    }
  }

  return req;
};

/* ───────── moderation: suspend / activate ───────── */

const suspendArtist = async (userId, adminId) => {
  try {
    const user = await ArtistProfile.findOneAndUpdate(
      { userId },
      {
        isbaned: true,
        bannedBy: adminId,
        bannedAt: new Date()
      }, { new: true }
    );
    return user
  } catch (err) {
    throw err;
  }
};

const activateArtist = async (userId, adminId) => {
  try {
    const user = await ArtistProfile.findOneAndUpdate(
      { userId },
      {
        isbaned: false,
      }, { new: true } // ← return the *updated* doc

    );
    return user;
  }
  catch (err) {
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