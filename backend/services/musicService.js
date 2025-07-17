const Player = require('../models/audioPlayer');
const Song = require('../models/song');
const mongoose = require('mongoose');


const incrementPlayCount = async (songId) => {
    const result = await Song.findByIdAndUpdate(
        songId,
        { $inc: { playCount: 1 } }
    );
    if (result) return true;
    return false;
};

const toggleSongLike = async (userId, songId) => {
    const userObjectId = new mongoose.Types.ObjectId(userId);

    const song = await Song.findById(songId);
    if (!song) return null;

    const alreadyLiked = song.likes.some(id => id.equals(userObjectId));

    let updatedSong;
    let status;

    if (alreadyLiked) {
        updatedSong = await Song.findByIdAndUpdate(
            songId,
            { $pull: { likes: userObjectId } },
            { new: true }
        );
        status = 'unliked';
    } else {
        updatedSong = await Song.findByIdAndUpdate(
            songId,
            { $addToSet: { likes: userObjectId } },
            { new: true }
        );
        status = 'liked';
    }

    return { status, likeCount: updatedSong.likes.length };
};

const getAudioStreamUrl = async (songId) => {
    const song = await Song.findById(songId);
    if (!song) return null;

    return song.audioUrl; 
};


const addToQueue = async (userId, songId) => {
    const song = await Song.findById(songId);
    if (!song) return null;

    const player = await Player.findOneAndUpdate(
        { userId },
        { $addToSet: { queue: songId } }, // tránh trùng bài
        { new: true, upsert: true }
    ).populate('queue');

    return player.queue.map(song => ({
        _id: song._id,
        title: song.title,
        artistId: song.artistId,
        duration: song.duration,
        imageUrl: song.imageUrl,
    }));
};

const skipToNext = async (userId) => {
    const player = await Player.findOne({ userId }).populate('queue');

    if (!player || !player.queue || player.queue.length === 0) return null;

    const nextSong = player.queue[0];

    const updatedPlayer = await Player.findOneAndUpdate(
        { userId },
        {
            currentSong: nextSong._id,
            $pop: { queue: -1 }, // xoá phần tử đầu tiên trong mảng
            isPlaying: true
        },
        { new: true }
    ).populate('queue');

    return {
        currentSong: {
            _id: nextSong._id,
            title: nextSong.title,
            artistId: nextSong.artistId,
            duration: nextSong.duration,
            imageUrl: nextSong.imageUrl,
            audioUrl: nextSong.audioUrl
        },
        queue: updatedPlayer.queue.map(song => ({
            _id: song._id,
            title: song.title,
            artistId: song.artistId,
            duration: song.duration,
            imageUrl: song.imageUrl
        }))
    };
};

const getQueue = async (userId) => {
    const player = await Player.findOne({ userId }).populate('queue');

    if (!player) return null;

    return player.queue.map(song => ({
        _id: song._id,
        title: song.title,
        artistId: song.artistId,
        duration: song.duration,
        imageUrl: song.imageUrl
    }));
};

const toggleRepeatMode = async (userId) => {
    const player = await Player.findOne({ userId });

    let newRepeatMode = true;

    if (player) {
        newRepeatMode = !player.repeatMode;
    }

    const updatedPlayer = await Player.findOneAndUpdate(
        { userId },
        { repeatMode: newRepeatMode },
        { new: true, upsert: true }
    );

    return updatedPlayer.repeatMode;
};
module.exports = {
    incrementPlayCount,
    toggleSongLike,
    getAudioStreamUrl,
    addToQueue,
    skipToNext,
    getQueue,
    toggleRepeatMode
};
