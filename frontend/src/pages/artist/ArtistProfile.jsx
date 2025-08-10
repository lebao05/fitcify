import React, { useState, useEffect } from "react";
import testImg from "../../assets/test.jpg";
import edImg from "../../assets/edsheeran.jpg";
import PlayButton from "../../components/user/PlayButton";
import TrackItem from "../../components/user/TrackItem";
import SectionHeader from "../../components/user/SectionHeader";
import PlaylistCard from "../../components/user/PlaylistCard";
import AlbumCard from "../../components/user/AlbumCard";
import ArtistHorizontalDots from "../../components/artist/ArtistHorizontalDots";
import "./ArtistProfile.scss";
import { useParams } from "react-router-dom";
import { getArtistProfile } from "../../services/artistApi";
import { useDispatch, useSelector } from "react-redux";
import { playArtistThunk } from "../../redux/slices/playerSlice";
import {
  followArtistThunk,
  unfollowArtistThunk,
  clearToast,
} from "../../redux/slices/myCollectionSlice";
import NotFound from "../NotFound";
const discographyTabs = [
  { label: "Albums", value: "album" },
  { label: "Playlist", value: "playlist" },
];
const ArtistProfile = () => {
  const dispatch = useDispatch();
  const { artistId } = useParams();
  const [activeTab, setActiveTab] = useState("album");
  const [artistData, setArtistData] = useState(null);
  useEffect(() => {
    const fetchArtistProfile = async () => {
      try {
        const result = await getArtistProfile(artistId);
        setArtistData(result.Data); // Make sure this matches your API response
      } catch (error) {}
    };
    fetchArtistProfile();
  }, [artistId]);
  const followees = useSelector((s) => s.myCollection.followees);
  const toast = useSelector((s) => s.myCollection.toast);

  const isFollowing =
    Array.isArray(followees) &&
    followees.some((a) => (a?._id || a?.id || a?.userId?._id) === artistId);

  const onToggleFollow = async (e) => {
    if (isFollowing) {
      await dispatch(unfollowArtistThunk(artistId));
    } else {
      const artistInfo = {
        _id: artistData.profile.userId._id,
        username: artistData.profile.userId.username,
        avatarUrl: artistData.profile.userId.avatarUrl,
      };
      await dispatch(followArtistThunk({ artistId, artistInfo }));
    }
    setTimeout(() => dispatch(clearToast()), 2000);
  };

  if (!artistData) {
    return null;
  }
  const playArtist = async () => {
    await dispatch(playArtistThunk(artistId));
  };

  const { profile, albums, playlists, songs } = artistData;
  return (
    <div>
      <div className="artist-profile-header">
        <img
          className="artist-profile-header__bg"
          src={profile.userId.avatarUrl}
          alt="Artist background"
        />
        <div className="artist-profile-header__content">
          <div className="artist-profile-header__verified">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="12" fill="#1ED760" />
              <path
                d="M7 13l3 3 7-7"
                stroke="#fff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Verified Artist
          </div>
          <div className="artist-profile-header__name">
            {profile.userId.username}
          </div>
          <div className="artist-profile-header__stats">
            {profile.totalPlays} monthly listeners
          </div>
        </div>
      </div>
      <div className="artist-profile-actions">
        <PlayButton onClick={playArtist} />
        <button
          className={`follow-button${isFollowing ? " is-following" : ""}`}
          onClick={onToggleFollow}
        >
          {isFollowing ? "Following" : "Follow"}
        </button>
      </div>
      {toast && <div className="center-toast">{toast.message}</div>}

      <div className="artist-profile-popular">
        <SectionHeader title="Popular songs" />
        <div>
          {songs
            .slice(0, 10)
            .sort((a, b) => b.playCount - a.playCount)
            .map((track, idx) => (
              <TrackItem key={track._id || idx} track={track} index={idx} />
            ))}
        </div>
      </div>

      <div className="artist-profile-discography">
        <SectionHeader title="Discography" />
        <div className="artist-profile-discography__tabs">
          {discographyTabs.map((tab) => (
            <button
              key={tab.value}
              className={`artist-profile-discography__tab${
                activeTab === tab.value
                  ? " artist-profile-discography__tab--active"
                  : ""
              }`}
              onClick={() => setActiveTab(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="artist-profile-discography__grid">
          {activeTab === "album" &&
            albums.map((item) => <AlbumCard key={item.name} album={item} />)}
          {activeTab === "playlist" &&
            playlists.map((item) => (
              <PlaylistCard key={item.name} playlist={item} />
            ))}
        </div>
      </div>
      <div className="artist-profile-about">
        <SectionHeader title="About" />
        <div className="artist-profile-about__card">
          <img
            className="artist-profile-about__img"
            src={profile.userId.avatarUrl}
            alt="About artist"
          />
          <div className="artist-profile-about__info">
            <div className="artist-profile-about__listeners">
              <b>{profile.totalPlays} monthly listeners</b>
            </div>
            <div className="artist-profile-about__desc">{profile.bio}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;
