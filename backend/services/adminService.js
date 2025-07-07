// services/adminService.js
const User = require('../models/user');
const ArtistProfile = require('../models/artistProfile');
const ArtistVerificationRequest = require('../models/artistVerification');

const getAllUsers = async () => User.find();

const getVerificationRequests = async () =>
  ArtistVerificationRequest.find({ status: 'pending' })
    .populate('userId');


const processVerificationRequest = async (
  requestId,
  decision,   
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


module.exports = {
  getAllUsers,
  getVerificationRequests,
  processVerificationRequest,
  suspendArtist,
  activateArtist,
};