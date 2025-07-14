import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "../pages/Tabular.css";

export default function ProfileOverlay({
  user,
  onClose,
}) {
  return (
    <div className="tabular-overlay-bg" onClick={onClose}>
      <div
        className="tabular-overlay-card"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="tabular-overlay-close"
          aria-label="Close"
        >
          &times;
        </button>
        <div className="tabular-overlay-content">
          {/* Profile Info Only */}
          <div className="tabular-overlay-profile">
            <div className="tabular-profile-avatar">
              <FaUserCircle size={120} color="#e0e0e0" />
            </div>
            <div className="tabular-overlay-name">{user.first_name} {user.last_name}</div>
            <div className="tabular-overlay-role">{user.user_role}</div>
            <div className="tabular-overlay-desc">{user.user_description}</div>
          </div>
        </div>
      </div>
    </div>
  );
}