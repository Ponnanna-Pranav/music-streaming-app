import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/api";
import { usePlayer } from "../context/PlayerContext";
import "../styles/PlaylistDetails.css";

const PlaylistDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [playlist, setPlaylist] = useState(null);
  const { playSong } = usePlayer();

  useEffect(() => {
    api.get(`/playlists/${id}`).then(res => {
      setPlaylist(res.data);
      if (res.data.songs?.length) {
        playSong(res.data.songs, 0); // ✅ AUTO PLAY
      }
    });
  }, [id]);

  const deletePlaylist = async () => {
    if (!window.confirm("Delete this playlist?")) return;
    await api.delete(`/playlists/${id}`);
    navigate("/playlists");
  };

  if (!playlist) return <p>Loading...</p>;

  return (
    <div className="playlist-details">
      <div className="playlist-header">
        <h1>{playlist.name}</h1>
        <button className="delete-btn" onClick={deletePlaylist}>
          🗑 Delete
        </button>
      </div>

      {playlist.songs.length === 0 && (
        <p style={{ color: "#aaa" }}>No songs in this playlist</p>
      )}

      {playlist.songs.map((song, index) => (
        <div
          key={song.id}
          className="playlist-song"
          onClick={() => playSong(playlist.songs, index)}
        >
          <div>
            <strong>{song.title}</strong>
            <div className="artist">{song.artist}</div>
          </div>
          ▶
        </div>
      ))}
    </div>
  );
};

export default PlaylistDetails;
