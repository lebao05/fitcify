import axiosInstance from "../configs/axios";

export const fetchAudioStreamUrl = async (songId) => {
  try {
    const response = await axiosInstance.get(`/music/songs/${songId}/stream`, {
      responseType: "blob", // fetch audio as binary
      headers: {
        Range: "bytes=0-",
      },
    });

    const blob = new Blob([response.data], { type: "audio/mpeg" });
    const url = URL.createObjectURL(blob);
    return url;
  } catch (error) {
    console.error("Error fetching audio:", error);
    throw error;
  }
};

export const getAlbumById = async (albumId) => {
  try {
    const response = await axiosInstance.get(`/music/albums/${albumId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching album:", error);
    throw error;
  }
};

/**
 * Fetch all albums of an artist by artist ID.
 * GET /music/artists/:artistId/albums
 */
export const getAlbumsByArtistId = async (artistId) => {
  try {
    const response = await axiosInstance.get(
      `/music/artists/${artistId}/albums`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching albums of artist:", error);
    throw error;
  }
};
export const getTopSongs = async () => {
  try {
    const response = await axiosInstance.get(`/music/top/songs`);
    return response.data;
  } catch (error) {
    console.error("Error fetchig:", error);
    throw error;
  }
};
export const getTopArtists = async () => {
  try {
    const response = await axiosInstance.get(`/music/top/artists`);
    return response.data;
  } catch (error) {
    console.error("Error fetchig:", error);
    throw error;
  }
};
export const getTopAlbums = async () => {
  try {
    const response = await axiosInstance.get(`/music/top/albums`);
    return response.data;
  } catch (error) {
    console.error("Error fetchig:", error);
    throw error;
  }
};
export const playAnAlbum = async (albumId, songOrder = 0) => {
  try {
    const response = await axiosInstance.post(
      `/music/play/album/${albumId}?songOrder=${songOrder}`
    );
    return response.data;
  } catch (error) {
    console.error("Error playing album:", error);
    throw error;
  }
};

// === Play a playlist ===
export const playAPlaylist = async (playlistId, songOrder = 0) => {
  try {
    const response = await axiosInstance.post(
      `/music/play/playlist/${playlistId}?songOrder=${songOrder}`
    );
    return response.data;
  } catch (error) {
    console.error("Error playing playlist:", error);
    throw error;
  }
};

// === Play an artist ===
export const playAnArtist = async (artistId) => {
  try {
    const response = await axiosInstance.post(`/music/play/artist/${artistId}`);
    return response.data;
  } catch (error) {
    console.error("Error playing artist:", error);
    throw error;
  }
};

// === Play a specific song ===
export const playASong = async (songId) => {
  try {
    const response = await axiosInstance.post(`/music/play-song`, { songId });
    return response.data;
  } catch (error) {
    console.error("Error playing song:", error);
    throw error;
  }
};

// === Previous track ===
export const playPrevious = async () => {
  try {
    const response = await axiosInstance.post(`/music/previous`);
    return response.data;
  } catch (error) {
    console.error("Error going to previous track:", error);
    throw error;
  }
};

// === Next track ===
export const playNext = async () => {
  try {
    const response = await axiosInstance.post(`/music/next`);
    return response.data;
  } catch (error) {
    console.error("Error going to next track:", error);
    throw error;
  }
};
