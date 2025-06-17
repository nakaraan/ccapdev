import { useParams } from 'react-router-dom';
import profile from './profile.png';
import './UserProfile.css';

function UserProfile() {
  const { userId } = useParams();

  return (
    <div className="userprofile-container">
      <div className="profile-page">
        <p>VIEWING USER WITH ID: {userId}</p>
        <img src={profile} className="profile-picture" />
        <h2 className="username">Name</h2>
        <p className="user-role">Student</p>

        <div className="description-box">Description</div>

        <div className="reservations-box">
          <strong>Current Reservations:</strong>
          <ul>
            <li>GK302A – June 20, 2025 | 0730 - 1000</li>
            <li>GK302B – July 4, 2025 | 1230 - 1415</li>
            <li>AG1707 – July 21, 2025 | 0900 - 1030</li>
            <li>AG1902 – July 29, 2025 | 1600 - 1830</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
