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
import {
  fetchTopArtistsThisMonth,
  fetchTopSongsThisMonth,
} from "../../redux/slices/myCollectionSlice.js";
import { getFollowedArtists } from "../../services/userApi.js";

const UserProfile = () => {
  const [isYou, setIsYou] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const { id } = useParams();
  const [playlists, setPlaylists] = useState(null);
  const [followingArtists, setFollowingArtists] = useState(null);
  const dispatch = useDispatch();
  const myAuth = useSelector((state) => state.user.myAuth);
  const user = useSelector((state) => state.user.currentProfile);
  const topSongs = useSelector((state) => state.myCollection.topSongsMonth);
  const topArtists = useSelector((state) => state.myCollection.topArtistsMonth);
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
  const fetchTopContent = async () => {
    try {
      await Promise.all([
        dispatch(fetchTopSongsThisMonth({ limit: 5 })).unwrap(),
        dispatch(fetchTopArtistsThisMonth({ limit: 5 })).unwrap(),
      ]);
    } catch (err) {
      console.error("Failed to fetch top content:", err);
    }
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
      setIsYou(myAuth._id === user._id);
    }
  }, [user]);
  useEffect(() => {
    if (myAuth) fetchTopContent();
  }, [myAuth]);
  const handleToggleEditModal = () => {
    if (myAuth._id === id) setShowEditModal((prev) => !prev);
  };
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
        {isYou && (
          <>
            {" "}
            <section className="artist-section">
              <SectionHeader
                title="Top artists this month"
                subtitle="Only visible to you"
                showAll={false}
              />
              <div className="artists-card-container">
                {topArtists.slice(0, 10).map((artist, index) => (
                  <ArtistCard key={index} artist={artist} />
                ))}
              </div>
            </section>
            <section className="tracks-section">
              <SectionHeader
                title="Top tracks this month"
                subtitle="Only visible to you"
                showAll={false}
              />
              <div className="tracks-item-container">
                {topSongs.map((track, index) => (
                  <TrackItem key={index} track={track} index={index} />
                ))}
              </div>
            </section>
          </>
        )}
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
                .map((artist, index) => (
                  <ArtistCard key={index} artist={artist} />
                ))}
          </div>
        </section>
        <ProfileFooter />
      </div>
    </div>
  );
};

export default UserProfile;
