import { FaHeart, FaPlay } from "react-icons/fa";

const LikedTrackBar = ({ title, subtitle, onClick }) => {
  return (
    <div
      className="relative group flex items-center gap-4 p-2 hover:bg-[#2a2a2a] cursor-pointer rounded"
      onClick={onClick}
    >
      {/* Gradient box with heart icon */}
      <div className="w-12 h-12 rounded bg-gradient-to-br from-[#450af5] via-[#c4efd9] to-[#8e8ee5] flex items-center justify-center">
        <FaHeart className="text-white text-lg" />
      </div>

      {/* Title + subtitle */}
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-semibold truncate">{title}</p>
        <p className="text-xs text-gray-400 truncate">{subtitle}</p>
      </div>
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

export default LikedTrackBar;
