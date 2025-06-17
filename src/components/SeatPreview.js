import React from "react";

const seatGridStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(9, 32px)", // 8 seats + 1 aisle
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

const aisleStyle = {
  width: "1rem",
  height: 32,
  background: "transparent",
  gridColumn: "auto",
};

export default function AvailabilityPreview({ reservation, onClose }) {
  const totalSeats = 40;
  const seatsPerRow = 8;
  const rows = 5;
  const aisleAfter = 4; // after seat 4 in each row

  // Build grid with aisle
  const gridItems = [];
  let seatNum = 1;
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < seatsPerRow + 1; col++) {
      if (col === aisleAfter) {
        // Insert aisle
        gridItems.push(
          <div key={`aisle-${row}`} style={aisleStyle} />
        );
      } else {
        gridItems.push(
          <div
            key={seatNum}
            style={seatStyle(seatNum === Number(reservation.seat))}
            title={seatNum === Number(reservation.seat) ? "Your reserved seat" : ""}
          >
            {seatNum}
          </div>
        );
        seatNum++;
      }
    }
  }

  return (
    <div style={{ minWidth: 350, padding: 16 }}>
      <h2 style={{ color: "#00703c" }}>Seat Availability Preview</h2>
      <div>
        <strong>Date:</strong> {reservation.date}
        <br />
        <strong>Lab:</strong> {reservation.lab}
      </div>
      <div style={seatGridStyle}>
        {gridItems}
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