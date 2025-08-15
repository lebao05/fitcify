import React, { useState } from "react";
import "./ArtistSection.scss";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Form } from "react-router-dom";
import {
  getPlaylistsOfAnArtist,
  updatePlaylist,
  deletePlaylist,
} from "../../redux/slices/artistPlaylistSlice";
const PlaylistEditModal = ({
  playlist,
  songs = [],
  onSave,
  onDelete,
  onClose,
}) => {
  const [name, setName] = useState(playlist?.name || "");
  const [cover, setCover] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const handleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };
  const handleCover = (e) => {
    setCover(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("You must select at least one song.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("name", name);
    formData.append("coverImage", cover); // fix typo: was 'coverIamge'
    selected.forEach((id) => formData.append("songIds", id)); // send as array
    await dispatch(updatePlaylist({ playlistId: playlist._id, formData }));
    await dispatch(getPlaylistsOfAnArtist());
    onSave();
  };
  useEffect(() => {
    setSelected(playlist.songs);
  }, []);
  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setDeleting(true);
    setShowConfirm(false);
    await dispatch(deletePlaylist(playlist._id));
    await dispatch(getPlaylistsOfAnArtist());
    setDeleting(false);
    onClose && onClose();
  };

  return (
    <div className="create-form-modal">
      <div className="create-form-modal-backdrop" onClick={onClose} />
      <div className="create-form-modal-content">
        <form className="create-dialog-form relative" onSubmit={handleSubmit}>
          <button
            type="button"
            className="absolute -top-1.5 right-0 text-gray-400 hover:text-white cursor-pointer  text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
            onClick={onClose}
            aria-label="Close"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold text-white leading-tight">
            Managing Playlist
          </h2>
          <label>Playlist Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>Cover Image (leave blank to keep current)</label>
          <input type="file" accept="image/*" onChange={handleCover} />
          <label>Select Songs (Max 100 songs)</label>
          <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 mb-4">
            {songs.map((song) => {
              const isSelected = selected.includes(song._id);
              const isDisabled = !isSelected && selected.length >= 100;

              return (
                <div
                  key={song._id}
                  className={`
                  flex justify-between items-center px-4 py-2 rounded-md
                  cursor-pointer transition-colors
                  ${
                    isSelected
                      ? "bg-green-500 text-white"
                      : "bg-gray-800 text-gray-100 hover:bg-gray-700"
                  }
                  ${isDisabled ? "opacity-50 cursor-not-allowed" : ""}
                `}
                  onClick={() => !isDisabled && handleSelect(song._id)}
                >
                  <span className="truncate">{song.title}</span>
                  <span className="text-sm text-gray-400">
                    {" "}
                    {Math.floor(song.duration / 60)}:
                    {(song.duration % 60).toString().padStart(2, "0")}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="selected-count">
            Selected: {selected.length} songs
          </div>
          {error && <div className="form-error">{error}</div>}
          <div className="flex flex-nowrap justify-end items-center gap-3 mt-4 w-full">
            <button
              type="submit"
              className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-base shadow hover:bg-blue-700 transition min-w-[140px] h-11 cursor-pointer"
            >
              Save Changes
            </button>
            <button
              type="button"
              className="bg-red-600 text-white font-bold text-base px-6 py-2 rounded-md shadow transition hover:bg-red-800 focus:outline-none disabled:opacity-60 min-w-[140px] h-11 cursor-pointer flex items-center gap-2"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete Playlist"}
            </button>
            {showConfirm && (
              <div className="fixed inset-0 bg-black/30 z-[1200] flex items-center justify-center">
                <div className="bg-[#23242b] text-white rounded-xl p-8 min-w-[320px] shadow-2xl flex flex-col items-center gap-4 z-[1201]">
                  <div className="text-xl font-bold mb-2">Confirm Delete</div>
                  <div className="text-base mb-2 text-center">
                    Are you sure you want to delete this playlist?
                    <br />
                    This action cannot be undone.
                  </div>
                  <div className="flex gap-4 mt-2">
                    <button
                      type="button"
                      className="bg-red-600 text-white rounded-lg px-5 py-2 font-bold text-base hover:bg-red-800 transition"
                      onClick={confirmDelete}
                    >
                      Yes, Delete
                    </button>
                    <button
                      type="button"
                      className="bg-[#23242b] text-white border border-gray-400 rounded-lg px-5 py-2 font-bold text-base hover:bg-gray-700 transition"
                      onClick={() => setShowConfirm(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlaylistEditModal;
