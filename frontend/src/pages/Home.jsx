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
      fontFamily: "Roboto, sans-serif"
    }}>
      <style>
        {`
          ul.custom-marker li::marker {
            content: "";
            font-size: 1.1em;
          }
        `}
      </style>
      <h1 style={{ color: "#00703c", marginBottom: 12 }}> Welcome! </h1>
      <p style={{ color: "#333", marginBottom: 24 }}>
        This page features links to all the webpages in our project.
      </p>
      <ul
        className="custom-marker"
        style={{
          fontSize: "1.1rem",
          lineHeight: 2,
          padding: 0,
          margin: 0
        }}
      > 
        <li>
          <Link to="/home">Home (this page)</Link>
        </li>
        <li>
          <Link to="/">Login</Link>
        </li>
        <li>
          <Link to="/faqs">FAQs (Credits)</Link>
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
          <Link to="/settings">Settings (Logout | Delete) </Link>
        </li>
        <li>
          <Link to="/userprofile">User Profile</Link>
        </li>
        <li>
          <Link to="/userprofile-edit">Edit User Profile</Link>
        </li>
      </ul>
    </div>
  );
}