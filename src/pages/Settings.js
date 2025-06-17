import { useNavigate } from "react-router-dom";

export default function Settings() {
  const navigate = useNavigate();

  function handleLogout() {
    // Optionally clear user session here
    navigate("/");
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <h1>Manage your settings</h1>
      <button
        style={{
          marginTop: "2rem",
          padding: "10px 24px",
          background: "#00703c",
          color: "#fff",
          border: "none",
          borderRadius: "6px",
          fontSize: "1rem",
          cursor: "pointer"
        }}
        onClick={handleLogout}
      >
        Logout
      </button>
    </div>
  );
}