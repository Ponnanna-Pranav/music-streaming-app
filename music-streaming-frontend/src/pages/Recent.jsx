import { usePlayer } from "../context/PlayerContext";

const Recent = () => {
  const { recentlyPlayed, playSong } = usePlayer();

  return (
    <div>
      <h1>Recently Played</h1>
      {recentlyPlayed.map((s, i) => (
        <div key={s.id} onClick={() => playSong(recentlyPlayed, i)}>
          {s.title} — {s.artist}
        </div>
      ))}
    </div>
  );
};

export default Recent;
