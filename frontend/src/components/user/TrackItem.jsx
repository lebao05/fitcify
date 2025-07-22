import React, { useState } from 'react';
import { Play, Heart } from 'lucide-react';

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

  const isPlaying = track.isPlaying;

  return (
    <div
      className={`flex items-center px-2 py-1 transition-colors duration-200 ${
        hovered ? 'bg-neutral-800 cursor-pointer' : ''
      } ${!showLikeButton ? 'no-like-btn' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={handlePlaying}
    >
      {/* Track Number or Play Icon */}
      <div className="w-10 text-sm text-gray-400 flex justify-center items-center min-w-[40px] min-h-[40px]">
        {isPlaying || hovered ? (
          <Play size={16} fill={isPlaying ? '#1db954' : 'currentColor'} color={isPlaying ? '#1db954' : undefined} />
        ) : (
          index + 1
        )}
      </div>

      {/* Track Info */}
      <div className={`grid items-center text-white text-sm w-full ${showLikeButton ? 'grid-cols-[40px_2fr_1.5fr_40px_0.7fr]' : 'grid-cols-[40px_2fr_1.27fr_160px]'}`}>
        <img
          src={track.image}
          alt={track.title}
          className="w-[35px] h-[35px] object-cover rounded mr-2 shadow-sm"
        />

        {/* Title & Artist */}
        <div className="flex flex-col mr-4 overflow-hidden">
          <div className={`truncate font-medium ${isPlaying ? 'text-green-500' : ''}`}>{track.title}</div>
          <div className={`truncate text-gray-400 text-sm ${isPlaying ? 'text-green-500' : ''}`}>{track.artist}</div>
        </div>

        {/* Album */}
        <div className={`truncate mr-4 text-gray-400 ${isPlaying ? 'text-green-500' : ''}`}>{track.album}</div>

        {/* Like Button */}
        {showLikeButton && (
          <div className="flex justify-center items-center relative z-10 transition-opacity duration-200">
            <button
              className={`p-1 rounded-full relative hover:bg-green-600/10 ${liked ? '' : ''}`}
              onClick={handleLike}
              tabIndex={-1}
            >
              <Heart
                size={18}
                fill={liked ? '#1db954' : 'none'}
                color={liked ? '#1db954' : '#fff'}
                className={liked ? 'drop-shadow-[0_0_2px_#1db954]' : ''}
              />
              <span className="absolute left-[110%] top-1/2 -translate-y-1/2 bg-[#222] text-white text-xs px-2 py-1 rounded shadow-md whitespace-nowrap opacity-0 pointer-events-none transition-opacity duration-200 group-hover:opacity-100 ml-2">
                {liked ? 'Added to Liked Songs' : 'Add to Liked Songs'}
              </span>
            </button>
          </div>
        )}

        {/* Duration */}
        <div className={`text-right min-w-[40px] text-sm text-gray-400 ${isPlaying ? 'text-green-500' : ''}`}>
          {track.duration}
        </div>
      </div>
    </div>
  );
};

export default TrackItem;
