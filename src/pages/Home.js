import { Link } from "react-router-dom";

export default function Home() {
  return (
    <div style={{
      maxWidth: 700,
      margin: "40px auto",
      padding: "32px",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      fontFamily: "Poppins, sans-serif"
    }}>
      <h1 style={{ color: "#00703c", marginBottom: 12 }}>Project Navigation Index</h1>
      <p style={{ color: "#333", marginBottom: 24 }}>
        Quick links to all main functional pages in this workspace:
      </p>
      <ul style={{ fontSize: "1.1rem", lineHeight: 2 }}>
        <li>
          <Link to="/home">Home (this page)</Link>
        </li>
        <li>
          <Link to="/login">Login</Link>
        </li>
        <li>
          <Link to="/faqs">FAQs</Link>
        </li>
        <li>
          <Link to="/viewusers">View Users (Search for Users)</Link>
        </li>
        <li>
          <Link to="/reservations">Reservations (View | Edit | Delete)</Link>
        </li>
        <li>
          <Link to="/reserve">Reserve (User)</Link>
        </li>
        <li>
          <Link to="/reserve-admin">Reserve (Admin/Block Mode)</Link>
        </li>
        <li>
          <Link to="/settings">Settings (Logout) </Link>
        </li>
        <li>
          <Link to="/userprofile">User Profile</Link>
        </li>
        <li>
          <Link to="/userprofile-edit">Edit User Profile</Link>
        </li>
      </ul>
      <hr style={{ margin: "32px 0" }} />
      <h2 style={{ color: "#00703c", fontSize: "1.2rem" }}>Other Sample/Static Pages</h2>
      <ul style={{ fontSize: "1rem", lineHeight: 2 }}>
        <li>
          <a href="/testreservations.html" target="_blank" rel="noopener noreferrer">
            testreservations.html
          </a>
        </li>
        <li>
          <a href="/pages/samplereservations.html" target="_blank" rel="noopener noreferrer">
            samplereservations.html
          </a>
        </li>
        <li>
          <a href="/pages/sample-lab-reservation-system.html" target="_blank" rel="noopener noreferrer">
            sample-lab-reservation-system.html
          </a>
        </li>
        <li>
          <a href="/pages/Availability.html" target="_blank" rel="noopener noreferrer">
            Availability.html
          </a>
        </li>
      </ul>
    </div>
  );
}