import React, { useEffect, useRef, useState } from "react";
import { assets } from "../../assets/assets";
import { fetchAudioStreamUrl } from "../../services/musicApi";

const AudioPlayer = () => {
  const songIds = [
    "68823aeaf3ae3183381e612a",
    "68823b05f3ae3183381e612f",
    "68823b19f3ae3183381e6134",
  ];
  const [volume, setVolume] = useState(1);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const audioRef = useRef(null);
  const seekBar = useRef(null);
  const seekBg = useRef(null);

  const [track, setTrack] = useState({
    image: "/placeholder.jpg",
    name: "Demo Song",
    desc: "Demo artist / album",
  });

  const [time, setTime] = useState({
    currentTime: { minute: "00", second: "00" },
    totalTime: { minute: "00", second: "00" },
  });
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);
  const loadAudio = async () => {
    try {
      const url = await fetchAudioStreamUrl(songIds[currentIndex]);
      setAudioUrl(url);
      if (audioRef.current) {
        audioRef.current.load();
        if (isPlaying) {
          audioRef.current.play();
        }
      }
    } catch (error) {
      console.error("Failed to load audio:", error);
    }
  };
  useEffect(() => {
    console.log(currentIndex);
    loadAudio();
  }, [currentIndex]);

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
    const current = audioRef.current.currentTime;
    const duration = audioRef.current.duration;

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

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const previous = () => {
    setCurrentIndex((prev) => (prev === 0 ? songIds.length - 1 : prev - 1));
    setIsPlaying(true);
    audioRef.current.play();
  };

  const next = () => {
    setCurrentIndex((prev) => (prev === songIds.length - 1 ? 0 : prev + 1));
  };

  const handleEnded = () => {
    next();
  };

  return (
    <div className="fixed bottom-0 bg-gray-800 left-0 w-full h-[7%] text-white px-4 py-2 flex items-center justify-between border-t border-gray-700 z-50">
      {/* Left: Song Info */}
      <div className="hidden lg:flex items-center gap-4 w-[25%]">
        <img src={track.image} alt="track" className="w-12 h-12 rounded" />
        <div>
          <p className="text-sm font-semibold">{track.name}</p>
          <p className="text-xs text-gray-400">{track.desc.slice(0, 43)}</p>
        </div>
      </div>

      {/* Center: Controls + Seekbar */}
      <div className="flex-1 flex flex-col items-center gap-2">
        <div className="flex gap-5 items-center">
          <img src={assets.shuffle_icon} className="w-4 cursor-pointer" />
          <img
            src={assets.prev_icon}
            className="w-4 cursor-pointer"
            onClick={previous}
          />
          {isPlaying ? (
            <img
              src={assets.pause_icon}
              className="w-6 cursor-pointer"
              onClick={togglePlay}
            />
          ) : (
            <img
              src={assets.play_icon}
              className="w-6 cursor-pointer"
              onClick={togglePlay}
            />
          )}
          <img
            src={assets.next_icon}
            className="w-4 cursor-pointer"
            onClick={next}
          />
          <img src={assets.loop_icon} className="w-4 cursor-pointer" />
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
        <img src={assets.plays_icon} className="w-4" />
        <img src={assets.mic_icon} className="w-4" />
        <img src={assets.queue_icon} className="w-4" />
        <img src={assets.speaker_icon} className="w-4" />
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

        <img src={assets.mini_player_icon} className="w-4" />
        <img src={assets.zoom_icon} className="w-4" />
      </div>

      <audio
        ref={audioRef}
        src={audioUrl || ""}
        onTimeUpdate={updateProgress}
        onEnded={handleEnded}
        preload="auto"
        autoPlay={isPlaying}
      />
    </div>
  );
};

export default AudioPlayer;
