import React, { useState } from "react";
import "./CreateDialog.scss";
import { useDispatch, useSelector } from "react-redux";
import {
  createAlbum,
  getAlbumsOfAnArtist,
} from "../../redux/slices/artistAlbumSlice";
import { fetchArtistSongs } from "../../redux/slices/artistSongSlice";

const CreateAlbumForm = ({ songs = [], onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [cover, setCover] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const dispatch = useDispatch();

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

  const handleCover = (e) => setCover(e.target.files[0]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Album name is required.");
      return;
    }

    if (!cover) {
      setError("Cover image is required.");
      return;
    }

    if (selected.length === 0) {
      setError("You must select at least one song.");
      return;
    }

    setError("");

    const formData = new FormData();
    formData.append("title", name);
    formData.append("coverImage", cover);
    selected.forEach((id) => formData.append("songIds", id));

    await dispatch(createAlbum(formData));
    await dispatch(getAlbumsOfAnArtist());
    await dispatch(fetchArtistSongs());

    onCreate && onCreate();
  };

  return (
    <form
      className="create-dialog-form relative"
      onSubmit={handleSubmit}
    >
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute -top-1.2 right-0 text-gray-400 hover:text-white cursor-pointer text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
      >
        &times;
      </button>

      <h2 style={{ paddingRight: 32 }}>Create New Album</h2>

      {/* Album Name */}
      <label>Album Name *</label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter album name"
        className={!name.trim() && error ? "input-error" : ""}
        required
      />

      {/* Cover Image */}
      <label>Cover Image *</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleCover}
        className={!cover && error ? "input-error" : ""}
      />

      {/* Song List */}
      <label className="text-white font-medium block mb-2">
        Select Songs (Max 30 songs)
      </label>
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 mb-4">
        {songs.map((song) => {
          const isSelected = selected.includes(song._id);
          const isInAnotherAlbum = !!song.albumId;
          const isDisabled =
            isInAnotherAlbum || (!isSelected && selected.length >= 30);

          return (
            <div
              key={song._id}
              className={`
                flex justify-between items-center px-4 py-2 rounded-md transition-colors
                ${isSelected ? "bg-green-500 text-white" : "bg-gray-800 text-gray-100 hover:bg-gray-700"}
                ${isDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}
              `}
              onClick={() => {
                if (!isDisabled) handleSelect(song._id);
              }}
            >
              <span>{song.title}</span>
              <span className="text-sm text-gray-400">{song.duration}</span>
            </div>
          );
        })}
      </div>

      {/* Selected Count */}
      <div className="sticky bottom-0 left-0 bg-gray-900 text-white p-4 shadow-md rounded-md mb-4">
        <div className="text-sm font-semibold">
          Selected: {selected.length} song{selected.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error */}
      {error && <div className="form-error">{error}</div>}

      {/* Action Buttons */}
      <div className="form-actions" style={{ display: "flex", gap: 12, justifyContent: "flex-end" }}>
        <button type="submit" className="primary">
          Create
        </button>
      </div>
    </form>
  );
};

export default CreateAlbumForm;
