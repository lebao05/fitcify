import React, { useState, useMemo, useEffect } from "react";
import "./CreateDialog.scss";

const AlbumManagingModal = ({
  album = {},
  songs = [],
  onSave,
  onDelete,
  onPublish,
  onClose,
}) => {
  const [name, setName] = useState(album?.name || "");
  const [desc, setDesc] = useState(album?.desc || "");
  const [cover, setCover] = useState(null);
  const [releaseDate, setReleaseDate] = useState(album?.releaseDate ? album.releaseDate : "");
  const initialSelected = useMemo(() => {
    if (album?.songIds && Array.isArray(album.songIds)) {
      return album.songIds;
    }
    if (album?.songs && Array.isArray(album.songs)) {
      return album.songs.map(s => s.id || s._id).filter(Boolean);
    }
    return [];
  }, [album]);
  const [selected, setSelected] = useState(initialSelected);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  useEffect(() => {
    setSelected(initialSelected);
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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) {
      setError("You must enter an album name.");
      return;
    }
    if (!releaseDate.trim()) {
      setError("You must enter a release date.");
      return;
    }
    // Validate format mm-dd-yyyy
    if (!/^\d{2}-\d{2}-\d{4}$/.test(releaseDate.trim())) {
      setError("Release date must be in format mm-dd-yyyy.");
      return;
    }
    if (selected.length === 0) {
      setError("You must select at least one song.");
      return;
    }
    setError("");
    onSave &&
      onSave({
        ...album,
        name,
        desc,
        cover,
        releaseDate: releaseDate || null,
        songIds: selected,
      });
  };

  const handleDelete = () => {
    setShowConfirm(true);
  };

  const confirmDelete = () => {
    setDeleting(true);
    setShowConfirm(false);
    onDelete && onDelete(album);
  };

  // Album status: 'draft', 'pending', 'approved'
  const status = album.status || (album.published ? 'approved' : 'draft');
  const isDraft = status === 'draft';
  const isPending = status === 'pending';
  const isApproved = status === 'approved';

  return (
    <div className="create-form-modal">
      <div className="create-form-modal-backdrop" onClick={onClose} />
      <div className="create-form-modal-content">
        <form className="create-dialog-form relative" onSubmit={handleSubmit}>
          <div className="flex flex-row items-center justify-between mb-2">
            <h2 className="text-2xl font-bold text-white leading-tight">Managing Album</h2>
            <button
              type="button"
              className="absolute -top-1.5 right-0 text-gray-400 hover:text-white cursor-pointer  text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
              onClick={onClose}
              aria-label="Close"
            >
              &times;
            </button>
          </div>
          <div className={`mb-2 font-semibold ${isDraft ? 'text-yellow-400' : isPending ? 'text-blue-400' : 'text-green-400'}`}>
            Status: {isDraft ? 'Draft' : isPending ? 'Pending Approval' : 'Approved'}
          </div>
          {isPending && (
            <div className="text-red-400 font-semibold text-sm mb-2">This album is pending approval and cannot be edited.</div>
          )}
          <label className="text-white font-medium">Album Name *</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={!isDraft}
            readOnly={isPending || isApproved}
            className="rounded-lg px-4 py-2 bg-[#23242b] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          <label className="text-white font-medium">Release Date *</label>
          <input
            type="text"
            value={releaseDate}
            onChange={e => setReleaseDate(e.target.value)}
            placeholder="mm-dd-yyyy"
            required
            maxLength={10}
            pattern="\d{2}-\d{2}-\d{4}"
            title="Format: mm-dd-yyyy"
            disabled={!isDraft}
            readOnly={isPending || isApproved}
            className="rounded-lg px-4 py-2 bg-[#23242b] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 mb-2"
          />
          <label className="text-white font-medium">Cover Image (leave blank to keep current)</label>
          <input type="file" accept="image/*" onChange={handleCover} disabled={!isDraft} className="block text-white disabled:opacity-60" />
          <label className="text-white font-medium">Description</label>
          <textarea
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            rows={3}
            disabled={!isDraft}
            readOnly={isPending || isApproved}
            className="rounded-lg px-4 py-2 bg-[#23242b] text-white border border-[#333] focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60"
          />
          {isDraft ? (
            <>
              <label className="text-white font-medium">Select Songs (1-30 songs)</label>
              <div className="select-songs-list">
                {songs.map((song) => {
                  const isSelected = selected.includes(song.id);
                  const isDisabled = !isSelected && selected.length >= 30;
                  return (
                    <div
                      key={song.id}
                      className={
                        `select-song-row${isSelected ? ' selected' : ''}` +
                        (!isDisabled ? '' : ' opacity-60 cursor-not-allowed')
                      }
                      onClick={() => !isDisabled && handleSelect(song.id)}
                      style={isDisabled ? { background: '#333' } : {}}
                    >
                      <span>{song.name}</span>
                      <span className="duration">{song.duration}</span>
                    </div>
                  );
                })}
              </div>
              <div className="selected-count">Selected: {selected.length} songs</div>
            </>
          ) : (
            <>
              <label className="text-white font-medium">Songs in Album</label>
              <div className="selected-count mb-1">{selected.length} Songs in this album</div>
              <div className="mb-2">
                <span className="text-white font-medium">Release Date: </span>
                <span className="text-gray-300">{releaseDate ? releaseDate : "N/A"}</span>
              </div>
              <div className="select-songs-list">
                {songs.filter(song => selected.includes(song.id)).map(song => (
                  <div key={song.id} className="select-song-row opacity-100 cursor-default">
                    <span>{song.name}</span>
                    <span className="duration">{song.duration}</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {error && <div className="text-red-400 font-semibold text-sm mt-1">{error}</div>}
          <div className="flex flex-col gap-2 mt-4">
            {/* Draft: show Save, Request Approval, Delete */}
            {isDraft && (
              <>
                <div className="flex flex-nowrap justify-end items-center gap-3 mb-2 w-full">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-md font-bold text-base shadow hover:bg-blue-700 transition min-w-[140px] h-11 cursor-pointer"
                  >
                    Save Changes
                  </button>
                  <button
                    type="button"
                    className="bg-indigo-400 text-white px-6 py-2 rounded-md font-bold text-base shadow hover:bg-indigo-600 transition min-w-[140px] h-11 cursor-pointer"
                    onClick={() => onPublish && onPublish(album)}
                  >
                    Request Approval
                  </button>
                </div>
                <div className="flex flex-nowrap justify-end items-center gap-3 w-full">
                  <button
                    type="button"
                    className="bg-red-600 text-white font-bold text-base px-6 py-2 rounded-md shadow transition hover:bg-red-800 focus:outline-none disabled:opacity-60 min-w-[140px] h-11 cursor-pointer"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete Album"}
                  </button>
                </div>
              </>
            )}
            {/* Pending: show Delete only. Approved: nothing. */}
            {isPending && (
              <div className="flex flex-nowrap justify-end items-center gap-3 w-full">
                <button
                  type="button"
                  className="bg-red-600 text-white font-bold text-base px-6 py-2 rounded-md shadow transition hover:bg-red-800 focus:outline-none disabled:opacity-60 min-w-[140px] h-11 cursor-pointer"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete Album"}
                </button>
              </div>
            )}
          </div>
            {showConfirm && (
              <div className="fixed inset-0 bg-black/30 z-[1200] flex items-center justify-center">
                <div className="bg-[#23242b] text-white rounded-xl p-8 min-w-[320px] shadow-2xl flex flex-col items-center gap-4 z-[1201]">
                  <div className="text-xl font-bold mb-2">Confirm Delete</div>
                  <div className="text-base mb-2 text-center">Are you sure you want to delete this album?<br/>This action cannot be undone.</div>
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
