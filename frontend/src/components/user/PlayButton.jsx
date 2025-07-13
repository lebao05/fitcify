import React from 'react';
import './PlayButton.scss'; 

function PlayButton({ onClick }) {
  return (
    <button className="play-button" onClick={onClick}>
      <svg viewBox="0 0 24 24" className="play-icon">
        <polygon points="6,4 20,12 6,20" fill="black" />
      </svg>
    </button>
  );
}

export default PlayButton;