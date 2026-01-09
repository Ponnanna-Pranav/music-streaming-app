import { useState } from "react";
import api from "../api/api";
import { usePlayer } from "../context/PlayerContext";

const Search = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const { playSong } = usePlayer();

  const handleSearch = async (e) => {
    e.preventDefault();
    const res = await api.get(`/songs/search?q=${query}`);
    setResults(res.data);
  };

  return (
    <div style={{ padding: "24px", color: "white" }}>
      <h1>Search</h1>

      <form onSubmit={handleSearch}>
        <input
          placeholder="Search songs or artists"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "20px",
            border: "none",
            outline: "none",
          }}
        />
      </form>

      <div style={{ marginTop: "20px" }}>
        {results.map((song, index) => (
          <div
            key={song.id}
            onClick={() => playSong(results, index)}
            style={{
              padding: "12px",
              cursor: "pointer",
              borderBottom: "1px solid #2a2a2a",
            }}
          >
            <b>{song.title}</b>
            <div style={{ color: "#b3b3b3" }}>{song.artist}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Search;
