const User = require('../models/user');
const mongoose = require('mongoose');
const ArtistProfile = require('../models/artistProfile');
const ArtistVerificationRequest = require('../models/artistVerification');
const ContentVerificationRequest = require('../models/contentVerification');
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

const getAllUsers = async () => {
  return await User.find();
};

const getVerificationRequests = async () => {
  return await ArtistVerificationRequest.find({ status: 'pending' });
};

async function processVerificationRequest(requestId, decision, adminId, reason = '') {
  if (!mongoose.isValidObjectId(requestId)) throw new Error('Invalid request ID');
  const req = await ArtistVerificationRequest.findById(requestId);
  if (!req) throw new Error('Verification request not found');

  req.status = decision;
  req.processedBy = adminId;
  req.processedAt = new Date();
  if (decision === 'rejected') {
    req.rejectionReason = reason;
    req.rejectedAt = new Date();
  }

  // Update user and profile
  const user = await User.findById(req.userId);
  if (!user) throw new Error('User not found');
  if (decision === 'approved') {
    user.isVerified = true;
    user.role = 'artist';
    let profile = await ArtistProfile.findOne({ userId: user._id });
    if (!profile) {
      profile = await ArtistProfile.create({ userId: user._id, isVerified: true, verificationRequestDate: new Date() });
    } else {
      profile.isVerified = true;
      await profile.save();
    }
    user.artistProfile = profile._id;
  } else {
    user.isVerified = false;
    user.role = 'user';
    const profile = await ArtistProfile.findOne({ userId: user._id });
    if (profile && profile.isVerified) {
      profile.isVerified = false;
      await profile.save();
    }
  }
  await user.save();

  return await req.save();
}

/* ───────── moderation: suspend / activate ───────── */

const suspendArtist = async (userId, adminId) => {
  const artist = await ArtistProfile.findOneAndUpdate(
    { userId },
    {
      isBanned: true,
      bannedBy: adminId,
      bannedAt: new Date()
    },
    { new: true }
  );
  if (!artist) throw new Error("Artist profile not found");
  return artist;
};

const activateArtist = async (userId, adminId) => {
  const artist = await ArtistProfile.findOneAndUpdate(
    { userId },
    {
      isBanned: false,
      bannedBy: null,
      bannedAt: null
    },
    { new: true }
  );
  if (!artist) throw new Error("Artist profile not found");
  return artist;
};

async function getAllSongs() {
  return await Song.find().sort({ createdAt: -1 });
}

async function approveSong(songId, adminId) {
  if (!mongoose.isValidObjectId(songId)) throw new Error('Invalid song ID');
  const song = await Song.findById(songId);
  if (!song) throw new Error('Song not found');
  song.isApproved = true;
  song.approvedBy = adminId;
  song.approvedAt = new Date();
  return await song.save();
}

async function rejectSong(songId, adminId, reason = '') {
  if (!mongoose.isValidObjectId(songId)) throw new Error('Invalid song ID');
  const song = await Song.findById(songId);
  if (!song) throw new Error('Song not found');
  song.isApproved = false;
  song.rejectedBy = adminId;
  song.rejectionReason = reason;
  song.rejectedAt = new Date();
  return await song.save();
}

async function getContentVerificationRequests(statusFilter) {
  const filter = {};
  if (statusFilter) filter.status = statusFilter;
  return await ContentVerificationRequest.find(filter)
    .select('objectId artistId type status submittedAt processedAt processedBy rejectionReason rejectedAt')
    .populate({ path: 'artistId', model: 'User', select: 'username email' })
    .populate({ path: 'processedBy', model: 'User', select: 'username email' });
}

async function approveContentVerification(requestId, adminId) {
  if (!mongoose.isValidObjectId(requestId)) throw new Error('Invalid request ID');
  const req = await ContentVerificationRequest.findById(requestId);
  if (!req) throw new Error('Verification request not found');
  req.status = 'approved';
  req.processedBy = adminId;
  req.processedAt = new Date();
  return await req.save();
}

async function rejectContentVerification(requestId, adminId, notes = '') {
  if (!mongoose.isValidObjectId(requestId)) throw new Error('Invalid request ID');
  const req = await ContentVerificationRequest.findById(requestId);
  if (!req) throw new Error('Verification request not found');
  req.status = 'rejected';
  req.processedBy = adminId;
  req.processedAt = new Date();
  req.rejectionReason = notes;
  req.rejectedAt = new Date();
  return await req.save();
}

module.exports = {
  suspendUser,
  activateUser,
  getAllUsers,
  getVerificationRequests,
  processVerificationRequest,
  suspendArtist,
  activateArtist,
  getAllSongs,
  approveSong,
  rejectSong,
  getContentVerificationRequests,
  approveContentVerification,
  rejectContentVerification,
};

