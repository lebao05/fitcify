const User = require('../models/user');
const ArtistProfile = require('../models/artistProfile');
const ArtistVerificationRequest = require('../models/artistVerification');

const getAllUsers = async () => {
  return await User.find();
};

const getVerificationRequests = async () => {
  return await ArtistVerificationRequest.find({ status: 'pending' });
};

const processVerificationRequest = async (requestId, decision, adminId, reason = null) => {
  const request = await ArtistVerificationRequest.findById(requestId).populate('userId');
  if (!request) throw new Error("Verification request not found");

  const userId = request.userId._id;

  request.status = decision;
  request.processedAt = new Date();
  request.processedBy = adminId;
  request.notes = reason;
  await request.save();

  const user = await User.findById(userId);
  if (!user) throw new Error("User associated with this request not found");

  if (decision === 'approved') {
    user.isVerified = true;
    user.role = 'artist';

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
    ...request.toObject(),
    userId: user.toObject(),
  };
};

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

module.exports = {
  getAllUsers,
  getVerificationRequests,
  processVerificationRequest,
  suspendArtist,
  activateArtist,
};
