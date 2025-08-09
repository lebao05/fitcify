import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  createPlaylist as apiCreatePlaylist,
  updatePlaylist as apiUpdatePlaylist,
  deletePlaylist as apiDeletePlaylist,
  getUserPlaylists,
  getPlaylistById,
} from "../../services/playlistApi";
import {
  getTopSongs,
  getTopAlbums,
  getTopArtists,
  getLikedSongs,
} from "../../services/musicApi";
import {
  getFollowedArtists,
  getTopArtistsThisMonth,
  getTopSongsThisMonth,
} from "../../services/userApi";
// ───── THUNKS ─────
// ─── THUNKS ───
export const fetchTopSongs = createAsyncThunk(
  "music/fetchTopSongs",
  async (_, thunkAPI) => {
    try {
      const data = await getTopSongs();
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Failed to fetch top songs"
      );
    }
  }
);

export const fetchTopAlbums = createAsyncThunk(
  "music/fetchTopAlbums",
  async (_, thunkAPI) => {
    try {
      const data = await getTopAlbums();
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Failed to fetch top albums"
      );
    }
  }
);

export const fetchTopArtists = createAsyncThunk(
  "music/fetchTopArtists",
  async (_, thunkAPI) => {
    try {
      const data = await getTopArtists();
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Failed to fetch top artists"
      );
    }
  }
);
// ── Fetch All ──
export const fetchUserPlaylists = createAsyncThunk(
  "myCollection/fetchUserPlaylistIds",
  async (_, thunkAPI) => {
    try {
      const playlists = await getUserPlaylists();
      return playlists.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Fetch playlists failed"
      );
    }
  }
);

// ── Create ──
export const createUserPlaylist = createAsyncThunk(
  "myCollection/createUserPlaylist",
  async ({ name, description, isPublic, cover }, thunkAPI) => {
    try {
      const newPlaylist = await apiCreatePlaylist({
        name,
        description,
        isPublic,
        cover,
      });
      return newPlaylist.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Create playlist failed"
      );
    }
  }
);

// ── Update ──
export const updateUserPlaylist = createAsyncThunk(
  "myCollection/updateUserPlaylist",
  async ({ playlistId, name, description, isPublic, cover }, thunkAPI) => {
    try {
      const updated = await apiUpdatePlaylist({
        playlistId,
        name,
        description,
        isPublic,
        cover,
      });
      return updated;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Update playlist failed"
      );
    }
  }
);

// ── Delete ──
export const deleteUserPlaylist = createAsyncThunk(
  "myCollection/deleteUserPlaylist",
  async ({ playlistId }, thunkAPI) => {
    try {
      await apiDeletePlaylist({ playlistId });
      return playlistId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Delete playlist failed"
      );
    }
  }
);

// ─── Get By ID (optional for detail use) ───
export const fetchUserPlaylistById = createAsyncThunk(
  "myCollection/fetchUserPlaylistById",
  async ({ playlistId }, thunkAPI) => {
    try {
      const data = await getPlaylistById({ playlistId });
      return data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Fetch playlist failed"
      );
    }
  }
);
export const fetchLikedSongs = createAsyncThunk(
  "myCollection/fetchLikedSongs",
  async (songId, thunkAPI) => {
    try {
      const data = await getLikedSongs(songId);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Fetch liked songs failed"
      );
    }
  }
);
export const fetchTopSongsThisMonth = createAsyncThunk(
  "music/fetchTopSongsThisMonth",
  async ({ limit = 5 }, thunkAPI) => {
    try {
      const data = await getTopSongsThisMonth(limit);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Failed to fetch top songs this month"
      );
    }
  }
);

// Fetch Top Artists This Month (New)
export const fetchTopArtistsThisMonth = createAsyncThunk(
  "music/fetchTopArtistsThisMonth",
  async ({ limit = 5 }, thunkAPI) => {
    try {
      const data = await getTopArtistsThisMonth(limit);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message ||
          "Failed to fetch top artists this month"
      );
    }
  }
);
export const fetchFollowee = createAsyncThunk(
  "music/fetchFollowee",
  async (userId, thunkAPI) => {
    try {
      const data = await getFollowedArtists(userId);
      return data.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message ||
          "Failed to fetch top artists this month"
      );
    }
  }
);

// ───── INITIAL STATE ─────
const initialState = {
  topArtistsMonth: [],
  topSongsMonth: [],
  playlists: [],
  likedSongs: [],
  topSongs: [],
  topAlbums: [],
  topArtists: [],
  followees: [],
  loading: false,
  error: null,
};

// ───── SLICE ─────
const myCollectionSlice = createSlice({
  name: "myCollection",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ── Fetch All ──
      .addCase(fetchUserPlaylists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylists.fulfilled, (state, action) => {
        state.playlists = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPlaylists.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Create ──
      .addCase(createUserPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createUserPlaylist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(createUserPlaylist.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Update ──
      .addCase(updateUserPlaylist.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserPlaylist.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateUserPlaylist.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Delete ──
      .addCase(deleteUserPlaylist.fulfilled, (state, action) => {
        state.playlists = state.playlists.filter((id) => id !== action.payload);
      })
      .addCase(deleteUserPlaylist.rejected, (state, action) => {
        state.error = action.payload;
      })

      // ── Fetch By ID ──
      .addCase(fetchUserPlaylistById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserPlaylistById.fulfilled, (state, action) => {
        state.selectedPlaylist = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserPlaylistById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchTopSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSongs.fulfilled, (state, action) => {
        state.topSongs = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopSongs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Top Albums ──
      .addCase(fetchTopAlbums.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopAlbums.fulfilled, (state, action) => {
        state.topAlbums = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopAlbums.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ── Top Artists ──
      .addCase(fetchTopArtists.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopArtists.fulfilled, (state, action) => {
        state.topArtists = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopArtists.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchLikedSongs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLikedSongs.fulfilled, (state, action) => {
        state.likedSongs = action.payload;
        state.loading = false;
      })
      .addCase(fetchLikedSongs.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchTopSongsThisMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSongsThisMonth.fulfilled, (state, action) => {
        state.topSongsMonth = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopSongsThisMonth.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchFollowee.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFollowee.fulfilled, (state, action) => {
        state.followees = action.payload;
        state.loading = false;
      })
      .addCase(fetchFollowee.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // Fetch Top Artists This Month
      .addCase(fetchTopArtistsThisMonth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopArtistsThisMonth.fulfilled, (state, action) => {
        state.topArtistsMonth = action.payload;
        state.loading = false;
      })
      .addCase(fetchTopArtistsThisMonth.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

export default myCollectionSlice.reducer;
