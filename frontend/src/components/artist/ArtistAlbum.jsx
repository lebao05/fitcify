import React, { useState, useEffect } from "react";
import testImg from "../../assets/test.jpg";
import AlbumCard from "../user/AlbumCard.jsx";
import CreateAlbumForm from "./CreateAlbumForm.jsx";
import AlbumManagingModal from "./AlbumManagingModal.jsx";
import { fetchArtistSongs } from "../../redux/slices/artistSongSlice.js";
import "./ArtistSection.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumsOfAnArtist } from "../../redux/slices/artistAlbumSlice.js";
const ArtistAlbum = () => {
  const dispatch = useDispatch();
  const albums = useSelector((state) => state.artistAlbum.albums);
  const [showForm, setShowForm] = useState(false);
  const songs = useSelector((state) => state.artistSong.songs);

  const [editAlbum, setEditAlbum] = useState(null);
  // Ensure all albums have a status for demo/testing
  const data = albums.map((album) => ({
    ...album,
    status: album.status || "draft",
  }));
  const songList = songs;

  useEffect(() => {
    dispatch(fetchArtistSongs());
    dispatch(getAlbumsOfAnArtist());
  }, [fetchArtistSongs, getAlbumsOfAnArtist]);

  const handleCreateAlbum = () => {
    setShowForm(false);
  };

  const handleEditClick = (album) => {
    setEditAlbum(album);
  };

  const handleSaveEdit = () => {
    setEditAlbum(null);
  };

  const handleDelete = () => {
    setEditAlbum(null);
  };

  return (
    <div className="artist-album-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2>Albums</h2>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Create new album
        </button>
      </div>
      <div className="album-grid">
        {data.map((album) => (
          <div
            key={album._id}
            album={album}
            style={{ cursor: "pointer" }}
            onClick={() => handleEditClick(album)}
          >
            <AlbumCard album={album} isButton="" />
          </div>
        ))}
      </div>
      {showForm && (
        <div className="create-form-modal">
          <div
            className="create-form-modal-backdrop"
            onClick={() => setShowForm(false)}
          />
          <div className="create-form-modal-content">
            <CreateAlbumForm
              songs={songList}
              onCreate={handleCreateAlbum}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      {editAlbum && (
        <AlbumManagingModal
          album={editAlbum}
          songs={songList}
          onSave={handleSaveEdit}
          onDelete={handleDelete}
          onClose={() => setEditAlbum(null)}
        />
      )}
    </div>
  );
};

export default ArtistAlbum;
