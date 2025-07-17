const musicService = require('../services/musicService');

const toggleSongLike = async (req, res) => {
    const userId = req.user._id;
    const { songId } = req.params;

    try {
        const result = await musicService.toggleSongLike(userId, songId);
        if (!result) return res.status(404).json({ message: "Song not found" });

        return res.status(200).json({
            message: `Song successfully ${result.status}`,
            data: result
        });
    } catch (err) {
        console.error("toggleSongLike error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getAudioStreamUrl = async (req, res) => {
    const { songId } = req.params;

    try {
        const url = await musicService.getAudioStreamUrl(songId);
        if (!url) return res.status(404).json({ message: "Song not found" });

        return res.status(200).json({ audioUrl: url });
    } catch (err) {
        console.error("getAudioStreamUrl error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const addToQueue = async (req, res) => {
    const userId = req.user._id;
    const { songId } = req.params;

    try {
        const queue = await musicService.addToQueue(userId, songId);
        if (!queue) return res.status(404).json({ message: "Song not found or not approved" });

        return res.status(200).json({
            message: "Song added to queue",
            queue
        });
    } catch (err) {
        console.error("addToQueue error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const skipToNext = async (req, res) => {
    const userId = req.user._id;

    try {
        const result = await musicService.skipToNext(userId);
        if (!result) return res.status(404).json({ message: "Queue is empty or player not found" });

        return res.status(200).json({
            message: "Skipped to next song",
            data: result
        });
    } catch (err) {
        console.error("skipToNext error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const getQueue = async (req, res) => {
    const userId = req.user._id;

    try {
        const queue = await musicService.getQueue(userId);
        if (!queue) return res.status(404).json({ message: "Player not found or queue empty" });

        return res.status(200).json({
            message: "Fetched queue successfully",
            queue
        });
    } catch (err) {
        console.error("getQueue error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

const toggleRepeatMode = async (req, res) => {
    const userId = req.user._id;

    try {
        const repeatMode = await musicService.toggleRepeatMode(userId);

        return res.status(200).json({
            message: `Repeat mode is now ${repeatMode ? 'enabled' : 'disabled'}`,
            repeatMode
        });
    } catch (err) {
        console.error("toggleRepeatMode error:", err);
        return res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = {
    toggleSongLike,
    getAudioStreamUrl,
    addToQueue,
    skipToNext,
    getQueue,
    toggleRepeatMode
};
