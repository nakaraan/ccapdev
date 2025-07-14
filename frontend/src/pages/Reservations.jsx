import { Table, Button, Popconfirm, message } from 'antd';
import { useState, useEffect } from 'react';
import './Tabular.css';
import { useUser } from './UserContext';
import { getUserReservations, clearSeatReservation } from './api';

const columns = (onEdit, onDelete) => [
  { title: 'Date', dataIndex: 'date', key: 'date' },
  { title: 'Lab', dataIndex: 'lab', key: 'lab' },
  { title: 'Time Slot', dataIndex: 'timeSlot', key: 'timeSlot' },
  { title: 'Seat', dataIndex: 'seat', key: 'seat' },
  { title: 'Status', dataIndex: 'status', key: 'status' },
  {
    title: 'Action',
    key: 'action',
    render: (_, record) => (
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <Popconfirm
          title="Are you sure you want to cancel this reservation?"
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
            Cancel
          </Button>
        </Popconfirm>
      </div>
    ),
  },
];

export default function Reservations() {
  const { user } = useUser();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch user reservations on component mount
  useEffect(() => {
    const fetchReservations = async () => {
      if (!user) {
        console.log("No user found, skipping reservation fetch");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log("Fetching reservations for user:", user.user_id);
        
        const reservations = await getUserReservations(user.user_id);
        console.log("Raw reservations from API:", reservations);
        
        // Transform the data to match the table format
        const transformedData = reservations.map((reservation, index) => ({
          key: `${reservation.date}-${reservation.lab}-${reservation.timeSlot}-${reservation.seatIndex}`,
          date: reservation.date,
          lab: reservation.lab,
          timeSlot: reservation.timeSlot,
          seat: reservation.seatId,
          seatIndex: reservation.seatIndex,
          status: 'Confirmed',
          occupantName: reservation.occupantName
        }));
        
        console.log("Transformed data for table:", transformedData);
        setData(transformedData);
      } catch (error) {
        console.error("Error fetching user reservations:", error);
        setError("Failed to load reservations. Please try again.");
        message.error("Failed to load reservations");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [user]);

  const handleEdit = (record) => {
    // For now, just show info message. Could implement edit functionality later
    message.info(`Editing reservations is not currently supported. Please cancel and make a new reservation if needed.`);
  };

  const handleDelete = async (record) => {
    try {
      // Call the API to clear the seat reservation
      await clearSeatReservation(record.date, record.lab, record.timeSlot, record.seatIndex);
      
      // Remove from local state
      setData(prev => prev.filter(item => item.key !== record.key));
      message.success('Reservation cancelled successfully');
    } catch (error) {
      console.error("Error cancelling reservation:", error);
      message.error('Failed to cancel reservation. Please try again.');
    }
  };

  const refreshReservations = async () => {
    if (!user) return;
    
    try {
      setLoading(true);
      setError(null);
      console.log("Manual refresh - Fetching reservations for user:", user.user_id);
      
      const reservations = await getUserReservations(user.user_id);
      console.log("Manual refresh - Raw reservations from API:", reservations);
      
      const transformedData = reservations.map((reservation, index) => ({
        key: `${reservation.date}-${reservation.lab}-${reservation.timeSlot}-${reservation.seatIndex}`,
        date: reservation.date,
        lab: reservation.lab,
        timeSlot: reservation.timeSlot,
        seat: reservation.seatId,
        seatIndex: reservation.seatIndex,
        status: 'Confirmed',
        occupantName: reservation.occupantName
      }));
      
      console.log("Manual refresh - Transformed data for table:", transformedData);
      setData(transformedData);
      message.success(`Refreshed! Found ${transformedData.length} reservations.`);
    } catch (error) {
      console.error("Error refreshing reservations:", error);
      setError("Failed to refresh reservations. Please try again.");
      message.error("Failed to refresh reservations");
    } finally {
      setLoading(false);
    }
  };

  // Show login prompt if user is not logged in
  if (!user) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif', textAlign: 'center' }}>
        <h1 style={{ color: '#00703c', marginBottom: 24 }}>My Reservations</h1>
        <p style={{ fontSize: '1.2rem', color: '#666' }}>Please log in to view your reservations.</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Poppins, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h1 style={{ color: '#00703c', margin: 0 }}>My Reservations</h1>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#666' }}>
            User ID: {user.user_id}
          </span>
          <Button 
            onClick={refreshReservations}
            loading={loading}
            style={{ background: '#00703c', color: '#fff' }}
          >
            Refresh
          </Button>
        </div>
      </div>
      
      {error && (
        <div style={{ 
          padding: '16px', 
          marginBottom: '16px', 
          background: '#ffebee', 
          border: '1px solid #f44336', 
          borderRadius: '8px',
          color: '#d32f2f' 
        }}>
          {error}
        </div>
      )}
      
      <Table
        columns={columns(handleEdit, handleDelete)}
        dataSource={data}
        loading={loading}
        pagination={false}
        style={{ background: '#fff', borderRadius: 12 }}
        locale={{
          emptyText: loading ? 'Loading...' : `No reservations found for user ${user.user_id}. Make your first reservation!`
        }}
      />
    </div>
  );
}