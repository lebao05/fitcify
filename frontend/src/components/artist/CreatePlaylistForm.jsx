import React, { useState } from "react";
import "./CreateDialog.scss";


const CreatePlaylistForm = ({ songs = [], onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const handleCover = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("You must select at least one song to create a playlist.");
      return;
    }
    setError("");
    onCreate && onCreate({ name, desc, cover, songIds: selected });
  };

  return (
    <form className="create-dialog-form relative" onSubmit={handleSubmit} >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute -top-1.2 right-0 text-gray-400 hover:text-white cursor-pointer  text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
      >
        &times;
      </button>
      <h2 style={{paddingRight: 32}}>Create New Playlist</h2>
      <label>Playlist Name *</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter playlist name"
        required
      />
      <label>Cover Image</label>
      <input type="file" accept="image/*" onChange={handleCover} />
      <label>Description</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Enter playlist description"
        rows={3}
      />
      <label>Select Songs (Max 100 songs)</label>
      <div className="select-songs-list">
        {songs.map((song) => (
          <div
            key={song.id}
            className={`select-song-row${selected.includes(song.id) ? " selected" : ""}`}
            onClick={() => handleSelect(song.id)}
          >
            <span>{song.name}</span>
            <span className="duration">{song.duration}</span>
          </div>
        ))}
      </div>
      <div className="selected-count">Selected: {selected.length} songs</div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions" style={{display: 'flex', justifyContent: 'flex-end'}}>
        <button type="submit" className="primary">Create Playlist</button>
      </div>
    </form>
  );
};

export default CreatePlaylistForm;
