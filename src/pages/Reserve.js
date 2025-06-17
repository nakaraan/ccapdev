import './style.css'; // Optional: if you have separate CSS for styling

const SeatAvailability = () => {
  return (
    <div className="container" role="region" aria-label="Seat Availability Page">
      <div className="header">
        <div className="title">Seat Availability</div>
        <button className="closeBtn" aria-label="Close Seat Availability Page">
          &times;
        </button>
      </div>

      <div className="date-nav">
        <button className="date-prev" aria-label="Previous Day">
          &larr;
        </button>
        <div className="date" aria-live="polite" aria-atomic="true"></div>
        <button className="date-next" aria-label="Next Day">
          &rarr;
        </button>
      </div>

      <div className="seats" aria-label="Seats"></div>

      <div className="legend" aria-label="Seat Legend">
        <div>
          <span className="legend-box available"></span> Available
        </div>
        <div>
          <span className="legend-box reserved"></span> Reserved
        </div>
        <div>
          <span className="legend-box blocked"></span> Blocked
        </div>
      </div>

      <div className="data" style={{ marginBottom: '20px', textAlign: 'center' }}>
        <button id="availableSeatsBtn" style={{ marginRight: '10px' }}>
          Show Available Seats
        </button>
        <button id="occupantsBtn" style={{ marginLeft: '10px' }}>
          Show Occupants
        </button>
        <div
          id="infoOutput"
          style={{
            marginTop: '10px',
            fontSize: '1rem',
            color: '#333',
            whiteSpace: 'pre-wrap',
          }}
        ></div>
      </div>

      <button className="actionBtn" aria-label="Add Selected Seat" disabled>
        Add
      </button>
    </div>
  );
};

export default SeatAvailability;