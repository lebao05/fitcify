// src/store/slices/artistSongSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  uploadSong,
  updateSong,
  deleteSong,
  getAllSongs,
  getSongById,
} from "../../services/artistApi";

// ───── THUNKS ─────

// ── Upload ──
export const uploadArtistSong = createAsyncThunk(
  "artistSongs/uploadArtistSong",
  async (formData, thunkAPI) => {
    try {
      const res = await uploadSong(formData);
      return res.data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Upload failed"
      );
    }
  }
);

// ── Update ──
export const updateArtistSong = createAsyncThunk(
  "artistSongs/updateArtistSong",
  async ({ songId, data }, thunkAPI) => {
    try {
      const res = await updateSong(songId, data);
      console.log(res);
      return res.data.Data;
    } catch (error) {
      console.error("An error happend", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Update failed"
      );
    }
  }
);

// ── Delete ──
export const deleteArtistSong = createAsyncThunk(
  "artistSongs/deleteArtistSong",
  async (songId, thunkAPI) => {
    try {
      await deleteSong(songId);
      return songId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Delete failed"
      );
    }
  }
);

// ── Get All ──
export const fetchArtistSongs = createAsyncThunk(
  "artistSongs/fetchArtistSongs",
  async (_, thunkAPI) => {
    try {
      const res = await getAllSongs();
      return res.data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Fetch songs failed"
      );
    }
  }
);

// ── Get By ID ──
export const fetchArtistSongById = createAsyncThunk(
  "artistSongs/fetchArtistSongById",
  async (songId, thunkAPI) => {
    try {
      const res = await getSongById(songId);
      return res.data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Fetch song failed"
      );
    }
  }
);

// ───── INITIAL STATE ─────
const initialState = {
  songs: [],
  selectedSong: null,
  loading: false,
  error: null,
};

// ───── SLICE ─────
const artistSongSlice = createSlice({
  name: "artistSongs",
  initialState,
  reducers: {
    clearSelectedSong: (state) => {
      state.selectedSong = null;
    },
    setSelectedSong: (state, action) => {
      state.selectedSong = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // ── Upload ──
      .addCase(uploadArtistSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(uploadArtistSong.fulfilled, (state, action) => {
        state.songs.push(action.payload);
        state.loading = false;
      })
      .addCase(uploadArtistSong.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Update ──
      .addCase(updateArtistSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateArtistSong.fulfilled, (state, action) => {
        const index = state.songs.findIndex((s) => s.id === action.payload.id);
        if (index !== -1) state.songs[index] = action.payload;
        state.loading = false;
      })
      .addCase(updateArtistSong.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Delete ──
      .addCase(deleteArtistSong.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteArtistSong.fulfilled, (state, action) => {
        state.songs = state.songs.filter((s) => s.id !== action.payload);
        state.loading = false;
      })
      .addCase(deleteArtistSong.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Fetch All ──
      .addCase(fetchArtistSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistSongs.fulfilled, (state, action) => {
        state.songs = action.payload;
        state.loading = false;
      })
      .addCase(fetchArtistSongs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Fetch By ID ──
      .addCase(fetchArtistSongById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchArtistSongById.fulfilled, (state, action) => {
        state.selectedSong = action.payload;
        state.loading = false;
      })
      .addCase(fetchArtistSongById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// ───── EXPORTS ─────
export const { clearSelectedSong, setSelectedSong } = artistSongSlice.actions;
export default artistSongSlice.reducer;
