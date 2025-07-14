import React, { useEffect, useState } from "react";
import { Table } from "antd";
import ProfileOverlay from "../components/ProfileOverlay";
import "./Tabular.css";
import { getUsers } from "./api"

const columns = [
  { title: "Firstname", dataIndex: "first_name", key: "first_name" },
  { title: "Lastname", dataIndex: "last_name", key: "last_name"},
  { title: "ID Number", dataIndex: "user_id", key: "user_id" },
  { title: "Role", dataIndex: "user_role", key: "user_role" }
];

export default function ViewUsers() {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        console.error("Error fetching users: ", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUsers();
  }, []);

  const handleShowReservations = () => {
    alert(`Show reservations for ${selectedUser.first_name}`);
  };
  const handleEditReservations = () => {
    alert(`Edit reservations for ${selectedUser.first_name}`);
  };

  // Add search bar
  return (
    <div className="tabular-container">
      <Table
        columns={columns}
        dataSource={users}
        loading={loading}
        onRow={record => ({
          onClick: () => setSelectedUser(record),
          style: { cursor: "pointer" },
        })}
        pagination={false}
        rowClassName={() => "clickable-row"}
        className="tabular-table"
      />
      {selectedUser && (
        <ProfileOverlay
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onShowReservations={handleShowReservations}
          onEditReservations={handleEditReservations}
        />
      )}
    </div>
  );
}