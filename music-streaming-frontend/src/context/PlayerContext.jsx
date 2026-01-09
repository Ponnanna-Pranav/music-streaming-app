import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
} from "react";

export const PlayerContext = createContext(null);

export const PlayerProvider = ({ children }) => {
  const audioRef = useRef(new Audio());

  const [queue, setQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  /* =========================
     AUDIO EVENTS
  ========================== */
  useEffect(() => {
    const audio = audioRef.current;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoaded = () => setDuration(audio.duration || 0);
    const onEnded = () => playNext();

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, queue]);

  /* =========================
     VOLUME
  ========================== */
  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  /* =========================
     CONTROLS
  ========================== */
  const playSong = (songs, index) => {
    if (!songs || index == null || !songs[index]) return;

    const song = songs[index];
    const audio = audioRef.current;

    // 🔥 CRITICAL FIX
    audio.pause();
    audio.src = `${import.meta.env.VITE_API_URL}/songs/${song.id}/stream`;
    audio.load();

    setQueue(songs);
    setCurrentIndex(index);
    setCurrentTime(0);

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((err) => {
        console.error("Audio play failed:", err);
      });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio.src) return;

    if (audio.paused) {
      audio.play().then(() => setIsPlaying(true));
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!queue.length || currentIndex === null) return;
    playSong(queue, (currentIndex + 1) % queue.length);
  };

  const playPrev = () => {
    if (!queue.length || currentIndex === null) return;
    playSong(
      queue,
      currentIndex === 0 ? queue.length - 1 : currentIndex - 1
    );
  };

  const seek = (time) => {
    const audio = audioRef.current;
    audio.currentTime = time;
    setCurrentTime(time);
  };

  /* =========================
     STOP PLAYER (LOGOUT)
  ========================== */
  const stopAndReset = () => {
    const audio = audioRef.current;

    audio.pause();
    audio.currentTime = 0;
    audio.src = "";

    setQueue([]);
    setCurrentIndex(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  };

  return (
    <PlayerContext.Provider
      value={{
        audioRef,
        queue,
        currentIndex,
        isPlaying,
        currentTime,
        duration,
        volume,

        playSong,
        togglePlay,
        playNext,
        playPrev,
        seek,
        setVolume,

        stopAndReset,
      }}
    >
      {children}
    </PlayerContext.Provider>
  );
};

export const usePlayer = () => {
  const ctx = useContext(PlayerContext);
  if (!ctx) {
    throw new Error("usePlayer must be used inside PlayerProvider");
  }
  return ctx;
};
