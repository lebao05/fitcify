import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice"; // Adjust the path as necessary
import userReducer from "./slices/userSlice"; // Adjust the path as necessary
import artistSongReducer from "./slices/artistSong"; // Adjust the path as necessary
export const store = configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
    artistSong: artistSongReducer, 
  },
  devTools: true, // Force enable DevTools
});