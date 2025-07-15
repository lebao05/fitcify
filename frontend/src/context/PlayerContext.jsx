// src/context/PlayerContext.jsx
import { createContext, useEffect, useRef, useState } from "react";
import { songsData } from "../assets/assets";

export const PlayerContext = createContext();

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef();
  const seekBg = useRef();
  const seekBar = useRef();

  const [track, setTrack] = useState(songsData[0]);
  const [playStatus, setPlayStatus] = useState(false);
  const [time, setTime] = useState({
    currentTime: { second: 0, minute: 0 },
    totalTime: { second: 0, minute: 0 },
  });

  const play = () => {
    audioRef.current?.play();
    setPlayStatus(true);
  };

  const pause = () => {
    audioRef.current?.pause();
    setPlayStatus(false);
  };

  const playWithId = (id) => {
    setTrack(songsData[id]);
    setTimeout(() => {
      audioRef.current?.play();
      setPlayStatus(true);
    }, 0);
  };

  const previous = () => {
    if (track.id > 0) {
      setTrack(songsData[track.id - 1]);
      setTimeout(() => audioRef.current?.play(), 0);
      setPlayStatus(true);
    }
  };

  const next = () => {
    if (track.id < songsData.length - 1) {
      setTrack(songsData[track.id + 1]);
      setTimeout(() => audioRef.current?.play(), 0);
      setPlayStatus(true);
    }
  };

  const seekSong = (e) => {
    const clickedX = e.nativeEvent.offsetX;
    const width = seekBg.current?.offsetWidth || 1;
    const newTime = (clickedX / width) * audioRef.current.duration;
    audioRef.current.currentTime = newTime;
  };

  useEffect(() => {
    const audio = audioRef.current;

    const updateTime = () => {
      if (!audio?.duration) return;
      const progress = (audio.currentTime / audio.duration) * 100;
      seekBar.current.style.width = `${Math.floor(progress)}%`;

      setTime({
        currentTime: {
          minute: Math.floor(audio.currentTime / 60),
          second: Math.floor(audio.currentTime % 60),
        },
        totalTime: {
          minute: Math.floor(audio.duration / 60),
          second: Math.floor(audio.duration % 60),
        },
      });
    };

    audio.ontimeupdate = updateTime;
    return () => {
      audio.ontimeupdate = null;
    };
  }, [track]);

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        seekBg,
        seekBar,
        track,
        setTrack,
        playStatus,
        setPlayStatus,
        time,
        setTime,
        play,
        pause,
        playWithId,
        previous,
        next,
        seekSong,
      }}
    >
      {children}
      <audio ref={audioRef} src={track.audio} />
    </PlayerContext.Provider>
  );
};