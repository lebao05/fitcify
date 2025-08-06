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
import { getPlaylistsByUserId } from "../../services/playlistApi.js";
import { getFollowedArtists } from "../../services/userApi.js";

const UserProfile = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const { id } = useParams();
  const [playlists, setPlaylists] = useState(null);
  const [followingArtists, setFollowingArtists] = useState(null);
  const dispatch = useDispatch();
  const myAuth = useSelector((state) => state.user.myAuth);
  const user = useSelector((state) => state.user.currentProfile);
  const fetchPlaylists = async (userId) => {
    const res = await getPlaylistsByUserId(userId);
    setPlaylists(res.Data);
    return res;
  };
  const fetchFollowedArtists = async () => {
    const res = await getFollowedArtists();
    setFollowingArtists(res.Data);
    return res;
  };
  useEffect(() => {
    if (id) dispatch(fetchCurrentProfileById(id));
    if (user?._id) {
      fetchPlaylists(user._id);
    }
  }, [id, fetchCurrentProfileById]);
  useEffect(() => {
    if (user?._id) {
      fetchPlaylists(user._id);
      fetchFollowedArtists();
    }
  }, [user]);
  const handleToggleEditModal = () => {
    if (myAuth._id === id) setShowEditModal((prev) => !prev);
  };
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

  if (user === null) return null;
  return (
    <div className="user-profile-content pb-10 h-full w-[80%] overflow-y-auto">
      {" "}
      <ProfileHeader user={user} onEditClick={handleToggleEditModal} />
      {showEditModal && (
        <EditProfileDialog
          user={user}
          open={showEditModal}
          onClose={handleToggleEditModal}
        />
      )}
      <div className="profile-content">
        <section className="artist-section">
          <SectionHeader
            title="Top artists this month"
            subtitle="Only visible to you"
            showAll={true}
          />
          <div className="artists-card-container">
            {topArtists.slice(0, 5).map((artist) => (
              <ArtistCard key={artist.id} artist={artist} />
            ))}
          </div>
        </section>

        <section className="tracks-section">
          <SectionHeader
            title="Top tracks this month"
            subtitle="Only visible to you"
            showAll={true}
          />
          <div className="tracks-item-container">
            {topTracks.map((track, index) => (
              <TrackItem key={track.id} track={track} index={index} />
            ))}
          </div>
        </section>

        <section className="playlists-section">
          <SectionHeader title="Public Playlists" showAll={true} />
          <div className="playlists-container">
            {playlists?.map((playlist) => (
              <PlaylistCard
                key={playlist._id}
                playlist={playlist}
                isButton="true"
              />
            ))}
          </div>
        </section>

        <section className="following-artists-section">
          <SectionHeader title="Following" showAll={true} />
          <div className="following-artists-container">
            {followingArtists &&
              followingArtists
                .slice(0, 5)
                .map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
          </div>
        </section>
        <ProfileFooter />
      </div>
    </div>
  );
};

export default UserProfile;
