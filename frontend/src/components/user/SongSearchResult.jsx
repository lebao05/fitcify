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

export default function SongSearchResult() {
  return (
    <table className="w-full text-left">
      <thead className="border-b border-gray-700 text-gray-400">
        <tr>
          <th className="py-2 w-12">#</th>
          <th className="py-2">Title</th>
          <th className="py-2">Album</th>
          <th className="py-2 text-right">
            <i className="fas fa-clock" />
          </th>
        </tr>
      </thead>
      <tbody>
        {songs.map((song, index) => (
          <tr
            key={song.id}
            className="hover:bg-gray-800 cursor-pointer transition-colors duration-200"
          >
            <td className="py-2">{index + 1}</td>
            <td className="flex items-center gap-3 py-2">
              <img
                src={song.img}
                alt={song.title}
                className="w-10 h-10 rounded"
              />
              <div>
                <div className="font-semibold">{song.title}</div>
                <div className="text-sm text-gray-400">{song.artist}</div>
              </div>
            </td>
            <td className="py-2">{song.album}</td>
            <td className="py-2 text-right">{song.duration}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
