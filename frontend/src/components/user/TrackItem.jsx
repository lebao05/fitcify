// components/TrackItem/TrackItem.jsx
import React from 'react';
import { Play, MoreHorizontal } from 'lucide-react';
import './TrackItem.scss';

const TrackItem = ({ track, index, onPlay, onMore }) => {
  return (
    <div className={`track-item ${track.isPlaying ? 'playing' : ''}`}>
      <div className="track-number">
        {track.isPlaying ? <Play size={16} fill="currentColor" /> : index + 1}
      </div>
      <div className="track-info">

        <img src={track.image} alt={track.title} className="track-image" />

        <div className="track-title">
          <div className="track-name"> {track.title} </div>
          <div className="track-artist"> {track.artist} </div>
        </div>

        <div className="track-album">
          {track.album}
        </div>

        <div className="track-duration">
          {track.duration}
        </div>

      </div>
    </div>
  );
};

export default TrackItem;