const mongoose = require("mongoose");
const User = require("../models/user");
const ArtistProfile = require("../models/artistProfile");
const ArtistVerificationRequest = require("../models/artistVerification");
const Song = require("../models/song");
const Album = require("../models/album");
const Playlist = require("../models/playlist");
const ContentVerificationRequest = require("../models/contentVerification");
const { uploadToCloudinary } = require("../services/cloudinaryService");
const cloudinary = require("../configs/cloudinary");
const mm = require("music-metadata");
const extractCloudinaryPublicId = require("../helpers/extractPublicId");

const submitArtistVerificationRequest = async (userId, notes = null) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");
  if (user.role === "artist") throw new Error("User is already a verified artist");

  const duplicate = await ArtistVerificationRequest.findOne({ userId, status: "pending" });
  if (duplicate) throw new Error("A pending request already exists");

  const request = await ArtistVerificationRequest.create({
    userId,
    notes,
    status: "pending",
    submittedAt: new Date(),
  });

  return request;
};

async function uploadSong({ artistUserId, title, audioPath, imagePath = null, albumId = null }) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists can upload songs");

  const duration = await getAudioDuration(audioPath);
  const audioRes = await uploadToCloudinary(audioPath, "/fitcify/songs", { resource_type: "video" });

  let imageUrl = "";
  if (imagePath) {
    const imgRes = await uploadToCloudinary(imagePath, "/fitcify/song-covers", { resource_type: "image" });
    imageUrl = imgRes.secure_url;
  }

  const validAlbumId = mongoose.Types.ObjectId.isValid(albumId) ? albumId : null;
  
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

async function updateSong(songId, artistUserId, { title, albumId = null, audioPath = null, imagePath = null }) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists can update songs");

  const song = await Song.findById(songId);
  if (!song) throw new Error("Song not found");
  if (!song.artistId.equals(artistUserId)) throw new Error("You do not have permission to modify this song");

  const updates = {};
  if (title) updates.title = title;
  if (albumId && mongoose.Types.ObjectId.isValid(albumId)) updates.albumId = albumId;

  if (audioPath) {
    const oldAudioId = extractCloudinaryPublicId(song.audioUrl);
    if (oldAudioId) await cloudinary.uploader.destroy(oldAudioId, { resource_type: "video" });

    const audioRes = await uploadToCloudinary(audioPath, "fitcify/songs", { resource_type: "video" });
    const newDuration = await getAudioDuration(audioPath);
    updates.audioUrl = audioRes.secure_url;
    updates.duration = newDuration;
    assetReplaced = true;
  }

  if (imagePath) {
    const oldImgId = extractCloudinaryPublicId(song.imageUrl);
    if (oldImgId) await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });

    const imgRes = await uploadToCloudinary(imagePath, "fitcify/song-covers", { resource_type: "image" });
    updates.imageUrl = imgRes.secure_url;
    assetReplaced = true;
  }

  const updatedSong = await Song.findByIdAndUpdate(songId, updates, { new: true });
  return updatedSong;
}

async function deleteSong(songId, artistUserId) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists can delete songs");

  const song = await Song.findById(songId);
  if (!song) throw new Error("Song not found");
  if (!song.artistId.equals(artistUserId)) throw new Error("You do not have permission to delete this song");

  const oldAudioId = extractCloudinaryPublicId(song.audioUrl);
  if (oldAudioId) await cloudinary.uploader.destroy(oldAudioId, { resource_type: "video" });

  const oldImgId = extractCloudinaryPublicId(song.imageUrl);
  if (oldImgId) await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });

  await ArtistProfile.findOneAndUpdate(
    { userId: artistUserId },
    { $pull: { songs: song._id } }
  );

  await Song.findByIdAndDelete(song._id);
  return { deletedSongId: song._id };
}

async function getAlbumsByArtist(artistUserId) {
  if (!artistUserId) throw new Error("artistUserId is required");
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists have albums");
  const albums = await Album.find({ artistId: artistUserId }).sort({ createdAt: -1 });
  return albums;
}

async function createAlbum({ artistUserId, title, coverImagePath, releaseDate, description, songIds }) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists can create albums");

  // Xử lý songIds: nếu là chuỗi JSON hoặc chuỗi phân tách phẩy, chuyển thành mảng string
  let songIdArr = songIds;
  if (typeof songIds === 'string') {
    try {
      songIdArr = JSON.parse(songIds);
      if (!Array.isArray(songIdArr)) songIdArr = [songIdArr];
    } catch {
      songIdArr = songIds.split(',').map(s => s.trim());
    }
  }

  if (songIdArr.length > 30) {
    const err = new Error("An album can contain up to 30 songs only.");
    err.code = "TOO_MANY_SONGS";
    throw err;
  }

  const existed = await Album.findOne({ artistId: artistUserId, title: title.trim() });
  if (existed) {
    const err = new Error("Album title must be unique.");
    err.code = "DUPLICATE_TITLE";
    throw err;
  }

  let imageUrl = "";
  if (coverImagePath) {
    const imgRes = await uploadToCloudinary(coverImagePath, "/fitcify/album-covers", { resource_type: "image" });
    imageUrl = imgRes.secure_url;
  }

  let totalDuration = 0;
  if (songIdArr.length > 0) {
    const songs = await Song.find({ _id: { $in: songIdArr } }, 'duration');
    totalDuration = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
  }

  const album = await Album.create({
    title: title.trim(),
    artistId: artistUserId,
    imageUrl,
    releaseDate: releaseDate || null,
    description: description || "",
    songs: songIdArr,
    totalDuration,
  });
  return album;
}

async function deleteAlbum({ artistUserId, albumId }) {
  const album = await Album.findOne({ _id: albumId, artistId: artistUserId });
  if (!album) throw new Error("Album not found or you do not have permission to delete this album");

  if (album.imageUrl) {
    const oldImgId = extractCloudinaryPublicId(album.imageUrl);
    if (oldImgId) await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
  }

  await Album.findByIdAndDelete(albumId);
  return { deletedAlbumId: albumId };
}

async function editSongIds({ album, artistUserId, songIds }) {
  let update = {};
  let hasChange = false;
  if (typeof songIds !== 'undefined') {
    let parsedSongIds = songIds;
    if (typeof parsedSongIds === 'string') {
      try {
        parsedSongIds = JSON.parse(parsedSongIds);
        if (!Array.isArray(parsedSongIds)) parsedSongIds = [parsedSongIds];
      } catch {
        parsedSongIds = parsedSongIds.split(',').map(s => s.trim());
      }
    }
    if (!Array.isArray(parsedSongIds)) parsedSongIds = [];
    if (parsedSongIds.length > 30) {
      const err = new Error("An album can contain up to 30 songs only.");
      err.code = "TOO_MANY_SONGS";
      throw err;
    }
    if (parsedSongIds.length > 0) {
      const songs = await Song.find({ _id: { $in: parsedSongIds }, artistId: artistUserId });
      const oldIds = (album.songs || []).map(id => id.toString());
      const newIds = parsedSongIds.map(id => id.toString());
      const isSame = oldIds.length === newIds.length && oldIds.every((id, i) => id === newIds[i]);
      if (!isSame) {
        update.songs = parsedSongIds;
        update.totalDuration = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
        hasChange = true;
      }
    } else if ((album.songs || []).length === 0) {
      const err = new Error("Album must have at least 1 song.");
      err.code = "ALBUM_MUST_HAVE_SONG";
      throw err;
    }
  }
  return { update, hasChange };
}

async function updateAlbumMetadata({ artistUserId, albumId, title, description, releaseDate, coverImagePath, songIds }) {
  const album = await Album.findOne({ _id: albumId, artistId: artistUserId });
  if (!album) throw new Error("Album not found or you do not have permission to edit this album");

  let hasChange = false;
  const update = {};
  if (title && title.trim() !== album.title) {
    update.title = title.trim();
    hasChange = true;
  }

  if (description !== undefined && description !== album.description) {
    update.description = description;
    hasChange = true;
  }

  if (releaseDate && new Date(releaseDate).toISOString() !== new Date(album.releaseDate).toISOString()) {
    update.releaseDate = releaseDate;
    hasChange = true;
  }

  if (coverImagePath) {
    if (album.imageUrl) {
      const oldImgId = extractCloudinaryPublicId(album.imageUrl);
      if (oldImgId) await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
    }
    if (!update.imageUrl) update.imageUrl = ""; // Ensure imageUrl exists in update
    const imgRes = await uploadToCloudinary(coverImagePath, "/fitcify/album-covers", { resource_type: "image" });
    update.imageUrl = imgRes.secure_url;
    hasChange = true;
  }

  if (typeof songIds !== 'undefined') {
    const songEdit = await editSongIds({ album, artistUserId, songIds });
    if (songEdit.hasChange) {
      Object.assign(update, songEdit.update);
      hasChange = true;
    }
  }

  if (!hasChange) {
    const err = new Error("No metadata changes");
    err.code = "NO_METADATA_CHANGES";
    throw err;
  }

  if (update.title) {
    const existed = await Album.findOne({ artistId: artistUserId, title: update.title, _id: { $ne: albumId } });
    if (existed) {
      const err = new Error("Album title must be unique.");
      err.code = "DUPLICATE_TITLE";
      throw err;
    }
  }

  const updated = await Album.findByIdAndUpdate(albumId, update, { new: true });
  return updated;
}

async function getPlaylistsByArtist(artistUserId) {
  if (!artistUserId) throw new Error("artistUserId is required");
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists have playlists");
  const playlists = await Playlist.find({ ownerId: artistUserId }).sort({ createdAt: -1 });
  return playlists;
}

async function createPlaylist({ artistUserId, name, coverImagePath, description, songIds }) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") throw new Error("Only verified artists can create playlists");
  if (!name || !name.trim()) {
    const err = new Error("Please fill out this field.");
    err.code = "REQUIRED_TITLE";
    throw err;
  }
  // Xử lý songIds
  let songIdArr = songIds;
  if (typeof songIds === 'string') {
    try {
      songIdArr = JSON.parse(songIds);
      if (!Array.isArray(songIdArr)) songIdArr = [songIdArr];
    } catch {
      songIdArr = songIds.split(',').map(s => s.trim());
    }
  }
  if (!Array.isArray(songIdArr) || songIdArr.length === 0) {
    const err = new Error("You must select at least one song to create a playlist.");
    err.code = "REQUIRED_SONG";
    throw err;
  }
  if (songIdArr.length > 100) {
    const err = new Error("A playlist can contain up to 100 songs only.");
    err.code = "TOO_MANY_SONGS";
    throw err;
  }

  let imageUrl = "";
  if (coverImagePath) {
    const imgRes = await uploadToCloudinary(coverImagePath, "/fitcify/playlist-covers", { resource_type: "image" });
    imageUrl = imgRes.secure_url;
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    ownerId: artistUserId,
    imageUrl,
    description: description || "",
    songs: songIdArr,
  });
  return playlist;
}

async function deletePlaylist({ artistUserId, playlistId }) {
  const playlist = await Playlist.findOne({ _id: playlistId, ownerId: artistUserId });
  if (!playlist) throw new Error("Playlist not found or you do not have permission to delete this playlist");

  if (playlist.imageUrl) {
    const oldImgId = extractCloudinaryPublicId(playlist.imageUrl);
    if (oldImgId) await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
  }
  await Playlist.findByIdAndDelete(playlistId);
  return { deletedPlaylistId: playlistId };
}

async function updatePlaylistMetadata({ artistUserId, playlistId, name, description, coverImagePath, songIds }) {
  const playlist = await Playlist.findOne({ _id: playlistId, ownerId: artistUserId });
  if (!playlist) throw new Error("Playlist not found or you do not have permission to edit this playlist");
  let hasChange = false;
  const update = {};
  if (name && name.trim() !== playlist.name) {
    update.name = name.trim();
    hasChange = true;
  }
  if (description !== undefined && description !== playlist.description) {
    update.description = description;
    hasChange = true;
  }
  if (coverImagePath) {
    if (playlist.imageUrl) {
      const oldImgId = extractCloudinaryPublicId(playlist.imageUrl);
      if (oldImgId) await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
    }
    const imgRes = await uploadToCloudinary(coverImagePath, "/fitcify/playlist-covers", { resource_type: "image" });
    update.imageUrl = imgRes.secure_url;
    hasChange = true;
  }
  // Xử lý cập nhật songIds
  if (typeof songIds !== 'undefined') {
    let parsedSongIds = songIds;
    if (typeof parsedSongIds === 'string') {
      try {
        parsedSongIds = JSON.parse(parsedSongIds);
        if (!Array.isArray(parsedSongIds)) parsedSongIds = [parsedSongIds];
      } catch {
        parsedSongIds = parsedSongIds.split(',').map(s => s.trim());
      }
    }
    if (!Array.isArray(parsedSongIds) || parsedSongIds.length === 0) {
      const err = new Error("A playlist must have at least 1 song.");
      err.code = "PLAYLIST_MUST_HAVE_SONG";
      throw err;
    }
    if (parsedSongIds.length > 100) {
      const err = new Error("A playlist can contain up to 100 songs only.");
      err.code = "TOO_MANY_SONGS";
      throw err;
    }
    // So sánh với playlist.songs hiện tại
    const oldIds = (playlist.songs || []).map(id => id.toString());
    const newIds = parsedSongIds.map(id => id.toString());
    const isSame = oldIds.length === newIds.length && oldIds.every((id, i) => id === newIds[i]);
    if (!isSame) {
      update.songs = parsedSongIds;
      hasChange = true;
    }
  }
  if (!hasChange) {
    const err = new Error("No metadata changes");
    err.code = "NO_METADATA_CHANGES";
    throw err;
  }
  const updated = await Playlist.findByIdAndUpdate(playlistId, update, { new: true });
  return updated;
}


module.exports = {
  submitArtistVerificationRequest,
  uploadSong,
  updateSong,
  deleteSong,
  createAlbum,
  deleteAlbum,
  updateAlbumMetadata,
  getAlbumsByArtist,
  createPlaylist,
  deletePlaylist,
  updatePlaylistMetadata,
  getPlaylistsByArtist,
};
