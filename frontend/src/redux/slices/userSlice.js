import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signup,
  login,
  logout as logoutApi,
  verifyLoginOtp,
} from "../../services/authApi";

import {
  getMyProfile,
  updateProfileInfo,
  getUserProfileById,
} from "../../services/userApi";

// ───── REGISTER ─────
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, thunkAPI) => {
    try {
      const user = await signup(formData);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Signup failed"
      );
    }
  }
);

// ───── FETCH AUTHENTICATED USER ─────
export const fetchUserFromCookie = createAsyncThunk(
  "user/fetchUserFromCookie",
  async (_, thunkAPI) => {
    try {
      const res = await getMyProfile(); 
      return res.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Not authenticated"
      );
    }
  }
);

// ───── FETCH PROFILE BY ID (viewer) ─────
export const fetchCurrentProfileById = createAsyncThunk(
  "user/fetchCurrentProfileById",
  async (userId, thunkAPI) => {
    try {
      console.log("Fetching profile for userId:", userId);
      const res = await getUserProfileById(userId);
      return res.Data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Failed to fetch profile"
      );
    }
  }
);

// ───── UPDATE PROFILE ─────
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ username, avatarFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (avatarFile) {
        formData.append("avatar", avatarFile); // Must match multer field
      }
      const response = await updateProfileInfo(formData);
      return response.Data;
    } catch (error) {
      console.error("Update profile error:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Profile update failed"
      );
    }
  }
);

// ───── LOGIN ─────
export const loginWithPassword = createAsyncThunk(
  "user/loginWithPassword",
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await login({ email, password });
      return response.Data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Password login failed"
      );
    }
  }
);

export const loginWithOtp = createAsyncThunk(
  "user/loginWithOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const response = await verifyLoginOtp({ email, otp });
      return response.Data.user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "OTP login failed"
      );
    }
  }
);

// ───── LOGOUT ─────
export const logoutUserThunk = createAsyncThunk(
  "user/logoutUserThunk",
  async (_, thunkAPI) => {
    try {
      await logoutApi(); // server clears cookies
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Logout failed"
      );
    }
  }
);

// ───── INITIAL STATE ─────
const initialState = {
  myAuth: null, // authenticated user's profile
  currentProfile: null, // profile being viewed
  loading: false,
  error: null,
  isInitialized: false,
};

// ───── SLICE ─────
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.myAuth = null;
      state.currentProfile = null;
      state.isInitialized = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.myAuth = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.myAuth = action.payload;
        state.loading = false;
      })
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.myAuth = action.payload;
        state.loading = false;
      })
      .addCase(loginWithOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchUserFromCookie.fulfilled, (state, action) => {
        state.myAuth = action.payload;
        state.loading = false;
        state.isInitialized = true;
      })
      .addCase(fetchUserFromCookie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFromCookie.rejected, (state, action) => {
        state.myAuth = null;
        state.error = action.payload;
        state.loading = false;
        state.isInitialized = true;
      })

      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.myAuth = action.payload;
        state.loading = false;
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(fetchCurrentProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCurrentProfileById.fulfilled, (state, action) => {
        state.currentProfile = action.payload;
        state.loading = false;
      })
      .addCase(fetchCurrentProfileById.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.myAuth = null;
        state.currentProfile = null;
        state.isInitialized = false;
        state.loading = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// ───── EXPORTS ─────
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
