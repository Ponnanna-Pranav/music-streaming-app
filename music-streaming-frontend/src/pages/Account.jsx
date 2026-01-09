import { getToken, logout } from "../utils/auth";

const Account = () => {
  const token = getToken();

  if (!token) {
    return (
      <div style={{ padding: "24px", color: "white" }}>
        <h1>Account</h1>
        <p>You are not logged in.</p>
      </div>
    );
  }
  const Account = () => {
  const email = localStorage.getItem("email");

  const logout = () => {
    localStorage.clear();
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>Account</h1>
      <p>Email: {email || "Unknown"}</p>
      <p>Subscription: Free</p>

      <button onClick={logout}>Logout</button>
    </div>
  );
};




  // Decode JWT safely (email stored in payload)
  let email = "Unknown";
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    email = payload.sub || payload.email;
  } catch (e) {
    console.error("Invalid token");
  }

  return (
    <div style={{ padding: "24px", color: "white" }}>
      <h1>Account</h1>

      <p>
        <strong>Email:</strong> {email}
      </p>

      <p>
        <strong>Subscription:</strong> Free
      </p>

      <button
        onClick={logout}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          background: "#1db954",
          border: "none",
          color: "black",
          fontWeight: "bold",
          cursor: "pointer",
          borderRadius: "20px",
        }}
      >
        Logout
      </button>
    </div>
  );
};

export default Account;
