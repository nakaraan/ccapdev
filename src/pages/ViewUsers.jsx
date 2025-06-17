// src/pages/ViewUsers.jsx
import { Input, Table, Button } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Tabular.css';

const { Search } = Input;

const columns = [
  { title: 'Username', dataIndex: 'username', key: 'username' },
  { title: 'ID Number', dataIndex: 'id', key: 'id' },
  { title: 'Last Logged In', dataIndex: 'lastLogin', key: 'lastLogin' },
  { title: 'Section', dataIndex: 'section', key: 'section' },
  { title: 'Role', dataIndex: 'role', key: 'role' },
];

// sample data
const data = [
  {
    key: '1',
    username: 'juan_cruz',
    id: '12323456',
    lastLogin: '2025-06-17',
    section: 'S12A',
    role: 'Student',
  },
];

function ViewUsers() {
  const [filteredData, setFilteredData] = useState(data);
  const navigate = useNavigate();

  const onSearch = (value) => {
    const lower = value.toLowerCase();
    const filtered = data.filter((item) =>
      Object.values(item).some(val =>
        String(val).toLowerCase().includes(lower)
      )
    );
    setFilteredData(filtered);
  };

  const handleRowClick = (record) => {
    navigate(`/users/${record.id}`);
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
    <Search
      placeholder="Search"
      allowClear
      enterButton={
        <Button style={{ backgroundColor: '#00703c', color: '#fff' }}>
          Search
        </Button>
      }
      onSearch={onSearch}
      style={{ marginBottom: 16, maxWidth: 300 }}
    />
      <Table
        columns={columns}
        dataSource={filteredData}
        onRow={(record) => ({
          onClick: () => handleRowClick(record),
        })}
        rowClassName={() => 'clickable-row'}
        pagination={false}
      />
    </div>
  );
}

export default ViewUsers;
