import React, { useState, useEffect, useRef } from "react";
import testImg from "../../assets/test.jpg";
import doremonImg from "../../assets/doremon.svg";
import ProfileHeader from "../../components/user/ProfileHeader.jsx";
import SectionHeader from "../../components/user/SectionHeader.jsx";
import ArtistCard from "../../components/user/ArtistCard.jsx";
import TrackItem from "../../components/user/TrackItem.jsx";
import PlaylistCard from "../../components/user/PlaylistCard.jsx";
import ProfileFooter from "../../components/user/ProfileFooter.jsx";
import EditProfileDialog from "../../components/user/EditProfileDialog.jsx"; // ✅ new import
import "./UserProfile.scss";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { fetchCurrentProfileById } from "../../redux/slices/userSlice.js";

const UserProfile = () => {
  const [playingArtistId, setPlayingArtistId] = useState(null);
  const [maxVisibleArtists, setMaxVisibleArtists] = useState(0);
  const [maxVisiblePlaylists, setMaxVisiblePlaylists] = useState(0);
  const [showEditModal, setShowEditModal] = useState(false);
  const artistContainerRef = useRef();
  const playlistContainerRef = useRef();
  const { id } = useParams();
  const ditpatch = useDispatch();
  const CARD_WIDTH = 180;
  const GAP = 16;
  const handleToggleEditModal = () => {
    setShowEditModal((prev) => !prev);
  };
  const myAuth = useSelector((state) => state.user.myAuth);
  const user = useSelector((state) => state.user.currentProfile);
  useEffect(() => {
    if(id)
      ditpatch(fetchCurrentProfileById(id));
  }, [id, fetchCurrentProfileById]);
  useEffect(() => {
    const calcVisible = () => {
      if (artistContainerRef.current) {
        const containerWidth = artistContainerRef.current.offsetWidth;
        const count = Math.floor((containerWidth + GAP) / (CARD_WIDTH + GAP));
        setMaxVisibleArtists(count);
      }

      if (playlistContainerRef.current) {
        const width = playlistContainerRef.current.offsetWidth;
        const count = Math.floor((width + GAP) / (CARD_WIDTH + GAP));
        setMaxVisiblePlaylists(count);
      }
    };
    calcVisible();
    window.addEventListener("resize", calcVisible);
    return () => window.removeEventListener("resize", calcVisible);
  }, []);
  const topArtists = [
    { id: 1, name: "SOOBIN", image: testImg, type: "Artist" },
    { id: 2, name: "Sơn Tùng M-TP", image: testImg, type: "Artist" },
    { id: 3, name: "AMEE", image: testImg, type: "Artist" },
    { id: 4, name: "Vũ", image: testImg, type: "Artist" },
    { id: 5, name: "HIEUTHUHAI", image: testImg, type: "Artist" },
    { id: 6, name: "JustaTee", image: testImg, type: "Artist" },
    { id: 7, name: "Da LAB", image: testImg, type: "Artist" },
    { id: 8, name: "Dương Domic", image: testImg, type: "Artist" },
  ];

  const [topTracks, setTopTracks] = useState([
    {
      id: 1,
      title: 'Hẹn Một Mai - From "4 Năm 2 Chàng 1 Tình Yêu"',
      artist: "Bùi Lan Hương",
      album: 'Hẹn Một Mai - From "4 Năm 2 Chàng 1 Tình Yêu"',
      duration: "4:19",
      image: testImg,
    },
    {
      id: 2,
      title: "Nếu Biết Đó Là Lần Cuối",
      artist: "Đức Trường, BMZ",
      album: "Nếu Biết Đó Là Lần Cuối",
      duration: "4:00",
      image: testImg,
    },
    {
      id: 3,
      title: "Pháp Màu - Đàn Ca Gỗ Original Soundtrack",
      artist: "MAYDAYs, Minh Tốc & Lam",
      album: "Pháp Màu - Đàn Ca Gỗ Original Soundtrack",
      duration: "4:26",
      image: testImg,
    },
    {
      id: 4,
      title: "Nơi Này Có Anh",
      artist: "Sơn Tùng M-TP",
      album: "mtp M-TP",
      duration: "4:20",
      image: testImg,
    },
  ]);

  const followingArtists = [
    { id: 1, name: "Chillies", image: testImg, type: "Artist" },
    {
      id: 2,
      name: "Hoàng Dũng",
      image: testImg,
      type: "Artist",
      isPlaying: true,
    },
    { id: 3, name: "Shawn Mendes", image: testImg, type: "Artist" },
    { id: 4, name: "Taylor Swift", image: testImg, type: "Artist" },
  ];

  const playlists = [
    {
      id: 1,
      name: "My Playlist #1",
      creator: "Ngọc Hiếu",
      image: testImg,
    },
  ];

  const handlePlay = (artistId) => {
    setPlayingArtistId(artistId);
  };

  const handleShowAll = (section) => {
    console.log("Show all:", section);
  };

  const handlePlayTrack = (clickedTrack) => {
    setTopTracks((prevTracks) =>
      prevTracks.map((track) => ({
        ...track,
        isPlaying: track.id === clickedTrack.id,
      }))
    );
  };
  if( user === null)
    return null
  return (
    <div className="user-profile-content pb-10 h-full w-[75%] overflow-y-auto">
      <ProfileHeader user={user} onEditClick={handleToggleEditModal} />
      {showEditModal && (
        <EditProfileDialog
          user={user}
          open={showEditModal}
          onClose={handleToggleEditModal}
          onSave={(value) => console.log("Saved name:", value)}
        />
      )}
      <div className="profile-content">
        <section className="artist-section">
          <SectionHeader
            title="Top artists this month"
            subtitle="Only visible to you"
            showAll={true}
            onShowAll={() => handleShowAll("artists")}
          />
          <div ref={artistContainerRef} className="artists-card-container">
            {topArtists.slice(0, maxVisibleArtists).map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onPlay={() => handlePlay(artist.id)}
                showPlayingIndicator={playingArtistId === artist.id}
              />
            ))}
          </div>
        </section>

        <section className="tracks-section">
          <SectionHeader
            title="Top tracks this month"
            subtitle="Only visible to you"
            showAll={true}
            onShowAll={() => handleShowAll("tracks")}
          />
          <div className="tracks-item-container">
            {topTracks.map((track, index) => (
              <TrackItem
                key={track.id}
                track={track}
                index={index}
                onPlay={handlePlayTrack}
              />
            ))}
          </div>
        </section>

        <section className="playlists-section">
          <SectionHeader title="Public Playlists" showAll={true} />
          <div ref={playlistContainerRef} className="playlists-container">
            {playlists.slice(0, maxVisiblePlaylists).map((playlist) => (
              <PlaylistCard
                key={playlist.id}
                playlist={playlist}
                onPlay={handlePlay}
                isButton="true"
              />
            ))}
          </div>
        </section>

        <section className="following-artists-section">
          <SectionHeader title="Following" showAll={true} />
          <div ref={artistContainerRef} className="following-artists-container">
            {followingArtists.slice(0, maxVisibleArtists).map((artist) => (
              <ArtistCard
                key={artist.id}
                artist={artist}
                onPlay={handlePlay}
                showPlayingIndicator={true}
              />
            ))}
          </div>
        </section>
        <ProfileFooter />
      </div>
    </div>
  );
};

export default UserProfile;
