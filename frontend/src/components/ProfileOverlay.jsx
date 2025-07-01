import React from "react";
import { FaUserCircle } from "react-icons/fa";
import "../pages/Tabular.css";

export default function ProfileOverlay({
  user,
  onClose,
  onShowReservations,
  onEditReservations,
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
          {/* Left Side: PROFILE INFO */}
          <div className="tabular-overlay-profile">
            <div className="tabular-profile-avatar">
              <FaUserCircle size={120} color="#e0e0e0" />
            </div>
            <div className="tabular-overlay-name">{user.name}</div>
            <div className="tabular-overlay-role">{user.role}</div>
            <div className="tabular-overlay-desc">{user.description}</div>
          </div>
          {/* Right Side: ACTIONS */}
          <div className="tabular-overlay-actions">
            <button
              className="tabular-btn tabular-btn-main"
              onClick={onShowReservations}
            >
              Current Reservations
            </button>
            <button
              className="tabular-btn tabular-btn-outline"
              onClick={onEditReservations}
            >
              Edit Reservations
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}