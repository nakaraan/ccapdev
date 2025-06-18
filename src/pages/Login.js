import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "./UserContext";

const USERS = [
  { id: "12345678", password: "password", name: "Juan Dela Cruz", role: "Student" },
  { id: "12312312", password: "password", name: "Carlos Yulo", role: "Student" },
  { id: "12341234", password: "password", name: "Jose Rizal", role: "Student" },
  { id: "12121212", password: "password", name: "Andres Bonifacio", role: "Student" },
  { id: "12344321", password: "password", name: "Emilio Aguinaldo", role: "Student" },
  { id: "ADMIN", password: "ADMIN", name: "Admin", role: "Admin" }
];

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useUser();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    const found = USERS.find(u => u.id === id && u.password === pw);
    if (found) {
      setUser(found);
      navigate("/home");
    } else {
      setError("Invalid ID or password.");
    }
  }

  return (
    <div className="login-contents">
      <form className="login-form" onSubmit={handleSubmit}>
        User ID <br />
        <input type="text" className="login-input" value={id} onChange={e => setId(e.target.value)} /><br />
        Password <br />
        <input type="password" className="login-input" value={pw} onChange={e => setPw(e.target.value)} /><br />
        <button className="login-button" type="submit">Login</button>
        {error && <div style={{color: "red", marginTop: 8}}>{error}</div>}
      </form>
      <p style={{ marginTop: 16 }}>
        Don't have an account?{" "}
        <Link
          to="/register"
          style={{ color: "#00703c", textDecoration: "underline", cursor: "pointer" }}
        >
          Register here
        </Link>
      </p>
    </div>
  );
}