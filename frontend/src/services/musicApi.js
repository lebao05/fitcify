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
