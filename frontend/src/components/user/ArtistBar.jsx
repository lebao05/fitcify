import { FaPlay } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { playArtistThunk } from "../../redux/slices/playerSlice";

const ArtistBar = ({ avatar, name, onClick, id }) => {
  const dispatch = useDispatch();
  const playArtist = async (e) => {
    e.stopPropagation();
    await dispatch(playArtistThunk(id));
  };
  return (
    <div
      className="group flex items-center gap-4 p-2 hover:bg-[#2a2a2a] cursor-pointer rounded relative"
      onClick={onClick}
    >
      <img
        src={avatar}
        alt={name}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-gray-400 truncate">Artist</p>
      </div>
      <div onClick={playArtist} className="absolute right-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="w-6 h-6 cursor-pointer flex items-center justify-center bg-green-500 text-black rounded-full">
            <FaPlay className="text-xs" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ArtistBar;
