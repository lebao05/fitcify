import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as artistApi from "../../services/artistApi";

// ───── Async Thunks ─────
export const createAlbum = createAsyncThunk(
  "artistAlbum/createAlbum",
  async (formData, thunkAPI) => {
    try {
      return await artistApi.createAlbum(formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const updateAlbum = createAsyncThunk(
  "artistAlbum/updateAlbum",
  async ({ albumId, formData }, thunkAPI) => {
    try {
      return await artistApi.updateAlbum(albumId, formData);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const deleteAlbum = createAsyncThunk(
  "artistAlbum/deleteAlbum",
  async (albumId, thunkAPI) => {
    try {
      return await artistApi.deleteAlbum(albumId);
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
export const getAlbumsOfAnArtist = createAsyncThunk(
  "artistAlbum/getAlbumsOfAnArtist",
  async (_, thunkAPI) => {
    try {
      const result = await artistApi.getAlbumsOfAnAritst(); // typo in function name kept as-is
      return result.Data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || err.message);
    }
  }
);
// ───── Slice ─────
const artistAlbumSlice = createSlice({
  name: "artistAlbum",
  initialState: {
    albums: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder

      // Create Album
      .addCase(createAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAlbum.fulfilled, (state, action) => {
        state.loading = false;
        state.albums.push(action.payload);
      })
      .addCase(createAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Update Album
      .addCase(updateAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAlbum.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete Album
      .addCase(deleteAlbum.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAlbum.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(deleteAlbum.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get Albums of an Artist
      .addCase(getAlbumsOfAnArtist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAlbumsOfAnArtist.fulfilled, (state, action) => {
        state.loading = false;
        state.albums = action.payload;
      })
      .addCase(getAlbumsOfAnArtist.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export default artistAlbumSlice.reducer;
