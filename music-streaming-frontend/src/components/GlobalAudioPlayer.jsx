import { useContext } from "react";
import { PlayerContext } from "../context/PlayerContext";
import Waveform from "./Waveform";
import "../styles/GlobalAudioPlayer.css";

const formatTime = (sec = 0) => {
  if (!isFinite(sec)) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function GlobalAudioPlayer() {
  const {
    queue,
    currentIndex,
    isPlaying,
    currentTime,
    duration,
    togglePlay,
    playNext,
    playPrev,
    seek,
    volume,
    setVolume,
  } = useContext(PlayerContext);

  if (!queue.length || currentIndex === null) {
  return null;
}


  const song = queue[currentIndex];

  return (
    <div className="global-player">
      {/* LEFT */}
      <div className="gp-left">
        <div className="gp-title">{song.title}</div>
        <div className="gp-artist">{song.artist}</div>
      </div>

      {/* CENTER */}
      <div className="gp-center">
        <div className="controls">
          <button onClick={playPrev}>⏮</button>
          <button onClick={togglePlay}>
            {isPlaying ? "⏸" : "▶"}
          </button>
          <button onClick={playNext}>⏭</button>
        </div>

        {/* 🎧 WAVEFORM (PER SONG) */}
        <Waveform songId={song.id} />

        {/* ⏱ TIMER + SEEK */}
        <div className="progress-row">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min={0}
            max={duration || 1}
            step="0.1"
            value={Math.min(currentTime, duration)}
            onChange={(e) => seek(Number(e.target.value))}
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      {/* RIGHT */}
      <div className="gp-right">
        🔊
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(e) => setVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
