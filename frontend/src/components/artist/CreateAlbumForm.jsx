import React, { useState } from "react";
import "./CreateDialog.scss";

const CreateAlbumForm = ({ songs = [], onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [cover, setCover] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");

  const handleSelect = (id) => {
    setError("");
    setSelected((prev) => {
      if (prev.includes(id)) {
        return prev.filter((sid) => sid !== id);
      } else {
        if (prev.length >= 30) {
          setError("You can select up to 30 songs in an album.");
          return prev;
        }
        return [...prev, id];
      }
    });
  };

  const handleCover = (e) => {
    setCover(e.target.files[0]);
  };


  const handleSubmit = (e, publish = false) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("You must enter an album name.");
      return;
    }
    if (selected.length === 0) {
      setError("You must select at least one song to create an album.");
      return;
    }
    setError("");
    onCreate && onCreate({ name, desc, cover, songIds: selected, published: publish });
  };

  return (
    <form className="create-dialog-form relative" onSubmit={e => handleSubmit(e, false)}>
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute -top-1.2 right-0 text-gray-400 hover:text-white cursor-pointer  text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
      >
        &times;
      </button>
      <h2 style={{paddingRight: 32}}>Create New Album</h2>
      <label>Album Name *</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter album name"
        required
      />
      <label>Cover Image</label>
      <input type="file" accept="image/*" onChange={handleCover} />
      <label>Description</label>
      <textarea
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Enter album description"
        rows={3}
      />
      <label>Select Songs (Max 30 songs)</label>
      <div className="select-songs-list">
        {songs.map((song) => {
          const isSelected = selected.includes(song.id);
          const isDisabled = !isSelected && selected.length >= 30;
          return (
            <div
              key={song.id}
              className={`select-song-row${isSelected ? " selected" : ""}`}
              onClick={() => !isDisabled && handleSelect(song.id)}
              style={{ cursor: !isDisabled ? 'pointer' : 'not-allowed', opacity: !isDisabled ? 1 : 0.6, background: isDisabled ? '#333' : undefined }}
            >
              <span>{song.name}</span>
              <span className="duration">{song.duration}</span>
            </div>
          );
        })}
      </div>
      <div className="selected-count">Selected: {selected.length} songs</div>
      {error && <div className="form-error">{error}</div>}
      <div className="form-actions" style={{display: 'flex', gap: 12, justifyContent: 'flex-end'}}>
        <button type="submit" className="primary">Save Album</button>
        <button type="button" className="primary" style={{background: '#ca1717ff'}} onClick={e => handleSubmit(e, true)}>Request Approval</button>
      </div>
    </form>
  );
};

export default CreateAlbumForm;
