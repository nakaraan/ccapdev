import { useNavigate, Link } from "react-router-dom";
import { useState } from "react";
import { registerUser, getUsers } from "./api";

export default function Register() {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [idNumber, setIdNumber] = useState("");
  const [email, setEmail] = useState("");
  const [pw, setPw] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (!firstName || !lastName || !idNumber || !email || !pw) {
      setError("All fields are required.");
      setSuccess("");
      return;
    }

    // Fetch all users from MongoDB
    const users = await getUsers();
    if (users && users.find(u => u.user_id === idNumber || u.email_address === email)) {
      setError("ID number or email already exists.");
      setSuccess("");
      return;
    }

    // Register user in MongoDB
    let submitObject = {
      user_id: idNumber,
      first_name: firstName,
      last_name: lastName,
      user_password: pw,
      user_role: "Student",
      email_address: email,
      user_description: ""
    };

    await registerUser(submitObject);
    setSuccess("Registration successful! You may now log in.");
    setError("");
    setTimeout(() => navigate("/"), 1200);
  }

  return (
    <div className="login-contents">
      <form className="login-form" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: 16 }}>Create your account</h2>
        First Name <br />
        <input
          type="text"
          className="login-input"
          value={firstName}
          onChange={e => setFirstName(e.target.value)}
          maxLength={20}
        /><br />
        Last Name <br />
        <input
          type="text"
          className="login-input"
          value={lastName}
          onChange={e => setLastName(e.target.value)}
          maxLength={20}
        /><br />
        ID Number <br />
        <input
          type="text"
          className="login-input"
          value={idNumber}
          onChange={e => setIdNumber(e.target.value)}
          maxLength={8}
        /><br />
        Email Address <br />
        <input
          type="email"
          className="login-input"
          value={email}
          onChange={e => setEmail(e.target.value)}
          maxLength={50}
        /><br />
        Password <br />
        <input
          type="password"
          className="login-input"
          value={pw}
          onChange={e => setPw(e.target.value)}
          maxLength={50}
        /><br />
        <button className="login-button" type="submit">Register</button>
        {error && <div style={{ color: "red", marginTop: 8 }}>{error}</div>}
        {success && <div style={{ color: "green", marginTop: 8 }}>{success}</div>}
      </form>
      <p style={{ marginTop: 16 }}>
        Already have an account?{" "}
        <Link
          to="/"
          style={{ color: "#00703c", textDecoration: "underline", cursor: "pointer" }}
        >
          Login here
        </Link>
      </p>
    </div>
  );
}