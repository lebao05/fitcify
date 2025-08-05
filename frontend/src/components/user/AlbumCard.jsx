import React from "react";
import "./AlbumCard.scss";

import { useState } from "react";
import PlayButton from "./PlayButton.jsx";

const AlbumCard = ({ album, isButton }) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      className="album-card"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{ position: "relative" }}
    >
      <div className="album-image-container">
        <img src={album.imageUrl} alt={album.name} className="album-image" />
        {isButton && hovered && (
          <div className="album-action-btn">
            <PlayButton />
          </div>
        )}
      </div>
      <div className="album-info">
        <h3 className="album-name">{album.title}</h3>
        <p className="album-artist">
          Album &#8901; {album?.artistId?.username}
        </p>
      </div>
    </div>
  );
};

export default AlbumCard;
