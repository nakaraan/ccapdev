import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import profile from './profile.png';
import './UserProfile.css';
import { FaEdit } from "react-icons/fa";

function UserProfile() {
  const navigate = useNavigate();
  const { user } = useUser();

  const description =
    user?.description ||
    "No description set. Edit your profile to add a description.";
  const reservations = user?.reservations || [
    'GK302A – June 20, 2025 | 0730 - 1000',
    'GK302B – July 4, 2025 | 1230 - 1415',
    'AG1707 – July 21, 2025 | 0900 - 1030',
    'AG1902 – July 29, 2025 | 1600 - 1830',
  ];

  if (!user) {
    return (
      <div className="userprofile-container">
        <div className="profile-page">
          <h2>Please log in to view your profile.</h2>
        </div>
      </div>
    );
  }

  function handleEditProfile() {
    navigate('/userprofile-edit');
  }

  return (
    <div className="userprofile-container">
      <div className="profile-page">
        <p className="id-holder">VIEWING USER WITH ID: {user.id}</p>
        <img
          src={profile}
          className="profile-picture large"
          alt="Profile"
          style={{
            maxWidth: "100%",
            width: 150,
            height: 150,
            marginTop: 15,
            marginBottom: 5,
            borderRadius: "50%",
            objectFit: "cover",
            border: "1px solid #ebebeb"
          }}
        />
        <h2 className="username">{user.name}</h2>
        <p className="user-role">{user.role}</p>
        <div
          style={{
            display: "flex",
            width: "100%",
            alignItems: "center",
            marginBottom: 30,
          }}
        >
          <div
            className="description-box"
            style={{
              flex: 1,
              marginRight: 10,
              minWidth: 0,
              wordBreak: "break-word",
              fontSize: "1rem",
              background: "#f5f5f5",
              borderRadius: 8,
              padding: "12px 16px",
              border: "1px solid #e0e0e0",
            }}
          >
            {description}
          </div>
          <button
            onClick={handleEditProfile}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              padding: 0,
              display: "flex",
              alignItems: "center",
            }}
            aria-label="Edit Description"
          >
            <FaEdit size={30} style={{ marginLeft: "10px", marginBottom: "10px" }} color="#00703c" />
          </button>
        </div>
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

export default UserProfile;