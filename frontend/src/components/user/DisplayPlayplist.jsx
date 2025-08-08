import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import {
  deletePlaylist,
  getPlaylistById,
  updatePlaylist,
  addSongToPlaylist,
  removeSongFromPlaylist,
} from "../../services/playlistApi";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { playPlaylistThunk } from "../../redux/slices/playerSlice";
import defaultMusic from "../../assets/default-music.png";
import EditPlaylistModal from "./EditPlaylistModal";
import {
  fetchUserPlaylists,
  fetchLikedSongs,
} from "../../redux/slices/myCollectionSlice";
import { toggleLikeSong } from "../../services/musicApi";
import { Heart } from "lucide-react";
import ContextMenu from "./ContextMenu"; // Adjust path if needed
import applogo from "../../assets/applogo.jpg";
const DisplayPlaylist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const [isOwner, setIsOwner] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [playlist, setPlaylist] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const user = useSelector((state) => state.user.myAuth);
  const likedSongs = useSelector((state) => state.myCollection.likedSongs);
  const playlists = useSelector((state) => state.myCollection.playlists);

  const handleSave = async ({ name, description, cover }) => {
    try {
      await updatePlaylist({ playlistId: id, name, description, cover });
      fetchPlaylist();
      dispatch(fetchUserPlaylists());
    } catch (err) {
      console.error("Update failed", err);
    } finally {
      setShowModal(false);
    }
  };

  const handleDelete = async () => {
    await deletePlaylist({ playlistId: id });
    await dispatch(fetchUserPlaylists());
    navigate("/");
  };

  const handlePlay = (songOrder) => {
    if (!id) return;
    dispatch(playPlaylistThunk({ playlistId: id, songOrder }));
  };

  const fetchPlaylist = async () => {
    try {
      setPlaylist(null);
      const res = await getPlaylistById({ playlistId: id });
      const data = res?.Data;
      setPlaylist(data);

      setIsOwner(user?._id === data?.ownerId?._id);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRightClick = (e, song, isLiked) => {
    e.preventDefault();
    const options = [
      {
        label: "Add to playlist",
        submenu: playlists.map((pl) => ({
          label: pl.name,
          onClick: async () => {
            await addSongToPlaylist({ playlistId: pl._id, songId: song._id });
            await dispatch(fetchUserPlaylists());
          },
        })),
      },
      {
        label: "Remove song from playlist",
        onClick: async () => {
          try {
            await removeSongFromPlaylist({ playlistId: id, songId: song._id });

            // Update local state by filtering out the removed song
            setPlaylist((prev) => ({
              ...prev,
              songs: prev.songs.filter((s) => s._id !== song._id),
            }));
          } catch (err) {
            console.error("Failed to remove song from playlist", err);
          }
        },
      },
      {
        label: isLiked ? "Unlike song" : "like song",
        onClick: async () => {
          await toggleLikeSong(song._id);
          await dispatch(fetchLikedSongs());
        },
      },
      {
        label: "Go to artist",
        onClick: () => {
          if (song.artistId?._id) {
            navigate(`/artist/${song.artistId._id}`);
          }
        },
      },
    ];
    setContextMenu({ x: e.clientX, y: e.clientY, options });
  };

  useEffect(() => {
    if (id) fetchPlaylist();
  }, [id, user?._id]);

  if (!playlist) return null;

  return (
    <div className="h-full px-5 overflow-y-auto pr-4 scroll-on-hover">
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-48 h-48 object-cover rounded cursor-pointer transition-all duration-200 hover:scale-105 hover:brightness-110 hover:shadow-lg"
          src={playlist.imageUrl || defaultMusic}
          onClick={() => setShowModal(true)}
          alt="cover"
        />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2
            onClick={() => setShowModal(true)}
            className="text-5xl cursor-pointer font-bold mb-4 md:text-7xl"
          >
            {playlist.name}
          </h2>
          <h4>{playlist.description}</h4>
          <p className="mt-1 text-sm text-[#a7a7a7]">
            <img
              className="inline-block rounded-full w-5"
              src={applogo}
              alt="spotify"
            />
            <b>{playlist.ownerId?.username}</b> •{" "}
            <b>{playlist.songs.length} songs</b> •{" "}
            <span>
              ~
              {Math.round(
                playlist.songs.reduce((acc, s) => acc + s.duration, 0) / 60
              )}{" "}
              min
            </span>
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 mt-8 mb-4 pl-2">
        <button
          onClick={() => handlePlay(0)}
          className="bg-green-500 cursor-pointer w-14 h-14 text-black rounded-full flex items-center justify-center text-2xl hover:bg-green-400 hover:scale-105 transition-all"
        >
          ▶
        </button>
        {isOwner && (
          <button
            onClick={handleDelete}
            className="text-red-500 cursor-pointer border border-red-500 hover:bg-red-500 hover:text-white px-4 py-2 rounded-full transition-all duration-300 hover:scale-105"
          >
            Delete Playlist
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 mt-6 mb-4 pl-2 text-[#a7a7a7] text-sm">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Album</p>
        <p className="hidden sm:block">Date Added</p>
        <p className="text-center hidden sm:block">Like</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="Duration" />
      </div>
      <hr />

      {playlist?.songs.map((song, index) => {
        const isLiked = likedSongs?.some((s) => s._id === song._id);
        return (
          <div
            key={song._id}
            onContextMenu={(e) => handleRightClick(e, song, isLiked)}
            onClick={() => handlePlay(index)}
            className="group grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded"
          >
            {/* Song title and artist */}
            <div className="flex items-center gap-4 text-white text-sm md:text-[15px]">
              <div className="w-5 text-right">
                <span className="group-hover:hidden block text-[#a7a7a7]">
                  {index + 1}
                </span>
                <span className="hidden group-hover:block text-[#a7a7a7]">
                  ▶
                </span>
              </div>
              <img
                className="w-10 h-10 object-cover rounded"
                src={song.imageUrl}
                alt={song.title}
              />
              <div className="flex flex-col">
                <span>{song.title}</span>
                <span className="text-[#a7a7a7]">
                  {song.artistId?.username}
                </span>
              </div>
            </div>

            <p className="text-[15px]">{song.albumId?.title || ""}</p>

            <p className="text-[15px] hidden sm:block">
              {new Date(song.uploadedAt).toLocaleDateString()}
            </p>

            {/* Like Icon */}
            <div className="hidden sm:flex justify-center items-center relative group z-10">
              <button
                onClick={async (e) => {
                  e.stopPropagation();
                  await toggleLikeSong(song._id);
                  await dispatch(fetchLikedSongs());
                }}
                className="p-1 rounded-full relative hover:bg-green-600/10"
                tabIndex={-1}
              >
                <Heart
                  size={18}
                  fill={isLiked ? "#1db954" : "none"}
                  color={isLiked ? "#1db954" : "#fff"}
                  className={isLiked ? "drop-shadow-[0_0_2px_#1db954]" : ""}
                />
                <span className="absolute left-[110%] top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap ml-2">
                  {isLiked ? "Added to Liked Songs" : "Add to Liked Songs"}
                </span>
              </button>
            </div>

            <p className="text-[15px] text-center text-white">
              {Math.floor(song.duration / 60)}:
              {(song.duration % 60).toString().padStart(2, "0")}
            </p>
          </div>
        );
      })}

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}

      {isOwner && (
        <EditPlaylistModal
          isOpen={showModal}
          onClose={() => setShowModal(false)}
          playlist={playlist}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default DisplayPlaylist;
