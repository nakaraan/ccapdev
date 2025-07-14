import React, { useState, useEffect } from 'react';
import './availability.css';
import { 
  getSeatReservations, 
  updateSeatReservation, 
  clearSeatReservation, 
  getLabs
} from './api.js';
import { useUser } from './UserContext.js';

const rows = 5;
const seatsPerSide = 4;
const totalSeats = rows * seatsPerSide * 2; // 40 seats total
const aisleColumn = seatsPerSide;
const initializeSeatMap = () => ({});

// seat status (0 = vacant if not in map, 1 = reserved, -1 = blocked)
const getSeatStatus = (seatMap, seatIndex) => {
  if (seatMap[seatIndex]) return seatMap[seatIndex].status;
  return 0; // vacant if not in map
};

const getOccupantName = (seatMap, seatIndex) => {
  if (seatMap[seatIndex]) return seatMap[seatIndex].occupantName || "Anonymous";
  return "Anonymous";
};

// Get user ID from sparse map
const getUserId = (seatMap, seatIndex) => {
  if (seatMap[seatIndex]) return seatMap[seatIndex].user_id;
  return null;
};

function getStorageKey(date, lab, timeSlot) {
  return `seatData_${lab}_${date.toISOString().slice(0, 10)}_${timeSlot}`;
}

// Generate time slots from 7:30 AM to 10:00 PM in 30-minute intervals
function generateTimeSlots() {
  const slots = [];
  for (let hour = 7; hour <= 21; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      // Skip 7:00 AM, start from 7:30 AM
      if (hour === 7 && minute === 0) continue;
      // Stop at 10:00 PM
      if (hour === 22) break;
      
      const startHour = hour;
      const startMinute = minute;
      const endHour = minute === 30 ? hour + 1 : hour;
      const endMinute = minute === 30 ? 0 : 30;
      
      const formatTime = (h, m) => {
        return `${h.toString().padStart(2, '0')}${m.toString().padStart(2, '0')}`;
      };
      
      const startTime = formatTime(startHour, startMinute);
      const endTime = formatTime(endHour, endMinute);
      const slotKey = `${startTime}-${endTime}`;
      
      slots.push({
        key: slotKey,
        display: slotKey,
        startHour,
        startMinute,
        endHour,
        endMinute
      });
    }
  }
  return slots;
}

// CRUD Operations using MongoDB API (User mode)
const SeatCRUD = {
  // Load seat data from MongoDB
  load: async (date, lab, timeSlot) => {
    try {
      const dateStr = date.toISOString().slice(0, 10);
      const seatMap = await getSeatReservations(dateStr, lab, timeSlot);
      return { seats: seatMap };
    } catch (error) {
      console.error("Error loading seat data:", error);
      return { seats: initializeSeatMap() };
    }
  },

  // Update seat reservation (User mode: only for current user)
  updateReservation: async (date, lab, timeSlot, seatIndex, status, occupantName = "", user_id = null) => {
    try {
      const dateStr = date.toISOString().slice(0, 10);
      await updateSeatReservation(dateStr, lab, timeSlot, seatIndex, status, occupantName, user_id);
      return await SeatCRUD.load(date, lab, timeSlot);
    } catch (error) {
      console.error("Error updating seat reservation:", error);
      throw error;
    }
  },

  // Clear seat reservation (User mode: only own reservations)
  clearReservation: async (date, lab, timeSlot, seatIndex) => {
    try {
      const dateStr = date.toISOString().slice(0, 10);
      await clearSeatReservation(dateStr, lab, timeSlot, seatIndex);
      return await SeatCRUD.load(date, lab, timeSlot);
    } catch (error) {
      console.error("Error clearing seat reservation:", error);
      throw error;
    }
  },

  // Get all reservations for a date/lab/timeSlot (User mode: no user IDs shown)
  getReservations: (seatMap) => {
    const reservations = [];
    Object.entries(seatMap).forEach(([seatIndex, seat]) => {
      if (seat.status === 1) {
        reservations.push({
          seatIndex: parseInt(seatIndex),
          seatId: `S${parseInt(seatIndex) + 1}`,
          occupantName: seat.occupantName
          // Note: No user_id exposed to regular users
        });
      }
    });
    return reservations;
  },

  // Get available seat count
  getAvailableCount: (seatMap) => {
    const occupiedCount = Object.keys(seatMap).length;
    return totalSeats - occupiedCount;
  }
};


function formatDate(date) {
  return date.toLocaleDateString(undefined, {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export default function Reserve() {
  const { user } = useUser(); // Get current logged-in user
  const [currentDate, setCurrentDate] = useState(new Date(2025, 5, 14));
  const [selectedSeatIndex, setSelectedSeatIndex] = useState(null);
  const [infoOutput, setInfoOutput] = useState('');
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState("");

  // Fetch labs from server on mount
  useEffect(() => {
    async function fetchLabs() {
      try {
        console.log("Fetching labs..."); // Debug log
        const labsList = await getLabs();
        console.log("Labs fetched:", labsList); // Debug log
        
        if (labsList && labsList.length > 0) {
          const labIds = labsList.map(lab => lab.lab_id);
          console.log("Lab IDs:", labIds); // Debug log
          setLabs(labIds);
          setSelectedLab(labIds[0] || "");
        } else {
          console.log("No labs found or empty response");
          // Fallback to hardcoded labs if server fetch fails
          const fallbackLabs = ["GK210", "GK304A", "GK304B", "AG1804", "AG1904", "LS212", "LS229", "LS320", "LS335", "YG602"];
          console.log("Using fallback labs:", fallbackLabs);
          setLabs(fallbackLabs);
          setSelectedLab(fallbackLabs[0]);
        }
      } catch (error) {
        console.error("Error fetching labs:", error);
        // Fallback to hardcoded labs if server fetch fails
        const fallbackLabs = ["GK210", "GK304A", "GK304B", "AG1804", "AG1904", "LS212", "LS229", "LS320", "LS335", "YG602"];
        console.log("Using fallback labs due to error:", fallbackLabs);
        setLabs(fallbackLabs);
        setSelectedLab(fallbackLabs[0]);
      }
    }
    fetchLabs();
  }, []);

  // Generate time slots and set default
  const timeSlots = generateTimeSlots();
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(timeSlots[0]?.key || "");
  
  // Load seat data for current date, lab, and time slot
  const [seatData, setSeatData] = useState(() => ({ seats: initializeSeatMap() }));

  // User verification - this component should only be accessible by logged-in users
  if (!user) {
    return (
      <div style={{ 
        padding: "2rem", 
        textAlign: "center", 
        color: "#d32f2f",
        fontFamily: "Poppins, sans-serif"
      }}>
        <h2>Login Required</h2>
        <p>Please log in to access the seat reservation system.</p>
      </div>
    );
  }

  // Reset seat selection and load data when date, lab, or time slot changes
  useEffect(() => {
    setSelectedSeatIndex(null);
    setInfoOutput('');
    const loadData = async () => {
      try {
        const newData = await SeatCRUD.load(currentDate, selectedLab, selectedTimeSlot);
        setSeatData(newData);
      } catch (error) {
        console.error("Error loading seat data:", error);
        setSeatData({ seats: initializeSeatMap() });
      }
    };
    loadData();
  }, [currentDate, selectedLab, selectedTimeSlot]);

  // Build seat grid with aisle
  function buildSeatGrid() {
    const grid = [];
    let seatIndex = 0;
    for (let row = 1; row <= rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < seatsPerSide * 2 + 1; col++) {
        if (col === aisleColumn) {
          rowSeats.push({ type: 'aisle', key: `r${row}c${col}` });
        } else {
          const seatNumber = seatIndex + 1;
          const seatId = 'S' + seatNumber;
          rowSeats.push({ 
            type: 'seat', 
            seatId, 
            seatIndex,
            key: `r${row}c${col}`, 
            seatNumber 
          });
          seatIndex++;
        }
      }
      grid.push(rowSeats);
    }
    return grid;
  }
  
  const seatGrid = buildSeatGrid();

  function onSeatClick(seatIndex) {
    const availability = getSeatStatus(seatData.seats, seatIndex);
    const userId = getUserId(seatData.seats, seatIndex);
    
    // User mode restrictions:
    // 1. Cannot click blocked seats
    if (availability === -1) {
      return; // Do nothing for blocked seats
    }
    
    // 2. Can only click vacant seats or their own reservations
    if (availability === 1 && userId !== user.user_id) {
      // Show occupant name but don't allow interaction
      const occupantName = getOccupantName(seatData.seats, seatIndex);
      alert(`This seat is reserved by ${occupantName}.`);
      return;
    }
    
    // Allow selection only for vacant seats or user's own reservations
    setSelectedSeatIndex(seatIndex === selectedSeatIndex ? null : seatIndex);
  }

  function onActionClick() {
    if (selectedSeatIndex === null) {
      alert('Please select a seat first.');
      return;
    }
    
    const availability = getSeatStatus(seatData.seats, selectedSeatIndex);
    const userId = getUserId(seatData.seats, selectedSeatIndex);
    
    if (availability === 1 && userId === user.user_id) {
      // Remove user's own reservation
      SeatCRUD.clearReservation(currentDate, selectedLab, selectedTimeSlot, selectedSeatIndex)
        .then(newData => {
          setSeatData(newData);
          setSelectedSeatIndex(null);
          setInfoOutput('');
        })
        .catch(error => {
          console.error("Error clearing reservation:", error);
          alert("Failed to clear reservation. Please try again.");
        });
    } else if (availability === 0) {
      // Add reservation to vacant seat (user makes reservation for themselves)
      const useRealName = confirm(`Use your real name for reservation?\nUser: ${user.first_name} ${user.last_name}\n\nClick OK to use real name, Cancel for Anonymous`);
      
      const finalName = useRealName ? `${user.first_name} ${user.last_name}` : 'Anonymous';
      
      SeatCRUD.updateReservation(currentDate, selectedLab, selectedTimeSlot, selectedSeatIndex, 1, finalName, user.user_id)
        .then(newData => {
          setSeatData(newData);
          setSelectedSeatIndex(null);
          setInfoOutput('');
        })
        .catch(error => {
          console.error("Error adding reservation:", error);
          alert("Failed to add reservation. Please try again.");
        });
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
    const count = SeatCRUD.getAvailableCount(seatData.seats);
    const selectedSlot = timeSlots.find(slot => slot.key === selectedTimeSlot);
    setInfoOutput(`Available seats for ${formatDate(currentDate)} (${selectedSlot?.display}): ${count}`);
  }

  function onShowOccupants() {
    const reservations = SeatCRUD.getReservations(seatData.seats);
    const selectedSlot = timeSlots.find(slot => slot.key === selectedTimeSlot);
    
    if (reservations.length === 0) {
      setInfoOutput(`No Occupants For ${formatDate(currentDate)} (${selectedSlot?.display}).`);
    } else {
      const list = reservations.map((r) => {
        // User mode: Only show occupant names, no student IDs
        return `Seat ${r.seatId}: ${r.occupantName}`;
      }).join('\n');
      setInfoOutput(`Occupants For ${formatDate(currentDate)} (${selectedSlot?.display}):\n${list}`);
    }
  }

  function getSeatClass(seatIndex) {
    const availability = getSeatStatus(seatData.seats, seatIndex);
    const userId = getUserId(seatData.seats, seatIndex);
    
    if (availability === -1) return 'seat user-blocked';
    if (availability === 1) {
      // Different styling for user's own reservation vs others
      if (userId === user.user_id) {
        return 'seat user-own-reservation';
      } else {
        return 'seat user-other-reservation';
      }
    }
    if (selectedSeatIndex === seatIndex) return 'seat selected';
    return 'seat';
  }

  function getAriaPressed(seatIndex) {
    if (selectedSeatIndex === seatIndex) return 'true';
    return 'false';
  }

  function getSeatBackgroundColor(seatIndex) {
    const availability = getSeatStatus(seatData.seats, seatIndex);
    const userId = getUserId(seatData.seats, seatIndex);
    
    if (availability === -1) return '#ccc'; // blocked
    if (availability === 1) {
      if (userId === user.user_id) {
        return '#00703c'; // user's own reservation (green)
      } else {
        return '#f44336'; // other user's reservation (red)
      }
    }
    if (selectedSeatIndex === seatIndex) return '#e0e0e0'; // selected
    return '#e0e0e0'; // vacant
  }

  function getSeatBorderColor(seatIndex) {
    const availability = getSeatStatus(seatData.seats, seatIndex);
    const userId = getUserId(seatData.seats, seatIndex);
    
    if (availability === 1) {
      if (userId === user.user_id) {
        return '2px solid #00703c'; // user's own reservation
      } else {
        return '1px solid #f44336'; // other user's reservation
      }
    }
    if (selectedSeatIndex === seatIndex) return '2px solid #00703c';
    return '1px solid #ccc';
  }

  function canClickSeat(seatIndex) {
    const availability = getSeatStatus(seatData.seats, seatIndex);
    const userId = getUserId(seatData.seats, seatIndex);
    
    // Cannot click blocked seats
    if (availability === -1) return false;
    
    // Can click vacant seats
    if (availability === 0) return true;
    
    // Can click own reservations, but not others'
    if (availability === 1 && userId === user.user_id) return true;
    
    return false;
  }

  return (
    <div style={{ minHeight: "100vh", background: "#f5f7fa", padding: 0, margin: 0 }}>
      <div className="card">
        <div className="header">
          <div className="title">Seat Reservation Portal</div>
          {user && (
            <div style={{ fontSize: "0.9rem", color: "#00703c", fontWeight: 500 }}>
              User: {user.first_name} {user.last_name} (ID: {user.user_id})
            </div>
          )}
          <button
            className="closeBtn"
            aria-label="Close Seat Availability Page"
            onClick={() => alert('Close')}
            onMouseOver={e => (e.currentTarget.style.color = "#00703c")}
            onMouseOut={e => (e.currentTarget.style.color = "#888")}
          >
            &times;
          </button>
        </div>

        <div className="date-nav">
          <button className="date-btn" aria-label="Previous Day" onClick={onPrevDate}>
            &larr;
          </button>
          <div style={{ minWidth: 220, textAlign: "center", fontWeight: 500, fontSize: "1.1rem", letterSpacing: "0.5px" }}>
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
          <button className="date-btn" aria-label="Next Day" onClick={onNextDate}>
            &rarr;
          </button>
        </div>

        <div className="selector-container">
          <select
            value={selectedLab}
            onChange={e => setSelectedLab(e.target.value)}
            aria-label="Select Laboratory"
          >
            {labs.length === 0 && <option value="">Loading labs...</option>}
            {labs.map(lab => {
              console.log("Rendering lab option:", lab); // Debug log
              return <option key={lab} value={lab}>{lab}</option>;
            })}
          </select>
          
          <select
            value={selectedTimeSlot}
            onChange={e => setSelectedTimeSlot(e.target.value)}
            aria-label="Select Time Slot"
          >
            {timeSlots.map(slot => (
              <option key={slot.key} value={slot.key}>{slot.display}</option>
            ))}
          </select>
        </div>
        
        <div
          className="seats"
          aria-label="Seats"
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
              
              const seatIndex = cell.seatIndex;
              const availability = getSeatStatus(seatData.seats, seatIndex);
              const seatClass = getSeatClass(seatIndex);
              const isBlocked = availability === -1;
              const isReserved = availability === 1;
              const userId = getUserId(seatData.seats, seatIndex);
              const isOwnReservation = isReserved && userId === user.user_id;
              const occupantName = isReserved ? getOccupantName(seatData.seats, seatIndex) : '';
              const clickable = canClickSeat(seatIndex);

              return (
                <div
                  key={cell.key}
                  role="button"
                  tabIndex={clickable ? 0 : -1}
                  aria-pressed={getAriaPressed(seatIndex)}
                  aria-label={`Seat ${cell.seatId}${isBlocked ? ', blocked' : ''}${isReserved ? `, reserved` : ''}`}
                  title={
                    isBlocked
                      ? `Seat ${cell.seatId} is blocked`
                      : isReserved && occupantName
                      ? isOwnReservation
                        ? `Your reservation: ${occupantName}`
                        : `Reserved by ${occupantName}`
                      : `Seat ${cell.seatId} - Available`
                  }
                  className={seatClass}
                  style={{
                    width: 40,
                    height: 40,
                    backgroundColor: getSeatBackgroundColor(seatIndex),
                    color: isBlocked || isReserved ? '#fff' : '#222',
                    borderRadius: 6,
                    border: getSeatBorderColor(seatIndex),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: isReserved || selectedSeatIndex === seatIndex ? 700 : 500,
                    outline: 'none',
                    transition: 'background 0.2s, border 0.2s',
                    cursor: clickable ? 'pointer' : isBlocked ? 'not-allowed' : 'default',
                    opacity: isBlocked ? 0.6 : 1,
                  }}
                  onClick={() => clickable && onSeatClick(seatIndex)}
                  onKeyDown={(e) => {
                    if ((e.key === ' ' || e.key === 'Enter') && clickable) {
                      e.preventDefault();
                      onSeatClick(seatIndex);
                    }
                  }}
                >
                  {cell.seatNumber}
                </div>
              );
            })
          )}
        </div>

        <div className="legend" aria-label="Seat Legend">
          <div>
            <span className="legend-box" style={{ backgroundColor: "#e0e0e0" }}></span> Available
          </div>
          <div>
            <span className="legend-box" style={{ backgroundColor: "#00703c" }}></span> Your Reservation
          </div>
          <div>
            <span className="legend-box" style={{ backgroundColor: "#f44336" }}></span> Reserved by Others
          </div>
          <div>
            <span className="legend-box" style={{ backgroundColor: "#ccc" }}></span> Blocked
          </div>
        </div>

        <div style={{ width: "100%", textAlign: "center", marginBottom: 12 }}>
          <button className="dataBtn" onClick={onShowAvailableSeats}>
            Show Available Seats
          </button>
          <button className="dataBtn" onClick={onShowOccupants}>
            Show Occupants
          </button>
          <div className="info-output">
            {infoOutput}
          </div>
          <div style={{fontSize: "0.8rem", color: "#666", marginTop: 8}}>
            💡 User Mode: Select available seats or your own reservations
            <div style={{color: "#00703c", marginTop: 4}}>
              📝 You can only manage your own reservations
            </div>
          </div>
        </div>

        <button
          className="actionBtn"
          aria-label={
            selectedSeatIndex !== null 
              ? getSeatStatus(seatData.seats, selectedSeatIndex) === 1
                ? 'Remove Your Reservation'
                : 'Make Reservation'
              : 'Select a seat first'
          }
          onClick={onActionClick}
          disabled={selectedSeatIndex === null}
          style={{
            backgroundColor: selectedSeatIndex === null ? "#999" : "#00703c",
            cursor: selectedSeatIndex === null ? "not-allowed" : "pointer",
          }}
        >
          {selectedSeatIndex !== null 
            ? getSeatStatus(seatData.seats, selectedSeatIndex) === 1
              ? 'Remove Reservation'
              : 'Make Reservation'
            : 'Select Seat'
          }
        </button>
      </div>
    </div>
  );
}