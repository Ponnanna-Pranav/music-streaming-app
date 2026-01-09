import { useEffect, useRef, useContext } from "react";
import WaveSurfer from "wavesurfer.js";
import { PlayerContext } from "../context/PlayerContext";
import "../styles/Waveform.css";

export default function Waveform({ songId }) {
  const containerRef = useRef(null);
  const waveRef = useRef(null);

  const { audioRef, seek } = useContext(PlayerContext);

  useEffect(() => {
    if (!songId || !audioRef.current) return;

    // Destroy previous waveform
    if (waveRef.current) {
      waveRef.current.destroy();
    }

    waveRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#444",
      progressColor: "#1db954",
      cursorColor: "#1db954",
      barWidth: 2,
      barGap: 1,
      height: 70,
      responsive: true,
      interact: true,
    });

    // 🔗 Load from SAME audio source
    waveRef.current.load(audioRef.current.src);

    // 🔄 Audio → Wave sync
    const syncWave = () => {
      if (!waveRef.current || !audioRef.current.duration) return;
      waveRef.current.seekTo(
        audioRef.current.currentTime / audioRef.current.duration
      );
    };

    audioRef.current.addEventListener("timeupdate", syncWave);

    // 🖱 Wave → Audio seek
    waveRef.current.on("seek", (progress) => {
      seek(progress * audioRef.current.duration);
    });

    return () => {
      audioRef.current?.removeEventListener("timeupdate", syncWave);
      waveRef.current?.destroy();
    };
  }, [songId]);

  return <div ref={containerRef} className="waveform" />;
}
