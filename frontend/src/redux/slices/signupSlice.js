// src/features/signup/signupSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  email: "",
  password: "",
  name: "",
  dateOfBirth: {
    day: "",
    month: "",
    year: "",
  },
  gender: "",
};

const signupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setEmail: (state, action) => {
      state.email = action.payload;
    },
    setPassword: (state, action) => {
      state.password = action.payload;
    },
    setName: (state, action) => {
      state.name = action.payload;
    },
    setDateOfBirth: (state, action) => {
      state.dateOfBirth = action.payload;
    },
    setGender: (state, action) => {
      state.gender = action.payload;
    },
    resetSignup: () => initialState,
  },
});

export const {
  setEmail,
  setPassword,
  setName,
  setDateOfBirth,
  setGender,
  resetSignup,
} = signupSlice.actions;

export default signupSlice.reducer;
