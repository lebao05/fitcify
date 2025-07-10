import React, { useState } from "react";
import "./CreateDialog.scss";

const UploadSongForm = ({ onUpload, onCancel }) => {
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [album, setAlbum] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };
  const handleCover = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!file || !title || !genre || !date) {
      setError("Please fill in all required fields and select an audio file.");
      return;
    }
    setError("");
    onUpload && onUpload({ file, cover, title, genre, album, date, desc });
  };

  return (
    <form className="create-dialog-form" onSubmit={handleSubmit}>
      <h2 style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ display: "flex", alignItems: "center" }}>
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V5M12 5l-5 5M12 5l5 5" />
            <rect x="3" y="19" width="18" height="2" rx="1" fill="white" />
          </svg>
        </span>
        Upload New Song
      </h2>
      <label>Audio File *</label>
      <input
        type="file"
        accept="audio/mp3,audio/wav,audio/flac,audio/m4a"
        onChange={handleFile}
        required
      />
      <label>Cover Image</label>
      <input type="file" accept="image/*" onChange={handleCover} />
      <div className="form-note">
        Supported formats: MP3, WAV, FLAC, M4A · Max size: 10MB
      </div>
      <label>Song Title *</label>
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Enter song title"
        required
      />
      <label>Genre *</label>
      <select value={genre} onChange={(e) => setGenre(e.target.value)} required>
        <option value="">Select genre</option>
        <option value="Pop">Pop</option>
        <option value="Rock">Rock</option>
        <option value="Ballad">Ballad</option>
        <option value="EDM">EDM</option>
        <option value="Indie">Indie</option>
        <option value="Other">Other</option>
      </select>
      <label>Album (Optional)</label>
      <input
        type="text"
        value={album}
        onChange={(e) => setAlbum(e.target.value)}
        placeholder="Enter album name"
      />
      <label>Release Date *</label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
      />
      <label>Description (Optional)</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Enter song description"
        rows={3}
      />
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions">
        <button
          type="submit"
          className="primary"
          style={{ background: "#1db954" }}
        >
          Upload Song
        </button>
        <button type="button" className="secondary" onClick={onCancel}>
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UploadSongForm;
