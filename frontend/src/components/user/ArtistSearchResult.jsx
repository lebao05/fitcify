import React from "react";
import { useNavigate } from "react-router-dom";

export default function ArtistSearchResult({ searchResult }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2">
      {searchResult?.artists.map((artist) => (
        <div
          key={artist._id}
          onClick={() => navigate(`/artist/${artist._id}`)}
          className="bg-[#181818] hover:bg-[#242424] transition rounded-lg cursor-pointer flex flex-col items-center text-center p-3"
        >
          <div className="w-full aspect-square rounded-full overflow-hidden">
            <img
              src={artist.avatarUrl}
              alt={artist.username}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-white text-sm font-semibold truncate w-full">
            {artist.username}
          </div>
          <div className="text-xs text-gray-400">Artist</div>
        </div>
      ))}
    </div>
  );
}
