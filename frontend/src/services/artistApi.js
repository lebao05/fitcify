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
export const updateSong = async (
  songId,
  { title, albumId, audioFile, imageFile }
) => {
  const formData = new FormData();
  if (title) formData.append("title", title);
  if (albumId) formData.append("albumId", albumId);
  if (audioFile) formData.append("audio", audioFile);
  if (imageFile) formData.append("image", imageFile);

  return axios.put(`/artist/songs/${songId}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};
export const deleteSong = async (songId) => {
  return await axios.delete(`/artist/songs/${songId}`);
};
export const getAllSongs = async () => {
  return await axios.get("/artist/songs");
};
export const getSongById = async (songId) => {
  return await axios.get(`/artist/songs/${songId}`);
};
// Create an album
export const createAlbum = async (formData) => {
  const res = await axios.post("/artist/albums", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update an album
export const updateAlbum = async (albumId, formData) => {
  const res = await axios.put(`/artist/albums/${albumId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete an album
export const deleteAlbum = async (albumId) => {
  const res = await axios.delete(`/artist/albums/${albumId}`);
  return res.data;
};
//Get Albums of an artist
export const getAlbumsOfAnAritst = async () => {
  const res = await axios.get(`/artist/albums/me`);
  return res.data;
};
export const getPlaylistOfAnAritst = async () => {
  const res = await axios.get(`/artist/playlists/me`);
  return res.data;
};
/* ───── PLAYLIST MANAGEMENT ───── */

// Create a playlist
export const createPlaylist = async (formData) => {
  const res = await axios.post("/artist/playlists", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Update a playlist
export const updatePlaylist = async (playlistId, formData) => {
  const res = await axios.put(`/artist/playlists/${playlistId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Delete a playlist
export const deletePlaylist = async (playlistId) => {
  const res = await axios.delete(`/artist/playlists/${playlistId}`);
  return res.data;
};
export const getArtistProfile = async (artistId) => {
  const res = await axios.get(`/artist/profile/${artistId}`);
  return res.data;
};
