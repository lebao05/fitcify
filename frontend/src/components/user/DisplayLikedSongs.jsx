import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import {
  playAlbumThunk,
  playLikedTrackThunk,
} from "../../redux/slices/playerSlice";
import { Play, Heart } from "lucide-react";
import { FaHeart } from "react-icons/fa";
import {
  fetchLikedSongs,
  fetchUserPlaylists,
} from "../../redux/slices/myCollectionSlice";
import { toggleLikeSong } from "../../services/musicApi";
import { addSongToPlaylist } from "../../services/playlistApi";
import ContextMenu from "./ContextMenu"; // 👈 Make sure this is correct

const DisplayLikedSongs = () => {
  const likedSongs = useSelector((state) => state.myCollection.likedSongs);
  const playlists = useSelector((state) => state.myCollection.playlists);
  const user = useSelector((state) => state.user.myAuth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [likedMap, setLikedMap] = useState({});
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    if (likedSongs) {
      const initialLikes = {};
      likedSongs.forEach((song) => {
        initialLikes[song._id] = true;
      });
      setLikedMap(initialLikes);
    }
    dispatch(fetchUserPlaylists());
  }, [likedSongs]);

  const handlePlayLikedTracks = async () => {
    if (likedSongs.length > 0) {
      await dispatch(playLikedTrackThunk());
    }
  };

  const toggleLike = async (songId) => {
    await toggleLikeSong(songId);
    await dispatch(fetchLikedSongs());
  };

  const handleRightClick = (e, song) => {
    e.preventDefault();

    const options = [
      {
        label: "Add to playlist",
        submenu: playlists.map((pl) => ({
          label: pl.name,
          onClick: async () => {
            await addSongToPlaylist({ playlistId: pl._id, songId: song._id });
            dispatch(fetchUserPlaylists());
          },
        })),
      },
      {
        label: likedMap[song._id] ? "Unlike song" : "Like song",
        onClick: () => toggleLike(song._id),
      },
      {
        label: "Go to artist",
        onClick: () => {
          navigate(`/artist/${song.artistId?._id}`);
        },
      },
    ];

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options,
    });
  };

  const totalDuration = likedSongs.reduce(
    (acc, song) => acc + song.duration,
    0
  );

  if (!likedSongs || likedSongs.length === 0)
    return <p className="text-white p-10">No liked songs yet.</p>;

  return (
    <div className="h-full px-5 overflow-y-auto pr-4 scroll-on-hover">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
          <div className="w-38 h-38 rounded bg-gradient-to-br from-[#450af5] via-[#c4efd9] to-[#8e8ee5] flex items-center justify-center">
            <FaHeart className="text-white text-lg" />
          </div>
          <div className="flex flex-col">
            <p>Playlist</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">
              Liked Tracks
            </h2>
            <p className="mt-1">
              <img
                className="inline-block w-5"
                src={assets.spotify_logo}
                alt="logo"
              />
              <b> {user?.username || "Unknown"} </b>
              <b> • {likedSongs.length} songs,</b>
              <span className="text-[#a7a7a7]">
                {" "}
                about {Math.floor(totalDuration / 60)} min
              </span>
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-6 mt-8 mb-4 pl-2">
          <button
            onClick={handlePlayLikedTracks}
            className="bg-green-500 cursor-pointer w-14 h-14 text-black rounded-full flex items-center text-2xl justify-center hover:bg-green-400 hover:scale-105 transition-all"
          >
            ▶
          </button>
        </div>

        {/* Tracklist Header */}
        <div className="grid grid-cols-3 sm:grid-cols-5 mt-6 mb-4 pl-2 text-[#a7a7a7] text-sm">
          <p>
            <b className="mr-4">#</b>Title
          </p>
          <p>Album</p>
          <p className="hidden sm:block">Date</p>
          <p className="text-center hidden sm:block">Like</p>
          <img className="m-auto w-4" src={assets.clock_icon} alt="Duration" />
        </div>
        <hr />

        {/* Song Rows */}
        {likedSongs.map((item, index) => (
          <div
            key={item._id}
            onContextMenu={(e) => handleRightClick(e, item)} // 👈 Add right click here
            className="group grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded"
          >
            <div className="flex items-center gap-4 text-white text-sm md:text-[15px]">
              <div
                className="w-5 text-right"
                onClick={() =>
                  dispatch(
                    playAlbumThunk({ songs: likedSongs, startIndex: index })
                  )
                }
              >
                <span className="group-hover:hidden block text-[#a7a7a7]">
                  {index + 1}
                </span>
                <span className="hidden group-hover:block text-[#a7a7a7]">
                  ▶
                </span>
              </div>
              <img
                className="w-10 h-10 object-cover rounded"
                src={item.imageUrl}
                alt={item.title}
              />
              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-[#a7a7a7]">
                  {item.artistId?.username || "Unknown"}
                </span>
              </div>
            </div>

            <p className="text-[15px]">{item.albumId?.title || "Unknown"}</p>

            <p className="text-[15px] hidden sm:block">
              {new Date(item.uploadedAt).toLocaleDateString()}
            </p>

            <div className="hidden sm:flex justify-center items-center relative group z-10">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleLike(item._id);
                }}
                className="p-1 rounded-full relative hover:bg-green-600/10"
                tabIndex={-1}
              >
                <Heart
                  size={18}
                  fill={likedMap[item._id] ? "#1db954" : "none"}
                  color={likedMap[item._id] ? "#1db954" : "#fff"}
                  className={
                    likedMap[item._id] ? "drop-shadow-[0_0_2px_#1db954]" : ""
                  }
                />
                <span className="absolute left-[110%] top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap ml-2">
                  {likedMap[item._id]
                    ? "Added to Liked Songs"
                    : "Add to Liked Songs"}
                </span>
              </button>
            </div>

            <p className="text-[15px] text-center text-white">
              {Math.floor(item.duration / 60)}:
              {(item.duration % 60).toString().padStart(2, "0")}
            </p>
          </div>
        ))}

        {/* Context Menu */}
        {contextMenu && (
          <ContextMenu
            x={contextMenu.x}
            y={contextMenu.y}
            options={contextMenu.options}
            onClose={() => setContextMenu(null)}
          />
        )}
      </div>
    </div>
  );
};

export default DisplayLikedSongs;
