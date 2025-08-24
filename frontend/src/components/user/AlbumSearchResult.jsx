import React from "react";
import { useNavigate } from "react-router-dom";
export default function AlbumSearchResult({ searchResult }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
      {searchResult?.albums.map((album) => (
        <div
          key={album._id}
          onClick={() => navigate(`/album/${album._id}`)}
          className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-200 cursor-pointer"
        >
          <div className="w-full aspect-square overflow-hidden rounded">
            <img
              src={album.imageUrl}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-white font-semibold text-sm line-clamp-2">
            {album.title}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            By {album.artistId.username}
          </div>
        </div>
      ))}
    </div>
  );
}
