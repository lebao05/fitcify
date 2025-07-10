// src/redux/slices/userSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { signup, login, verifyLoginOtp } from "../../services/authApi";

// ───── REGISTER ─────
export const registerUser = createAsyncThunk(
  "user/registerUser",
  async (formData, thunkAPI) => {
    try {
      const user = await signup(formData);
      return user;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Signup failed"
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
        error.response?.data?.message || "Password login failed"
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
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "OTP login failed"
      );
    }
  }
);

// ───── INITIAL STATE ─────
const initialState = {
  user: null,
  loading: false,
  error: null,
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
    // REGISTER
    builder
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

      // LOGIN WITH PASSWORD
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

      // LOGIN WITH OTP
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
      });
  },
});

export const { logoutUser } = userSlice.actions;

export default userSlice.reducer;
