import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  playAnAlbum,
  playAPlaylist,
  playAnArtist,
  playASong,
  playPrevious,
  playNext,
  getCurrentPlayerSong,
} from "../../services/musicApi";

// ─── Thunks ───
export const playSongThunk = createAsyncThunk(
  "player/playSong",
  async (songId, thunkAPI) => {
    try {
      const data = await playASong(songId);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Play song failed"
      );
    }
  }
);

export const playAlbumThunk = createAsyncThunk(
  "player/playAlbum",
  async ({ albumId, songOrder }, thunkAPI) => {
    try {
      const data = await playAnAlbum(albumId, songOrder);
      console.log("Playing album:", data);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Play album failed"
      );
    }
  }
);
export const fetchCurrentSongThunk = createAsyncThunk(
  "player/fetchCurrentSong",
  async (_, thunkAPI) => {
    try {
      const data = await getCurrentPlayerSong();
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Fetch current song failed"
      );
    }
  }
);
export const playPlaylistThunk = createAsyncThunk(
  "player/playPlaylist",
  async ({ playlistId, songOrder }, thunkAPI) => {
    try {
      const data = await playAPlaylist(playlistId, songOrder);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Play playlist failed"
      );
    }
  }
);

export const playArtistThunk = createAsyncThunk(
  "player/playArtist",
  async (artistId, thunkAPI) => {
    try {
      const data = await playAnArtist(artistId);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Play artist failed"
      );
    }
  }
);

export const playPreviousThunk = createAsyncThunk(
  "player/playPrevious",
  async (_, thunkAPI) => {
    try {
      const data = await playPrevious();
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Previous track failed"
      );
    }
  }
);

export const playNextThunk = createAsyncThunk(
  "player/playNext",
  async (_, thunkAPI) => {
    try {
      const data = await playNext();
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Next track failed"
      );
    }
  }
);

// ─── Slice ───
const playerSlice = createSlice({
  name: "player",
  initialState: {
    currentSong: null,
    isPlaying: false,
    loading: false,
    error: null,
    autoplay: false,
  },
  reducers: {
    togglePlay(state) {
      if (state.currentSong) {
        state.isPlaying = !state.isPlaying;
      }
    },
    setAutoplay(state, action) {
      state.autoplay = action.payload;
    },
  },
  extraReducers: (builder) => {
    const addCases = (thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.isPlaying = false;
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.isPlaying = true;
          state.loading = false;
          state.currentSong = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };
    const addGetCurrentSongCases = (thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.currentSong = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };
    // Apply to all thunks
    addCases(playSongThunk);
    addCases(playAlbumThunk);
    addCases(playPlaylistThunk);
    addCases(playArtistThunk);
    addCases(playPreviousThunk);
    addCases(playNextThunk);
    addGetCurrentSongCases(fetchCurrentSongThunk);
  },
});

export default playerSlice.reducer;
export const { togglePlay, setAutoplay } = playerSlice.actions;
