import { Link } from "react-router-dom";

export default function Reservations() {
  // Replace with real data/fetching
  const reservations = [
    { id: 1, date: "2025-06-18", lab: "Computer Lab A" },
    { id: 2, date: "2025-06-20", lab: "Computer Lab B" },
  ];

  return (
    <div>
      <h2>My Reservations</h2>
      <Link to="/reserve">Book a Reservation</Link>
      <ul>
        {reservations.map(r => (
          <li key={r.id}>
            {r.date} - {r.lab}
            <Link to={`/reservations/${r.id}`}>View Seats</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}