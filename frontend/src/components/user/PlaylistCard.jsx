// components/PlaylistCard/PlaylistCard.jsx
import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import "./PlaylistCard.scss";
import PlayButton from "./PlayButton.jsx";

const PlaylistCard = ({ playlist, isButton }) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.play();
    }
  };

  return (
    <div
      className="playlist-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="playlist-image-container">
        <img
          src={playlist.imageUrl}
          alt={playlist.name}
          className="playlist-image"
        />
        {isButton && isHovered && (
          <div className="playlist-play-button" onClick={handlePlay}>
            <PlayButton />
          </div>
        )}
        {playlist.audio && <audio ref={audioRef} src={playlist?.audio} />}
      </div>

      <div className="playlist-info">
        <h3 className="playlist-name">{playlist?.name}</h3>
        <p className="playlist-creator">
          Playlist &#8901; {playlist?.ownerId?.username}
        </p>
      </div>
    </div>
  );
};

export default PlaylistCard;
