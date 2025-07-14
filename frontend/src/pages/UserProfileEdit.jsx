import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { updateUser } from './api';
import profile from './profile.png';
import './UserProfile.css';

export default function UserProfileEdit() {
  const navigate = useNavigate();
  const { user, updateUser: updateUserContext } = useUser();
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize form with user data
  useEffect(() => {
    if (user) {
      setFirstName(user.first_name || "");
      setLastName(user.last_name || "");
      setDescription(user.user_description || "");
    }
  }, [user]);

  // TODO: Fetch actual reservations from database based on user ID
  const reservations = user?.reservations || [
    'GK302A – June 20, 2025 | 0730 - 1000',
    'GK302B – July 4, 2025 | 1230 - 1415',
    'AG1707 – July 21, 2025 | 0900 - 1030',
    'AG1902 – July 29, 2025 | 1600 - 1830',
  ];

  function handleImageEdit() {
    alert('Editing profile image!');
  }

  async function handleSave(e) {
    e.preventDefault();
    
    if (!firstName || !lastName) {
      setError("First name and last name are required.");
      setSuccess("");
      return;
    }

    try {
      // Update user in MongoDB using the MongoDB _id
      // Only send the fields that are being edited to prevent overwriting other data
      const updateData = {
        first_name: firstName,
        last_name: lastName,
        user_description: description
      };

      await updateUser(user._id, updateData);
      
      // Update local user context with the new data while preserving existing fields
      updateUserContext({
        ...user, // Preserve all existing user data
        first_name: firstName,
        last_name: lastName,
        user_description: description
      });

      setSuccess("Profile updated successfully!");
      setError("");
      
      // Redirect back to profile after 1.5 seconds
      setTimeout(() => navigate("/userprofile"), 1500);
    } catch (error) {
      console.error("Error updating profile:", error);
      setError("Failed to update profile. Please try again.");
      setSuccess("");
    }
  }

  if (!user) {
    return (
      <div className="userprofile-container">
        <div className="profile-page">
          <h2>Please log in to edit your profile.</h2>
        </div>
      </div>
    );
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
            placeholder='First Name'
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
            required
          />
          <input
            type="text"
            value={lastName}
            placeholder='Last Name'
            onChange={e => setLastName(e.target.value)}
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
            required
          />
          <div style={{
            margin: '8px auto',
            fontSize: '1rem',
            textAlign: 'center',
            color: '#666',
            fontFamily: 'Poppins, sans-serif'
          }}>
            Role: {user.user_role} | ID: {user.user_id}
          </div>
          <textarea
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder='Enter description here'
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
          
          {error && <div style={{ color: "red", marginBottom: 8 }}>{error}</div>}
          {success && <div style={{ color: "green", marginBottom: 8 }}>{success}</div>}
          
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
            type='submit'
          >
            Save Changes
          </button>
        </form>
        
        <div className="reservations-box">
          <strong>Current Reservations:</strong>
          <ul>
            {reservations.map((r, i) => (
              <li key={i}>{r}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}