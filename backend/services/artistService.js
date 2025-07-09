const mongoose = require("mongoose");
const User = require("../models/user");
const ArtistProfile = require("../models/artistProfile");
const ArtistVerificationRequest = require("../models/artistVerification");
const Song = require("../models/song");
const ContentVerificationRequest = require("../models/contentVerification");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const cloudinary = require("../configs/cloudinary");
const mm = require("music-metadata");
const extractCloudinaryPublicId = require("../helpers/extractPublicId");

const submitArtistVerificationRequest = async (userId, notes = null) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  if (user.role == "artist")
    throw new Error("User is already a verified artist");

  // 3️⃣ Block duplicate pending requests
  const duplicate = await ArtistVerificationRequest.findOne({
    userId,
    status: "pending",
  });
  if (duplicate) throw new Error("A pending request already exists");
  const request = await ArtistVerificationRequest.create({
    userId,
    notes,
    status: "pending",
    submittedAt: new Date(),
  });

  return request;
};

async function uploadSong({
  artistUserId,
  title,
  audioPath,
  imagePath = null,
  albumId = null,
}) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist")
    return {
      message: "Only verified artists can upload songs",
      error: 1,
      data: null,
    };

  const duration = await getAudioDuration(audioPath);

  const audioRes = await uploadToCloudinary(audioPath, "/fitcify/songs", {
    resource_type: "video"
  });

  let imageUrl = "";
  if (imagePath) {
    const imgRes = await uploadToCloudinary(imagePath, "/fitcify/song-covers", {
      resource_type : "image"
    });
    imageUrl = imgRes.secure_url;
  }

  const validAlbumId = mongoose.Types.ObjectId.isValid(albumId)
    ? albumId
    : null;

  const song = await Song.create({
    title,
    duration,
    artistId: artistUserId,
    albumId: validAlbumId,
    audioUrl: audioRes.secure_url,
    imageUrl,
    isApproved: false,
  });

  await ArtistProfile.findOneAndUpdate(
    { userId: artistUserId },
    { $push: { songs: song._id } },
    { new: true, upsert: true }
  );

  await ContentVerificationRequest.create({
    objectId: song._id,
    artistId: artistUserId,
    type: "Song",
    status: "pending",
  });

  return {
    message: "Song uploaded successfully. Waiting for admin approval.",
    error: 0,
    data: song,
  };
}

async function getAudioDuration(filePath) {
  const metadata = await mm.parseFile(filePath);
  return Math.round(metadata.format.duration);
}

async function updateSong(
  songId,
  artistUserId,
  { title, albumId = null, audioPath = null, imagePath = null }
) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") {
    return {
      message: "Only verified artists can update songs",
      error: 1,
      data: null,
    };
  }

  const song = await Song.findById(songId);
  if (!song) {
    return {
      message: "Song not found",
      error: 1,
      data: null,
    };
  }

  if (!song.artistId.equals(artistUserId)) {
    return {
      message: "You do not have permission to modify this song",
      error: 1,
      data: null,
    };
  }

  const existingPending = await ContentVerificationRequest.findOne({
    objectId: song._id.toString(),
    type: "Song",
    status: "pending",
  }).lean();

  if (existingPending) {
    return {
      message:
        "This song is already under review. You can't update it until approved or rejected.",
      error: 1,
      data: null,
    };
  }

  const updates = {};
  if (title) updates.title = title;
  if (albumId && mongoose.Types.ObjectId.isValid(albumId)) {
    updates.albumId = albumId;
  }

  let assetReplaced = false;

  if (audioPath) {
    const oldAudioId = extractCloudinaryPublicId(song.audioUrl);
    if (oldAudioId) {
      await cloudinary.uploader.destroy(oldAudioId, { resource_type: "video" });
    }

    const audioRes = await uploadToCloudinary(audioPath, "fitcify/songs", {
      resource_type: "video",
    });

    const newDuration = await getAudioDuration(audioPath);
    updates.audioUrl = audioRes.secure_url;
    updates.duration = newDuration;
    assetReplaced = true;
  }

  if (imagePath) {
    const oldImgId = extractCloudinaryPublicId(song.imageUrl);
    if (oldImgId) {
      await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
    }

    const imgRes = await uploadToCloudinary(imagePath, "fitcify/song-covers", {
      resource_type: "image",
    });

    updates.imageUrl = imgRes.secure_url;
    assetReplaced = true;
  }

  if (assetReplaced) {
    updates.isApproved = false;

    await ContentVerificationRequest.create({
      objectId: song._id,
      artistId: artistUserId,
      type: "Song",
      status: "pending",
    });
  }

  const updatedSong = await Song.findByIdAndUpdate(songId, updates, {
    new: true,
  });

  return {
    message: "Song updated successfully",
    error: 0,
    data: updatedSong,
  };
}

async function deleteSong(songId, artistUserId) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") {
    return {
      message: "Only verified artists can delete songs",
      error: 1,
      data: null,
    };
  }

  const song = await Song.findById(songId);
  if (!song) {
    return {
      message: "Song not found",
      error: 1,
      data: null,
    };
  }

  if (!song.artistId.equals(artistUserId)) {
    return {
      message: "You do not have permission to delete this song",
      error: 1,
      data: null,
    };
  }

  const oldAudioId = extractCloudinaryPublicId(song.audioUrl);
  if (oldAudioId) {
    await cloudinary.uploader.destroy(oldAudioId, { resource_type: "video" });
  }

  const oldImgId = extractCloudinaryPublicId(song.imageUrl);
  if (oldImgId) {
    await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
  }

  await ArtistProfile.findOneAndUpdate(
    { userId: artistUserId },
    { $pull: { songs: song._id } }
  );

  await ContentVerificationRequest.deleteMany({
    objectId: song._id,
    type: "Song",
  });

  await Song.findByIdAndDelete(song._id);

  return {
    message: "Song deleted successfully",
    error: 0,
    data: {
      deletedSongId: song._id,
    },
  };
}

module.exports = {
  submitArtistVerificationRequest,
  uploadSong,
  updateSong,
  deleteSong,
};
