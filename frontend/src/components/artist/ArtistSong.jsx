import React, { useState } from "react";
import TrackItem from "../user/TrackItem.jsx";
import UploadSongForm from "./UploadSongForm.jsx";
import "./ArtistSection.scss";

const mockSongs = [
  { id: 1, name: "Anti-Hero", artist: "Taylor Swift", duration: "3:20" },
  { id: 2, name: "Mascara", artist: "Chillies", duration: "4:01" },
  { id: 3, name: "Hẹn Một Mai", artist: "Bùi Anh Tuấn", duration: "5:00" },
];

const ArtistSong = ({ songs }) => {
  const [showForm, setShowForm] = useState(false);
  const data = songs && songs.length > 0 ? songs : mockSongs;

  const handleUploadSong = (songData) => {
    alert("Upload song thành công!\n" + JSON.stringify(songData, null, 2));
    setShowForm(false);
  };

  return (
    <div className="artist-song-container">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <h2>Music</h2>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Upload Song
        </button>
      </div>
      {showForm && (
        <div className="create-form-modal">
          <div
            className="create-form-modal-backdrop"
            onClick={() => setShowForm(false)}
          />
          <div className="create-form-modal-content">
            <UploadSongForm
              onUpload={handleUploadSong}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}
      <div className="song-grid">
        <div className="song-table-container">
          <div className="song-table-header">
            <div className="song-col index">#</div>
            <div className="song-col title">Title</div>
            <div className="song-col album">Album</div>
            <div className="song-col duration">
              <svg
                width="18"
                height="18"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
            </div>
          </div>
          <div className="song-table-body">
            <div className="tracks-item-container">
              {data.map((song, idx) => (
                <TrackItem
                  key={song.id}
                  track={{
                    title: song.name,
                    artist: song.artist,
                    album: song.album || "Unknown Album",
                    date: song.date || "Feb 24, 2025",
                    duration: song.duration,
                    image: song.image || "/test.jpg",
                  }}
                  index={idx}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistSong;
