import React, { useState } from 'react';
import './Profile.css';

// Sample data
const sampleData = [
  { id: 1, user: "test_user", date: "2025-06-20", time: "10:00", seat: "A1" },
  { id: 2, user: "other_user", date: "2025-06-22", time: "14:30", seat: "B2" }
];

// Mock user (replace with real props later)
const mockUser = {
  username: 'test_user',
  role: 'user', // change to 'admin' to test admin view
  description: 'CS Student',
  profilePic: 'https://i.pravatar.cc/150?u=test_user'
};

function Profile({ user = mockUser }) {
  const [reservations, setReservations] = useState(sampleData);
  const [editId, setEditId] = useState(null);
  const [formData, setFormData] = useState({ date: '', time: '', seat: '' });

  const isAdmin = user.role === 'admin';

  const filteredReservations = isAdmin
    ? reservations
    : reservations.filter(res => res.user === user.username);

  const handleEdit = (res) => {
    setEditId(res.id);
    setFormData({ date: res.date, time: res.time, seat: res.seat });
  };

  const saveEdit = (id) => {
    setReservations(prev =>
      prev.map(res => res.id === id ? { ...res, ...formData } : res)
    );
    setEditId(null);
  };

  const deleteReservation = (id) => {
    setReservations(prev => prev.filter(res => res.id !== id));
  };

  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Left Section */}
        <div className="profile-left">
          <div
            className="profile-picture"
            style={{ backgroundImage: `url(${user.profilePic})` }}
          ></div>
          <h2 className="profile-name">{user.username}</h2>
          <p className="profile-role">{user.role}</p>
          <p className="profile-description">{user.description}</p>
          <button className="profile-btn">Edit Profile</button>
        </div>

        {/* Right Section */}
        <div className="profile-right">
          <h3 style={{ marginBottom: '10px' }}>
            {isAdmin ? 'All Reservations' : 'Your Reservations'}
          </h3>

          {filteredReservations.map(res => (
            <div key={res.id} className="reservation-card">
              {editId === res.id ? (
                <>
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
                    value={formData.seat}
                    onChange={(e) => setFormData({ ...formData, seat: e.target.value })}
                    placeholder="Seat"
                  />
                  <button onClick={() => saveEdit(res.id)}>Save</button>
                  <button onClick={() => setEditId(null)}>Cancel</button>
                </>
              ) : (
                <>
                  <p><strong>User:</strong> {res.user}</p>
                  <p><strong>Date:</strong> {res.date}</p>
                  <p><strong>Time:</strong> {res.time}</p>
                  <p><strong>Seat:</strong> {res.seat}</p>

                  {(isAdmin || res.user === user.username) && (
                    <button onClick={() => handleEdit(res)}>Edit</button>
                  )}
                  {isAdmin && (
                    <button onClick={() => deleteReservation(res.id)}>Delete</button>
                  )}
                </>
              )}
            </div>
          ))}

          <div style={{ marginTop: '20px' }}>
            {!isAdmin && (
              <>
                <button className="reserve-history">Reservation History</button>
                <button className="action-btn">Delete Account</button>
              </>
            )}
            <button className="profile-btn logout">Log Out</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
