import React, { useState, useEffect } from "react";
import axios from "axios";
import PlayButton from "../../components/user/PlayButton";
import TrackItem from "../../components/user/TrackItem";
import SectionHeader from "../../components/user/SectionHeader";
import AlbumCard from "../../components/user/AlbumCard";
import ArtistHorizontalDots from "../../components/artist/ArtistHorizontalDots";
import ProfileHeader from "../../components/user/ProfileHeader";

const ArtistProfile = ({ isOwner }) => {
  const [artistData, setArtistData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showAllSongs, setShowAllSongs] = useState(false);

  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/artist/profile", {
          withCredentials: true
        });
        
        if (response.data.Error === 0) {
          setArtistData(response.data.Data);
        } else {
          setError(response.data.Message);
        }
      } catch (err) {
        setError("Failed to fetch artist profile");
        console.error("Error fetching artist profile:", err);
        
        if (err.response) {
          if (err.response.status === 401) {
            setError("Unauthorized - Please login");
          } else if (err.response.status === 403) {
            setError("Forbidden - You don't have permission");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchArtistProfile();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!artistData) {
    return (
      <div className="flex items-center justify-center h-screen">
        No artist data found
      </div>
    );
  }

  const allSongs = artistData.songs.map((song) => ({
    _id: song._id,
    title: song.title,
    artist: artistData.userId.username || artistData.userId.email.split('@')[0],
    // album: artistData.albums.find(album => album.songs.includes(song._id))?.title || "Single",
    image: artistData.userId.avatarUrl || "", // Use artist avatar as fallback
    duration: `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`,
    isPlaying: false,
    plays: "0",
    audioUrl: song.audioUrl,
  }));

  const getAlbumSongs = (albumId) => {
    const album = artistData.albums.find(a => a._id === albumId);
    if (!album) return [];
    
    return artistData.songs
      .filter(song => album.songs.includes(song._id))
      .map(song => ({
        ...song,
        duration: `${Math.floor(song.duration / 60)}:${(song.duration % 60).toString().padStart(2, '0')}`,
        image: artistData.userId.avatarUrl || ""
      }));
  };

  const userData = {
    username: artistData.userId.username || artistData.userId.email.split('@')[0],
    avatarUrl: artistData.userId.avatarUrl || "",
    publicAlbums: artistData.albums?.length || 0,
    following: 0,
    totalPlays: artistData.totalPlays || 0
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen pb-20">
      <ProfileHeader 
        user={userData} 
        isArtist={true}
        onEditClick={() => isOwner && console.log("Edit profile clicked")}
      />

      {/* Artist Header */}
      {/* <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900 z-10"></div>
        <div 
          className="relative z-0 h-64 bg-gray-800"
          style={{
            backgroundImage: userData.avatarUrl ? `url(${userData.avatarUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
        ></div>
        <div className="relative z-20 px-6 -mt-20">
          <div className="flex flex-col space-y-2">
            {artistData.isVerified && (
              <div className="flex items-center space-x-1 text-sm text-green-400">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="12" fill="#1ED760" />
                  <path
                    d="M7 13l3 3 7-7"
                    stroke="#fff"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <span>Verified Artist</span>
              </div>
            )}
            <h1 className="text-5xl font-bold">{userData.username}</h1>
            <p className="text-gray-400">{artistData.totalPlays} total plays</p>
          </div>
        </div>
      </div> */}

      {/* Actions */}
      <div className="px-6 mt-6 flex items-center space-x-4">
        {isOwner ? (
          <ArtistHorizontalDots artist={artistData} />
        ) : (
          <>
            <PlayButton onClick={() => {}} />
            <button className="px-6 py-2 bg-transparent border border-gray-400 rounded-full text-white hover:bg-gray-800 transition">
              Follow
            </button>
          </>
        )}
      </div>

      <div className="px-6 mt-10">
        <SectionHeader title="All Songs" />
        <div className="mt-4 space-y-2">
          {(showAllSongs ? allSongs : allSongs.slice(0, 5)).map((song, idx) => (
            <TrackItem key={song._id} track={song} index={idx} />
          ))}
        </div>
        {allSongs.length > 5 && (
          <button 
            onClick={() => setShowAllSongs(!showAllSongs)}
            className="mt-4 text-gray-400 hover:text-white text-sm"
          >
            {showAllSongs ? 'Show Less' : 'Show More...'}
          </button>
        )}
      </div>

      <div className="px-6 mt-10">
        <SectionHeader title="Albums" />
        <div className="mt-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {artistData.albums.map((album) => (
            <div 
              key={album._id} 
              className="cursor-pointer"
              onClick={() => setSelectedAlbum(selectedAlbum?._id === album._id ? null : album)}
            >
              <AlbumCard
                album={{
                  name: album.title,
                  artist: userData.username,
                  imageUrl: album.imageUrl ||artistData.userId.avatarUrl, 
                  year: new Date().getFullYear(),
                  type: "Album",
                  songsCount: album.songs.length
                }}
              />
            </div>
          ))}
        </div>
      </div>

      {selectedAlbum && (
        <div className="px-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">{selectedAlbum.title}</h2>
            <button 
              onClick={() => setSelectedAlbum(null)}
              className="text-gray-400 hover:text-white"
            >
              ✕
            </button>
          </div>
          <div className="space-y-2">
            {getAlbumSongs(selectedAlbum._id).map((song, index) => (
              <TrackItem 
                key={song._id} 
                track={{
                  ...song,
                  artist: userData.username,
                  album: selectedAlbum.title
                }} 
                index={index} 
              />
            ))}
          </div>
        </div>
      )}

      {/* About Section */}
{(artistData.bio || artistData.socialLinks) && (
  <div className="px-6 mt-12">
    <SectionHeader title="About" />

    <div className="mt-6 relative bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-6 shadow-lg border border-gray-700 space-y-6">
      
      {/* Total Plays */}
      {artistData.totalPlays !== undefined && (
        <div className="flex items-center space-x-3">
          <div className="bg-green-600/10 text-green-400 p-2 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-2v13" />
            </svg>
          </div>
          <p className="text-lg font-semibold text-white">
            {artistData.totalPlays.toLocaleString()} total plays
          </p>
        </div>
      )}

      {/* Bio */}
      {artistData.bio && (
        <p className="text-gray-300 leading-relaxed whitespace-pre-line">
          {artistData.bio}
        </p>
      )}

      {/* Social Links */}
      {artistData.socialLinks && (
        <div className="flex flex-wrap gap-4 mt-2">
          {artistData.socialLinks.spotify && (
            <a
              href={artistData.socialLinks.spotify}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-green-400 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 168 168"><path d="M84 0a84 84 0 100 168 84 84 0 000-168zm38.5 120.2a5.25 5.25 0 01-7.2 1.8c-19.7-12-44.5-14.7-73.8-8.1a5.26 5.26 0 11-2.4-10.3c32.6-7.7 60.1-4.5 82.2 9.6a5.26 5.26 0 011.8 7zm10.8-20.8a6.6 6.6 0 01-9.1 2.3c-22.5-13.7-56.8-17.7-83.4-9.7a6.6 6.6 0 11-3.8-12.7c31-9.3 69-4.8 95.8 11.1a6.6 6.6 0 012.3 9zM127 76a7.9 7.9 0 01-10.8 2.8c-25.8-15.8-69.6-17.3-94.5-9.5a7.9 7.9 0 01-4.8-15.2c29.6-9.3 78.3-7.6 108.2 11.3A7.9 7.9 0 01127 76z"/></svg>
              <span>Spotify</span>
            </a>
          )}
          {artistData.socialLinks.instagram && (
            <a
              href={artistData.socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-pink-400 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.9.3 2.4.6.6.3 1 .8 1.4 1.4.3.5.5 1.2.6 2.4.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.3 1.9-.6 2.4-.3.6-.8 1-1.4 1.4-.5.3-1.2.5-2.4.6-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.9-.3-2.4-.6-.6-.3-1-.8-1.4-1.4-.3-.5-.5-1.2-.6-2.4C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.3-1.9.6-2.4.3-.6.8-1 1.4-1.4.5-.3 1.2-.5 2.4-.6C8.4 2.2 8.8 2.2 12 2.2zm0 1.8c-3.1 0-3.5 0-4.7.1-1 .1-1.6.2-2 .4-.5.2-.8.4-1.1.8-.3.3-.5.7-.6 1.1-.2.4-.3 1-.4 2-.1 1.2-.1 1.6-.1 4.7s0 3.5.1 4.7c.1 1 .2 1.6.4 2 .2.5.4.8.8 1.1.3.3.7.5 1.1.6.4.2 1 .3 2 .4 1.2.1 1.6.1 4.7.1s3.5 0 4.7-.1c1-.1 1.6-.2 2-.4.5-.2.8-.4 1.1-.8.3-.3.5-.7.6-1.1.2-.4.3-1 .4-2 .1-1.2.1-1.6.1-4.7s0-3.5-.1-4.7c-.1-1-.2-1.6-.4-2-.2-.5-.4-.8-.8-1.1-.3-.3-.7-.5-1.1-.6-.4-.2-1-.3-2-.4-1.2-.1-1.6-.1-4.7-.1zM12 5.8a6.2 6.2 0 110 12.4 6.2 6.2 0 010-12.4zm0 1.8a4.4 4.4 0 100 8.8 4.4 4.4 0 000-8.8zm5.5-1.3a1.4 1.4 0 110 2.8 1.4 1.4 0 010-2.8z"/>
              </svg>
              <span>Instagram</span>
            </a>
          )}
          {artistData.socialLinks.twitter && (
            <a
              href={artistData.socialLinks.twitter}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-blue-400 transition"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M23 3a10.9 10.9 0 01-3.14 1.53A4.48 4.48 0 0022.4.36a9.2 9.2 0 01-2.88 1.1A4.52 4.52 0 0016.2 0c-2.63 0-4.77 2.13-4.77 4.77 0 .37.04.73.12 1.07-3.96-.2-7.46-2.1-9.8-5A4.78 4.78 0 001.4 3.64c0 1.65.84 3.1 2.1 3.95a4.5 4.5 0 01-2.17-.6v.06c0 2.3 1.64 4.2 3.81 4.63a4.53 4.53 0 01-2.15.08 4.76 4.76 0 004.44 3.3A9.05 9.05 0 010 19.54a12.78 12.78 0 006.92 2.03c8.3 0 12.84-6.88 12.84-12.84l-.01-.59A9.1 9.1 0 0023 3z" />
              </svg>
              <span>Twitter</span>
            </a>
          )}
          {artistData.socialLinks.website && (
            <a
              href={artistData.socialLinks.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-2 text-gray-300 hover:text-white transition"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
              </svg>
              <span>Website</span>
            </a>
          )}
        </div>
      )}
    </div>
  </div>
)}

    </div>
  );
};

export default ArtistProfile;