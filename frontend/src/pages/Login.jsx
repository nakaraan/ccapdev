import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { useUser } from "./UserContext";
import { loginUser } from "./api"; 

export default function Login() {
  const navigate = useNavigate();
  const { loginUser: loginUserContext } = useUser();
  const [id, setId] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    
    if (!id || !pw) {
      setError("Please enter both ID and password.");
      return;
    }

    console.log("Login submitted with ID:", id, "and Password:", pw);
    try {
      const userData = await loginUser({ user_id: String(id), user_password: String(pw) });
      loginUserContext(userData); // Use enhanced login function from context
      
      // Navigate based on user role
      if (userData.user_role === 'Admin') {
        navigate("/home"); // or navigate to admin dashboard
      } else {
        navigate("/home");
      }
    } catch (err) {
      setError("Invalid ID or password.");
      console.log(err);
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