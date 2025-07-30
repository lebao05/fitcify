import { FaPlay } from "react-icons/fa";

const PlaylistBar = ({ cover, title, subtitle, onClick }) => {
  return (
    <div
      className="relative group flex items-center gap-4 p-2 hover:bg-[#2a2a2a] cursor-pointer rounded"
      onClick={onClick}
    >
      <img
        src={cover || "https://placehold.co/64x64?text=♪"}
        alt={title}
        className="w-12 h-12 object-cover rounded"
      />

      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>

      {/* Play icon on hover */}
      <div className="absolute right-3">
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="w-6 h-6 flex items-center justify-center bg-green-500 text-black rounded-full">
            <FaPlay className="text-xs cursor-pointer" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaylistBar;
