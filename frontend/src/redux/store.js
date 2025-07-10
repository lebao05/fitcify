import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice"; // Adjust the path as necessary
import userReducer from "./slices/userSlice"; // Adjust the path as necessary
export const store = configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
  },
  devTools: true, // Force enable DevTools
});