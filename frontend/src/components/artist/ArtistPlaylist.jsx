import React, { useState, useEffect } from "react";
import testImg from "../../assets/test.jpg";
import PlaylistCard from "../user/PlaylistCard.jsx";
import CreatePlaylistForm from "./CreatePlaylistForm.jsx";
import PlaylistManagingModal from "./PlaylistManagingModal.jsx";
import "./ArtistSection.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylistsOfAnArtist } from "../../redux/slices/artistPlaylistSlice.js";
import { fetchArtistSongs } from "../../redux/slices/artistSongSlice.js";

const mockPlaylists = [
  {
    id: 1,
    name: "Liked Songs",
    creator: "Spotify",
    image: testImg,
    isPinned: true,
  },
  { id: 2, name: "My Playlist #2", creator: "Ngọc Hiếu", image: testImg },
  { id: 3, name: "Acoustic Favorites", creator: "Spotify", image: testImg },
  { id: 4, name: "This Is Taylor Swift", creator: "Spotify", image: testImg },
  { id: 5, name: "Top Nghệ Sĩ Việt 2024", creator: "Spotify", image: testImg },
  { id: 6, name: "Reading Soundtrack", creator: "Spotify", image: testImg },
  { id: 7, name: "My Playlist #1", creator: "Ngọc Hiếu", image: testImg },
];
const mockSongs = [
  { id: 1, name: "Anti-Hero", artist: "Taylor Swift", duration: "3:20" },
  { id: 2, name: "Mascara", artist: "Chillies", duration: "4:01" },
  { id: 3, name: "Hẹn Một Mai", artist: "Bùi Anh Tuấn", duration: "5:00" },
];

const ArtistPlaylist = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const songs = useSelector((state) => state.artistSong.songs);
  const playlists = useSelector((state) => state.artistPlaylist.playlists);
  const data = playlists && playlists.length > 0 ? playlists : mockPlaylists;
  const songList = songs.length > 0 ? songs : mockSongs;
  const [editPlaylist, setEditPlaylist] = useState(null);
  useEffect(() => {
    dispatch(getPlaylistsOfAnArtist());
    dispatch(fetchArtistSongs());
  }, [getPlaylistsOfAnArtist, fetchArtistSongs]);
  const handleCreatePlaylist = () => {
    setShowForm(false);
    console.log("DONE");
  };

  const handleEditClick = (playlist) => {
    setEditPlaylist(playlist);
  };

  const handleSaveEdit = () => {
    setEditPlaylist(null);
  };

  const handleDelete = () => {
    setEditPlaylist(null);
  };

  return (
    <div className="artist-playlist-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2>Playlists</h2>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Create new playlist
        </button>
      </div>
      {showForm && (
        <div className="create-form-modal">
          <div
            className="create-form-modal-backdrop"
            onClick={() => setShowForm(false)}
          />
          <div className="create-form-modal-content">
            <CreatePlaylistForm
              songs={songList}
              onCreate={handleCreatePlaylist}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      <div className="playlist-grid">
        {data.map((playlist, index) => (
          <div
            key={index}
            style={{ cursor: "pointer" }}
            onClick={() => handleEditClick(playlist)}
          >
            <PlaylistCard playlist={playlist} isButton="" />
          </div>
        ))}
      </div>
      {editPlaylist && (
        <PlaylistManagingModal
          playlist={editPlaylist}
          songs={songList}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
          onClose={() => setEditPlaylist(null)}
        />
      )}
    </div>
  );
};

export default ArtistPlaylist;
