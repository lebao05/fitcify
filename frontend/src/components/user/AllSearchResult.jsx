import React from "react";
import { Play } from "lucide-react"; // Spotify-style play icon

const data = {
  topResult: {
    type: "artist",
    name: "Sơn Tùng M-TP",
    image:
      "https://images2.thanhnien.vn/Uploaded/hienht/2022_05_12/den-vau-6397.jpg",
  },
  songs: [
    {
      id: 1,
      title: "Đừng Làm Trái Tim Anh Đau",
      artist: "Sơn Tùng M-TP",
      duration: "4:39",
      image: "/covers/mtp1.jpg",
    },
    {
      id: 2,
      title: "Âm Thầm Bên Em",
      artist: "Sơn Tùng M-TP",
      duration: "4:53",
      image: "/covers/mtp2.jpg",
    },
    {
      id: 4,
      title: "Âm Thầm Bên Em",
      artist: "Sơn Tùng M-TP",
      duration: "4:53",
      image: "/covers/mtp2.jpg",
    },
    {
      id: 4,
      title: "Âm Thầm Bên Em",
      artist: "Sơn Tùng M-TP",
      duration: "4:53",
      image: "/covers/mtp2.jpg",
    },
  ],
  artists: [
    { id: 1, name: "Đen Vâu", image: "/covers/mtp3.jpg" },
    { id: 2, name: "Hòa Minzy", image: "/covers/mtp4.jpg" },
  ],
  albums: [
    {
      id: 1,
      title: "M-TP M-TP",
      artist: "Sơn Tùng M-TP",
      image: "/covers/mtp5.jpg",
    },
    {
      id: 2,
      title: "Sky Tour",
      artist: "Sơn Tùng M-TP",
      image: "/covers/mtp6.jpg",
    },
  ],
  playlists: [
    {
      id: 1,
      title: "Top Nhạc Việt 2024",
      author: "By Spotify",
      image: "/covers/mtp7.jpg",
    },
    {
      id: 2,
      title: "Sơn Tùng M-TP Radio",
      author: "By Spotify",
      image: "/covers/mtp8.jpg",
    },
  ],
  profiles: [
    { id: 1, name: "User1", image: "https://i.pravatar.cc/150?img=1" },
    { id: 2, name: "MusicLover", image: "https://i.pravatar.cc/150?img=2" },
  ],
};

const PlayButton = () => (
  <button className="bg-green-500 hover:scale-105 transition rounded-full p-2">
    <Play size={16} fill="black" className="text-black" />
  </button>
);

export default function GeneralSearchResult() {
  return (
    <div className="space-y-12 text-white">
      {/* Songs */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        {/* Top Result (30%) */}
        <div className="md:w-[30%]">
          <h2 className="text-xl font-bold mb-4">Top Result</h2>
          <div className="relative bg-[#181818] min-h-[240px] cursor-pointer p-4 rounded-lg group overflow-hidden flex flex-col justify-center">
            <img
              src={data.topResult.image}
              alt={data.topResult.name}
              className="w-24 h-24 object-cover rounded-full mb-4"
            />
            <div>
              <div className="text-lg font-semibold">{data.topResult.name}</div>
              <div className="text-gray-400 capitalize">
                {data.topResult.type}
              </div>
            </div>
            <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
              <PlayButton />
            </div>
          </div>
        </div>

        {/* Songs (70%) */}
        <div className="md:w-[70%]">
          <h2 className="text-xl font-bold mb-4">Songs</h2>
          <div className="space-y-2">
            {data.songs.map((song) => (
              <div
                key={song.id}
                className="flex items-center justify-between hover:bg-[#282828] p-3 rounded group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.image}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{song.title}</div>
                    <div className="text-gray-400 text-sm">{song.artist}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400">{song.duration}</div>
                  <div className="opacity-0 group-hover:opacity-100 transition">
                    <PlayButton />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Albums */}
      <section>
        <h2 className="text-xl mt-16 font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {data.albums.map((album) => (
            <div
              key={album.id}
              className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] relative group cursor-pointer"
            >
              <img
                src={album.image}
                alt={album.title}
                className="w-full aspect-square object-cover rounded mb-3"
              />
              <div className="font-semibold">{album.title}</div>
              <div className="text-sm text-gray-400">{album.artist}</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <PlayButton />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Playlists */}
      <section>
        <h2 className="text-xl font-bold mb-4">Playlists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4 cursor-pointer">
          {data.playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] relative group"
            >
              <img
                src={playlist.image}
                alt={playlist.title}
                className="w-full aspect-square object-cover rounded mb-3"
              />
              <div className="font-semibold">{playlist.title}</div>
              <div className="text-sm text-gray-400">{playlist.author}</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <PlayButton />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Artists */}
      <section>
        <h2 className="text-xl font-bold mb-4">Artists</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {data.artists.map((artist) => (
            <div
              key={artist.id}
              className="text-center relative group hover:bg-[#282828] p-4 rounded-lg cursor-pointer"
            >
              <img
                src={artist.image}
                alt={artist.name}
                className="w-full aspect-square object-cover rounded-full mb-3"
              />
              <div className="font-semibold">{artist.name}</div>
              <div className="text-xs text-gray-400">Artist</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <PlayButton />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Profiles */}
      <section>
        <h2 className="text-xl font-bold mb-4">Profiles</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {data.profiles.map((profile) => (
            <div
              key={profile.id}
              className="text-center relative group hover:bg-[#282828] p-4 rounded-lg cursor-pointer"
            >
              <img
                src={profile.image}
                alt={profile.name}
                className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
              />
              <div className="font-semibold">{profile.name}</div>
              <div className="text-xs text-gray-400">Profile</div>
              <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition">
                <PlayButton />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
