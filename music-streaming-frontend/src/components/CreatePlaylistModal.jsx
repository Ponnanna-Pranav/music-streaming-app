import { useState } from "react";
import { createPlaylist } from "../api/api";
import "../styles/modal.css";

const CreatePlaylistModal = ({ onClose, onCreated }) => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreate = async () => {
    if (!name.trim()) return;

    try {
      setLoading(true);
      const playlist = await createPlaylist(name);
      onCreated(playlist);
      onClose();
    } catch (err) {
      console.error("Create playlist error:", err);
      alert("Failed to create playlist");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Create Playlist</h2>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Playlist name"
        />

        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={handleCreate} disabled={loading}>
            {loading ? "Creating..." : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreatePlaylistModal;
