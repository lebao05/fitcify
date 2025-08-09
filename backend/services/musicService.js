const https = require("https");
const Song = require("../models/song");
const Album = require("../models/album");
const ArtistProfile = require("../models/artistProfile");
const mongoose = require("mongoose");
const Player = require("../models/audioPlayer");
const Playlist = require("../models/playlist");
const User = require("../models/user");
const PlayHistory = require("../models/playHistory");
const { normalizeString } = require("../helpers/normolize");
const { distance } = require("fastest-levenshtein");
function proxyStreamFromCloudinary(cloudinaryUrl, range) {
  return new Promise((resolve, reject) => {
    const req = https.get(
      cloudinaryUrl,
      { headers: { Range: range } },
      (res) => {
        resolve(res); // res is an IncomingMessage (readable stream)
      }
    );
    req.on("error", reject);
  });
}

async function getStream(songId, rangeHeader = "bytes=0-") {
  const song = await Song.findById(songId).select("audioUrl");
  if (!song) throw new Error("Song not found");
  const cloudRes = await proxyStreamFromCloudinary(song.audioUrl, rangeHeader);
  return cloudRes;
}

const toggleSongLike = async (userId, songId) => {
  try {
    const song = await Song.findById(songId);
    if (!song) throw new Error("Song not found");

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const hasLiked = song.likes.some((id) => id.equals(userObjectId));

    if (hasLiked) {
      // Bỏ like
      song.likes = song.likes.filter((id) => !id.equals(userObjectId));
    } else {
      // Thêm like
      song.likes.push(userObjectId);
    }

    await song.save();

    return {
      liked: !hasLiked,
    };
  } catch (error) {
    throw error;
  }
};

// Lấy danh sách bài hát đã like của user
const getLikedTracks = async (userId) => {
  if (!userId) {
    const err = new Error("Unauthorized: User must be logged in");
    err.status = 401;
    throw err;
  }
  try {
    const likedSongs = await Song.find({ likes: userId })
      .populate("artistId", "username")
      .populate("albumId", "title");
    return likedSongs;
  } catch (error) {
    throw error;
  }
};

const getAlbumById = async (albumId) => {
  if (!mongoose.isValidObjectId(albumId)) {
    const err = new Error("Invalid album id");
    err.status = 400;
    throw err;
  }

  const album = await Album.findById(albumId)
    .populate({
      path: "songs",
      options: { sort: { createdAt: 1 } }, // ascending, use -1 for descending
    })
    .populate("artistId")
    .lean();

  if (!album) {
    const err = new Error("Album not found");
    err.status = 404;
    throw err;
  }

  return album;
};

const getAlbumsOfAnArtist = async (artistId) => {
  if (!mongoose.isValidObjectId(artistId)) {
    const err = new Error("Invalid artist id");
    err.status = 400;
    throw err;
  }
  const albums = await Album.find({ artistId }).lean();
  return albums;
};

const playAnAlbum = async (albumId, songOrder = 0, user) => {
  if (!mongoose.isValidObjectId(albumId)) {
    const err = new Error("Invalid album ID");
    err.status = 400;
    throw err;
  }

  const album = await Album.findById(albumId).populate({
    path: "songs",
    options: { sort: { createdAt: 1 } },
  });
  if (!album) {
    const err = new Error("Album not found");
    err.status = 404;
    throw err;
  }

  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "album",
      itemId:   album._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: now }
    },
    { upsert: true }  
  );


  const songs = album.songs;
  if (!songs || songs.length === 0) {
    const err = new Error("No songs in album");
    err.status = 404;
    throw err;
  }

  let resultSongs = [];

  if (user?.isPremium) {
    resultSongs = songs.slice(songOrder);
  } else {
    resultSongs = [...songs];
    for (let i = resultSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultSongs[i], resultSongs[j]] = [resultSongs[j], resultSongs[i]];
    }
  }

  // Replace player's current session
  await Player.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      queue: resultSongs.map((s) => s._id),
      currentSong: resultSongs[0]._id,
      currentIndex: 0,
      isPlaying: true,
      repeatMode: false,
      shuffle: !user?.isPremium,
    },
    { upsert: true, new: true }
  );

  const currentSong = resultSongs[0];
  const songDoc = await Song.findByIdAndUpdate(currentSong, {
    $inc: { playCount: 1 },
  });
  await User.updateOne({ _id: songDoc.artistId }, { $inc: { playCount: 1 } });
  await Album.updateOne({ _id: albumId }, { $inc: { playCount: 1 } });

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   songDoc._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   songDoc.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );


  return currentSong;
};

const playAPlaylist = async (playlistId, songOrder = 0, user) => {
  if (!mongoose.isValidObjectId(playlistId)) {
    const err = new Error("Invalid playlist ID");
    err.status = 400;
    throw err;
  }

  const playlist = await Playlist.findById(playlistId).populate({
    path: "songs",
    options: { sort: { createdAt: 1 } },
  });
  if (!playlist) {
    const err = new Error("Playlist not found");
    err.status = 404;
    throw err;
  }

  const songs = playlist.songs;
  if (!songs || songs.length === 0) {
    const err = new Error("No songs in playlist");
    err.status = 404;
    throw err;
  }

  let resultSongs;
  if (user?.isPremium) {
    resultSongs = songs.slice(songOrder);
  } else {
    resultSongs = [...songs];
    for (let i = resultSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultSongs[i], resultSongs[j]] = [resultSongs[j], resultSongs[i]];
    }
  }

  await Player.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      queue: resultSongs.map((s) => s._id),
      currentSong: resultSongs[0]._id,
      currentIndex: 0,
      isPlaying: true,
      repeatMode: false,
      currentAlbum: null,
      currentPlaylist: playlist._id,
    },
    { upsert: true, new: true }
  );

  const currentSong = resultSongs[0];
  const song = await Song.findByIdAndUpdate(
    currentSong,
    { $inc: { playCount: 1 } },
    { new: true }
  );
  await User.updateOne({ _id: song.artistId }, { $inc: { playCount: 1 } });

  //Record history for song & artist
  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   song._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   song.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  return currentSong;
};

async function playAnArtist(user, artistId) {
  const songs = await Song.find({ artistId: artistId }).limit(5);
  if (!songs || songs.length === 0) {
    throw new Error("No songs found for this artist.");
  }
  const shuffledSongs = songs.sort(() => 0.5 - Math.random());

  const player = await Player.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      queue: shuffledSongs.map((s) => s._id),
      currentSong: shuffledSongs[0]._id,
      currentIndex: 0,
      isPlaying: true,
      repeatMode: false,
      currentAlbum: null,
      currentPlaylist: null,
    },
    { upsert: true, new: true }
  ).populate("queue");

  const currentSong = shuffledSongs[0];
  const song = await Song.findByIdAndUpdate(currentSong._id, {
    $inc: { playCount: 1 },
  });
  await User.updateOne({ _id: song.artistId }, { $inc: { playCount: 1 } });

  // —— Bổ sung: ghi lịch sử cho song và artist ——
  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   song._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   song.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  return currentSong;
}

async function previousTrack(user) {
  const player = await Player.findOne({ userId: user._id }).populate("queue");

  if (!player || !player.queue || player.queue.length === 0) {
    throw new Error("No songs are currently playing.");
  }

  // If already at the beginning of the queue
  if (player.currentIndex <= 0) {
    const first = player.queue[0];
    // ghi history cho lần phát lại đầu tiên
    const now = new Date();
    await Song.findByIdAndUpdate(first, { $inc: { playCount: 1 } });
    await User.updateOne({ _id: first.artistId }, { $inc: { playCount: 1 } });
    const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
    const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
    
    await PlayHistory.findOneAndUpdate(
      {
        userId:   user._id,
        itemType: "song",
        itemId:   song._id,
        playedAt: { $gte: monthStart, $lt: nextMonthStart }
      },
      {
        $inc: { playCount: 1 }, 
        $set: { playedAt: Date.now() }
      },
      { upsert: true }  
    );

    await PlayHistory.findOneAndUpdate(
      {
        userId:   user._id,
        itemType: "artist",
        itemId:   song.artistId,
        playedAt: { $gte: monthStart, $lt: nextMonthStart }
      },
      {
        $inc: { playCount: 1 }, 
        $set: { playedAt: Date.now() }
      },
      { upsert: true }  
    );
    return first;
  }

  player.currentIndex -= 1;
  const currentSong = player.queue[player.currentIndex];
  await player.save();

  // increment counts
  const song = await Song.findByIdAndUpdate(currentSong, {
    $inc: { playCount: 1 },
  });
  await User.updateOne({ _id: song.artistId }, { $inc: { playCount: 1 } });

  // record history
  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   song._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   song.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  return currentSong;
}
async function playASong(user, songId) {
  if (!user || !user._id) {
    const err = new Error("User not authenticated.");
    err.status = 401;
    throw err;
  }

  const mainSong = await Song.findById(songId);
  if (!mainSong) {
    const err = new Error("Song not found.");
    err.status = 404;
    throw err;
  }

  const totalSongs = await Song.countDocuments({ _id: { $ne: mainSong._id } });
  const randomSize = Math.min(5, totalSongs);
  const randomSongs = await Song.aggregate([
    { $match: { _id: { $ne: mainSong._id } } },
    { $sample: { size: randomSize } },
  ]);

  const queue = [mainSong._id, ...randomSongs.map((s) => s._id)];

  await Player.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      queue,
      currentIndex: 0,
      isPlaying: true,
      repeatMode: false,
      shuffle: true,
      currentAlbum: null,
      currentPlaylist: null,
    },
    { upsert: true, new: true }
  );

  const song = await Song.findByIdAndUpdate(mainSong._id, {
    $inc: { playCount: 1 },
  });
  await User.updateOne({ _id: song.artistId }, { $inc: { playCount: 1 } });

  // record history
  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   song._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   song.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  return mainSong;
}

async function nextTrack(user) {
  const player = await Player.findOne({ userId: user._id });
  if (!player || !player.queue || player.queue.length === 0) {
    throw new Error("No queue found for user.");
  }

  let { queue, currentIndex } = player;

  if (currentIndex + 1 >= queue.length) {
    // End of queue: add 5 new random songs (excluding existing ones)
    const excludedIds = queue.map((id) => mongoose.Types.ObjectId(id));

    const additionalSongs = await Song.aggregate([
      { $match: { _id: { $nin: excludedIds } } },
      { $sample: { size: 5 } },
    ]);

    const newSongIds = additionalSongs.map((s) => s._id);
    queue = [...queue, ...newSongIds];
    currentIndex += 1;
  } else {
    // Just move to next song
    currentIndex += 1;
  }

  player.queue = queue;
  player.currentIndex = currentIndex;
  await player.save();

  const currentSongId = queue[currentIndex];

  const currentSong = await Song.findById(currentSongId);
  if (!currentSong) throw new Error("Next song not found.");

  // Increment play counts
  const song = await Song.findByIdAndUpdate(
    currentSongId,
    { $inc: { playCount: 1 } },
    { new: true }
  ).exec();
  await User.updateOne(
    { _id: song.artistId },
    { $inc: { playCount: 1 } }
  ).exec();

  // —— Bổ sung: ghi lịch sử cho song và artist ——
  const now = new Date();
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   song._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   song.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  return currentSong;
}

async function playLikedTrack(songOrder = 0, user) {
  // 1) Load all liked songs
  const likedSongs = await Song.find({ likes: user._id }).populate(
    "artistId",
    "username"
  );
  if (!likedSongs.length) {
    const err = new Error("No liked tracks found");
    err.status = 404;
    throw err;
  }

  // 2) Build queue
  let resultSongs;
  if (user.isPremium) {
    resultSongs = likedSongs.slice(songOrder);
  } else {
    resultSongs = [...likedSongs];
    for (let i = resultSongs.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [resultSongs[i], resultSongs[j]] = [resultSongs[j], resultSongs[i]];
    }
  }

  // 3) Save/update Player session
  await Player.findOneAndUpdate(
    { userId: user._id },
    {
      userId: user._id,
      queue: resultSongs.map((s) => s._id),
      currentSong: resultSongs[0]._id,
      currentIndex: 0,
      isPlaying: true,
      repeatMode: false,
      shuffle: !user.isPremium,
      currentAlbum: null,
      currentPlaylist: null,
    },
    { upsert: true, new: true }
  );

  // 4) Increment counts and record history for the first track
  const now = new Date();
  const currentSong = resultSongs[0];
  const songDoc = await Song.findByIdAndUpdate(
    currentSong._id,
    { $inc: { playCount: 1 } },
    { new: true }
  );

  await User.updateOne({ _id: songDoc.artistId }, { $inc: { playCount: 1 } });

  // 5) Record PlayHistory for song and artist
  const monthStart     = new Date(now.getFullYear(), now.getMonth(), 1);
  const nextMonthStart = new Date(now.getFullYear(), now.getMonth() + 1, 1);
  
  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "song",
      itemId:   songDoc._id,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  await PlayHistory.findOneAndUpdate(
    {
      userId:   user._id,
      itemType: "artist",
      itemId:   songDoc.artistId,
      playedAt: { $gte: monthStart, $lt: nextMonthStart }
    },
    {
      $inc: { playCount: 1 }, 
      $set: { playedAt: Date.now() }
    },
    { upsert: true }  
  );

  return currentSong;
}

const getTopSongs = async (limit = 10) => {
  const topSongs = await Song.find({ isApproved: true })
    .sort({ playCount: -1 })
    .limit(limit)
    .select("title artistId playCount imageUrl");
  return topSongs;
};
const getTopArtists = async (limit = 10) => {
  const artists = await ArtistProfile.find()
    .sort({ playCount: -1 })
    .limit(limit)
    .populate({
      path: "userId",
      select: "username avatarUrl",
    })
    .select("userId totalPlays");

  return artists;
};
const getTopAlbums = async (limit = 10) => {
  return await Album.find({})
    .sort({ playCount: -1 })
    .limit(limit)
    .select("title artistId imageUrl playCount releaseDate");
};

const getCurrentSong = async (userId) => {
  if (!mongoose.isValidObjectId(userId)) {
    const err = new Error("Invalid user ID");
    err.status = 400;
    throw err;
  }

  const player = await Player.findOne({ userId }).populate({
    path: "queue",
    populate: {
      path: "artistId",
      select: "username",
    },
  });

  if (!player || !player.queue || player.queue.length === 0) {
    const err = new Error("No active song in player");
    err.status = 404;
    throw err;
  }

  const currentSong = player.queue[player.currentIndex];

  let album = null;
  if (currentSong.albumId) {
    album = await Album.findById(currentSong.albumId).select(
      "title releaseDate imageUrl"
    );
  }

  return {
    ...currentSong.toObject(),
    artist: currentSong.artistId, // artistId đã populate username
    albumId: album || null,
  };
};
async function search(query) {
  const normalizedQuery = normalizeString(query);
  const THRESHOLD = 5;

  const fuzzyMatch = (input, target) => {
    return distance(input.toLowerCase(), target.toLowerCase()) <= THRESHOLD;
  };

  const [albums, songs, playlists, users] = await Promise.all([
    Album.find({}, "title imageUrl playCount artistId")
      .populate("artistId", "username")
      .lean(),
    Song.find({}, "title audioUrl imageUrl playCount artistId")
      .populate("artistId", "username")
      .lean(),
    Playlist.find({}, "name imageUrl playCount ownerId")
      .populate("ownerId", "username")
      .lean(),
    User.find({}, "username role avatarUrl playCount").lean(),
  ]);

  // Step 1: Filter matches
  const matchedAlbums = albums.filter((a) =>
    fuzzyMatch(normalizedQuery, normalizeString(a.title))
  );
  const matchedSongs = songs.filter((s) =>
    fuzzyMatch(normalizedQuery, normalizeString(s.title))
  );
  const matchedPlaylists = playlists.filter((p) =>
    fuzzyMatch(normalizedQuery, normalizeString(p.name))
  );
  const matchedUsers = users.filter(
    (u) =>
      u.role !== "artist" &&
      fuzzyMatch(normalizedQuery, normalizeString(u.username))
  );
  let matchedArtists = users.filter(
    (u) =>
      u.role === "artist" &&
      fuzzyMatch(normalizedQuery, normalizeString(u.username))
  );

  // Step 2: Infer best artist
  let bestArtist = matchedArtists.sort(
    (a, b) => (b.playCount || 0) - (a.playCount || 0)
  )[0];

  if (!bestArtist) {
    const bestAlbumFromMatch = matchedAlbums.sort(
      (a, b) => (b.playCount || 0) - (a.playCount || 0)
    )[0];
    const bestSongFromMatch = matchedSongs.sort(
      (a, b) => (b.playCount || 0) - (a.playCount || 0)
    )[0];
    const bestCreatorId =
      bestSongFromMatch?.artistId._id || bestAlbumFromMatch?.artistId._id;

    if (bestCreatorId) {
      bestArtist = users.find(
        (u) =>
          u.role === "artist" && u._id.toString() === bestCreatorId.toString()
      );
    }
  }

  // Step 3: Get artist's content
  let artistAlbums = [];
  let artistSongs = [];
  let artistPlaylists = [];

  if (bestArtist) {
    const artistId = bestArtist._id.toString();
    artistAlbums = albums.filter(
      (a) => a.artistId?._id.toString() === artistId
    );
    artistSongs = songs.filter((s) => s.artistId?._id.toString() === artistId);
    artistPlaylists = playlists.filter(
      (p) => p.ownerId?._id.toString() === artistId
    );
  }

  // Step 4: Deduplicate content
  const uniqueById = (arr) => {
    const seen = new Map();
    for (const item of arr) {
      seen.set(item._id.toString(), item);
    }
    return Array.from(seen.values());
  };

  const allAlbums = uniqueById([...matchedAlbums, ...artistAlbums]);
  const allSongs = uniqueById([...matchedSongs, ...artistSongs]);
  const allPlaylists = uniqueById([...matchedPlaylists, ...artistPlaylists]);

  // Step 5: Pick best of each
  const bestAlbums = allAlbums.sort(
    (a, b) => (b.playCount || 0) - (a.playCount || 0)
  );
  const bestSongs = allSongs.sort(
    (a, b) => (b.playCount || 0) - (a.playCount || 0)
  );
  const bestPlaylists = allPlaylists.sort(
    (a, b) => (b.playCount || 0) - (a.playCount || 0)
  );
  const bestArtists = uniqueById([...matchedArtists, bestArtist]);
  return {
    artists: bestArtists,
    albums: bestAlbums,
    songs: bestSongs,
    playlists: bestPlaylists,
    users: matchedUsers,
  };
}

// Toggle repeat mode for the current user's player
const toggleRepeatMode = async (userId) => {
  if (!userId) throw new Error("User ID is required");

  const player = await Player.findOne({ userId });
  if (!player) throw new Error("Player not found");

  player.repeatMode = !player.repeatMode;
  await player.save();

  return { repeatMode: player.repeatMode };
};

module.exports = {
  search,
  getAlbumsOfAnArtist,
  toggleSongLike,
  getStream,
  getLikedTracks,
  getAlbumById,
  playAnAlbum,
  playAPlaylist,
  playAnArtist,
  previousTrack,
  playASong,
  nextTrack,
  playLikedTrack,
  getTopSongs,
  getTopArtists,
  getTopAlbums,
  getCurrentSong,
  toggleRepeatMode,
};
