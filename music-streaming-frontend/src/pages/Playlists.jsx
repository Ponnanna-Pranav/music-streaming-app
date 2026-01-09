import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { usePlayer } from "../context/PlayerContext";
import "../styles/Playlists.css";

const Playlists = () => {
  const [playlists, setPlaylists] = useState([]);
  const [name, setName] = useState("");
  const navigate = useNavigate();
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get("/playlists").then(res => setPlaylists(res.data));
  }, []);

  const createPlaylist = async () => {
    if (!name.trim()) return;
    await api.post("/playlists", { name });
    setName("");
    const res = await api.get("/playlists");
    setPlaylists(res.data);
  };

  const openAndPlay = (playlist) => {
    if (playlist.songs && playlist.songs.length > 0) {
      playSong(playlist.songs, 0); // ▶ start playing
    }
    navigate(`/playlists/${playlist.id}`);
  };

  return (
    <div className="playlists-container">
      <h1>Your Playlists</h1>

      <div className="create-playlist">
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New playlist name"
        />
        <button onClick={createPlaylist}>＋ Create</button>
      </div>

      <div className="playlist-grid">
        {playlists.map(pl => (
          <div
            key={pl.id}
            className="playlist-card"
            onClick={() => openAndPlay(pl)}
          >
            <div className="playlist-art">🎵</div>
            <div className="playlist-name">{pl.name}</div>
            <div className="playlist-count">
              {pl.songs?.length || 0} songs
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Playlists;
