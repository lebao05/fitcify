import axios from "../configs/axios";

export const uploadSong = async ({ title, albumId, audioFile, imageFile }) => {
  const formData = new FormData();
  formData.append("title", title);
  if (albumId) formData.append("albumId", albumId);
  formData.append("audio", audioFile);
  if (imageFile) formData.append("image", imageFile);

  return axios.post("/artist/songs", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const updateSong = async (songId, { title, albumId, audioFile, imageFile }) => {
  const formData = new FormData();
  if (title) formData.append("title", title);
  if (albumId) formData.append("albumId", albumId);
  if (audioFile) formData.append("audio", audioFile);
  if (imageFile) formData.append("image", imageFile);

  return axios.patch(`/artist/songs/${songId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteSong = async (songId) => {
  return axios.delete(`/artist/songs/${songId}`);
};
export const getAllSongs = async () => {
  return axios.get("/artist/songs");
};
export const getSongById = async (songId) => {
  return axios.get(`/artist/songs/${songId}`);
};
