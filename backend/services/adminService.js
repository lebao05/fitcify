const User = require("../models/user");
const ArtistProfile = require("../models/artistProfile");
const ArtistVerificationRequest = require("../models/artistVerification");

async function getVerificationRequests() {
  const requests = await ArtistVerificationRequest.find({ status: "pending" })
    .populate("userId", "username email role")
    .sort({ submittedAt: -1 });

  return {
    status: 200,
    message: "Fetched pending verification requests successfully",
    data: requests,
  };
}

async function approveArtistRequest(requestID) {
  const request = await ArtistVerificationRequest.findById(requestID);

  if (!request) {
    return {
      status: 404,
      message: "Verification request not found",
    };
  }

  if (request.status === "approved") {
    return {
      status: 409,
      message: "This request has already been approved.",
    };
  }

  const user = await User.findById(request.userId);

  if (!user || user.role !== "artist") {
    await request.deleteOne(); // cleanup invalid request
    return {
      status: 400,
      message: "User not found or not an artist. Request deleted.",
    };
  }

  const artistProfile = await ArtistProfile.findOne({ userId: user._id });

  if (!artistProfile) {
    return {
      status: 404,
      message: "Artist profile not found. Cannot approve.",
    };
  }

  // Approve the request
  request.status = "approved";
  request.processedAt = new Date();
  await request.save();

  // Update artist profile
  artistProfile.isVerified = true;
  artistProfile.verificationRequestDate = new Date();
  await artistProfile.save();

  // Optionally update user as well
  user.isVerified = true;
  await user.save();

  return {
    status: 200,
    message: "Artist verified and profile updated successfully.",
    data: {
      requestId: request._id,
      artistId: user._id,
      username: user.username,
    },
  };
}

async function rejectArtistRequest(requestId, adminId, notes = "") {
  const request = await ArtistVerificationRequest.findById(requestId);

  if (!request) {
    return {
      status: 404,
      message: "Verification request not found.",
    };
  }

  if (request.status === "rejected") {
    return {
      status: 409,
      message: "This request has already been rejected.",
    };
  }

  if (request.status === "approved") {
    return {
      status: 400,
      message: "Cannot reject a request that has already been approved.",
    };
  }

  const user = await User.findById(request.userId);
  if (!user) {
    await request.deleteOne(); // Cleanup invalid request
    return {
      status: 404,
      message: "User not found. Request deleted.",
    };
  }

  // Cập nhật request
  request.status = "rejected";
  request.processedAt = new Date();
  request.processedBy = adminId;
  if (notes) request.notes = notes;

  await request.save();

  return {
    status: 200,
    message: "Verification request rejected successfully.",
    data: {
      requestId: request._id,
      rejectedBy: adminId,
      userId: user._id,
    },
  };
}

async function suspendUser(userId, reason, adminId) {
  const user = await User.findById(userId);

  if (!user) {
    return {
      status: 404,
      message: `${userId} not found`,
    };
  }

  if (user.isSuspended) {
    return {
      status: 409,
      message: `${userId} is already suspended.`,
    };
  }

  user.isSuspended = true;
  user.suspensionReason = reason;
  user.suspendedBy = adminId;
  user.suspendedAt = new Date();
  await user.save();

  return {
    status: 200,
    message: `${userId} suspended successfully.`,
    data: {
      userId: user._id,
      reason,
    },
  };
}

async function activateUser(userId, adminId) {
  const user = await User.findById(userId);

  if (!user) {
    return {
      status: 404,
      message: `${userId} not found`,
    };
  }

  if (!user.isSuspended) {
    return {
      status: 409,
      message: `${userId} is not currently suspended.`,
    };
  }

  user.isSuspended = false;
  user.suspendedBy = null;
  user.suspensionReason = null;
  user.suspendedAt = null;
  await user.save();

  return {
    status: 200,
    message: `${userId} reactivated successfully.`,
    
    data: {
      userId: user._id,
    },
  };
}
  


  module.exports = {
    getVerificationRequests,
    approveArtistRequest,
    rejectArtistRequest,
    suspendUser,
    activateUser,
  };
