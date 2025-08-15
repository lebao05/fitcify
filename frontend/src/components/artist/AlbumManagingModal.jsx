import React, { useState, useMemo, useEffect } from "react";
import "./CreateDialog.scss";
import {
  updateAlbum,
  getAlbumsOfAnArtist,
  deleteAlbum,
} from "../../redux/slices/artistAlbumSlice";
import { useDispatch } from "react-redux";
import { fetchArtistSongs } from "../../redux/slices/artistSongSlice";
const AlbumManagingModal = ({
  album = {},
  songs = [],
  onSave,
  onDelete,
  onClose,
}) => {
  const dispatch = useDispatch();
  const [name, setName] = useState(album?.name || "");
  const [cover, setCover] = useState(null);
  const initialSelected = useMemo(() => {
    if (album?.songs && Array.isArray(album.songs)) {
      return album.songs;
    }
    if (album?.songs && Array.isArray(album.songs)) {
      return album.songs.map((s) => s.id || s._id).filter(Boolean);
    }
    return [];
  }, [album]);
  const [selected, setSelected] = useState(initialSelected);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setSelected(initialSelected);
    setName(album.title);
  }, [initialSelected]);

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (selected.length === 0) {
      setError("You must select at least one song.");
      return;
    }
    setError("");
    const formData = new FormData();
    formData.append("title", name);
    if (cover) formData.append("coverImage", cover);
    formData.append("songIds", JSON.stringify(selected));
    await dispatch(updateAlbum({ albumId: album._id, formData }));
    await dispatch(getAlbumsOfAnArtist());
    onSave && onSave();
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setShowConfirm(false);
    setDeleting(true);
    await dispatch(deleteAlbum(album._id));
    await dispatch(getAlbumsOfAnArtist());
    await dispatch(fetchArtistSongs());
    onDelete && onDelete();
  };

  return (
    <div className="create-form-modal">
      <div className="create-form-modal-backdrop" onClick={onClose} />
      <div className="create-form-modal-content">
        <form className="create-dialog-form relative" onSubmit={handleSubmit}>
          <div className="flex flex-row items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white leading-tight">
              Managing Album
            </h2>
            <button
              type="button"
              className="absolute -top-1.5 right-0 text-gray-400 hover:text-white cursor-pointer  text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <label className="text-white font-medium">Album Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="rounded-lg px-4 py-2 bg-[#23242b] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <label className="text-white font-medium">
            Cover Image (leave blank to keep current)
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleCover}
            className="block text-white disabled:opacity-60"
          />
          {songs.map((song) => {
            const isSelected = selected.includes(song._id);
            const belongsToOtherAlbum =
              song.albumId && song.albumId._id !== album._id; // <-- important check
            const isSelectable = !belongsToOtherAlbum;
            const isDisabled =
              !isSelected && (selected.length >= 30 || !isSelectable);

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
                onClick={() => {
                  if (!isDisabled) handleSelect(song._id);
                }}
              >
                <span>
                  {song.title}
                  {belongsToOtherAlbum && (
                    <span className="text-red-400 ml-2 text-xs">
                      (In another album)
                    </span>
                  )}
                </span>
                <span className="text-sm text-gray-400">
                  {" "}
                  {Math.floor(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, "0")}
                </span>
              </div>
            );
          })}

          {error && (
            <div className="text-red-400 font-semibold text-sm mt-1">
              {error}
            </div>
          )}
          <div className="flex flex-col gap-2 mt-4">
            {/* Draft: show Save, Request Approval, Delete */}

            <div className="flex flex-nowrap justify-end items-center gap-3 mb-2 w-full">
              <button
                type="submit"
                className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-base shadow hover:bg-blue-700 transition min-w-[140px] h-11 cursor-pointer"
              >
                Save Changes
              </button>
              <button
                type="button"
                className="bg-red-600 text-white font-bold text-base px-6 py-2 rounded-md shadow transition hover:bg-red-800 focus:outline-none disabled:opacity-60 min-w-[140px] h-11 cursor-pointer"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete Album"}
              </button>
            </div>
          </div>
          {showConfirm && (
            <div className="fixed inset-0 bg-black/30 z-[1200] flex items-center justify-center">
              <div className="bg-[#23242b] text-white rounded-xl p-8 min-w-[320px] shadow-2xl flex flex-col items-center gap-4 z-[1201]">
                <div className="text-xl font-bold mb-2">Confirm Delete</div>
                <div className="text-base mb-2 text-center">
                  Are you sure you want to delete this album?
                  <br />
                  This action cannot be undone.
                </div>
                <div className="flex gap-4 mt-2">
                  <button
                    type="button"
                    className="bg-red-600 text-white rounded-lg px-5 py-2 font-bold text-base hover:bg-red-800 transition cursor-pointer"
                    onClick={confirmDelete}
                  >
                    Yes, Delete
                  </button>
                  <button
                    type="button"
                    className="bg-[#23242b] text-white border border-gray-400 rounded-lg px-5 py-2 font-bold text-base hover:bg-gray-700 transition cursor-pointer"
                    onClick={() => setShowConfirm(false)}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default AlbumManagingModal;
