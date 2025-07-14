import { useNavigate } from 'react-router-dom';
import { useUser } from './UserContext';
import { useState, useEffect } from "react"
import profile from './profile.png';
import './UserProfile.css';
import { FaEdit } from "react-icons/fa";
import { getUser, getUserReservations } from "./api";
import { Table, Spin, Alert } from 'antd';


function UserProfile() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const description =
    user?.user_description ||
    "No description set. Edit your profile to add a description.";

  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      try {
        const data = await getUserReservations(user.user_id);
        const transformed = data.map((reservation, idx) => ({
          key: `${reservation.date}-${reservation.lab}-${reservation.timeSlot}-${reservation.seatIndex}`,
          date: reservation.date,
          lab: reservation.lab,
          timeSlot: reservation.timeSlot,
          seat: reservation.seatId,
          occupantName: reservation.occupantName || '',
        }));
        setReservations(transformed);
      } catch (err) {
        setError('Failed to load reservations.');
      } finally {
        setLoading(false);
      }
    };
    fetchReservations();
  }, [user]);

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
        <p className="id-holder">VIEWING USER WITH ID: {user.user_id}</p>
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
        <p className="user-role">{user.user_role}</p>
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
            {user.user_description}
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
        {/* Mini-table of reservations under description */}
        <div style={{ marginTop: 0, width: '100%' }}>
          <h3 style={{ color: '#00703c', marginBottom: 12 }}>My Reservations</h3>
          {loading ? (
            <Spin tip="Loading reservations..." />
          ) : error ? (
            <Alert type="error" message={error} />
          ) : (
            <Table
              columns={[
                { title: 'Date', dataIndex: 'date', key: 'date' },
                { title: 'Lab', dataIndex: 'lab', key: 'lab' },
                { title: 'Time Slot', dataIndex: 'timeSlot', key: 'timeSlot' },
                { title: 'Seat', dataIndex: 'seat', key: 'seat' },
                { title: 'Name', dataIndex: 'occupantName', key: 'occupantName' },
              ]}
              dataSource={reservations}
              pagination={false}
              size="small"
              locale={{ emptyText: 'No reservations found.' }}
              style={{ background: '#fff', borderRadius: 8 }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default UserProfile;