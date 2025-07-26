import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice"; // Adjust the path as necessary
import userReducer from "./slices/userSlice"; // Adjust the path as necessary
import artistSongReducer from "./slices/artistSongSlice"; 
import artistAlbumReducer from "./slices/artistAlbumSlice";
import artistPlaylistReducer from "./slices/artistPlaylistSlice";
export const store = configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
    artistSong: artistSongReducer,
    artistAlbum: artistAlbumReducer,
    artistPlaylist: artistPlaylistReducer,
  },
  devTools: true, // Force enable DevTools
});
