import React from "react";
import { useNavigate } from "react-router-dom";

const playlists = [
  {
    id: 1,
    title: "Tất cả các bài hát của Sơn Tùng M-TP",
    author: "By",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/09/0a/54/090a5427-7550-ab6d-d822-1e0169618299/dj.vosqmabx.jpg/1200x1200bf-60.jpg",
  },
  {
    id: 2,
    title: "Playlist Sơn Tùng M-TP",
    author: "By Trần Mai Trung Kiên",
    image: "/covers/playlist2.jpg",
  },
  {
    id: 3,
    title: "Sơn Tùng Remix",
    author: "By Hoàng Lâm Nguyễn",
    image: "/covers/playlist3.jpg",
  },
  {
    id: 4,
    title: "Sơn Tùng MTP playlist",
    author: "By LiuminhvulmV",
    image: "/covers/playlist4.jpg",
  },
  {
    id: 5,
    title: "Khuôn Mặt Đáng Thương Remix",
    author: "By Anien",
    image: "/covers/playlist5.jpg",
  },
  {
    id: 6,
    title: "Sơn Tùng M-TP Playlist !!!!!!",
    author: "By Phú Lộc",
    image: "/covers/playlist6.jpg",
  },
];

export default function PlaylistSearchResult({ searchResult }) {
  const navigate = useNavigate();
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
      {searchResult?.playlists.map((playlist) => (
        <div
          key={playlist._id}
          onClick={() => navigate(`/playlist/${playlist._id}`)}
          className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-200 cursor-pointer"
        >
          <div className="w-full aspect-square overflow-hidden rounded">
            <img
              src={playlist.imageUrl}
              alt={playlist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-white font-semibold text-sm line-clamp-2">
            {playlist.title}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            By {playlist.ownerId.username}
          </div>
        </div>
      ))}
    </div>
  );
}
