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
