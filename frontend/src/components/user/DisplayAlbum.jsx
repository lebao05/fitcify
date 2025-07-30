import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { getAlbumById } from "../../services/musicApi";
import { assets } from "../../assets/assets";

const DisplayAlbum = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [album, setAlbum] = useState(null);

  const handlePlayAlbum = () => {
    console.log("Playing full album:", album.title);
  };

  const handleShuffleAlbum = () => {
    console.log("Shuffle play album:", album.title);
  };

  const handleAddAlbum = () => {
    console.log("Add album to library:", album.title);
  };

  const handleDownloadAlbum = () => {
    console.log("Download album:", album.title);
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

  if (!album) return <p className="text-white p-10">Loading...</p>;

  return (
    <div className="h-full px-5 overflow-y-auto pr-4 scroll-on-hover">
      <div className="flex-1 overflow-y-auto">
        {/* Album Info */}
        <div className="mt-10 flex gap-8 flex-col md:flex-row md:items-end">
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
            <h4>{album.description || "No description"}</h4>
            <p className="mt-1">
              <img
                className="inline-block w-5"
                src={assets.spotify_logo}
                alt="logo"
              />
              <b> {album.artistId?.username || "Unknown"} </b>
              <b>• {album.songs?.length || 0} songs,</b>
              <span className="text-[#a7a7a7]">
                {" "}
                about {Math.floor(album.totalDuration / 60)} min
              </span>
            </p>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center gap-6 mt-8 mb-4 pl-2">
          <button
            onClick={handlePlayAlbum}
            className="bg-green-500 cursor-pointer w-14 h-14 text-black rounded-full flex items-center text-2xl justify-center hover:bg-green-400 hover:scale-105 transition-all"
          >
            ▶
          </button>

          <button
            onClick={handleAddAlbum}
            className="text-zinc-400 cursor-pointer text-4xl border-5 w-11 h-11 flex items-center justify-center border-zinc-400 hover:border-zinc-200 hover:text-zinc-200 rounded-full px-4 py-2 hover:scale-105 transition-all"
          >
            +
          </button>
        </div>

        {/* Tracklist Header */}
        <div className="grid grid-cols-3 sm:grid-cols-4 mt-6 mb-4 pl-2 text-[#a7a7a7]">
          <p>
            <b className="mr-4">#</b>Title
          </p>
          <p>Album</p>
          <p className="hidden sm:block">Date Added</p>
          <img className="m-auto w-4" src={assets.clock_icon} alt="" />
        </div>
        <hr />

        {/* Song Rows */}
        {album.songs?.map((item, index) => (
          <div
            key={item._id}
            className="group grid grid-cols-3 sm:grid-cols-4 gap-2 p-2 items-center text-[#a7a7a7] hover:bg-[#ffffff2b] cursor-pointer"
          >
            {/* Title + image */}
            <div className="flex items-center gap-4 text-white text-sm md:text-[15px]">
              <div className="w-5 text-right">
                <span className="group-hover:hidden block text-[#a7a7a7]">{index + 1}</span>
                <span className="hidden group-hover:block text-[#a7a7a7]">▶</span>
              </div>

              <img
                className="w-10 h-10 object-cover rounded"
                src={item.imageUrl}
                alt={item.title}
              />

              <div className="flex flex-col">
                <span>{item.title}</span>
                <span className="text-[#a7a7a7]">
                  {album.artistId?.username}
                </span>
              </div>
            </div>

            <p className="text-[15px]">{album.title}</p>
            <p className="text-[15px] hidden sm:block">
              {new Date(item.uploadedAt).toLocaleDateString()}
            </p>
            <p className="text-[15px] text-center">
              {Math.floor(item.duration / 60)}:
              {(item.duration % 60).toString().padStart(2, "0")}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DisplayAlbum;
