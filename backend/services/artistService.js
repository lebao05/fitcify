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
  if (user.role === "artist")
    throw new Error("User is already a verified artist");

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
    throw new Error("Only verified artists can upload songs");

  const duration = await getAudioDuration(audioPath);
  const audioRes = await uploadToCloudinary(audioPath, "/fitcify/songs", {
    resource_type: "video",
  });

  let imageUrl = "";
  if (imagePath) {
    const imgRes = await uploadToCloudinary(imagePath, "/fitcify/song-covers", {
      resource_type: "image",
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
    isApproved: true,
  });

  await ArtistProfile.findOneAndUpdate(
    { userId: artistUserId },
    { $push: { songs: song._id } },
    { new: true, upsert: true }
  );

  return song;
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
  if (!user || !user.isVerified || user.role !== "artist")
    throw new Error("Only verified artists can update songs");

  const song = await Song.findById(songId);
  if (!song) throw new Error("Song not found");
  if (!song.artistId.equals(artistUserId))
    throw new Error("You do not have permission to modify this song");

  const updates = {};
  if (title) updates.title = title;
  if (albumId && mongoose.Types.ObjectId.isValid(albumId))
    updates.albumId = albumId;

  if (audioPath) {
    const oldAudioId = extractCloudinaryPublicId(song.audioUrl);
    if (oldAudioId)
      await cloudinary.uploader.destroy(oldAudioId, { resource_type: "video" });

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
    if (oldImgId)
      await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });

    const imgRes = await uploadToCloudinary(imagePath, "fitcify/song-covers", {
      resource_type: "image",
    });
    updates.imageUrl = imgRes.secure_url;
    assetReplaced = true;
  }

  const updatedSong = await Song.findByIdAndUpdate(songId, updates, {
    new: true,
  });
  return updatedSong;
}

async function deleteSong(songId, artistUserId) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist")
    throw new Error("Only verified artists can delete songs");

  const song = await Song.findById(songId);
  if (!song) throw new Error("Song not found");
  if (!song.artistId.equals(artistUserId))
    throw new Error("You do not have permission to delete this song");

  const oldAudioId = extractCloudinaryPublicId(song.audioUrl);
  if (oldAudioId)
    await cloudinary.uploader.destroy(oldAudioId, { resource_type: "video" });

  const oldImgId = extractCloudinaryPublicId(song.imageUrl);
  if (oldImgId)
    await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });

  await ArtistProfile.findOneAndUpdate(
    { userId: artistUserId },
    { $pull: { songs: song._id } }
  );

  await Song.findByIdAndDelete(song._id);
  return { deletedSongId: song._id };
}

async function getSongById(songId, artistUserId) {
  const artist = await User.findById(artistUserId);
  if (!artist || !artist.isVerified || artist.role !== "artist")
    throw new Error("Only verified artists can delete songs");

  const song = await Song.findById(songId);
  if (!song) throw new Error("Song not found");

  if (!song.artistId.equals(artistUserId))
    throw new Error("This is not your song");

  return song;
}

async function getAllSongs(artistUserId) {
  const artist = await User.findById(artistUserId);
  if (!artist || !artist.isVerified || artist.role !== "artist") {
    throw new Error("Only verified artists can view their songs");
  }
  return await Song.find({ artistId: artistUserId }).populate(
    "artistId",
    "-password -refreshToken -__v"
  );
}

async function getArtistProfileById(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error('Invalid user ID');
  }
  const profile = await ArtistProfile.findOne({ userId })
    .populate('userId', 'name email')
    .populate('albums', 'title imageUrl')
    .populate('songs', 'title audioUrl imageUrl duration');

  if (!profile) {
    throw new Error('Artist profile not found');
  }
  return profile;
}

async function updateArtistProfile(userId, data) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error('Invalid user ID');
  }
  const allowed = ['bio', 'socialLinks.spotify', 'socialLinks.instagram', 'socialLinks.twitter', 'socialLinks.website'];
  const updates = {};
  Object.keys(data).forEach(key => {
    if (allowed.includes(key)) {
      updates[key] = data[key];
    }
  });
  const updated = await ArtistProfile.findOneAndUpdate(
    { userId },
    { $set: updates },
    { new: true }
  );
  if (!updated) {
    throw new Error('Artist profile not found');
  }
  return updated;
}

module.exports = {
  submitArtistVerificationRequest,
  uploadSong,
  updateSong,
  deleteSong,
  getSongById,
  getAllSongs,
  getArtistProfileById,
  updateArtistProfile,
};
