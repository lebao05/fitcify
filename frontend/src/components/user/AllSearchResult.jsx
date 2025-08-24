import React from "react";
import { Play } from "lucide-react"; // Spotify-style play icon
import unknown from "../../assets/unknown.jpg";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  playAlbumThunk,
  playArtistThunk,
  playPlaylistThunk,
  playSongThunk,
} from "../../redux/slices/playerSlice";

const PlayButton = () => (
  <button className="bg-green-500 cursor-pointer hover:scale-105 transition rounded-full p-2">
    <Play size={16} fill="black" className="text-black" />
  </button>
);

export default function GeneralSearchResult({ searchResult }) {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const playArtist = async (id) => {
    await dispatch(playArtistThunk(id));
  };
  const playPlaylist = async (id) => {
    await dispatch(playPlaylistThunk({ playlistId: id }));
  };
  const playAlbum = async (id) => {
    await dispatch(playAlbumThunk({ albumId: id }));
  };
  const playSong = async (id) => {
    await dispatch(playSongThunk(id));
  };

  return (
    <div className="space-y-12 text-white">
      {/* Songs */}
      <div className="flex flex-col md:flex-row gap-8 items-stretch">
        <div className="w-[70%]">
          <h2 className="text-xl font-bold">Songs</h2>
          <div className="space-y-2">
            {searchResult?.songs.slice(0, 5).map((song) => (
              <div
                key={song._id}
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/song/${song._id}`);
                }}
                className="flex items-center justify-between hover:bg-[#282828] p-3 rounded group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={song.imageUrl}
                    alt={song.title}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium">{song.title}</div>
                    <div className="text-gray-400 text-sm">
                      {song.artistId.username}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-sm text-gray-400">{song.duration}</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      playSong(song._id);
                    }}
                    className="opacity-0 group-hover:opacity-100 transition"
                  >
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
        <h2 className="text-xl font-bold mb-4">Albums</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6 gap-4">
          {searchResult?.albums?.map((album) => (
            <div
              key={album._id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/album/${album._id}`);
              }}
              className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] relative group cursor-pointer"
            >
              <img
                src={album.imageUrl}
                alt={album.title}
                className="w-full aspect-square object-cover rounded mb-3"
              />
              <div className="font-semibold">{album.title}</div>
              <div className="text-sm text-gray-400">
                {album.artistId.username}
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  playAlbum(album._id);
                }}
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition"
              >
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
          {searchResult?.playlists.map((playlist) => (
            <div
              key={playlist._id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/playlist/${playlist._id}`);
              }}
              className="bg-[#181818] p-3 rounded-lg hover:bg-[#282828] relative group"
            >
              <img
                src={playlist.imageUrl}
                alt={playlist.name}
                className="w-full aspect-square object-cover rounded mb-3"
              />
              <div className="font-semibold">{playlist.name}</div>
              <div className="text-sm text-gray-400">
                {playlist.ownerId.username}
              </div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  playPlaylist(playlist._id);
                }}
                className="absolute cursor-pointer bottom-4 right-4 opacity-0 group-hover:opacity-100 transition"
              >
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
          {searchResult?.artists.map((artist) => (
            <div
              key={artist._id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/artist/${artist._id}`);
              }}
              className="text-center relative group hover:bg-[#282828] p-4 rounded-lg cursor-pointer"
            >
              <img
                src={artist.avatarUrl || unknown}
                alt={artist.name}
                className="w-full aspect-square object-cover rounded-full mb-3"
              />
              <div className="font-semibold">{artist.username}</div>
              <div className="text-xs text-gray-400">Artist</div>
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  playArtist(artist._id);
                }}
                className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition"
              >
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
          {searchResult?.users.map((profile) => (
            <div
              key={profile._id}
              onClick={(e) => {
                e.stopPropagation();
                navigate(`/profile/${profile._id}`);
              }}
              className="text-center relative group hover:bg-[#282828] p-4 rounded-lg cursor-pointer"
            >
              <img
                src={profile.avatarUrl || unknown}
                alt={profile.username}
                className="w-20 h-20 rounded-full mx-auto mb-2 object-cover"
              />
              <div className="font-semibold">{profile.username}</div>
              <div className="text-xs text-gray-400">Profile</div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
