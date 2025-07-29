const musicService = require("../services/musicService");

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
    return res.status(400).json({ message: "Missing userId or songId" });
  }

  try {
    const result = await musicService.toggleSongLike(userId, songId);
    res.status(200).json({
      message: result.liked ? "Song liked" : "Song unliked",
      liked: result.liked,
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
    res.status(200).json({ likedTracks });
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
  nextTrack

};
