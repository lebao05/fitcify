import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  signup,
  login,
  logout as logoutApi,
  verifyLoginOtp,
} from "../../services/authApi"; // adjust if your file path is different
import { getProfileInfo, updateProfileInfo } from "../../services/userApi"; // Import user profile service
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
export const fetchUserFromCookie = createAsyncThunk(
  "user/fetchUserFromCookie",
  async (_, thunkAPI) => {
    try {
      const res = await getProfileInfo(); // must return { Data: { user } }
      console.log("Fetched user from cookie:", res);
      return res.Data;
    } catch (err) {
      console.error("Error fetching user from cookie:", err);
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Not authenticated"
      );
    }
  }
);
export const updateUserProfile = createAsyncThunk(
  "user/updateUserProfile",
  async ({ username, avatarFile }, thunkAPI) => {
    try {
      const formData = new FormData();
      formData.append("username", username);
      if (avatarFile) {
        formData.append("avatar", avatarFile); // 🔁 must match multer field name
      }

      const response = await updateProfileInfo(formData);
      return response.Data;
    } catch (error) {
      console.error("Error updating user profile:", error);
      return thunkAPI.rejectWithValue(
        error.response?.data?.Message || "Profile update failed"
      );
    }
  }
);

// ───── LOGIN WITH PASSWORD ─────
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

// ───── LOGIN WITH OTP ─────
export const loginWithOtp = createAsyncThunk(
  "user/loginWithOtp",
  async ({ email, otp }, thunkAPI) => {
    try {
      const response = await verifyLoginOtp({ email, otp });
      return response.Data.user;
    } catch (error) {
      console.error("Error in loginWithOtp:", error);
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
  user: null,
  loading: false,
  error: null,
  isInitialized: false, // Track if user data is initialized
};

// ───── SLICE ─────
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    logoutUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ───── REGISTER ─────
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ───── LOGIN WITH PASSWORD ─────
      .addCase(loginWithPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithPassword.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginWithPassword.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ───── LOGIN WITH OTP ─────
      .addCase(loginWithOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithOtp.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
      })
      .addCase(loginWithOtp.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })

      // ───── LOGOUT ─────
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.user = null;
        state.loading = false;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      })
      .addCase(fetchUserFromCookie.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserFromCookie.fulfilled, (state, action) => {
        state.user = action.payload;
        state.loading = false;
        state.isInitialized = true; // ✅ done loading
      })
      .addCase(fetchUserFromCookie.rejected, (state, action) => {
        state.user = null;
        state.error = action.payload;
        state.loading = false;
        state.isInitialized = true; // ✅ done loading
      })
      // ───── UPDATE USER PROFILE ─────
      .addCase(updateUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.user = action.payload; // updated user
        state.loading = false;
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.error = action.payload;
        state.loading = false;
      });
  },
});

// ───── EXPORTS ─────
export const { logoutUser } = userSlice.actions;
export default userSlice.reducer;
