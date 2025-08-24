import React, { useEffect, useState } from "react";
import { Play } from "lucide-react";
import UploadSongForm from "./UploadSongForm";
import SongManagingModal from "./SongManagingModel";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteArtistSong,
  fetchArtistSongs,
  uploadArtistSong,
} from "../../redux/slices/artistSongSlice";
import { getAlbumsOfAnArtist } from "../../redux/slices/artistAlbumSlice";
import { getPlaylistsOfAnArtist } from "../../redux/slices/artistPlaylistSlice";

const TrackItem = ({ track, index }) => {
  const [hovered, setHovered] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const handleEdit = (e) => {
    e.stopPropagation();
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await dispatch(deleteArtistSong(id));
      await dispatch(fetchArtistSongs());
      await dispatch(getAlbumsOfAnArtist());
      await dispatch(getPlaylistsOfAnArtist());
      alert("Song deleted successfully!");
    } catch (err) {
      alert("Something went wrong!");
    }
  };

  function formatDuration(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  }

  return (
    <div
      className={`flex items-center px-2 py-1 transition-colors duration-200 ${
        hovered ? "bg-neutral-800 cursor-pointer" : ""
      }`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {showForm && (
        <div className="create-form-modal">
          <div
            className="create-form-modal-backdrop"
            onClick={(e) => e.stopPropagation()}
          />
          <div className="create-form-modal-content">
            <SongManagingModal
              track={track}
              onUpdate={() => setShowForm(false)}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      <div className="w-10 text-sm text-gray-400 flex justify-center items-center min-w-[40px] min-h-[40px]">
        {index + 1}
      </div>

      <div className="grid items-center text-white text-sm w-full grid-cols-[40px_2fr_1.27fr_160px_auto]">
        <img
          src={track.imageUrl || "/test.jpg"}
          alt={track.title}
          className="w-[35px] h-[35px] object-cover rounded mr-2 shadow-sm"
        />
        <div className="flex flex-col mr-4 overflow-hidden">
          <div className="truncate font-medium">{track.title}</div>
          <div className="truncate text-gray-400 text-sm">
            {track?.artistId?.username || ""}
          </div>
        </div>
        <div className="truncate mr-4 text-gray-400">
          {track?.albumId?.title || ""}
        </div>
        <div className="text-right min-w-[40px] text-sm mr-5 text-gray-400">
          {formatDuration(track.duration)}
        </div>
        <div className="flex gap-2 ml-4">
          <button
            className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full text-xs"
            onClick={handleEdit}
          >
            Edit
          </button>
          <button
            className="bg-red-500 cursor-pointer hover:bg-red-700 text-white font-bold py-1 px-2 rounded-full text-xs"
            onClick={() => handleDelete(track._id)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

const ArtistSong = () => {
  const songs = useSelector((state) => state.artistSong.songs);
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();

  const handleUploadSong = async (songData) => {
    await dispatch(uploadArtistSong(songData));
    setShowForm(false);
  };

  useEffect(() => {
    dispatch(fetchArtistSongs());
  }, [dispatch]);

  if (songs === null) return null;

  return (
    <div className="artist-song-container bg-gray-900 text-white p-6 rounded-lg">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Music</h2>
        <button className="create-btn" onClick={() => setShowForm(true)}>
          + Upload Song
        </button>
      </div>

      {showForm && (
        <div className="create-form-modal">
          <div
            className="create-form-modal-backdrop"
            onClick={() => {
              e.stopPropagation();
            }}
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
          <div className="grid grid-cols-[40px_2fr_1.27fr_160px_auto] gap-4 p-2 border-b border-gray-700 text-gray-400 text-sm font-medium">
            <div className="text-center">#</div>
            <div>Title</div>
            <div>Album</div>
            <div className="flex justify-center">
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
            <div>Actions</div>
          </div>

          <div className="song-table-body">
            <div className="tracks-item-container">
              {songs.map((song, idx) => (
                <TrackItem key={idx} track={song} index={idx} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistSong;
