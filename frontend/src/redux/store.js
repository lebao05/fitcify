import { configureStore } from "@reduxjs/toolkit";
import signupReducer from "./slices/signupSlice"; // Adjust the path as necessary
import userReducer from "./slices/userSlice"; // Adjust the path as necessary
import artistSongReducer from "./slices/artistSongSlice";
import artistAlbumReducer from "./slices/artistAlbumSlice";
import artistPlaylistReducer from "./slices/artistPlaylistSlice";
import myCollectionSliceReducer from "./slices/myCollectionSlice"; // Ensure this is imported correctly
export const store = configureStore({
  reducer: {
    signup: signupReducer,
    user: userReducer,
    artistSong: artistSongReducer,
    artistAlbum: artistAlbumReducer,
    artistPlaylist: artistPlaylistReducer,
    myCollection: myCollectionSliceReducer, // Ensure this is imported correctly
  },
  devTools: true, // Force enable DevTools
});
