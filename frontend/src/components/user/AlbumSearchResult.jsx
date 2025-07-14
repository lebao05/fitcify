import React from "react";

const albums = [
  {
    id: 1,
    title: "m-tp M-TP",
    artist: "Sơn Tùng M-TP",
    year: 2017,
    image: "/covers/mtp1.jpg",
  },
  {
    id: 2,
    title: "Đừng Làm Trái Tim Anh Đau",
    artist: "Sơn Tùng M-TP",
    year: 2024,
    image: "/covers/mtp2.jpg",
  },
  {
    id: 3,
    title: "Sky Tour (Original Motion Picture Soundtrack)",
    artist: "Sơn Tùng M-TP",
    year: 2020,
    image: "/covers/mtp3.jpg",
  },
  {
    id: 4,
    title: "Hãy Trao Cho Anh",
    artist: "Sơn Tùng M-TP",
    year: 2019,
    image: "/covers/mtp4.jpg",
  },
  {
    id: 5,
    title: "Nơi Này Có Anh",
    artist: "Sơn Tùng M-TP",
    year: 2017,
    image: "/covers/mtp5.jpg",
  },
  {
    id: 6,
    title: "Chúng Ta Của Tương Lai",
    artist: "Sơn Tùng M-TP",
    year: 2024,
    image: "/covers/mtp6.jpg",
  },
  {
    id: 7,
    title: "Em Của Ngày Hôm Qua",
    artist: "Sơn Tùng M-TP",
    year: 2014,
    image: "/covers/mtp7.jpg",
  },
  {
    id: 8,
    title: "Chạy Ngay Đi",
    artist: "Sơn Tùng M-TP",
    year: 2018,
    image: "/covers/mtp8.jpg",
  },
  {
    id: 9,
    title: "Có Chắc Yêu Là Đây",
    artist: "Sơn Tùng M-TP",
    year: 2020,
    image: "/covers/mtp9.jpg",
  },
  {
    id: 10,
    title: "Sky Decade",
    artist: "Sơn Tùng M-TP",
    year: 2022,
    image: "/covers/mtp10.jpg",
  },
];

export default function AlbumSearchResult() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-6">
      {albums.map((album) => (
        <div
          key={album.id}
          className="bg-[#181818] p-4 rounded-lg hover:bg-[#282828] transition duration-200 cursor-pointer"
        >
          <div className="w-full aspect-square overflow-hidden rounded">
            <img
              src={album.image}
              alt={album.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-white font-semibold text-sm line-clamp-2">
            {album.title}
          </div>
          <div className="text-xs text-gray-400 mt-1">
            {album.year} · {album.artist}
          </div>
        </div>
      ))}
    </div>
  );
}
