import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as artistApi from "../../services/artistApi";

// ───── Async Thunks ─────
export const createPlaylist = createAsyncThunk(
  "artistPlaylist/createPlaylist",
  async (formData, thunkAPI) => {
    try {
      return await artistApi.createPlaylist(formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updatePlaylist = createAsyncThunk(
  "artistPlaylist/updatePlaylist",
  async ({ playlistId, formData }, thunkAPI) => {
    try {
      console.log(playlistId);
      return await artistApi.updatePlaylist(playlistId, formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deletePlaylist = createAsyncThunk(
  "artistPlaylist/deletePlaylist",
  async (playlistId, thunkAPI) => {
    try {
      return await artistApi.deletePlaylist(playlistId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const getPlaylistsOfAnArtist = createAsyncThunk(
  "artistPlaylist/getPlaylistsOfAnArtist",
  async (_, thunkAPI) => {
    try {
      const result = await artistApi.getPlaylistOfAnAritst(); // typo in function name kept as-is
      return result.Data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
// ───── Slice ─────
const artistPlaylistSlice = createSlice({
  name: "artistPlaylist",
  initialState: {
    playlists: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Create Playlist
      .addCase(createPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPlaylist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createPlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Playlist
      .addCase(updatePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updatePlaylist.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.playlists.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) state.playlists[index] = action.payload;
      })
      .addCase(updatePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Playlist
      .addCase(deletePlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deletePlaylist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deletePlaylist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getPlaylistsOfAnArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getPlaylistsOfAnArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.playlists = action.payload;
      })
      .addCase(getPlaylistsOfAnArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default artistPlaylistSlice.reducer;
