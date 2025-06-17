import { useState } from 'react';
import profile from './profile.png';
import './UserProfile.css';

export default function UserProfileEdit() {
  // Example state; replace with real user data as needed
  const [name, setName] = useState('Name');
  const [role, setRole] = useState('Student');
  const [description, setDescription] = useState('Description');
  const [reservations, setReservations] = useState([
    'GK302A – June 20, 2025 | 0730 - 1000',
    'GK302B – July 4, 2025 | 1230 - 1415',
    'AG1707 – July 21, 2025 | 0900 - 1030',
    'AG1902 – July 29, 2025 | 1600 - 1830',
  ]);

  function handleImageEdit() {
    alert('Edit profile image clicked!');
  }

  function handleSave() {
    alert('Profile saved!');
    // Implement save logic here
  }

  return (
    <div className="userprofile-container">
      <div className="profile-page">
        <div style={{ position: 'relative', display: 'inline-block' }}>
          <img src={profile} className="profile-picture" alt="Profile" />
          <button
            onClick={handleImageEdit}
            style={{
              position: 'absolute',
              top: 8,
              right: 8,
              background: '#00703c',
              color: '#fff',
              border: 'none',
              borderRadius: '50%',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 22,
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}
            title="Edit profile picture"
          >
            +
          </button>
        </div>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          style={{
            display: 'block',
            margin: '16px auto 8px auto',
            fontSize: '1.5rem',
            fontWeight: 600,
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '4px 12px',
            fontFamily: 'Poppins, sans-serif'
          }}
        />
        <input
          type="text"
          value={role}
          onChange={e => setRole(e.target.value)}
          style={{
            display: 'block',
            margin: '0 auto 16px auto',
            fontSize: '1rem',
            textAlign: 'center',
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '2px 10px',
            fontFamily: 'Poppins, sans-serif'
          }}
        />
        <textarea
          value={description}
          onChange={e => setDescription(e.target.value)}
          style={{
            width: '100%',
            minHeight: 60,
            border: '1px solid #ccc',
            borderRadius: 6,
            padding: '8px',
            fontFamily: 'Poppins, sans-serif',
            marginBottom: 16
          }}
        />
        <div className="reservations-box">
          <strong>Current Reservations:</strong>
          <ul>
            {reservations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
        <button
          style={{
            background: "#00703c",
            color: "#fff",
            border: "none",
            borderRadius: "6px",
            padding: "8px 20px",
            fontSize: "1rem",
            fontFamily: "Poppins, sans-serif",
            marginTop: "20px",
            cursor: "pointer"
          }}
          onClick={handleSave}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}