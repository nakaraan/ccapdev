import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    // Perform login logic here if needed
    navigate("/home"); // Redirect to home page after login
  }

  return (
    <div className="login-contents">
      <form className="login-form" onSubmit={handleSubmit}>
        User ID <br />
        <input type="text" className="login-input" /><br />
        Password <br />
        <input type="password" className="login-input" /><br />
        <button className="login-button" type="submit">Login</button>
      </form>
    </div>
  );
}