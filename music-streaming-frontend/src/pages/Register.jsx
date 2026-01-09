import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";
import "../styles/Auth.css";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await api.post("/users/register", {
        email,
        password,
      });
      navigate("/login");
    } catch (err) {
      setError("User already exists");
    }
  };

  return (
    <div className="auth-page">
      <form className="auth-card" onSubmit={handleRegister}>
        <div className="auth-title">Register</div>
        <div className="auth-subtitle">Create your music world 🎶</div>

        {error && <div className="auth-error">{error}</div>}

        <input
          className="auth-input"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="auth-input"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button className="auth-btn">Register</button>

        <div className="auth-link">
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
