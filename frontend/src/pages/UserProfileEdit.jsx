import { useState } from 'react';
import { getUser, updateUser } from './api';
import profile from './profile.png';
import './UserProfile.css';

export default function UserProfileEdit() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  // const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [reservations] = useState([
    'GK302A – June 20, 2025 | 0730 - 1000',
    'GK302B – July 4, 2025 | 1230 - 1415',
    'AG1707 – July 21, 2025 | 0900 - 1030',
    'AG1902 – July 29, 2025 | 1600 - 1830',
  ]); // remove
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  function handleImageEdit() {
    alert('Editing profile image!');
  }

  async function handleSave(e) {
    e.preventDefault();
        if (!firstName || !lastName || !description) {
          setError("All fields are required.");
          setSuccess("");
          return;
        }

        const token = sessionStorage.getItem("User")
        const user = await getUser(token)
    
        // Register user in MongoDB
        let userObject = {
          first_name: firstName,
          last_name: lastName,
          user_description: description
        };
    
        await updateUser(user._id, userObject);
        setSuccess("Registration successful! You may now log in.");
        setError("");
        setTimeout(() => navigate("/"), 1200);
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
        <form className='edit-profile' onSubmit={handleSave}>
          <input
            type="text"
            value={firstName}
            placeholder='Firstname'
            onChange={e => setFirstName(e.target.value)}
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
            value={lastName}
            placeholder='Lastname'
            onChange={e => setLastName(e.target.value)}
            style={{
              display: 'block',
              margin: '16px auto 8px auto', // '0 auto 16px auto',
              fontSize: '1.5rem', // '1rem',
              fontWeight: 600,
              textAlign: 'center',
              border: '1px solid #ccc',
              borderRadius: 6,
              padding: '4px 12px', // '2px 10px',
              fontFamily: 'Poppins, sans-serif'
            }}
          />
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Input description here'
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
        </form>
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
          className='save-edit'
          type='submit'
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}