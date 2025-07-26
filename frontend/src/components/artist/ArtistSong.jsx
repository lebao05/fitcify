import React, { useEffect, useState } from "react";
import { Play, Heart } from "lucide-react";
import UploadSongForm from "./UploadSongForm";
import SongManagingModal from "./SongManagingModel";
import { useDispatch, useSelector } from "react-redux";
import {
  deleteArtistSong,
  fetchArtistSongs,
  uploadArtistSong,
} from "../../redux/slices/artistSongSlice";
import { Loader2 } from "lucide-react"; // loading spinner icon

const mockSongs = [
  { id: 1, name: "Anti-Hero", artist: "Taylor Swift", duration: "3:20" },
  { id: 2, name: "Mascara", artist: "Chillies", duration: "4:01" },
  { id: 3, name: "Hẹn Một Mai", artist: "Bùi Anh Tuấn", duration: "5:00" },
];

// TrackItem component merged inline
const TrackItem = ({
  track,
  index,
  onPlay,
  onMore,
  onLike,
  onEdit,
  onDelete,
  showLikeButton = true,
}) => {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(track.liked || false);
  const [showForm, setShowForm] = useState(false);
  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) onLike(track);
  };
  const dispatch = useDispatch();
  const handlePlaying = () => {
    if (onPlay) onPlay(track);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    if (onEdit) onEdit(track);
  };

  const handleDelete = async (id) => {
    await dispatch(deleteArtistSong(id));
    await dispatch(fetchArtistSongs());
  };

  const isPlaying = track.isPlaying;

  return (
    <div
      className={`flex items-center px-2 py-1 transition-colors duration-200 ${
        hovered ? "bg-neutral-800 cursor-pointer" : ""
      } ${!showLikeButton ? "no-like-btn" : ""}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlaying}
    >
      {showForm && (
        <div className="create-form-modal">
          <div
            className="create-form-modal-backdrop"
            onClick={() => setShowForm(false)}
          />
          <div className="create-form-modal-content">
            <SongManagingModal
              track={track}
              onUpdate={() => {
                setShowForm();
              }}
              onCancel={() => setShowForm(false)}
            />
          </div>
        </div>
      )}

      {/* Track Number or Play Icon */}
      <div className="w-10 text-sm text-gray-400 flex justify-center items-center min-w-[40px] min-h-[40px]">
        {isPlaying || hovered ? (
          <Play
            size={16}
            fill={isPlaying ? "#1db954" : "currentColor"}
            color={isPlaying ? "#1db954" : undefined}
          />
        ) : (
          index + 1
        )}
      </div>

      {/* Track Info */}
      <div
        className={`grid items-center text-white text-sm w-full ${
          showLikeButton
            ? "grid-cols-[40px_2fr_1.5fr_40px_0.7fr_auto]"
            : "grid-cols-[40px_2fr_1.27fr_160px_auto]"
        }`}
      >
        <img
          src={track.imageUrl || "/test.jpg"}
          alt={track.title}
          className="w-[35px] h-[35px] object-cover rounded mr-2 shadow-sm"
        />

        {/* Title & Artist */}
        <div className="flex flex-col mr-4 overflow-hidden">
          <div
            className={`truncate font-medium ${
              isPlaying ? "text-green-500" : ""
            }`}
          >
            {track.title}
          </div>
          <div
            className={`truncate text-gray-400 text-sm ${
              isPlaying ? "text-green-500" : ""
            }`}
          >
            {track.artistId.username}
          </div>
        </div>

        {/* Album */}
        <div
          className={`truncate mr-4 text-gray-400 ${
            isPlaying ? "text-green-500" : ""
          }`}
        >
          {track.albumId || "Unknown"}
        </div>

        {/* Like Button */}
        {showLikeButton && (
          <div className="flex justify-center items-center relative z-10 transition-opacity duration-200">
            <button
              className={`p-1 rounded-full relative hover:bg-green-600/10 ${
                liked ? "" : ""
              }`}
              onClick={handleLike}
              tabIndex={-1}
            >
              <Heart
                size={18}
                fill={liked ? "#1db954" : "none"}
                color={liked ? "#1db954" : "#fff"}
                className={liked ? "drop-shadow-[0_0_2px_#1db954]" : ""}
              />
              <span className="absolute left-[110%] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 ml-2">
                {liked ? "Added to Liked Songs" : "Add to Liked Songs"}
              </span>
            </button>
          </div>
        )}

        {/* Duration */}
        <div
          className={`text-right min-w-[40px] text-sm mr-5 text-gray-400 ${
            isPlaying ? "text-green-500" : ""
          }`}
        >
          {track.duration}
        </div>

        {/* Edit and Delete Buttons */}
        <div className="flex gap-2 ml-4">
          <button
            className="bg-blue-500 cursor-pointer hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-full text-xs"
            onClick={() => {
              // dispatct(setSelectedSong(track));
              setShowForm(true);
            }}
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
    alert("Upload song thành công!\n" + JSON.stringify(songData, null, 2));
    setShowForm(false);
  };

  const handleEditSong = (track) => {
    alert(`Edit song: ${track.title}`);
  };

  const handleDeleteSong = (track) => {
    if (window.confirm(`Are you sure you want to delete "${track.title}"?`)) {
      alert(`Deleted song: ${track.title}`);
    }
  };
  useEffect(() => {
    dispatch(fetchArtistSongs());
  }, [fetchArtistSongs]);
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
            onClick={() => setShowForm(false)}
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
                <TrackItem
                  key={song._id}
                  track={song}
                  index={idx}
                  showLikeButton={false}
                  onEdit={handleEditSong}
                  onDelete={handleDeleteSong}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistSong;
