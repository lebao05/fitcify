import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPlaylist, getPlaylistsOfAnArtist } from "../../redux/slices/artistPlaylistSlice";
const CreatePlaylistForm = ({ songs = [], onCreate, onCancel }) => {
  const [name, setName] = useState("");
  const [cover, setCover] = useState(null);
  const [selected, setSelected] = useState([]);
  const [error, setError] = useState("");
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
      setError("You must select at least one song to create a playlist.");
      return;
    }
    const formData = new FormData();
    formData.append("name", name);
    formData.append("coverImage", cover); // fix typo: was 'coverIamge'
    selected.forEach((id) => formData.append("songIds", id)); // send as array
    await dispatch(createPlaylist(formData));
    await dispatch(getPlaylistsOfAnArtist());
    setError("");
    onCreate && onCreate();
  };

  return (
    <form className="create-dialog-form relative" onSubmit={handleSubmit}>
      {/* Close button */}
      <button
        type="button"
        aria-label="Close"
        onClick={onCancel}
        className="absolute -top-1.5 right-0 text-gray-400 hover:text-white cursor-pointer text-[40px] font-extrabold rounded transition focus:outline-none w-12 h-12 z-10"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold mb-4 pr-8">Create New Playlist</h2>

      <label className="text-white font-medium block mb-2">
        Playlist Name *
      </label>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter playlist name"
        required
        className="w-full px-3 py-2 rounded bg-gray-800 text-white mb-4 focus:outline-none focus:ring focus:ring-green-500"
      />

      <label className="text-white font-medium block mb-2">Cover Image</label>
      <input
        type="file"
        accept="image/*"
        onChange={handleCover}
        className="mb-4 text-white"
      />

      <label className="text-white font-medium block mb-2">
        Select Songs (Max 100 songs)
      </label>

      {/* Song list */}
      <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 mb-4">
        {songs.map((song) => {
          const isSelected = selected.includes(song._id);
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
              `}
              onClick={() => handleSelect(song._id)}
            >
              <span>{song.title}</span>
              <span className="text-sm text-gray-400">{song.duration}</span>
            </div>
          );
        })}
      </div>

      {/* Sticky bottom count */}
      <div className="sticky bottom-0 left-0 bg-gray-900 text-white p-4 shadow-md rounded-md mb-4">
        <div className="text-sm font-semibold">
          Selected: {selected.length} song{selected.length !== 1 ? "s" : ""}
        </div>
      </div>

      {/* Error */}
      {error && <div className="text-red-400 font-medium mb-2">{error}</div>}

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <button
          type="submit"
          className="bg-green-600 cursor-pointer hover:bg-green-700 text-white font-semibold py-2 px-4 rounded transition"
        >
          Create Playlist
        </button>
      </div>
    </form>
  );
};

export default CreatePlaylistForm;
