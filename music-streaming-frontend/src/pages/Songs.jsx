import { useEffect, useState } from "react";
import api from "../api/api";
import { usePlayer } from "../context/PlayerContext";
import "../styles/Songs.css";

const Songs = () => {
  const [songs, setSongs] = useState([]);
  const [playlists, setPlaylists] = useState([]);

  const { playSong, currentIndex, isPlaying } = usePlayer();

  useEffect(() => {
    api.get("/songs").then(res => setSongs(res.data));
    api.get("/playlists").then(res => setPlaylists(res.data));
  }, []);

  const addToPlaylist = async (playlistId, songId) => {
    if (!playlistId) return;
    try {
      await api.post(`/playlists/${playlistId}/songs/${songId}`);
      alert("✅ Added to playlist");
    } catch {
      alert("❌ Failed to add to playlist");
    }
  };

  return (
    <div className="songs-container">
      <h1>🎵 Songs</h1>

      {songs.map((song, index) => {
        const isActive = index === currentIndex;

        return (
          <div
            key={song.id}
            className={`song-card ${isActive ? "active" : ""}`}
            onClick={() => playSong(songs, index)}
          >
            <div className="song-info">
              <div className="song-title">{song.title}</div>
              <div className="song-artist">{song.artist}</div>
            </div>

            <div className="song-play">
              {isActive && isPlaying ? "⏸" : "▶"}
            </div>

            <select
              className="playlist-select"
              onClick={(e) => e.stopPropagation()}
              onChange={(e) => {
                addToPlaylist(e.target.value, song.id);
                e.target.value = "";
              }}
            >
              <option value="">＋</option>
              {playlists.map(pl => (
                <option key={pl.id} value={pl.id}>
                  {pl.name}
                </option>
              ))}
            </select>
          </div>
        );
      })}
    </div>
  );
};

export default Songs;
