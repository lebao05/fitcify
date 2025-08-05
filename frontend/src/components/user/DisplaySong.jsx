import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { assets } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { playSongThunk } from "../../redux/slices/playerSlice";
import { Play, Heart } from "lucide-react";
import { getSongById } from "../../services/artistApi";
import { toggleLikeSong } from "../../services/musicApi";
import {
  fetchLikedSongs,
  fetchUserPlaylists,
} from "../../redux/slices/myCollectionSlice";
import { addSongToPlaylist } from "../../services/playlistApi";
import ContextMenu from "./ContextMenu";

const DisplaySong = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [song, setSong] = useState(null);
  const [contextMenu, setContextMenu] = useState(null);

  const likedSongs = useSelector((state) => state.myCollection.likedSongs);
  const playlists = useSelector((state) => state.myCollection.playlists);
  const liked = likedSongs?.some((s) => s._id === song?._id);

  useEffect(() => {
    if (id) {
      getSongById(id)
        .then((res) => {
          if (res?.data?.Data) {
            setSong(res.data.Data);
          } else {
            navigate("/not-found");
          }
        })
        .catch((err) => {
          console.error("Failed to load song", err);
        });
    }
    dispatch(fetchLikedSongs());
    dispatch(fetchUserPlaylists());
  }, [id]);

  const handlePlaySong = async () => {
    await dispatch(playSongThunk(song._id));
  };

  const handleLikeToggle = async () => {
    await toggleLikeSong(song._id);
    await dispatch(fetchLikedSongs());
  };

  const handleRightClick = (e) => {
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
        label: liked
          ? "Remove from your Liked Songs"
          : "Add to your Liked Songs",
        onClick: handleLikeToggle,
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

  if (!song) return null;

  return (
    <div
      className="h-full px-5 overflow-y-auto pr-4 scroll-on-hover"
      onContextMenu={handleRightClick} // 👈 Apply right click handler on container
    >
      <div className="flex-1 overflow-y-auto">
        {/* Song Info */}
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
          <img
            className="w-48 h-48 rounded object-cover"
            src={song.imageUrl}
            alt=""
          />
          <div className="flex flex-col">
            <p>Song</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">
              {song.title}
            </h2>
            <p className="mt-1">
              <img
                className="inline-block w-5"
                src={assets.spotify_logo}
                alt="logo"
              />
              <b> {song?.artistId?.username || "Unknown"} </b>
              <b> • 1 song</b>
              <span className="text-[#a7a7a7]">
                {" "}
                about {Math.floor(song?.duration / 60)} min
              </span>
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-6 mt-8 mb-4 pl-2">
          <button
            onClick={handlePlaySong}
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
          <p className="hidden sm:block">Date Added</p>
          <p className="text-center hidden sm:block">Like</p>
          <img className="m-auto w-4" src={assets.clock_icon} alt="Duration" />
        </div>
        <hr />

        {/* Song Row */}
        <div className="group grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded">
          <div className="flex items-center gap-4 text-white text-sm md:text-[15px]">
            <div className="w-5 text-right" onClick={handlePlaySong}>
              <span className="group-hover:hidden block text-[#a7a7a7]">1</span>
              <span className="hidden group-hover:block text-[#a7a7a7]">▶</span>
            </div>

            <img
              className="w-10 h-10 object-cover rounded"
              src={song.imageUrl}
              alt={song.title}
            />

            <div className="flex flex-col">
              <span>{song.title}</span>
              <span className="text-[#a7a7a7]">{song.artistId?.username}</span>
            </div>
          </div>

          <p className="text-[15px]">{song.albumId?.title || ""}</p>

          <p className="text-[15px] hidden sm:block">
            {new Date(song.uploadedAt).toLocaleDateString()}
          </p>

          <div className="hidden sm:flex justify-center items-center relative group z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLikeToggle();
              }}
              className="p-1 rounded-full relative hover:bg-green-600/10"
              tabIndex={-1}
            >
              <Heart
                size={18}
                fill={liked ? "#1db954" : "none"}
                color={liked ? "#1db954" : "#fff"}
                className={liked ? "drop-shadow-[0_0_2px_#1db954]" : ""}
              />
              <span className="absolute left-[110%] top-1/2 -translate-y-1/2 bg-black text-white text-xs px-2 py-1 rounded shadow-md opacity-0 pointer-events-none group-hover:opacity-100 whitespace-nowrap ml-2">
                {liked ? "Added to Liked Songs" : "Add to Liked Songs"}
              </span>
            </button>
          </div>

          <p className="text-[15px] text-center text-white">
            {Math.floor(song.duration / 60)}:
            {(song.duration % 60).toString().padStart(2, "0")}
          </p>
        </div>
      </div>

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
  );
};

export default DisplaySong;
