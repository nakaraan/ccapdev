import React from "react";

const seatGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(8, 32px)",
  gap: "8px",
  margin: "16px 0",
  justifyContent: "center",
};

const seatStyle = (isSelected) => ({
  width: 32,
  height: 32,
  borderRadius: 6,
  background: isSelected ? "#00703c" : "#e0e0e0",
  color: isSelected ? "#fff" : "#333",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontWeight: isSelected ? 700 : 400,
  border: isSelected ? "2px solid #00703c" : "1px solid #ccc",
});

export default function AvailabilityPreview({ reservation, onClose }) {
  const totalSeats = 16;
  const selectedSeat = Number(reservation.seat);

  return (
    <div style={{ minWidth: 350, padding: 16 }}>
      <h2 style={{ color: "#00703c" }}>Seat Availability Preview</h2>
      <div>
        <strong>Date:</strong> {reservation.date}
        <br />
        <strong>Lab:</strong> {reservation.lab}
      </div>
      <div style={seatGridStyle}>
        {Array.from({ length: totalSeats }, (_, i) => (
          <div
            key={i + 1}
            style={seatStyle(i + 1 === selectedSeat)}
            title={i + 1 === selectedSeat ? "Your reserved seat" : ""}
          >
            {i + 1}
          </div>
        ))}
      </div>
      <div style={{ textAlign: "right" }}>
        <button
          style={{
            background: "#00703c",
            color: "#fff",
            border: "none",
            borderRadius: 6,
            padding: "8px 20px",
            cursor: "pointer",
          }}
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
}