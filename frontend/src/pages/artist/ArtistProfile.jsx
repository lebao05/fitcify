import React, { useState, useEffect } from "react";
import testImg from '../../assets/test.jpg';
import edImg from '../../assets/edsheeran.jpg';
import PlayButton from "../../components/user/PlayButton";
import TrackItem from "../../components/user/TrackItem";
import SectionHeader from "../../components/user/SectionHeader";
import PlaylistCard from "../../components/user/PlaylistCard";
import AlbumCard from "../../components/user/AlbumCard";
import ArtistHorizontalDots from "../../components/artist/ArtistHorizontalDots";
import "./ArtistProfile.scss";

const popularTracks = [
  {
    title: "Azizam",
    artist: "Ed Sheeran",
    album: "Azizam (Single)",
    image: "/azizam.jpg",
    duration: "2:42",
    isPlaying: false,
    plays: "171,807,362",
  },
  {
    title: "Sapphire",
    artist: "Ed Sheeran",
    album: "Sapphire (Single)",
    image: "/sapphire.jpg",
    duration: "2:59",
    isPlaying: false,
    plays: "71,448,539",
  },
  {
    title: "Shape of You",
    artist: "Ed Sheeran",
    album: "Divide",
    image: "/shapeofyou.jpg",
    duration: "3:53",
    isPlaying: false,
    plays: "4,438,012,019",
  },
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    album: "Divide",
    image: "/perfect.jpg",
    duration: "4:23",
    isPlaying: false,
    plays: "3,507,933,266",
  },
  {
    title: "Photograph",
    artist: "Ed Sheeran",
    album: "Multiply",
    image: "/photograph.jpg",
    duration: "4:18",
    isPlaying: false,
    plays: "2,999,986,592",
  },
];

const albums = [
  {
    name: "= (Deluxe)",
    artist: "Ed Sheeran",
    image: testImg,
    year: 2017,
    type: "Album",
  },
  {
    name: "=",
    artist: "Ed Sheeran",
    image: testImg,
    year: 2021,
    type: "Album",
  },
  {
    name: "x (Deluxe Edition)",
    artist: "Ed Sheeran",
    image: testImg,
    year: 2014,
    type: "Album",
  },
  // Add singles/EPs for demo
  {
    name: "Azizam",
    artist: "Ed Sheeran",
    image: "/azizam.jpg",
    year: 2025,
    type: "Single",
  },
  {
    name: "Sapphire",
    artist: "Ed Sheeran",
    image: "/sapphire.jpg",
    year: 2025,
    type: "Single",
  },
];

const playlists = [
  {
    name: "Drive (From F1® The Movie)",
    creator: "Ed Sheeran",
    image: testImg,
  },
  {
    name: "Azizam",
    creator: "Ed Sheeran",
    image: testImg,
  },
  {
    name: "Sapphire",
    creator: "Ed Sheeran",
    image: testImg,
  },
];


const discographyTabs = [
  { label: "Popular releases", value: "popular" },
  { label: "Albums", value: "album" },
];
const ArtistProfile = ({ artist, isOwner }) => {
  const [activeTab, setActiveTab] = useState("popular");
  const fetchArtistProfile = async()=

  return (
    <div>
      <div className="artist-profile-header">
        <img
          className="artist-profile-header__bg"
          src= {edImg}
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
          <div className="artist-profile-header__name">Ed Sheeran</div>
          <div className="artist-profile-header__stats">
            98,762,221 monthly listeners
          </div>
        </div>
      </div>
      <div className="artist-profile-actions">
        {isOwner ? (
          <ArtistHorizontalDots artist={artist}/>
        ) : (
          <>
            <PlayButton onClick={() => {}} />
            <button className="follow-button" onClick={() => {}}>
              Follow
            </button>
          </>
        )}
      </div>
      <div className="artist-profile-popular">
        <SectionHeader title="Popular" />
        <div>
          {popularTracks.map((track, idx) => (
            <TrackItem key={track.title} track={track} index={idx} />
          ))}
        </div>
      </div>
      <div className="artist-profile-discography">
        <SectionHeader title="Discography" showAll />
        <div className="artist-profile-discography__tabs">
          {discographyTabs.map((tab) => (
            <button
              key={tab.value}
              className={`artist-profile-discography__tab${activeTab === tab.value ? " artist-profile-discography__tab--active" : ""}`}
              onClick={() => setActiveTab(tab.value)}
              type="button"
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div className="artist-profile-discography__grid">
          {activeTab === "popular" && [
            ...playlists.map((p) => ({ ...p, isPlaylist: true })),
            ...albums.map((a) => ({ ...a, isPlaylist: false })),
          ].map((item) =>
            item.isPlaylist ? (
              <PlaylistCard key={item.name} playlist={item} />
            ) : (
              <AlbumCard key={item.name} album={item} />
            )
          )}
          {activeTab === "album" && albums
            .filter((a) => a.type === "Album")
            .map((item) => (
              <AlbumCard key={item.name} album={item} />
            ))}
          {activeTab === "single" && albums
            .filter((a) => a.type === "Single")
            .map((item) => (
              <AlbumCard key={item.name} album={item} />
            ))}
        </div>
      </div>

      {/* About Section */}
      <div className="artist-profile-about">
        <SectionHeader title="About" />
        <div className="artist-profile-about__card">
          <img
            className="artist-profile-about__img"
            src={edImg}
            alt="About artist"
          />
          <div className="artist-profile-about__badge">
            <span className="artist-profile-about__badge-rank">#4</span>
            <span className="artist-profile-about__badge-label">in the world</span>
          </div>
          <div className="artist-profile-about__info">
            <div className="artist-profile-about__listeners">
              <b>98,762,221 monthly listeners</b>
            </div>
            <div className="artist-profile-about__desc">
              Idiosyncratic pop singer Ed Sheeran borrows from any style that crosses his path, molding genres to fit a musical character all his own that's charming, personable, and popular on a global scale. Elements of folk, hip-hop, pop, dance, soul, and rock shape his music.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ArtistProfile;