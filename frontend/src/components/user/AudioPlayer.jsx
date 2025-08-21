import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAudioStreamUrl } from "../../services/musicApi";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCurrentSongThunk,
  playNextThunk,
  playPreviousThunk,
  togglePlay,
} from "../../redux/slices/playerSlice";
import { useNavigate } from "react-router-dom";

const AudioPlayer = () => {
  const dispatch = useDispatch();
  // Get Redux state
  const currentSong = useSelector((state) => state.player.currentSong);
  const isPlaying = useSelector((state) => state.player.isPlaying); // Local UI state
  const [volume, setVolume] = useState(1);
  const [audioUrl, setAudioUrl] = useState(null);
  const [time, setTime] = useState({
    currentTime: { minute: "00", second: "00" },
    totalTime: { minute: "00", second: "00" },
  });
  const audioRef = useRef(null);
  const seekBar = useRef(null);
  const seekBg = useRef(null);
  const navigate = useNavigate();
  // Set audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  // Load new audio when currentSongId changes
  useEffect(() => {
    const loadAudio = async () => {
      if (!currentSong) return;
      try {
        const url = await fetchAudioStreamUrl(currentSong._id);
        setAudioUrl(url);

        if (audioRef.current) {
          const audio = audioRef.current;

          const handleCanPlay = async () => {
            if (isPlaying) {
              try {
                await audio.play();
              } catch (err) {
                console.error("Audio play failed:", err);
              }
            }
          };

          audio.addEventListener("canplaythrough", handleCanPlay);
          audio.load(); // Must call after setting src

          // Cleanup to prevent multiple listeners
          return () => {
            audio.removeEventListener("canplaythrough", handleCanPlay);
          };
        }
      } catch (error) {
        console.error("Failed to load audio:", error);
      }
    };

    loadAudio();
  }, [currentSong]);
  useEffect(() => {
    dispatch(fetchCurrentSongThunk());
  }, [fetchCurrentSongThunk]);
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(seconds % 60)
      .toString()
      .padStart(2, "0");
    return { minute: mins, second: secs };
  };

  const updateProgress = () => {
    if (!audioRef.current) return;

    const current = audioRef.current.currentTime || 0;
    const duration = audioRef.current.duration;

    if (isNaN(duration) || duration === 0) return; // Prevent NaN division

    setTime({
      currentTime: formatTime(current),
      totalTime: formatTime(duration),
    });

    const progressPercent = (current / duration) * 100;
    if (seekBar.current) {
      seekBar.current.style.width = `${progressPercent}%`;
    }
  };

  const seekSong = (e) => {
    if (!audioRef.current || !seekBg.current) return;
    const rect = seekBg.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newTime =
      (clickX / seekBg.current.offsetWidth) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  const togglePlayButton = () => {
    dispatch(togglePlay());
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  const previous = async () => {
    await audioRef.current.pause(); // Pause before going to previous track
    dispatch(playPreviousThunk());
  };

  const next = () => {
    dispatch(playNextThunk());
  };

  const handleEnded = () => {
    dispatch(playNextThunk());
  };
  if (!currentSong) return null;

  return (
    <div className="fixed bottom-0 bg-gray-800 left-0 w-full h-[7%] text-white px-4 py-10 flex items-center justify-between border-t border-gray-700 z-50">
      {/* Left: Song Info */}
      <div className="hidden lg:flex items-center gap-4 w-[25%]">
        <img
          src={currentSong?.imageUrl || null}
          alt="track"
          className="w-12 h-12 rounded"
        />
        <div>
          <p
            onClick={() => navigate(`song/${currentSong?._id}`)}
            className="text-sm font-semibold hover:underline cursor-pointer"
          >
            {currentSong?.title}
          </p>
          <p
            onClick={() => navigate(`artist/${currentSong.artistId._id}`)}
            className="text-xs text-gray-400 hover:underline cursor-pointer"
          >
            {currentSong?.artistId?.username}
          </p>
        </div>
      </div>

      {/* Center: Controls + Seekbar */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex gap-5 items-center">
          <img
            src={assets.prev_icon}
            className="w-4 cursor-pointer"
            onClick={previous}
          />
          {isPlaying ? (
            <img
              src={assets.pause_icon}
              className="w-6 cursor-pointer"
              onClick={togglePlayButton}
            />
          ) : (
            <img
              src={assets.play_icon}
              className="w-6 cursor-pointer"
              onClick={togglePlayButton}
            />
          )}
          <img
            src={assets.next_icon}
            className="w-4 cursor-pointer"
            onClick={next}
          />
        </div>

        <div className="flex items-center gap-3 text-xs w-full justify-center">
          <span>
            {time.currentTime.minute}:{time.currentTime.second}
          </span>
          <div
            ref={seekBg}
            onClick={seekSong}
            className="w-[60%] max-w-[500px] h-1 bg-gray-600 rounded cursor-pointer relative"
          >
            <hr
              ref={seekBar}
              className="absolute top-0 left-0 h-1 bg-white rounded w-0"
            />
          </div>
          <span>
            {time.totalTime.minute}:{time.totalTime.second}
          </span>
        </div>
      </div>

      {/* Right: Options */}
      <div className="hidden lg:flex items-center gap-3 w-[25%] justify-end text-gray-300">
        <div className="flex items-center gap-2">
          <img
            src={assets.volume_icon}
            className="w-5 cursor-pointer"
            onClick={() => setVolume(volume === 0 ? 1 : 0)} // toggle mute
          />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(parseFloat(e.target.value))}
            className="w-24 h-1 accent-white cursor-pointer"
          />
        </div>
      </div>

      <audio
        ref={audioRef}
        src={audioUrl || ""}
        onTimeUpdate={updateProgress}
        onEnded={handleEnded}
        preload="auto"
      />
    </div>
  );
};

export default AudioPlayer;
