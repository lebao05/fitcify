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
  if (!user || !user.isVerified || user.role !== "artist") {
    throw new Error("Only verified artists can delete songs");
  }

  const song = await Song.findById(songId);
  if (!song) throw new Error("Song not found");
  if (!song.artistId.equals(artistUserId)) {
    throw new Error("You do not have permission to delete this song");
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

  await Playlist.updateMany(
    { songs: song._id },
    { $pull: { songs: song._id } }
  );

  await Album.updateMany({ songs: song._id }, { $pull: { songs: song._id } });

  await Song.findByIdAndDelete(song._id);

  return { deletedSongId: song._id };
}

// Common helpers
function normalizeSongIds(songIds) {
  if (typeof songIds === "string") {
    try {
      songIds = JSON.parse(songIds);
      if (!Array.isArray(songIds)) songIds = [songIds];
    } catch {
      songIds = songIds.split(",").map((s) => s.trim());
    }
  }
  return Array.isArray(songIds) ? songIds : [];
}

async function findConflictSongs(songIds, currentAlbumId) {
  if (!Array.isArray(songIds) || songIds.length === 0) return [];

  const conflictSongs = await Song.find({
    _id: { $in: songIds },
    albumId: { $nin: [null, currentAlbumId] },
  });

  return conflictSongs;
}

async function handleCoverUpload(imagePath, folder, oldImageUrl = null) {
  if (oldImageUrl) {
    const oldImgId = extractCloudinaryPublicId(oldImageUrl);
    if (oldImgId)
      await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
  }
  const result = await uploadToCloudinary(imagePath, folder, {
    resource_type: "image",
  });
  return result.secure_url;
}

async function getTotalDuration(songIdArr) {
  let totalDuration = 0;
  if (songIdArr.length > 0) {
    const songs = await Song.find({ _id: { $in: songIdArr } }, "duration");
    totalDuration = songs.reduce((sum, s) => sum + (s.duration || 0), 0);
  }
  return totalDuration;
}

// Album related functions
async function getAlbumById(albumId) {
  const album = await Album.findById(albumId)
    .populate({
      path: "songs",
      model: "Song",
    })
    .populate({
      path: "artistId",
      model: "ArtistProfile",
    });

  if (!album) {
    const err = new Error("Album not found");
    err.code = "ALBUM_NOT_FOUND";
    throw err;
  }

  return album;
}

async function getAlbumsByArtist(artistUserId) {
  if (!artistUserId) throw new Error("artistUserId is required");
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") {
    throw new Error("Only verified artists can perform this action");
  }
  const albums = await Album.find({ artistId: artistUserId })
    .populate("artistId", "username")
    .sort({
      createdAt: -1,
    });
  return albums;
}

async function createAlbum({
  artistUserId,
  title,
  coverImagePath,
  releaseDate,
  description,
  songIds,
}) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") {
    throw new Error("Only verified artists can perform this action");
  }
  const songIdArr = normalizeSongIds(songIds);

  if (songIdArr.length > 30) {
    const err = new Error("An album can contain up to 30 songs only.");
    err.code = "TOO_MANY_SONGS";
    throw err;
  }

  const existed = await Album.findOne({
    artistId: artistUserId,
    title: title.trim(),
  });
  if (existed) {
    const err = new Error("Album title must be unique.");
    err.code = "DUPLICATE_TITLE";
    throw err;
  }

  let imageUrl = "";
  if (coverImagePath) {
    imageUrl = await handleCoverUpload(coverImagePath, "/fitcify/album-covers");
  }

  const totalDuration = await getTotalDuration(songIdArr);

  if (Array.isArray(songIdArr) && songIdArr.length > 0) {
    const conflictSongs = await findConflictSongs(songIdArr, null);

    if (conflictSongs.length > 0) {
      const titles = conflictSongs.map((s) => s.title).join(", ");
      const err = new Error(
        `Some songs already belong to another album: ${titles}`
      );
      err.code = "SONG_ALREADY_IN_ANOTHER_ALBUM";
      throw err;
    }
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

  await Song.updateMany(
    { _id: { $in: songIdArr } },
    { $set: { albumId: album._id } }
  );

  await ArtistProfile.findOneAndUpdate(
    { userId: artistUserId },
    { $push: { albums: album._id } }
  );

  return album;
}

async function deleteAlbum({ artistUserId, albumId }) {
  const album = await Album.findOne({ _id: albumId, artistId: artistUserId });
  if (!album)
    throw new Error(
      "Album not found or you do not have permission to delete this album"
    );

  if (album.imageUrl) {
    const oldImgId = extractCloudinaryPublicId(album.imageUrl);
    if (oldImgId)
      await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
  }

  await Song.updateMany({ albumId: albumId }, { $unset: { albumId: "" } });

  await Album.findByIdAndDelete(albumId);
  return { deletedAlbumId: albumId };
}

async function updateAlbumMetadata({
  artistUserId,
  albumId,
  title,
  description,
  releaseDate,
  coverImagePath,
  songIds,
}) {
  const album = await Album.findOne({ _id: albumId, artistId: artistUserId });
  if (!album)
    throw new Error(
      "Album not found or you do not have permission to edit this album"
    );

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

  if (
    releaseDate &&
    new Date(releaseDate).toISOString() !==
      new Date(album.releaseDate).toISOString()
  ) {
    update.releaseDate = releaseDate;
    hasChange = true;
  }

  if (coverImagePath) {
    update.imageUrl = await handleCoverUpload(
      coverImagePath,
      "/fitcify/album-covers",
      album.imageUrl
    );
    hasChange = true;
  }

  if (typeof songIds !== "undefined") {
    const songIdArr = normalizeSongIds(songIds);
    if (songIdArr.length > 30) {
      const err = new Error("An album can contain up to 30 songs only.");
      err.code = "TOO_MANY_SONGS";
      throw err;
    }
    if (songIdArr.length === 0) {
      const err = new Error("Album must have at least 1 song.");
      err.code = "ALBUM_MUST_HAVE_SONG";
      throw err;
    }
    const oldSongIds = (album.songs || []).map((id) => id.toString());
    const newSongIds = songIdArr.map((id) => id.toString());
    const isSame =
      oldSongIds.length === newSongIds.length &&
      oldSongIds.every((id, i) => id === newSongIds[i]);
    if (!isSame) {
      update.songs = songIdArr;
      update.totalDuration = await getTotalDuration(songIdArr);
      hasChange = true;

      const removedSongIds = oldSongIds.filter(
        (id) => !newSongIds.includes(id)
      );
      const addedSongIds = newSongIds.filter((id) => !oldSongIds.includes(id));

      if (addedSongIds.length > 0) {
        const conflictSongs = await findConflictSongs(addedSongIds, albumId);

        if (conflictSongs.length > 0) {
          const titles = conflictSongs.map((s) => s.title).join(", ");
          const err = new Error(
            `Some songs already belong to another album: ${titles}`
          );
          err.code = "SONG_ALREADY_IN_ANOTHER_ALBUM";
          throw err;
        }

        await Song.updateMany(
          { _id: { $in: addedSongIds }, albumId: null },
          { $set: { albumId: albumId } }
        );

        if (removedSongIds.length > 0) {
          await Song.updateMany(
            { _id: { $in: removedSongIds }, albumId: albumId },
            { $unset: { albumId: "" } }
          );
        }
      }
    }
  }

  if (!hasChange) {
    return album;
  }

  if (update.title) {
    const existed = await Album.findOne({
      artistId: artistUserId,
      title: update.title,
      _id: { $ne: albumId },
    });
    if (existed) {
      const err = new Error("Album title must be unique.");
      err.code = "DUPLICATE_TITLE";
      throw err;
    }
  }

  const updated = await Album.findByIdAndUpdate(albumId, update, { new: true });
  return updated;
}

// Playlist related functions
async function getPlaylistById(playlistId) {
  const playlist = await Playlist.findById(playlistId)
    .populate({
      path: "songs",
      model: "Song",
    })
    .populate("ownerId", "username");

  if (!playlist) {
    const err = new Error("Playlist not found");
    err.code = "PLAYLIST_NOT_FOUND";
    throw err;
  }

  return playlist;
}

async function getPlaylistsByArtist(artistUserId) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") {
    throw new Error("Only verified artists can perform this action");
  }
  const playlists = await Playlist.find({
    ownerId: artistUserId,
    isArtistPlaylist: true,
  })
    .populate("ownerId", "username")
    .sort({
      createdAt: -1,
    });
  return playlists;
}

async function createPlaylist({
  artistUserId,
  name,
  coverImagePath,
  description,
  songIds,
}) {
  const user = await User.findById(artistUserId);
  if (!user || !user.isVerified || user.role !== "artist") {
    throw new Error("Only verified artists can perform this action");
  }
  if (!name || !name.trim()) {
    const err = new Error("Please fill out this field.");
    err.code = "REQUIRED_TITLE";
    throw err;
  }
  const songIdArr = normalizeSongIds(songIds);

  if (!Array.isArray(songIdArr) || songIdArr.length === 0) {
    const err = new Error(
      "You must select at least one song to create a playlist."
    );
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
    imageUrl = await handleCoverUpload(
      coverImagePath,
      "/fitcify/playlist-covers"
    );
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    ownerId: artistUserId,
    imageUrl,
    description: description || "",
    songs: songIdArr,
    isArtistPlaylist: true,
  });
  return playlist;
}

async function deletePlaylist({ artistUserId, playlistId }) {
  const playlist = await Playlist.findOne({
    _id: playlistId,
    ownerId: artistUserId,
  });
  if (!playlist)
    throw new Error(
      "Playlist not found or you do not have permission to delete this playlist"
    );

  if (playlist.imageUrl) {
    const oldImgId = extractCloudinaryPublicId(playlist.imageUrl);
    if (oldImgId)
      await cloudinary.uploader.destroy(oldImgId, { resource_type: "image" });
  }

  await Playlist.findByIdAndDelete(playlistId);
  return { deletedPlaylistId: playlistId };
}

async function updatePlaylistMetadata({
  artistUserId,
  playlistId,
  name,
  description,
  coverImagePath,
  songIds,
}) {
  const playlist = await Playlist.findOne({
    _id: playlistId,
    ownerId: artistUserId,
  });
  if (!playlist)
    throw new Error(
      "Playlist not found or you do not have permission to edit this playlist"
    );

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
    update.imageUrl = await handleCoverUpload(
      coverImagePath,
      "/fitcify/playlist-covers",
      playlist.imageUrl
    );
    hasChange = true;
  }

  if (typeof songIds !== "undefined") {
    const songIdArr = normalizeSongIds(songIds);
    if (songIdArr.length === 0) {
      const err = new Error("A playlist must have at least 1 song.");
      err.code = "PLAYLIST_MUST_HAVE_SONG";
      throw err;
    }
    if (songIdArr.length > 100) {
      const err = new Error("A playlist can contain up to 100 songs only.");
      err.code = "TOO_MANY_SONGS";
      throw err;
    }
    const oldIds = (playlist.songs || []).map((id) => id.toString());
    const newIds = songIdArr.map((id) => id.toString());
    const isSame =
      oldIds.length === newIds.length &&
      oldIds.every((id, i) => id === newIds[i]);
    if (!isSame) {
      update.songs = songIdArr;
      hasChange = true;
    }
  }

  if (!hasChange) {
    return playlist;
  }
  const updated = await Playlist.findByIdAndUpdate(playlistId, update, {
    new: true,
  });
  return updated;
}

async function getSongById(songId) {
  const song = await Song.findById(songId)
    .populate("artistId", "username _id")
    .populate("albumId", "title _id");
  if (!song) throw new Error("Song not found");
  return song;
}

async function getAllSongs(artistUserId) {
  const artist = await User.findById(artistUserId);
  if (!artist || !artist.isVerified || artist.role !== "artist") {
    throw new Error("Only verified artists can view their songs");
  }
  return await Song.find({ artistId: artistUserId })
    .populate("albumId", "title _id")
    .populate("artistId", "username -_id");
}

async function getArtistProfileById(userId) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }

  const profile = await ArtistProfile.findOne({ userId }).populate(
    "userId",
    "username email avatarUrl"
  );

  if (!profile) {
    throw new Error("Artist profile not found");
  }

  const albums = await Album.find({ artistId: userId })
    .populate("artistId", "username")
    .lean();

  const playlists = await Playlist.find({ ownerId: userId })
    .populate("ownerId", "username")
    .lean();

  const songs = await Song.find({ artistId: userId })
    .select("title audioUrl imageUrl duration playCount")
    .lean();

  return { profile, albums, songs, playlists };
}

async function updateArtistProfile(userId, data) {
  if (!mongoose.isValidObjectId(userId)) {
    throw new Error("Invalid user ID");
  }
  const allowed = [
    "bio",
    "socialLinks.spotify",
    "socialLinks.instagram",
    "socialLinks.twitter",
    "socialLinks.website",
  ];
  const updates = {};
  Object.keys(data).forEach((key) => {
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
    throw new Error("Artist profile not found");
  }
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
  getAlbumById,
  createPlaylist,
  deletePlaylist,
  updatePlaylistMetadata,
  getPlaylistsByArtist,
  getPlaylistById,
  getSongById,
  getAllSongs,
  getArtistProfileById,
  updateArtistProfile,
};
