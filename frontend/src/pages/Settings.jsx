import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProfileSettings() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
   const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
    console.log("User logged out.");
  };

  const handleDelete = () => {
    setShowDeleteModal(false);
    console.log("Account deletion confirmed.");
  };

  return (
    <div style={{
      maxWidth: 400,
      margin: "40px auto",
      padding: "32px",
      background: "#fff",
      borderRadius: "16px",
      boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
      fontFamily: "Poppins, sans-serif",
      textAlign: "center"
    }}>
      <h2 style={{ color: "#00703c", marginBottom: 24 }}>Account Settings</h2>

      <button
        style={{
          background: "#00703c",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 24px",
          fontWeight: 700,
          marginBottom: 18,
          cursor: "pointer",
          width: "100%",
        }}
        onClick={handleLogout}
      >
        Logout
      </button>

      <button
        style={{
          background: "#d32f2f",
          color: "#fff",
          border: "none",
          borderRadius: 8,
          padding: "10px 24px",
          fontWeight: 700,
          marginTop: 0,
          cursor: "pointer",
          width: "100%",
        }}
        onClick={() => setShowDeleteModal(true)}
      >
        Delete Account
      </button>

      {showDeleteModal && (
        <div
          style={{
            position: "fixed",
            top: 0, left: 0, right: 0, bottom: 0,
            background: "rgba(0,0,0,0.18)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: 12,
              padding: "32px 40px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
              textAlign: "center",
              minWidth: 320,
            }}
          >
            <h2 style={{ color: "#d32f2f" }}>Delete Account?</h2>
            <p style={{ margin: "18px 0" }}>
              Are you sure you want to delete your account? This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                style={{
                  background: "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={handleDelete}
              >
                Confirm
              </button>
              <button
                style={{
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
                onClick={() => setShowDeleteModal(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}