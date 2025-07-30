const ShortcutGrid = ({ name, image, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="group bg-[#ffffff0d] hover:bg-[#ffffff26] cursor-pointer rounded-lg flex items-center justify-between gap-4 p-3 relative"
    >
      {/* Left side: Image and name */}
      <div className="flex items-center gap-4 overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-12 h-12 object-cover rounded-md"
        />
        <span className="text-white font-semibold truncate">{name}</span>
      </div>

      {/* Right side: Play button (shown only on hover) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          console.log(`Play ${name}`);
        }}
        className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 
             bg-green-500 text-black rounded-full w-10 h-10 flex items-center justify-center text-xl"
      >
        ▶
      </button>
    </div>
  );
};

export default ShortcutGrid;
