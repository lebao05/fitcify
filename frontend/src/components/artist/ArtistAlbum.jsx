import React, { useState, useEffect } from "react";
import testImg from "../../assets/test.jpg";
import AlbumCard from "../user/AlbumCard.jsx";
import CreateAlbumForm from "./CreateAlbumForm.jsx";
import AlbumManagingModal from "./AlbumManagingModal.jsx";
import { fetchArtistSongs } from "../../redux/slices/artistSongSlice.js";
import "./ArtistSection.scss";
import { useDispatch, useSelector } from "react-redux";
import { getAlbumsOfAnArtist } from "../../redux/slices/artistAlbumSlice.js";
const mockAlbums = [
  {
    id: 1,
    name: "1989 (Taylor's Version)",
    artist: "Taylor Swift",
    image: testImg,
    status: "draft",
  },
  {
    id: 2,
    name: "Chillies Album",
    artist: "Chillies",
    image: testImg,
    status: "pending",
  },
  {
    id: 3,
    name: "The Best of 2025",
    artist: "Various Artists",
    image: testImg,
    status: "approved",
  },
];
const mockSongs = [
  { id: 1, name: "Anti-Hero", artist: "Taylor Swift", duration: "3:20" },
  { id: 2, name: "Mascara", artist: "Chillies", duration: "4:01" },
  { id: 3, name: "Hẹn Một Mai", artist: "Bùi Anh Tuấn", duration: "5:00" },
];
const ArtistAlbum = () => {
  const dispatch = useDispatch();
  const albums = useSelector((state) => state.artistAlbum.albums);
  const [showForm, setShowForm] = useState(false);
  const songs = useSelector((state) => state.artistSong.songs);

  const [editAlbum, setEditAlbum] = useState(null);
  // Ensure all albums have a status for demo/testing
  const data = (albums && albums.length > 0 ? albums : mockAlbums).map(
    (album) => ({
      ...album,
      status: album.status || "draft",
    })
  );
  const songList = songs.length > 0 ? songs : mockSongs;

  useEffect(() => {
    dispatch(fetchArtistSongs());
    dispatch(getAlbumsOfAnArtist());
  }, [fetchArtistSongs, getAlbumsOfAnArtist]);

  const handleCreateAlbum = (albumData) => {
    alert("Album created successfully!\n" + JSON.stringify(albumData, null, 2));
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
