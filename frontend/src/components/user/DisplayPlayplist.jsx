import { useParams, useNavigate } from "react-router-dom";
import { assets } from "../../assets/assets";
import { getPlaylistById } from "../../services/playlistApi";
import { useState, useEffect } from "react";

const DisplayPlaylist = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

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
    <div className="h-full overflow-y-auto pr-4 scroll-on-hover">
      <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
        <img className="w-48 rounded" src={playlist.imageUrl} alt="cover" />
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

      <div className="grid grid-cols-3 sm:grid-cols-4 mt-10 mb-4 pl-2 text-[#a7a7a7] text-sm">
        <p>
          <b className="mr-4">#</b>Title
        </p>
        <p>Artist</p>
        <p className="hidden sm:block">Added</p>
        <img className="m-auto w-4" src={assets.clock_icon} alt="duration" />
      </div>
      <hr />

      {playlist.songs.map((song, index) => (
        <div
          key={song._id}
          className="grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-sm hover:bg-[#ffffff2b] cursor-pointer"
        >
          <div className="text-white">
            <b className="mr-4 text-[#a7a7a7]">{index + 1}</b>
            <img
              className="inline w-10 mb-5 mr-5 rounded"
              src={song.imageUrl}
              alt={song.title}
            />
            <div className="inline-block">
              <div>{song.title.slice(0, 25)}</div>
              <div className="text-[#a7a7a7]">{song.artistId?.username}</div>
            </div>
          </div>
          <p className="text-[#a7a7a7]">{song.artistId?.username}</p>
          <p className="hidden sm:block text-[#a7a7a7]">Recently</p>
          <p className="text-center text-[#a7a7a7]">
            {Math.floor(song.duration / 60)}:
            {String(song.duration % 60).padStart(2, "0")}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DisplayPlaylist;
