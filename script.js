const { useState } = React;

const sampleData = [
  { id: 1, user: "kharlene", date: "2025-06-20", time: "10:00", seat: "A1" },
];

function App() {
  const [role, setRole] = useState("user"); // or "admin"
  const [reservations, setReservations] = useState(sampleData);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ date: "", time: "", seat: "" });

  const currentUser = "kharlene";

  const handleEdit = (res) => {
    setEditId(res.id);
    setFormData({ date: res.date, time: res.time, seat: res.seat });
  };

  const saveEdit = (id) => {
    setReservations(reservations.map(res =>
      res.id === id ? { ...res, ...formData } : res
    ));
    setEditId(null);
  };

  const deleteReservation = (id) => {
    setReservations(reservations.filter(res => res.id !== id));
  };

  const filteredReservations = role === "admin"
    ? reservations
    : reservations.filter(res => res.user === currentUser);

  return (
    <div>
      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button onClick={() => setRole("user")}>User</button>
        <button onClick={() => setRole("admin")}>Admin</button>
      </div>

      {filteredReservations.map(res => (
        <div key={res.id} className="reservation">
          {editId === res.id ? (
            <div>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
              <input
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
              />
              <input
                type="text"
                placeholder="Seat"
                value={formData.seat}
                onChange={(e) => setFormData({ ...formData, seat: e.target.value })}
              />
              <button onClick={() => saveEdit(res.id)}>Save</button>
              <button onClick={() => setEditId(null)}>Cancel</button>
            </div>
          ) : (
            <>
              <p><strong>User:</strong> {res.user}</p>
              <p><strong>Date:</strong> {res.date}</p>
              <p><strong>Time:</strong> {res.time}</p>
              <p><strong>Seat:</strong> {res.seat}</p>

              {(role === "admin" || res.user === currentUser) && (
                <button onClick={() => handleEdit(res)}>Edit</button>
              )}
              {role === "admin" && (
                <button onClick={() => deleteReservation(res.id)}>Delete</button>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<App />);