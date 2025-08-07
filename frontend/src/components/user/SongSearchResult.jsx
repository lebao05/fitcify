import { useNavigate } from "react-router-dom";

const songs = [
  {
    id: 1,
    title: "Đừng Làm Trái Tim Anh Đau",
    artist: "Sơn Tùng M-TP",
    album: "Đừng Làm Trái Tim Anh Đau",
    duration: "4:39",
    img: "/covers/cover1.jpg",
  },
  {
    id: 2,
    title: "Hãy Trao Cho Anh",
    artist: "Sơn Tùng M-TP, Snoop Dogg",
    album: "Hãy Trao Cho Anh",
    duration: "4:05",
    img: "/covers/cover2.jpg",
  },
];
export default function SongSearchResult({ searchResult }) {
  console.log(searchResult);
  const navigate = useNavigate();
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left table-auto">
        <thead className="border-b border-gray-700 text-gray-400 text-sm">
          <tr>
            <th className="py-3 px-4 w-12">#</th>
            <th className="py-3 px-4">Title</th>
            <th className="py-3 px-4">Artist</th>
          </tr>
        </thead>
        <tbody>
          {searchResult?.songs.map((song, index) => (
            <tr
              key={song.id}
              onClick={() => {
                navigate(`/song/${song._id}`);
              }}
              className="hover:bg-gray-800 cursor-pointer transition-colors duration-200 group"
            >
              <td className="py-3 px-4 text-sm text-gray-400">{index + 1}</td>
              <td className="py-3 px-4">
                <div className="flex items-center gap-4">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-10 h-10 object-cover rounded-md"
                  />
                  <div>
                    <div className="text-sm font-medium text-white line-clamp-1">
                      {song.title}
                    </div>
                    <div className="text-xs text-gray-400 line-clamp-1">
                      {song.artist}
                    </div>
                  </div>
                </div>
              </td>
              <td className="py-3 px-4 text-sm text-gray-300">
                {song?.artistId?.username}
              </td>
              <td className="py-3 px-4 text-sm text-right text-gray-400">
                {song.duration}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
