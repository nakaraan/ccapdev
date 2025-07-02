import { Table, Button, Popconfirm, message } from 'antd';
import { useState } from 'react';
import './Tabular.css';
import { Overlay } from '../components/Overlay';
import AvailabilityPreview from '../components/SeatPreview';

const columns = (onEdit, onDelete) => [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Lab', dataIndex: 'lab', key: 'lab' },
  { title: 'Seat', dataIndex: 'seat', key: 'seat' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Button
          style={{
            background: '#00703c',
            color: '#fff',
            paddingLeft: 0,
            paddingRight: 16,
          }}
          onClick={e => {
            e.stopPropagation();
            onEdit(record);
          }}
        >
          Edit
        </Button>
        <Popconfirm
          title="Are you sure you want to delete this reservation?"
          onConfirm={e => {
            e.stopPropagation();
            onDelete(record);
          }}
          onCancel={e => e.stopPropagation()}
          okText="Yes"
          cancelText="No"
        >
          <Button
            style={{
              background: '#d32f2f',
              color: '#fff',
              paddingLeft: 0,
              paddingRight: 16,
            }}
            onClick={e => e.stopPropagation()}
          >
            Delete
          </Button>
        </Popconfirm>
      </div>
    ),
  },
];

// SAMPLE DATA
const initialData = [
  {
    key: '1',
    date: '2025-06-18',
    lab: 'AG1904',
    seat: '3',
    status: 'Confirmed',
  },
  {
    key: '2',
    date: '2025-06-20',
    lab: 'GK210',
    seat: '6',
    status: 'Confirmed',
  },
  { key: '3',
    date: '2025-06-22',
    lab: 'GK302',
    seat: '12',
    status: 'Confirmed',
  },
  { key: '4',
    date: '2025-06-24',
    lab: 'GK303',
    seat: '8',
    status: 'Confirmed',
  },
  { key: '5',
    date: '2025-06-26',
    lab: 'Computer Lab AG1804',
    seat: '5',
    status: 'Confirmed',
  },
];

export default function Reservations() {
  const [previewReservation, setPreviewReservation] = useState(null);
  const [data, setData] = useState(initialData);

  const handleEdit = (record) => {
    // Implement your edit logic here
    message.info(`Edit reservation for seat ${record.seat} on ${record.date}`);
  };

  const handleDelete = (record) => {
    setData(prev => prev.filter(item => item.key !== record.key));
    message.success('Reservation deleted');
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <h1 style={{ color: '#00703c', marginBottom: 24 }}>My Reservations</h1>
      <Table
        columns={columns(handleEdit, handleDelete)}
        dataSource={data}
        rowClassName={() => 'clickable-row'}
        pagination={false}
        style={{ background: '#fff', borderRadius: 12 }}
        onRow={record => ({
          onClick: () => setPreviewReservation(record),
        })}
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