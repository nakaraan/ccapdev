import React, { useState, useEffect } from 'react';

const SeatAvailability = () => {
  const rows = 5;
  const seatsPerSide = 4;
  const aisleColumn = seatsPerSide;

  // Fixed seat sets and names
  const blockedSeats = new Set(['S3', 'S15']);
  const reservedSeats = new Set(['S5', 'S12', 'S20', 'S33']);
  const reserverNames = {
    S5: 'Hanz',
    S12: 'Gabriel',
    S20: 'Antonio',
    S33: 'Gutierrez',
  };
  const blockOffMode = true;

  // State
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 14));
  const [selectedSeatId, setSelectedSeatId] = useState(null);
  const [addedSeatId, setAddedSeatId] = useState(() => getAddedSeatForDate(new Date(2025, 5, 14)));
  const [infoOutput, setInfoOutput] = useState('');

  // Helper functions for localStorage keys
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

  // Formatting display date
  const formatDate = (date) =>
    date.toLocaleDateString(undefined, {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Build seat IDs list in row-major order including aisle at aisleColumn
  const buildSeatGrid = () => {
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
  };

  // Seat grid data to render
  const seatGrid = buildSeatGrid();

  // Handle seat click
  const onSeatClick = (seatId) => {
    // blocked or reserved seats do nothing except alert for reserved
    if (blockOffMode && blockedSeats.has(seatId)) return;

    if (reservedSeats.has(seatId)) {
      alert(
        `Seat ${seatId} is reserved by ${reserverNames[seatId] || 'Unknown'
        }.`
      );
      return;
    }

    // If seat is added (already reserved by current user)
    if (addedSeatId === seatId) return;

    if (selectedSeatId === seatId) {
      setSelectedSeatId(null);
    } else {
      setSelectedSeatId(seatId);
    }
  };

  // Handle Action Button Add/Remove
  const onActionClick = () => {
    if (!selectedSeatId) {
      alert('Please select a seat first.');
      return;
    }
    if (addedSeatId === selectedSeatId) {
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
  };

  // Navigation handlers
  const onPrevDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
    setSelectedSeatId(null);
    setInfoOutput('');
  };

  const onNextDate = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
    setSelectedSeatId(null);
    setInfoOutput('');
  };

  // Show available seats count
  const onShowAvailableSeats = () => {
    let count = 0;
    seatGrid.flat().forEach((cell) => {
      if (cell.type !== 'seat') return;
      const seatId = cell.seatId;
      const isReserved = reservedSeats.has(seatId);
      const isBlocked = blockOffMode && blockedSeats.has(seatId);
      const isAdded = addedSeatId === seatId;
      if (!isReserved && !isBlocked && !isAdded) count++;
    });
    setInfoOutput(
      `Available seats for ${formatDate(currentDate)}: ${count}`
    );
  };

  // Show occupants info
  const onShowOccupants = () => {
    const occupants = [];
    reservedSeats.forEach((seatId) => {
      occupants.push({ seatId, name: reserverNames[seatId] || 'Unknown' });
    });
    if (addedSeatId) {
      const occupantName =
        getOccupantName(currentDate, addedSeatId) || 'Unknown';
      occupants.push({ seatId: addedSeatId, name: occupantName });
    }
    if (occupants.length === 0) {
      setInfoOutput(`No Occupants For ${formatDate(currentDate)}.`);
    } else {
      const list = occupants
        .map((o) => `Seat ${o.seatId}: ${o.name}`)
        .join('\n');
      setInfoOutput(`Occupants For ${formatDate(currentDate)}:\n${list}`);
    }
  };

  // Determine seat class for styling
  const getSeatClass = (seatId) => {
    if (blockOffMode && blockedSeats.has(seatId)) return 'seat blocked';
    if (reservedSeats.has(seatId)) return 'seat reserved';
    if (addedSeatId === seatId) return 'seat added';
    if (selectedSeatId === seatId) return 'seat selected';
    return 'seat';
  };

  // Determine aria-pressed attribute
  const getAriaPressed = (seatId) => {
    if (addedSeatId === seatId || selectedSeatId === seatId) return 'true';
    return 'false';
  };

  return (
    <div className="container" role="region" aria-label="Seat Availability Page">
      <div className="header">
        <div className="title">Seat Availability</div>
        <button
          className="closeBtn"
          aria-label="Close Seat Availability Page"
          onClick={() => alert('Close')}
        >
          &times;
        </button>
      </div>

      <div className="date-nav">
        <button
          className="date-prev"
          aria-label="Previous Day"
          onClick={onPrevDate}
        >
          &larr;
        </button>
        <div
          className="date"
          aria-live="polite"
          aria-atomic="true"
          style={{ margin: '0 1rem', minWidth: '200px' }}
        >
          {formatDate(currentDate)}
        </div>
        <button
          className="date-next"
          aria-label="Next Day"
          onClick={onNextDate}
        >
          &rarr;
        </button>
      </div>

      <div className="seats" aria-label="Seats" style={{ display: 'grid', gridTemplateColumns: `repeat(${seatsPerSide * 2 + 1}, 1fr)`, gap: '8px', marginTop: '1rem', marginBottom: '1rem' }}>
        {seatGrid.map((row, rowIndex) =>
          row.map((cell) => {
            if (cell.type === 'aisle') {
              return (
                <div
                  key={cell.key}
                  className="aisle"
                  style={{ backgroundColor: 'transparent' }}
                >
                  {/* Aisle spacer */}
                </div>
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
                style={{ cursor: isBlocked ? 'not-allowed' : 'pointer', userSelect: 'none', padding: '8px', borderRadius: '4px', textAlign: 'center', lineHeight: '24px', fontWeight: 'bold', backgroundColor: (isBlocked ? '#ccc' : isReserved ? '#f44336' : isAdded ? '#4caf50' : '#e0e0e0'), color: isBlocked || isReserved || isAdded ? '#fff' : '#000' }}
                onClick={() => onSeatClick(seatId)}
                onKeyDown={(e) => {
                  if (
                    (e.key === ' ' || e.key === 'Enter') &&
                    !isBlocked
                  ) {
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

      <div className="legend" aria-label="Seat Legend" style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', marginBottom: '1rem' }}>
        <div><span className="legend-box available" style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#e0e0e0', borderRadius: '4px', border: '1px solid #999', marginRight: '6px' }}></span> Available</div>
        <div><span className="legend-box reserved" style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#f44336', borderRadius: '4px', marginRight: '6px' }}></span> Reserved</div>
        <div><span className="legend-box blocked" style={{ display: 'inline-block', width: '20px', height: '20px', backgroundColor: '#ccc', borderRadius: '4px', marginRight: '6px' }}></span> Blocked</div>
      </div>

      <div className="data" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button
          id="availableSeatsBtn"
          style={{ marginRight: '10px' }}
          onClick={onShowAvailableSeats}
        >
          Show Available Seats
        </button>
        <button
          id="occupantsBtn"
          style={{ marginLeft: '10px' }}
          onClick={onShowOccupants}
        >
          Show Occupants
        </button>
        <div
          id="infoOutput"
          style={{
            marginTop: '10px',
            fontSize: '1rem',
            color: '#333',
            whiteSpace: 'pre-wrap',
            whiteSpace: 'pre-wrap',
            whiteSpace: 'pre-wrap',
          }}
        >
          {infoOutput}
        </div>
      </div>

      <button
        className="actionBtn"
        aria-label={addedSeatId === selectedSeatId && addedSeatId ? "Remove Selected Seat" : "Add Selected Seat"}
        onClick={onActionClick}
        disabled={!selectedSeatId && !addedSeatId}
        style={{ padding: '8px 16px' }}
      >
        {addedSeatId === selectedSeatId && addedSeatId ? "Remove" : "Add"}
      </button>
    </div>
  );
};

export default SeatAvailability;

