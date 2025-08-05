const musicService = require("../services/musicService");
const Song = require("../models/song");
const Album = require("../models/album");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const { distance } = require("fastest-levenshtein");
const normalizeString = require("../helpers/normolize").normalizeString;

const search = async (req, res, next) => {
  try {
    const rawQuery = req.query.q?.trim();
    if (!rawQuery)
      return res.status(400).json({ Error: "Search query required" });
    const data = await musicService.search(rawQuery);
    res.status(200).json({
      Message: "Search results",
      Error: 0,
      Data: {
        songs: data.songs,
        albums: data.albums,
        playlists: data.playlists,
        artists: data.artists,
      },
    });
  } catch (err) {
    next(err);
  }
};

const streamingAudio = async (req, res, next) => {
  try {
    const range = req.headers.range || "bytes=0-";

    // service returns Cloudinary response stream
    const cloudRes = await musicService.getStream(req.params.id, range);

    // Forward status & headers
    res.writeHead(cloudRes.statusCode, {
      "Content-Type": cloudRes.headers["content-type"] || "audio/mpeg",
      "Content-Length": cloudRes.headers["content-length"],
      "Content-Range": cloudRes.headers["content-range"] || undefined,
      "Accept-Ranges": "bytes",
      "Cache-Control": "public, max-age=31536000",
    });

    // Pipe Cloudinary → client
    cloudRes.pipe(res);
  } catch (err) {
    next(err);
  }
};

const toggleSongLikeController = async (req, res) => {
  const userId = req.user._id;
  const { songId } = req.params;

  if (!songId) {
    return res.status(400).json({ Message: "Missing userId or songId" });
  }

  try {
    const result = await musicService.toggleSongLike(userId, songId);
    res.status(200).json({
      Message: result.liked ? "Song liked" : "Song unliked",
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getLikedTracksController = async (req, res) => {
  const userId = req.user && req.user._id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const likedTracks = await musicService.getLikedTracks(userId);
    res
      .status(200)
      .json({ Data: likedTracks, Message: "Successfully", Error: 0 });
  } catch (error) {
    console.error(error);
    res
      .status(error.status || 500)
      .json({ message: error.message || "Internal Server Error" });
  }
};
const getAlbumById = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const data = await musicService.getAlbumById(albumId);
    res.status(200).json({ Message: "Album fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const getAlbumsOfAnArtist = async (req, res, next) => {
  try {
    const { artistId } = req.params;
    const data = await musicService.getAlbumsOfAnArtist(artistId);
    res.status(200).json({ Message: "Albums fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const playAnAlbumController = async (req, res, next) => {
  try {
    const { albumId } = req.params;
    const { songOrder = 0 } = req.query;
    const user = req.user;

    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const song = await musicService.playAnAlbum(
      albumId,
      parseInt(songOrder),
      user
    );
    res.status(200).json({
      Message: "Album is now playing",
      Error: 0,
      Data: song,
    });
  } catch (err) {
    next(err);
  }
};
const playAPlaylist = async (req, res, next) => {
  try {
    const { playlistId } = req.params;
    const { songOrder } = req.query;
    const user = req.user;

    const song = await musicService.playAPlaylist(
      playlistId,
      parseInt(songOrder) || 0,
      user
    );
    res.status(200).json({
      Message: "Started playing playlist",
      Error: 0,
      Data: song,
    });
  } catch (error) {
    next(error);
  }
};
async function playAnArtistController(req, res) {
  try {
    const user = req.user;
    const { artistId } = req.params;

    const song = await musicService.playAnArtist(user, artistId);
    res.status(200).json({
      Message: "Started playing artist",
      Error: 0,
      Data: song,
    });
  } catch (err) {
    console.error("playAnArtist error:", err);
    res.status(500).json({
      Message: err.message || "Failed to play artist.",
      Error: 1,
      Data: null,
    });
  }
}
const previousTrack = async (req, res) => {
  try {
    const user = req.user;
    const song = await musicService.previousTrack(user);
    res.status(200).json({
      Message: "Started playing artist",
      Error: 0,
      Data: song,
    });
  } catch (error) {
    res.status(500).json({
      Message: error.message || "Failed to play previous track.",
      Error: 1,
      Data: null,
    });
  }
};
const playASong = async (req, res) => {
  try {
    const user = req.user;
    const { songId } = req.body;
    const song = await musicService.playASong(user, songId);
    res.status(200).json({
      Message: "Started playing",
      Error: 0,
      Data: song,
    });
  } catch (err) {
    console.error("playAnArtist error:", err);
    res.status(500).json({
      Message: err.message || "Failed to play.",
      Error: 1,
      Data: null,
    });
  }
};
const nextTrack = async (req, res) => {
  try {
    const user = req.user;
    const song = await musicService.nextTrack(user);
    res.status(200).json({
      Message: "Next track is playing",
      Error: 0,
      Data: song,
    });
  } catch (err) {
    res.status(500).json({
      Message: err.message || "Failed to play next track.",
      Error: 1,
      Data: null,
    });
  }
};
const getTopSongs = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await musicService.getTopSongs(limit);
    res
      .status(200)
      .json({ Message: "Top songs fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};
const getTopArtists = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const artistProfiles = await musicService.getTopArtists(limit);
    const data = artistProfiles.map((profile) => ({
      _id: profile._id,
      userId: profile.userId._id,
      name: profile.userId.username,
      imageUrl: profile.userId.avatarUrl,
      totalPlays: profile.totalPlays,
    }));
    res
      .status(200)
      .json({ Message: "Top artists fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};
const getTopAlbums = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 10;
    const data = await musicService.getTopAlbums(limit);
    res
      .status(200)
      .json({ Message: "Top albums fetched", Error: 0, Data: data });
  } catch (err) {
    next(err);
  }
};

const getCurrentSong = async (req, res) => {
  try {
    const userId = req.user?._id;
    if (!userId) {
      return res.status(401).json({
        Message: "Unauthorized",
        Error: 1,
        Data: null,
      });
    }

    const song = await musicService.getCurrentSong(userId);

    res.status(200).json({
      Message: "Fetched current song",
      Error: 0,
      Data: song,
    });
  } catch (err) {
    res.status(500).json({
      Message: err.message || "Failed to get current song",
      Error: 1,
      Data: null,
    });
  }
};

module.exports = {
  streamingAudio,
  toggleSongLikeController,
  getLikedTracksController,
  getAlbumById,
  getAlbumsOfAnArtist,
  playAPlaylist,
  playASong,
  playAnAlbumController,
  playAnArtistController,
  previousTrack,
  nextTrack,
  getTopSongs,
  getTopArtists,
  getTopAlbums,
  search,
  getCurrentSong,
};
