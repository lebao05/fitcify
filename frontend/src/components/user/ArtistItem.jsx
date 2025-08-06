
const ArtistItem = ({ name, image, desc, id }) => {

  return (
    <div
      onClick={() => playWithId(id)}
      className="min-w-[180px] p-2 px-3 rounded cursor-pointer hover:bg-[#ffffff26]"
    >
      <img
        src={image}
        alt={name}
        className="w-36 h-36 rounded-full object-cover"
      />
      <p className="font-bold mt-2 mb-1">{name}</p>
      <p className="text-slate-200 text-sm">{desc}</p>
    </div>
  );
};

export default ArtistItem;
