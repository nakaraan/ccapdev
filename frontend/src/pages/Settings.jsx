import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import { deleteUserAccount } from "./api";

export default function ProfileSettings() {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();
  const { user, logoutUser } = useUser();

  const handleLogout = () => {
    logoutUser(); // Clear user session
    navigate("/");
    console.log("User logged out.");
  };

  const handleDelete = async () => {
    if (!user) return;
    
    setIsDeleting(true);
    try {
      console.log("Deleting account for user:", user.user_id);
      
      // Delete user account and all reservations
      await deleteUserAccount(user.user_id);
      
      console.log("Account deletion successful.");
      
      // Log out user and redirect to home
      logoutUser();
      navigate("/");
      
      // Optional: Show success message
      alert("Account and all reservations have been successfully deleted.");
      
    } catch (error) {
      console.error("Error deleting account:", error);
      alert("Failed to delete account. Please try again.");
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
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
              Are you sure you want to delete your account? This will permanently delete:
            </p>
            <ul style={{ textAlign: "left", margin: "12px 0", paddingLeft: "20px" }}>
              <li>Your user profile</li>
              <li>All your seat reservations</li>
              <li>All account data</li>
            </ul>
            <p style={{ margin: "18px 0", fontWeight: "bold", color: "#d32f2f" }}>
              This action cannot be undone.
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center" }}>
              <button
                style={{
                  background: isDeleting ? "#999" : "#d32f2f",
                  color: "#fff",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontWeight: 600,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? "Deleting..." : "Confirm Delete"}
              </button>
              <button
                style={{
                  background: "#eee",
                  color: "#333",
                  border: "none",
                  borderRadius: 6,
                  padding: "8px 20px",
                  fontWeight: 600,
                  cursor: isDeleting ? "not-allowed" : "pointer",
                }}
                onClick={() => setShowDeleteModal(false)}
                disabled={isDeleting}
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