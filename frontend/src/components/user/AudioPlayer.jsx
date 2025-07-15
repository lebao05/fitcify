import { useContext } from "react";
import { assets } from "../../assets/assets";
import { PlayerContext } from "../../context/PlayerContext";

const AudioPlayer = () => {
  const {
    seekBar,
    seekBg,
    playStatus,
    play,
    pause,
    track,
    time,
    previous,
    next,
    seekSong,
  } = useContext(PlayerContext);

  return (
    <div className="fixed bottom-0 bg-gray-800 left-0 w-full h-[7%] b text-white px-4 py-2 flex items-center justify-between border-t border-gray-700 z-50">
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
          {playStatus ? (
            <img
              src={assets.pause_icon}
              className="w-6 cursor-pointer"
              onClick={pause}
            />
          ) : (
            <img
              src={assets.play_icon}
              className="w-6 cursor-pointer"
              onClick={play}
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
              className="absolute top-0 left-0 h-1 bg-green-500 rounded w-0"
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
        <img src={assets.volume_icon} className="w-4" />
        <div className="w-20 h-1 bg-gray-500 rounded"></div>
        <img src={assets.mini_player_icon} className="w-4" />
        <img src={assets.zoom_icon} className="w-4" />
      </div>
    </div>
  );
};

export default AudioPlayer;