// backend/services/playlistService.js
const mongoose = require("mongoose");
const Playlist = require("../models/playlist");
const Song = require("../models/song");

const cloudinary = require("../configs/cloudinary");
const { uploadToCloudinary } = require("./cloudinaryService");
const extractCloudinaryPublicId = require("../helpers/extractPublicId");

const PLAYLIST_LIMIT = 10000;

/** Create new playlist */
const createPlaylist = async (ownerId, body, file) => {
  const { name, description = "", isPublic = true } = body;
  if (!name?.trim()) {
    const err = new Error("Name is required");
    err.status = 400;
    throw err;
  }

  let imageUrl = "";
  if (file) {
    const { secure_url } = await uploadToCloudinary(file.path, "playlists");
    imageUrl = secure_url;
  }

  const playlist = await Playlist.create({
    name: name.trim(),
    description,
    ownerId,
    isPublic,
    imageUrl,
    songs: [],
    isArtistPlaylist: false,
  });

  return playlist;
};

/** Update playlist details (name, desc, cover, privacy) */
const updatePlaylistDetails = async (playlistId, ownerId, body, file) => {
  if (!mongoose.isValidObjectId(playlistId)) {
    const err = new Error("Invalid playlist id");
    err.status = 400;
    throw err;
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    const err = new Error("Playlist not found");
    err.status = 404;
    throw err;
  }
  if (playlist.ownerId.toString() !== ownerId.toString()) {
    const err = new Error("You do not have permission to edit this playlist");
    err.status = 403;
    throw err;
  }

  const { name, description, isPublic } = body;
  if (name !== undefined) playlist.name = name;
  if (description !== undefined) playlist.description = description;
  if (isPublic !== undefined) playlist.isPublic = isPublic;

  if (file) {
    // upload new cover
    const { secure_url, public_id } = await uploadToCloudinary(
      file.path,
      "playlists"
    );

    // delete old cover if exists
    if (playlist.imageUrl) {
      const oldId = extractCloudinaryPublicId(playlist.imageUrl);
      if (oldId && oldId !== public_id) {
        try {
          await cloudinary.uploader.destroy(oldId, { invalidate: true });
        } catch (e) {
          console.warn("⚠️ Failed to destroy old cover:", oldId, e.message);
        }
      }
    }

    playlist.imageUrl = secure_url;
  }

  await playlist.save();
  return playlist;
};

/** Add a song to playlist */
const addSongToPlaylist = async (playlistId, ownerId, songId) => {
  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(songId)
  ) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }

  const [playlist, song] = await Promise.all([
    Playlist.findById(playlistId),
    Song.findById(songId).select("_id"),
  ]);

  if (!playlist) {
    const err = new Error("Playlist not found");
    err.status = 404;
    throw err;
  }
  if (!song) {
    const err = new Error("Song not found");
    err.status = 404;
    throw err;
  }
  if (playlist.ownerId.toString() !== ownerId.toString()) {
    const err = new Error("You do not have permission to edit this playlist");
    err.status = 403;
    throw err;
  }

  if (playlist.songs.length >= PLAYLIST_LIMIT) {
    const err = new Error("Playlist is full; cannot add new tracks");
    err.status = 409;
    throw err;
  }

  if (playlist.songs.some((id) => id.toString() === songId.toString())) {
    const err = new Error("Track already in playlist");
    err.status = 409;
    throw err;
  }

  playlist.songs.push(songId);
  await playlist.save();
  return playlist;
};

/** Remove a song from playlist */
const removeSongFromPlaylist = async (playlistId, ownerId, songId) => {
  if (
    !mongoose.isValidObjectId(playlistId) ||
    !mongoose.isValidObjectId(songId)
  ) {
    const err = new Error("Invalid id");
    err.status = 400;
    throw err;
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    const err = new Error("Playlist not found");
    err.status = 404;
    throw err;
  }
  if (playlist.ownerId.toString() !== ownerId.toString()) {
    const err = new Error("You do not have permission to edit this playlist");
    err.status = 403;
    throw err;
  }

  const index = playlist.songs.findIndex(
    (id) => id.toString() === songId.toString()
  );
  if (index === -1) {
    const err = new Error("Track not found");
    err.status = 404;
    throw err;
  }

  playlist.songs.splice(index, 1);
  await playlist.save();
  return playlist;
};

/** Delete playlist (hard delete). If you have trash, change to soft delete. */
const deletePlaylist = async (playlistId, ownerId) => {
  if (!mongoose.isValidObjectId(playlistId)) {
    const err = new Error("Invalid playlist id");
    err.status = 400;
    throw err;
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    const err = new Error("Playlist not found");
    err.status = 404;
    throw err;
  }
  if (playlist.ownerId.toString() !== ownerId.toString()) {
    const err = new Error("You do not have permission to delete this playlist");
    err.status = 403;
    throw err;
  }

  // delete cover on cloudinary if any
  if (playlist.imageUrl) {
    const oldId = extractCloudinaryPublicId(playlist.imageUrl);
    if (oldId) {
      try {
        await cloudinary.uploader.destroy(oldId, { invalidate: true });
      } catch (e) {
        console.warn("⚠️ Failed to destroy cover:", oldId, e.message);
      }
    }
  }

  await playlist.deleteOne();
  return { deleted: true };
};

const getUserPlaylists = async (ownerId) => {
  if (!mongoose.isValidObjectId(ownerId)) {
    const err = new Error("Invalid user id");
    err.status = 400;
    throw err;
  }
  const playlists = await Playlist.find({ ownerId, isArtistPlaylist: false })
    .select("name description isPublic imageUrl songs createdAt updatedAt")
    .populate({
      path: "songs",
      select: "title artistId duration imageUrl",
      options: { sort: { addedAt: 1 } },
    })
    .populate("ownerId", "username _id");
  return playlists;
};

const getPlaylistById = async (playlistId, viewerId) => {
  if (!mongoose.isValidObjectId(playlistId)) {
    const err = new Error("Invalid playlist id");
    err.status = 400;
    throw err;
  }

  const playlist = await Playlist.findById(playlistId)
    .select("-__v")
    .populate({
      path: "ownerId",
      select: "username avatarUrl",
    })
    .populate({
      path: "songs",
      select: "title artistId duration imageUrl",
      options: { sort: { createdAt: 1 } },
      populate: {
        path: "artistId",
        model: "User",
        select: "username",
      },
    });

  if (!playlist) {
    const err = new Error("Playlist not found");
    err.status = 404;
    throw err;
  }

  if (
    !playlist.isPublic &&
    playlist.ownerId._id.toString() !== viewerId.toString()
  ) {
    const err = new Error("You do not have access to this playlist");
    err.status = 403;
    throw err;
  }

  return playlist;
};

module.exports = {
  createPlaylist,
  updatePlaylistDetails,
  addSongToPlaylist,
  removeSongFromPlaylist,
  deletePlaylist,
  getUserPlaylists,
  getPlaylistById,
};
