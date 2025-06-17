import { Table, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import './Tabular.css';
import { Overlay } from '../components/Overlay';
import AvailabilityPreview from '../components/SeatPreview';

const columns = [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Lab', dataIndex: 'lab', key: 'lab' },
  { title: 'Seat', dataIndex: 'seat', key: 'seat' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <Button
        style={{ background: '#00703c', color: '#fff' }}
        onClick={() => record.onView(record)}
      >
        View
      </Button>
    ),
  },
];

// SAMPLE DATA
const data = [
  {
    key: '1',
    date: '2025-06-18',
    lab: 'Computer Lab A',
    seat: '3',
    status: 'Confirmed',
  },
  {
    key: '2',
    date: '2025-06-20',
    lab: 'Computer Lab B',
    seat: '6',
    status: 'Confirmed',
  },
];

export default function Reservations() {
  const navigate = useNavigate();
  const [previewReservation, setPreviewReservation] = useState(null);

  const tableData = data.map((row) => ({
    ...row,
    onView: () => setPreviewReservation(row),
  }));

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ color: '#00703c', marginBottom: 24 }}>My Reservations</h1>
      <Table
        columns={columns}
        dataSource={tableData}
        rowClassName={() => 'clickable-row'}
        pagination={false}
        style={{ background: '#fff', borderRadius: 12 }}
      />
      <Overlay isOpen={!!previewReservation} onClose={() => setPreviewReservation(null)}>
        {previewReservation && (
          <AvailabilityPreview
            reservation={previewReservation}
            onClose={() => setPreviewReservation(null)}
          />
        )}
      </Overlay>
    </div>
  );
}