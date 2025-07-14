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
         This is the landing page! Refer to the sidebar for navigation. <br /><br />

         You may go to settings to log out.
      </p>
    </div>
  );
}