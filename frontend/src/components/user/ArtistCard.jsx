
import React, { useState, useRef } from 'react';
import { Play } from 'lucide-react';
import './ArtistCard.scss';
import PlayButton from './PlayButton.jsx';

const ArtistCard = ({ artist, showPlayingIndicator = false, onPlay }) => {
  const [isHovered, setIsHovered] = useState(false);
  const audioRef = useRef(null);

  const handlePlay = (e) => {
    e.stopPropagation();
    if (audioRef.current) {
      audioRef.current.play();
    }
    if (onPlay) {
      onPlay(artist);
    }
  };

  return (
    <div
      className="artist-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="artist-image-container">
        <img src={artist.image} alt={artist.name} className="artist-image"/>
        {isHovered && (
          <div className="artist-play-button" onClick={handlePlay}>
            <PlayButton />
          </div>
        )}
        {artist.audio && (
          <audio ref={audioRef} src={artist.audio} />
        )}
      </div>
      
      <div className="artist-info">
        <h3 className="artist-name">{artist.name}</h3>
        <p className="type">{artist.type}</p>
      </div>
    </div>
  );
};

export default ArtistCard;