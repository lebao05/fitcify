import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import "./ArtistCard.scss";
import PlayButton from "./PlayButton.jsx";
import { playArtistThunk } from "../../redux/slices/playerSlice.js";
import { useDispatch } from "react-redux";

const ArtistCard = ({ artist }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const handlePlay = async (e) => {
    e.stopPropagation();
    await dispatch(playArtistThunk(artist._id));
  };
  console.log(artist);
  return (
    <div
      className="artist-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="artist-image-container">
        <img
          src={artist.avatarUrl}
          alt={artist.name}
          className="artist-image"
        />
        {isHovered && (
          <div className="artist-play-button" onClick={handlePlay}>
            <PlayButton />
          </div>
        )}
      </div>

      <div className="artist-info">
        <h3 className="artist-name">{artist.username}</h3>
        <p className="type">Artist</p>
      </div>
    </div>
  );
};

export default ArtistCard;
