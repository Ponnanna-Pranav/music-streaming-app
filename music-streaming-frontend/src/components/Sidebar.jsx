import { NavLink, useNavigate } from "react-router-dom";
import { usePlayer } from "../context/PlayerContext";

const Sidebar = () => {
  const navigate = useNavigate();
  const { stopAndReset } = usePlayer(); // 🔥 important

  const logout = () => {
    stopAndReset();                     // 🛑 stop audio + reset player
    localStorage.removeItem("token");   // remove auth
    navigate("/login");                 // redirect
  };

  const linkStyle = ({ isActive }) => ({
    display: "block",
    padding: "0.75rem 1rem",
    color: isActive ? "#1db954" : "white",
    textDecoration: "none",
    fontWeight: "500",
  });

  return (
    <div
      style={{
        width: "220px",
        background: "#000",
        color: "white",
        height: "100vh",
        paddingTop: "1rem",
      }}
    >
      <h2 style={{ padding: "0 1rem", marginBottom: "1rem" }}>🎵 Spotify</h2>

      <NavLink to="/songs" style={linkStyle}>
        🏠 Home
      </NavLink>

      <NavLink to="/playlists" style={linkStyle}>
        📂 Playlists
      </NavLink>

      <NavLink to="/account" style={linkStyle}>
        👤 Account
      </NavLink>

      <button
        onClick={logout}
        style={{
          marginTop: "2rem",
          marginLeft: "1rem",
          background: "transparent",
          border: "none",
          color: "#aaa",
          cursor: "pointer",
        }}
      >
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
