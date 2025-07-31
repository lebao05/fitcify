import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { getPlaylistById } from "../../services/playlistApi";
import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { playPlaylistThunk } from "../../redux/slices/playerSlice";
const DisplayPlaylist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);
  const handlePlay = (songOrder) => {
    if (!id) return;
    // Dispatch action to play the song at the specified order
    dispatch(playPlaylistThunk({ playlistId: id, songOrder }));
  };
  useEffect(() => {
    console.log(id);
    if (id) {
      getPlaylistById({ playlistId: id })
        .then((res) => {
          setPlaylist(res?.Data);
        })
        .catch(null);
    }
  }, [id]);
  if (!playlist) return null;

  return (
    <div className="h-full px-5 overflow-y-auto pr-4 scroll-on-hover">
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img
          className="w-48 h-48 object-cover rounded"
          src={playlist.imageUrl}
          alt="cover"
        />
        <div className="flex flex-col">
          <p>Playlist</p>
          <h2 className="text-5xl font-bold mb-4 md:text-7xl">
            {playlist.name}
          </h2>
          <h4>{playlist.description}</h4>
          <p className="mt-1 text-sm text-[#a7a7a7]">
            <img
              className="inline-block w-5 mr-1"
              src={assets.spotify_logo}
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
          onClick={handlePlay}
          className="bg-green-500 cursor-pointer w-14 h-14 text-black rounded-full flex items-center text-2xl justify-center hover:bg-green-400 hover:scale-105 transition-all"
        >
          ▶
        </button>

        <button className="text-zinc-400 cursor-pointer text-4xl border-5 w-11 h-11 flex items-center justify-center border-zinc-400 hover:border-zinc-200 hover:text-zinc-200 rounded-full px-4 py-2 hover:scale-105 transition-all">
          +
        </button>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] text-sm">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Artist</p>
        <p className="hidden sm:block">Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="duration" />
      </div>
      <hr />
      {playlist?.songs.map((song, index) => (
        <div
          key={song._id}
          className="group grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
          onClick={() => handlePlay(index)}
        >
          {/* Index + Play Icon + Title */}
          <div className="flex items-center gap-4 text-white text-sm md:text-[15px]">
            <div className="w-5 text-right">
              <span className="group-hover:hidden block text-[#a7a7a7]">
                {index + 1}
              </span>
              <span className="hidden group-hover:block text-[#a7a7a7]">▶</span>
            </div>

            <img
              className="w-10 h-10 object-cover rounded"
              src={song.imageUrl}
              alt={song.title}
            />

            <div className="flex flex-col">
              <span>{song.title.slice(0, 25)}</span>
              <span className="text-[#a7a7a7]">
                {song.artistId?.username || "Unknown"}
              </span>
            </div>
          </div>

          <p className="text-[15px]">Playlist</p>

          <p className="text-[15px] hidden sm:block">
            {song.uploadedAt
              ? new Date(song.uploadedAt).toLocaleDateString()
              : "Recently"}
          </p>

          <p className="text-[15px] text-center">
            {Math.floor(song.duration / 60)}:
            {String(song.duration % 60).padStart(2, "0")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DisplayPlaylist;
