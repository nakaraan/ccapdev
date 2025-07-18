import React, { useState, useEffect } from 'react';
import './availability.css';


const rows = 5;
const seatsPerSide = 4;
const aisleColumn = seatsPerSide;
const blockedSeats = new Set(['S3', 'S15']);
const reservedSeats = new Set(['S5', 'S12', 'S20', 'S33']);
const reserverNames = {
  S5: 'Hanz',
  S12: 'Gabriel',
  S20: 'Antonio',
  S33: 'Gutierrez',
};
const blockOffMode = true;



function getStorageKey(date) {
  return 'addedSeat_' + date.toISOString().slice(0, 10);
}
function setAddedSeatForDate(date, seatId) {
  if (seatId) {
    localStorage.setItem(getStorageKey(date), seatId);
  } else {
    localStorage.removeItem(getStorageKey(date));
  }
}
function getAddedSeatForDate(date) {
  return localStorage.getItem(getStorageKey(date));
}
function setOccupantName(date, seatId, name) {
  if (name) {
    localStorage.setItem(`occupant_${getStorageKey(date)}_${seatId}`, name);
  } else {
    localStorage.removeItem(`occupant_${getStorageKey(date)}_${seatId}`);
  }
}
function getOccupantName(date, seatId) {
  return localStorage.getItem(`occupant_${getStorageKey(date)}_${seatId}`);
}
function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Reserve() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 14));
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [addedSeatId, setAddedSeatId] = useState(() => getAddedSeatForDate(new Date(2025, 5, 14)));
  const [infoOutput, setInfoOutput] = useState('');
    const labs = [
    "GK210",
    "GK304A",
    "GK304B",
    "AG1804",
    "AG1904",
    "LS212",
    "LS229",
    "LS320",
    "LS335",
    "YG602"
  ];
  const [selectedLab, setSelectedLab] = useState(labs[0] || "");


  // Reset seat selection when date changes
  useEffect(() => {
    setSelectedSeatId(null);
    setAddedSeatId(getAddedSeatForDate(currentDate));
    setInfoOutput('');
  }, [currentDate]);

  // Build seat grid with aisle
  function buildSeatGrid() {
    const grid = [];
    let seatNumber = 1;
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerSide * 2 + 1; col++) {
        if (col === aisleColumn) {
          rowSeats.push({ type: 'aisle', key: `r${row}c${col}` });
        } else {
          const seatId = 'S' + seatNumber;
          rowSeats.push({ type: 'seat', seatId, key: `r${row}c${col}`, seatNumber });
          seatNumber++;
        }
      }
      grid.push(rowSeats);
    }
    return grid;
  }
  const seatGrid = buildSeatGrid();

  function onSeatClick(seatId) {
    if (blockOffMode && blockedSeats.has(seatId)) return;
    if (reservedSeats.has(seatId)) {
      alert(`Seat ${seatId} is reserved by ${reserverNames[seatId] || 'Unknown'}.`);
      return;
    }
    if (addedSeatId === seatId) return;
    setSelectedSeatId(seatId === selectedSeatId ? null : seatId);
  }

  function onActionClick() {
    if (!selectedSeatId && !addedSeatId) {
      alert('Please select a seat first.');
      return;
    }
    if (addedSeatId === selectedSeatId && addedSeatId) {
      // Remove seat
      setAddedSeatForDate(currentDate, null);
      setOccupantName(currentDate, selectedSeatId, null);
      setAddedSeatId(null);
      setSelectedSeatId(null);
      setInfoOutput('');
    } else {
      // Add seat
      const occupantName = prompt('Enter Your Name For Reservation:');
      if (!occupantName || occupantName.trim() === '') {
        alert('Name Is Required.');
        return;
      }
      setAddedSeatForDate(currentDate, selectedSeatId);
      setOccupantName(currentDate, selectedSeatId, occupantName);
      setAddedSeatId(selectedSeatId);
      setSelectedSeatId(null);
      setInfoOutput('');
    }
  }

  function onPrevDate() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  }
  function onNextDate() {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  }

  function onShowAvailableSeats() {
    let count = 0;
    seatGrid.flat().forEach((cell) => {
      if (cell.type !== 'seat') return;
      const seatId = cell.seatId;
      const isReserved = reservedSeats.has(seatId);
      const isBlocked = blockOffMode && blockedSeats.has(seatId);
      const isAdded = addedSeatId === seatId;
      if (!isReserved && !isBlocked && !isAdded) count++;
    });
    setInfoOutput(`Available seats for ${formatDate(currentDate)}: ${count}`);
  }

  function onShowOccupants() {
    const occupants = [];
    reservedSeats.forEach((seatId) => {
      occupants.push({ seatId, name: reserverNames[seatId] || 'Unknown' });
    });
    if (addedSeatId) {
      const occupantName = getOccupantName(currentDate, addedSeatId) || 'Unknown';
      occupants.push({ seatId: addedSeatId, name: occupantName });
    }
    if (occupants.length === 0) {
      setInfoOutput(`No Occupants For ${formatDate(currentDate)}.`);
    } else {
      const list = occupants.map((o) => `Seat ${o.seatId}: ${o.name}`).join('\n');
      setInfoOutput(`Occupants For ${formatDate(currentDate)}:\n${list}`);
    }
  }

  function getSeatClass(seatId) {
    if (blockOffMode && blockedSeats.has(seatId)) return 'seat blocked';
    if (reservedSeats.has(seatId)) return 'seat reserved';
    if (addedSeatId === seatId) return 'seat added';
    if (selectedSeatId === seatId) return 'seat selected';
    return 'seat';
  }

  function getAriaPressed(seatId) {
    if (addedSeatId === seatId || selectedSeatId === seatId) return 'true';
    return 'false';
  }

  // Overlay-style card container
  const cardStyle = {
    background: "#fff",
    borderRadius: 18,
    boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
    padding: "40px 32px",
    minWidth: 420,
    maxWidth: 600,
    margin: "48px auto",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    fontFamily: "Poppins, sans-serif",
  };

  const headerStyle = {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  };

  const titleStyle = {
    fontSize: "2rem",
    fontWeight: 700,
    color: "#00703c",
    letterSpacing: "0.5px",
  };

  const closeBtnStyle = {
    background: "none",
    border: "none",
    fontSize: "2rem",
    color: "#888",
    cursor: "pointer",
    fontWeight: "bold",
    marginLeft: "auto",
    marginRight: "-8px",
    marginTop: "-8px",
    transition: "color 0.2s",
  };

  const dateNavStyle = {
    display: "flex",
    alignItems: "center",
    gap: 16,
    marginBottom: 24,
    fontSize: "1.2rem",
    color: "#00703c",
    fontWeight: 600,
  };

  const dateBtnStyle = {
    background: "none",
    border: "none",
    fontSize: "1.5rem",
    cursor: "pointer",
    color: "#00703c",
    padding: "0 8px",
    borderRadius: 6,
    transition: "background 0.2s",
  };

  const dateStyle = {
    minWidth: 220,
    textAlign: "center",
    fontWeight: 500,
    fontSize: "1.1rem",
    letterSpacing: "0.5px",
  };

  const seatGridStyle = {
    display: "grid",
    gridTemplateColumns: "repeat(9, 40px)",
    gap: "10px",
    justifyItems: "center",
    marginBottom: 24,
    marginTop: 8,
  };

  const legendStyle = {
    display: "flex",
    justifyContent: "center",
    gap: 24,
    marginBottom: 18,
    fontSize: "1rem",
    color: "#222",
    width: "100%",
  };

  const legendBoxStyle = (bg) => ({
    display: "inline-block",
    width: 20,
    height: 20,
    backgroundColor: bg,
    borderRadius: 4,
    border: "1px solid #999",
    marginRight: 8,
  });

  const dataBtnStyle = {
    background: "#00703c",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    padding: "8px 18px",
    fontSize: "1rem",
    fontWeight: 600,
    cursor: "pointer",
    margin: "0 8px",
    marginBottom: 8,
    transition: "background 0.2s",
  };

  const actionBtnStyle = {
    width: "100%",
    padding: "12px",
    fontSize: "1.1rem",
    backgroundColor: "#00703c",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
    fontWeight: 700,
    marginTop: 12,
    transition: "background 0.2s",
  };

  const infoOutputStyle = {
    marginTop: 10,
    fontSize: "1rem",
    color: "#333",
    whiteSpace: "pre-wrap",
    textAlign: "center",
    minHeight: 24,
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: 0, margin: 0 }}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <div style={titleStyle}>Seat Reservation</div>
          <button
            style={closeBtnStyle}
            aria-label="Close Seat Availability Page"
            onClick={() => alert('Close')}
            onMouseOver={e => (e.currentTarget.style.color = "#00703c")}
            onMouseOut={e => (e.currentTarget.style.color = "#888")}
          >
            &times;
          </button>
        </div>

        <div style={dateNavStyle}>
          <button style={dateBtnStyle} aria-label="Previous Day" onClick={onPrevDate}>
            &larr;
          </button>
        <div style={dateStyle} aria-live="polite" aria-atomic="true">
          {/* {formatDate(currentDate)} */}
          <input
            type="date"
            value={currentDate.toISOString().slice(0, 10)}
            onChange={e => setCurrentDate(new Date(e.target.value))}
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "4px 10px",
              color: "#00703c",
              background: "#f5f5f5",
              textAlign: "center",
            }}
          />
        </div>
          <button style={dateBtnStyle} aria-label="Next Day" onClick={onNextDate}>
            &rarr;
          </button>
        </div>

        <div style={{ margin: "16px 0", width: "100%", display: "flex" }}>
          <select
            value={selectedLab}
            onChange={e => setSelectedLab(e.target.value)}
            style={{
              fontSize: "1.1rem",
              fontWeight: 500,
              border: "1px solid #ccc",
              borderRadius: 6,
              padding: "6px 16px",
              color: "#00703c",
              background: "#f5f5f5",
              width: "100%", 
              textAlign: "center",
              outline: "none",
              flex: 1,
            }}
          >
            {labs.map(lab => (
              <option key={lab} value={lab}>{lab}</option>
            ))}
          </select>
        </div>
        
        <div
          className="seats"
          aria-label="Seats"
          style={seatGridStyle}
        >
          {seatGrid.map((row, rowIndex) =>
            row.map((cell) => {
              if (cell.type === 'aisle') {
                return (
                  <div
                    key={cell.key}
                    className="aisle"
                    style={{ backgroundColor: 'transparent', width: 40, height: 40 }}
                  />
                );
              }
              const seatId = cell.seatId;
              const seatClass = getSeatClass(seatId);
              const isBlocked = seatClass.includes('blocked');
              const isReserved = seatClass.includes('reserved');
              const isAdded = seatClass.includes('added');
              const occupantName =
                isReserved
                  ? reserverNames[seatId] || 'Unknown'
                  : isAdded
                  ? getOccupantName(currentDate, seatId)
                  : '';

              return (
                <div
                  key={cell.key}
                  role="button"
                  tabIndex={isBlocked ? -1 : 0}
                  aria-pressed={getAriaPressed(seatId)}
                  aria-label={`Seat ${seatId}${isBlocked ? ', blocked' : ''}${isReserved ? `, reserved` : ''}${isAdded ? ', added' : ''}`}
                  title={
                    isReserved
                      ? `Reserved by ${occupantName}`
                      : isAdded && occupantName
                      ? `Reserved by ${occupantName}`
                      : ''
                  }
                  className={seatClass}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: isBlocked
                      ? '#ccc'
                      : isReserved
                      ? '#f44336'
                      : isAdded
                      ? '#00703c'
                      : selectedSeatId === seatId
                      ? '#e0e0e0'
                      : '#e0e0e0',
                    color: isBlocked || isReserved || isAdded ? '#fff' : '#222',
                    borderRadius: 6,
                    border: isAdded
                      ? '2px solid #00703c'
                      : selectedSeatId === seatId
                      ? '2px solid #00703c'
                      : '1px solid #ccc',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: isAdded || selectedSeatId === seatId ? 700 : 500,
                    cursor: isBlocked
                      ? 'not-allowed'
                      : isAdded
                      ? 'default'
                      : 'pointer',
                    outline: 'none',
                    transition: 'background 0.2s, border 0.2s',
                  }}
                  onClick={() => onSeatClick(seatId)}
                  onKeyDown={(e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && !isBlocked) {
                      e.preventDefault();
                      onSeatClick(seatId);
                    }
                  }}
                >
                  {cell.seatNumber}
                </div>
              );
            })
          )}
        </div>

        <div style={legendStyle} aria-label="Seat Legend">
          <div>
            <span style={legendBoxStyle("#e0e0e0")}></span> Available
          </div>
          <div>
            <span style={legendBoxStyle("#f44336")}></span> Reserved
          </div>
          <div>
            <span style={legendBoxStyle("#000000")}></span> Blocked
          </div>
        </div>

        <div style={{ width: "100%", textAlign: "center", marginBottom: 12 }}>
          <button style={dataBtnStyle} onClick={onShowAvailableSeats}>
            Show Available Seats
          </button>
          <button style={dataBtnStyle} onClick={onShowOccupants}>
            Show Occupants
          </button>
          <div style={infoOutputStyle}>
            {infoOutput}
          </div>
        </div>

        <button
          className="actionBtn"
          aria-label={addedSeatId === selectedSeatId && addedSeatId ? 'Remove Selected Seat' : 'Add Selected Seat'}
          onClick={onActionClick}
          disabled={!selectedSeatId && !addedSeatId}
          style={{
            ...actionBtnStyle,
            backgroundColor: (!selectedSeatId && !addedSeatId) ? "#999" : "#00703c",
            cursor: (!selectedSeatId && !addedSeatId) ? "not-allowed" : "pointer",
          }}
        >
          {addedSeatId === selectedSeatId && addedSeatId ? 'Remove' : 'Add'}
        </button>
      </div>
    </div>
  );
}