import React, { useState } from "react";
import { Table } from "antd";
import ProfileOverlay from "../components/ProfileOverlay";
import "./Tabular.css";

const users = [
  {
    key: "1",
    name: "Juan Dela Cruz",
    role: "Student",
    description: "College of Computer Studies Powerhouse.",
    idNumber: "12323456",
    lastLoggedIn: "2025-06-17",
    section: "S12A",
  },
  {
    key: "2",
    name: "Carlos Yulo",
    role: "Technician",
    description: "System administrator and faculty.",
    idNumber: "65432123",
    lastLoggedIn: "2025-06-15",
    section: "Admin",
  },
  {
    key: "3",
    name: "Jose Rizal",
    role: "Student",
    description: "National hero and polymath.",
    idNumber: "98765432",
    lastLoggedIn: "2025-06-14",
    section: "S12B",
  },
  {
    key: "4",
    name: "Andres Bonifacio",
    role: "Student",
    description: "Father of the Philippine Revolution.",
    idNumber: "12345678",
    lastLoggedIn: "2025-06-13",
    section: "S12C",
  },
  {
    key: "5",
    name: "Emilio Aguinaldo",
    role: "Student",
    description: "First President of the Philippines.",
    idNumber: "11223344",
    lastLoggedIn: "2025-06-12",
    section: "S12D",
  },
];

const columns = [
  { title: "Username", dataIndex: "name", key: "name" },
  { title: "ID Number", dataIndex: "idNumber", key: "idNumber" },
  { title: "Last Logged In", dataIndex: "lastLoggedIn", key: "lastLoggedIn" },
  { title: "Section", dataIndex: "section", key: "section" },
  { title: "Role", dataIndex: "role", key: "role" },
];

export default function ViewUsers() {
  const [selectedUser, setSelectedUser] = useState(null);

  const handleShowReservations = () => {
    alert(`Show reservations for ${selectedUser.name}`);
  };
  const handleEditReservations = () => {
    alert(`Edit reservations for ${selectedUser.name}`);
  };

  return (
    <div className="tabular-container">
      <Table
        columns={columns}
        dataSource={users}
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