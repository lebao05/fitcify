import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
const UploadSongForm = ({ onUpload, onCancel }) => {
  const isLoading = useSelector((state) => state.artistSong.loading);
  const [file, setFile] = useState(null);
  const [cover, setCover] = useState(null);
  const [title, setTitle] = useState("");
  const [genre, setGenre] = useState("");
  const [album, setAlbum] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const handleFile = (e) => setFile(e.target.files[0]);
  const handleCover = (e) => setCover(e.target.files[0]);
  const handleUploading = async (e) => {
    e.preventDefault();
    if (!file || !title) {
      setError("Please fill in all required fields and select an audio file.");
      return;
    }
    setError("");
    const data = { title, audioFile: file, imageFile: cover };
    if (onUpload) await onUpload(data);
  };

  return (
    <form
      onSubmit={handleUploading}
      className="flex flex-col gap-5 w-full max-w-lg text-white"
    >
      <h2 className="flex items-center gap-2 text-2xl font-bold mb-2">
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
        Upload New Song
      </h2>

      <div>
        <label className="font-medium mb-1 block">Audio File *</label>
        <input
          type="file"
          accept="audio/mp3,audio/wav,audio/flac,audio/m4a"
          onChange={handleFile}
          required
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        />
      </div>

      <div>
        <label className="font-medium mb-1 block">Cover Image</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleCover}
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        />
      </div>

      <p className="text-sm text-gray-400">
        Supported formats: MP3, WAV, FLAC, M4A · Max size: 10MB
      </p>

      <div>
        <label className="font-medium mb-1 block">Song Title *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Enter song title"
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        />
      </div>

      {/* Genre (Optional UI) */}
      {/* <div>
        <label className="font-medium mb-1 block">Genre *</label>
        <select
          value={genre}
          onChange={(e) => setGenre(e.target.value)}
          required
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        >
          <option value="">Select genre</option>
          <option value="Pop">Pop</option>
          <option value="Rock">Rock</option>
          <option value="Ballad">Ballad</option>
          <option value="EDM">EDM</option>
          <option value="Indie">Indie</option>
          <option value="Other">Other</option>
        </select>
      </div> */}
{/* 
      <div>
        <label className="font-medium mb-1 block">Album (Optional)</label>
        <input
          type="text"
          value={album}
          onChange={(e) => setAlbum(e.target.value)}
          placeholder="Enter album name"
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        />
      </div> */}

      {/* <div>
        <label className="font-medium mb-1 block">Release Date *</label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        />
      </div> */}

      {/* <div>
        <label className="font-medium mb-1 block">Description (Optional)</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          placeholder="Enter song description"
          rows={3}
          className="w-full bg-[#23242b] text-white rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-[#7f7fd5]"
        />
      </div> */}

      {error && <div className="text-red-500 text-base">{error}</div>}

      <div className="flex gap-4 mt-2">
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center justify-center gap-2 bg-[#1db954] hover:bg-[#169d45] text-white rounded-md px-6 py-2 font-semibold ${
            isLoading ? "opacity-70 cursor-not-allowed" : ""
          }`}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8H4z"
                ></path>
              </svg>
              Uploading...
            </>
          ) : (
            "Upload Song"
          )}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="bg-[#23242b] hover:bg-[#32334a] text-white rounded-md px-6 py-2 font-semibold"
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default UploadSongForm;
