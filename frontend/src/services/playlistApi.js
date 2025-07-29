import axiosInstance from "../configs/axios";

// Create a new playlist
export const createPlaylist = async ({
  name,
  description,
  isPublic,
  cover,
}) => {
  const formData = new FormData();
  formData.append("name", name);
  if (description) formData.append("description", description);
  formData.append("isPublic", isPublic);
  if (cover) formData.append("cover", cover); // cover is a File object

  const response = await axiosInstance.post("/playlists", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

// Update an existing playlist
export const updatePlaylist = async ({
  playlistId,
  name,
  description,
  isPublic,
  cover,
}) => {
  const formData = new FormData();
  if (name) formData.append("name", name);
  if (description) formData.append("description", description);
  if (typeof isPublic !== "undefined") formData.append("isPublic", isPublic);
  if (cover) formData.append("cover", cover);

  const response = await axiosInstance.put(
    `/playlists/${playlistId}`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );
  return response.data;
};

// Add a song to a playlist
export const addSongToPlaylist = async ({ playlistId, songId }) => {
  const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, {
    songId,
  });
  return response.data;
};

// Remove a song from a playlist
export const removeSongFromPlaylist = async ({ playlistId, songId }) => {
  const response = await axiosInstance.delete(
    `/playlists/${playlistId}/songs/${songId}`
  );
  return response.data;
};

// Delete a playlist
export const deletePlaylist = async ({ playlistId }) => {
  const response = await axiosInstance.delete(`/playlists/${playlistId}`);
  return response.data;
};

// Get all playlists created by the current user
export const getUserPlaylists = async () => {
  const response = await axiosInstance.get("/playlists");
  return response.data;
};

// Get a specific playlist by ID
export const getPlaylistById = async ({ playlistId }) => {
  const response = await axiosInstance.get(`/playlists/${playlistId}`);
  return response.data;
};
