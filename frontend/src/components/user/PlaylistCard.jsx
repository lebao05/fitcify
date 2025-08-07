// components/PlaylistCard/PlaylistCard.jsx
import React, { useState, useRef } from "react";
import { Play } from "lucide-react";
import "./PlaylistCard.scss";
import PlayButton from "./PlayButton.jsx";
import { useDispatch } from "react-redux";
import { playAPlaylist } from "../../services/musicApi.js";
import { playPlaylistThunk } from "../../redux/slices/playerSlice.js";
import { useNavigate } from "react-router-dom";

const PlaylistCard = ({ playlist, isButton }) => {
  const [isHovered, setIsHovered] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handlePlay = async (e) => {
    e.stopPropagation();
    await dispatch(playPlaylistThunk({ playlistId: playlist._id }));
  };
  return (
    <div
      className="playlist-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => navigate(`/playlist/${playlist._id}`)}
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
      </div>

      <div className="playlist-info">
        <h3 className="playlist-name">{playlist?.name}</h3>
        <p className="playlist-creator">By {playlist?.ownerId?.username}</p>
      </div>
    </div>
  );
};

export default PlaylistCard;
