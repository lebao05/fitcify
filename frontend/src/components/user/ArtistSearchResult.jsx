import React from "react";

const artists = [
  {
    id: 1,
    name: "Sơn Tùng M-TP",
    image:
      "https://is1-ssl.mzstatic.com/image/thumb/Music116/v4/09/0a/54/090a5427-7550-ab6d-d822-1e0169618299/dj.vosqmabx.jpg/1200x1200bf-60.jpg",
  },
  {
    id: 2,
    name: "MONO",
    image:
      "https://tse2.mm.bing.net/th/id/OIP.04AdKbBaHNFJ4PNuuc7NnAHaEo?rs=1&pid=ImgDetMain&o=7&rm=3",
  },
  {
    id: 3,
    name: "Sơn Tùng MT",
    image: "/artists/default.jpg",
  },
  {
    id: 4,
    name: "SOOBIN",
    image: "/artists/soobin.jpg",
  },
  {
    id: 5,
    name: "Sơn Tùng",
    image: "/artists/default.jpg",
  },
  {
    id: 6,
    name: "AMEE",
    image: "/artists/amee.jpg",
  },
  {
    id: 7,
    name: "Jack - J97",
    image: "/artists/jack.jpg",
  },
  {
    id: 8,
    name: "Jack",
    image: "/artists/jack2.jpg",
  },
  {
    id: 9,
    name: "Sơn Tuyền",
    image: "/artists/son-tuyen.jpg",
  },
  {
    id: 10,
    name: "Song Luân",
    image: "/artists/song-luan.jpg",
  },
  {
    id: 11,
    name: "S.T Sơn Thạch",
    image: "/artists/st.jpg",
  },
  {
    id: 12,
    name: "Quang Hùng MasterD",
    image: "/artists/quanghung.jpg",
  },
  {
    id: 13,
    name: "SON DONG PYO",
    image: "/artists/sondongpyo.jpg",
  },
  {
    id: 14,
    name: "Son Dong Woon",
    image: "/artists/sondongwoon.jpg",
  },
];

export default function ArtistSearchResult() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 px-2">
      {artists.map((artist) => (
        <div
          key={artist.id}
          className="bg-[#181818] hover:bg-[#242424] transition rounded-lg cursor-pointer flex flex-col items-center text-center p-3"
        >
          <div className="w-full aspect-square rounded-full overflow-hidden">
            <img
              src={artist.image}
              alt={artist.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="mt-3 text-white text-sm font-semibold truncate w-full">
            {artist.name}
          </div>
          <div className="text-xs text-gray-400">Artist</div>
        </div>
      ))}
    </div>
  );
}
