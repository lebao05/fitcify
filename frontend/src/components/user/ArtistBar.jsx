const ArtistBar = ({ avatar, name, onClick }) => {
  return (
    <div
      className="flex items-center gap-4 p-2 hover:bg-[#2a2a2a] cursor-pointer rounded"
      onClick={onClick}
    >
      <img
        src={avatar || "https://placehold.co/64x64?text=A"}
        alt={name}
        className="w-12 h-12 object-cover rounded-full"
      />
      <div className="flex flex-col overflow-hidden">
        <p className="text-sm font-semibold truncate">{name}</p>
        <p className="text-xs text-gray-400 truncate">Artist</p>
      </div>
    </div>
  );
};

export default ArtistBar;
