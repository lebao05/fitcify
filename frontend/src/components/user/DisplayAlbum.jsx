import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAlbumById, toggleLikeSong } from "../../services/musicApi";
import { assets } from "../../assets/assets";
import { useDispatch, useSelector } from "react-redux";
import { playAlbumThunk } from "../../redux/slices/playerSlice";
import { Play, Heart } from "lucide-react";
import ContextMenu from "./ContextMenu";
import { addSongToPlaylist } from "../../services/playlistApi";
import {
  fetchLikedSongs,
  fetchUserPlaylists,
} from "../../redux/slices/myCollectionSlice";
import applogo from "../../assets/applogo.jpg";
import NotFound from "../../pages/NotFound";

function CenterToast({ message, type = "info", onClose, duration = 2200 }) {
  useEffect(() => {
    const t = setTimeout(onClose, duration);
    return () => clearTimeout(t);
  }, [onClose, duration]);

  const bg =
    type === "success" ? "rgba(22,163,74,.92)" :
    type === "error"   ? "rgba(220,38,38,.92)" :
                         "rgba(39,39,42,.92)";

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        pointerEvents: "none",
        zIndex: 9999,
      }}
    >
      <div
        style={{
          pointerEvents: "auto",
          padding: "12px 16px",
          borderRadius: 12,
          color: "#fff",
          background: bg,
          boxShadow: "0 10px 30px rgba(0,0,0,.35)",
          fontSize: 14,
          maxWidth: 480,
          textAlign: "center",
        }}
      >
        {message}
      </div>
    </div>
  );
}

const DisplayAlbum = () => {
  const [contextMenu, setContextMenu] = useState(null);
  const likedSongs = useSelector((state) => state.myCollection.likedSongs);
  const dispatch = useDispatch();
  const playlists = useSelector((state) => state.myCollection.playlists);

  const [toast, setToast] = useState(null); 
  const showToast = (message, type = "info") => setToast({ message, type });

  const handleRightClick = (e, song, isLiked) => {
    e.preventDefault();
    const options = [
      {
        label: "Add to playlist",
        submenu: playlists.map((pl) => ({
          label: pl.name,
          onClick: async () => {
            try {
              await addSongToPlaylist({ playlistId: pl._id, songId: song._id });
              await dispatch(fetchUserPlaylists());
              showToast("Đã thêm vào playlist", "success");
            } catch (err) {
              const status = err?.response?.status || err?.status;
              if (status === 409) {
                showToast("Bài hát đã có sẵn trong playlist", "info");
              } else if (status === 404) {
                showToast("Playlist hoặc bài hát không tồn tại", "error");
              } else if (status === 403) {
                showToast("Bạn không có quyền sửa playlist này", "error");
              } else {
                showToast("Thêm bài hát thất bại. Vui lòng thử lại!", "error");
              }
            }
          },
        })),
      },
      {
        label: isLiked ? "Unlike song" : "Like song",
        onClick: async () => {
          await toggleLikeSong(song._id);
          await dispatch(fetchLikedSongs());
        },
      },
      {
        label: "Go to artist",
        onClick: () => {
          console.log("Go to artist", song.artistId?.username);
        },
      },
    ];

    setContextMenu({
      x: e.clientX,
      y: e.clientY,
      options,
    });
  };

  const navigate = useNavigate();
  const { id } = useParams();
  const [album, setAlbum] = useState(null);
  const handlePlayAlbum = async (songOrder) => {
    if (!id) return;
    await dispatch(playAlbumThunk({ albumId: id, songOrder }));
  };
  useEffect(() => {
    if (id) {
      getAlbumById(id)
        .then((res) => {
          if (res?.Data) {
            setAlbum(res.Data);
          } else {
            navigate("/not-found");
          }
        })
        .catch((err) => {
          console.error("Failed to load album", err);
        });
    }
  }, [id]);

  if (!album) return null;

  return (
    <div className="h-full px-5 overflow-y-auto pr-4 scroll-on-hover">
      <div className="flex-1 overflow-y-auto">
        {/* Album Info */}
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:songs-end">
          <img
            className="w-48 h-48 rounded object-cover"
            src={album.imageUrl}
            alt=""
          />
          <div className="flex flex-col">
            <p>Album</p>
            <h2 className="text-5xl font-bold mb-4 md:text-7xl">
              {album.title}
            </h2>
            <p className="mt-1">
              <img
                className="inline-block rounded-full w-5"
                src={applogo}
                alt="logo"
              />
              <b
                onClick={() => {
                  navigate(`artist/${album.artistId._id}`);
                }}
                className="hover:underline cursor-pointer"
              >
                {" "}
                {album.artistId?.username || "Unknown"}{" "}
              </b>
              <b>• {album.songs?.length || 0} songs,</b>
              <span className="text-[#a7a7a7]">
                {" "}
                about {Math.floor(album.totalDuration / 60)} min
              </span>
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex songs-center gap-6 mt-8 mb-4 pl-2">
          <button
            onClick={handlePlayAlbum}
            className="bg-green-500 cursor-pointer w-14 h-14 text-black rounded-full flex items-center justify-center text-2xl hover:bg-green-400 hover:scale-105 transition-all"
          >
            ▶
          </button>

          {/* <button
            onClick={handleAddAlbum}
            className="text-zinc-400 cursor-pointer text-4xl border-5 w-11 h-11 flex songs-center justify-center border-zinc-400 hover:border-zinc-200 hover:text-zinc-200 rounded-full px-4 py-2 hover:scale-105 transition-all"
          >
            +
          </button> */}
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

        {/* Song Rows */}
        {album.songs?.map((song, index) => {
          const isLiked = likedSongs?.some((s) => s._id === song._id);
          return (
            <>
              {" "}
              <div
                key={song._id}
                onClick={() => handlePlayAlbum(index)}
                onContextMenu={(e) => handleRightClick(e, song, isLiked)} 
                className="group grid grid-cols-3 sm:grid-cols-5 gap-2 p-2 songs-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer rounded"
              >
                {/* Title + image */}
                <div className="flex songs-center gap-4 text-white text-sm md:text-[15px]">
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
                      {album.artistId?.username}
                    </span>
                  </div>
                </div>

                <p className="text-[15px]">{album.title}</p>

                <p className="text-[15px] hidden sm:block">
                  {new Date(song.uploadedAt).toLocaleDateString()}
                </p>

                {/* Like Icon */}
                <div className="hidden sm:flex justify-center songs-center relative group z-10">
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

                {/* Duration */}
                <p className="text-[15px] text-center text-white">
                  {Math.floor(song.duration / 60)}:
                  {(song.duration % 60).toString().padStart(2, "0")}
                </p>
              </div>
            </>
          );
        })}
      </div>

      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          options={contextMenu.options}
          onClose={() => setContextMenu(null)}
        />
      )}

      {/* ===== Render toast (chỉ thêm mới) ===== */}
      {toast && (
        <CenterToast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
      {/* ====================================== */}
    </div>
  );
};

export default DisplayAlbum;
