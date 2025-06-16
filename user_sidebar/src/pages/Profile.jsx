import React from 'react';
import './Profile.css';

function Profile() {
  return (
    <div className="profile-container">
      <div className="profile-card">
        {/* Left Section */}
        <div className="profile-left">
          <div className="profile-picture"></div>
          <h2 className="profile-name">Name</h2>
          <p className="profile-role">Role</p>
          <p className="profile-description">Description</p>
          <button className="profile-btn">Edit Profile</button>
        </div>

        {/* Right Section */}
        <div className="profile-right">
          <button className="action-btn">Current Reservations</button>
          <div className="scrollable-box">
            <p>Reservation History</p>
          </div>
          <button className="action-btn">Delete Account</button>
          <button className="profile-btn logout">Log Out</button>
        </div>
      </div>
    </div>
  );
}

export default Profile;