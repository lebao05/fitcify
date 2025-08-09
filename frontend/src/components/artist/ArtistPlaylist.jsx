import React, { useState, useEffect } from "react";
import testImg from "../../assets/test.jpg";
import PlaylistCard from "../user/PlaylistCard.jsx";
import CreatePlaylistForm from "./CreatePlaylistForm.jsx";
import PlaylistManagingModal from "./PlaylistManagingModal.jsx";
import "./ArtistSection.scss";
import { useDispatch, useSelector } from "react-redux";
import { getPlaylistsOfAnArtist } from "../../redux/slices/artistPlaylistSlice.js";
import { fetchArtistSongs } from "../../redux/slices/artistSongSlice.js";
const ArtistPlaylist = () => {
  const dispatch = useDispatch();
  const [showForm, setShowForm] = useState(false);
  const songs = useSelector((state) => state.artistSong.songs);
  const playlists = useSelector((state) => state.artistPlaylist.playlists);
  const data = playlists;
  const songList = songs;
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
            onClick={() => {
              handleEditClick(playlist);
            }}
          >
            <PlaylistCard
              playlist={playlist}
              disableNavigate={true}
              isButton=""
            />
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
