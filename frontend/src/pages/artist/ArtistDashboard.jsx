import axios from "axios";
import { useEffect, useState } from "react";
import "./ArtistDashboard.scss";

const ArtistDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [userInfo, setUserInfo] = useState(null);
  const [songInfo, setSongInfo] = useState([]);
  const [albumInfo, setAlbumInfo] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [artistRes, userRes, songRes, albumRes] = await Promise.all([
          axios.get("http://localhost:5000/api/artist/profile", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/user/me", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/artist/songs", {
            withCredentials: true,
          }),
          axios.get("http://localhost:5000/api/artist/albums/me", {
            withCredentials : true,
          })
        ]);
        setProfile(artistRes.data.Data);
        setUserInfo(userRes.data.Data);
        setSongInfo(songRes.data.Data);
        setAlbumInfo(albumRes.data.Data);
      } catch (error) {
        console.error(
          "Error fetching artist dashboard data:",
          error.response?.data || error.message
        );
      }
    };

    fetchData();
  }, []);

  const totalLikes = songInfo.reduce((acc, song) => acc + (song.likes?.length || 0), 0);
  const totalSeconds = songInfo.reduce((acc, song) => acc + (song.duration || 0), 0);
  const totalMinutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;
  const totalPlayCount = songInfo.reduce((acc, song) => acc + (song.playCount || 0), 0);


  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">🎧 Artist Dashboard</h1>

      {profile && userInfo ? (
        <>
          <div className="profile-info">
            <div className="avatar-box">
              {userInfo.avatarUrl && (
                <img
                  src={userInfo.avatarUrl}
                  alt="Avatar"
                  className="avatar"
                />
              )}
            </div>
            <div className="text-info">
              <p><strong>Tên:</strong> {userInfo.username}</p>
              <p><strong>Email:</strong> {profile.userId?.email}</p>
              <p><strong>Tổng lượt phát: </strong> {totalPlayCount}</p>
              <p><strong>Tổng lượt thích:</strong> {totalLikes}</p>
              <p><strong>Tổng thời lượng:</strong> {totalMinutes} phút {remainingSeconds} giây </p>
              <p><strong>Tổng số bài hát:</strong> {songInfo.length}</p>
            </div>
          </div>

          <h2 className="song-list-title">📃 Danh sách bài hát</h2>
          <div className="song-list-scroll">
            <ul className="song-list">
              {songInfo.map((song) => {
                const mins = Math.floor(song.duration / 60);
                const secs = song.duration % 60;
                return (
                  <li key={song._id} className="song-item">
                    <strong>{song.title}</strong>
                    <p>⏱️ Duration: {mins} phút {secs} giây</p>
                    <p>❤️ Lượt thích: {song.likes.length}</p>
                    <p>▶️ Lượt phát: {song.playCount}</p>
                  </li>
                );
              })}
            </ul>
          </div>
              <div className="top-songs-section">
  <h2 className="top-songs-title">🔥 Top 5 Bài Hát Nổi Bật</h2>
  <div className="top-songs-lists">
    <div className="top-list">
      <h3>🎧 Nhiều lượt phát</h3>
      <ol>
        {songInfo
          .sort((a, b) => b.playCount - a.playCount)
          .slice(0, 5)
          .map((song) => (
            <li key={song._id}>
              <strong>{song.title}</strong> – {song.playCount} lượt
            </li>
          ))}
      </ol>
    </div>
    <div className="top-list">
      <h3>❤️ Nhiều lượt thích</h3>
      <ol>
        {songInfo
          .sort((a, b) => b.likes.length - a.likes.length)
          .slice(0, 5)
          .map((song) => (
            <li key={song._id}>
              <strong>{song.title}</strong> – {song.likes.length} lượt
            </li>
          ))}
      </ol>
    </div>
  </div>
</div>

          <h2 className="album-section-title">💿 Danh sách Album</h2>
        <div className="album-list">
          {albumInfo.map((album) => {
            // Lọc bài hát trong album này
            const albumSongs = songInfo.filter((song) => album.songs.includes(song._id));
            const albumPlayCount = albumSongs.reduce((acc, s) => acc + (s.playCount || 0), 0);
            const albumLikes = albumSongs.reduce((acc, s) => acc + (s.likes?.length || 0), 0);

            return (
              <div key={album._id} className="album-card">
                <img src={album.imageUrl} alt={album.title} className="album-cover" />
                <div className="album-info">
                  <h3>{album.title}</h3>
                  <p>🎵 Số bài hát: {albumSongs.length}</p>
                  <p>❤️ Tổng lượt thích: {albumLikes}</p>
                  <p>▶️ Tổng lượt phát: {albumPlayCount}</p>
                  <ul>
                    {albumSongs.map((song) => (
                      <li key={song._id}>🎶 {song.title}</li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default ArtistDashboard;
