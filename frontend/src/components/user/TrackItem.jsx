// components/TrackItem/TrackItem.jsx

import React, { useState } from 'react';
import { Play, Heart } from 'lucide-react';
import './TrackItem.scss';


const TrackItem = ({ track, index, onPlay, onMore, onLike, showLikeButton = true }) => {
  const [hovered, setHovered] = useState(false);
  const [liked, setLiked] = useState(track.liked || false);

  const handleLike = (e) => {
    e.stopPropagation();
    setLiked(!liked);
    if (onLike) onLike(track);
  };

  const handlePlaying = () => {
    if (onPlay) onPlay(track);
  };

  return (
    <div
      className={`track-item${showLikeButton ? '' : ' no-like-btn'}${track.isPlaying ? ' playing' : ''}${hovered ? ' hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlaying}
    >
      <div className="track-number">
        {track.isPlaying || hovered
          ? <Play size={16} fill={track.isPlaying ? '#1db954' : 'currentColor'} color={track.isPlaying ? '#1db954' : undefined} />
          : index + 1}
      </div>
      <div className="track-info">
        <img src={track.image} alt={track.title} className="track-image" />
        <div className="track-title">
          <div className="track-name" style={track.isPlaying ? { color: '#1db954' } : {}}> {track.title} </div>
          <div className="track-artist" style={track.isPlaying ? { color: '#1db954' } : {}}> {track.artist} </div>
        </div>
        <div className="track-album" style={track.isPlaying ? { color: '#1db954' } : {}}>
          {track.album}
        </div>
        {/* Like button appears on hover, between album and duration */}
        {showLikeButton && (
          <div className="track-like-btn-cell">
            <button
              className={`like-btn${liked ? ' liked' : ''}`}
              onClick={handleLike}
              tabIndex={-1}
            >
              <Heart size={18} fill={liked ? '#1db954' : 'none'} color={liked ? '#1db954' : '#fff'} />
              <span className="like-tooltip">
                {liked ? 'Added to Liked Songs' : 'Add to Liked Songs'}
              </span>
            </button>
          </div>
        )}
        <div className="track-duration" style={track.isPlaying ? { color: '#1db954' } : {}}>
          {track.duration}
        </div>
      </div>
    </div>
  );
};

export default TrackItem;