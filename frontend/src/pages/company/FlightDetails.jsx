import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Trash2, Users } from 'lucide-react';

const FlightDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [flight, setFlight] = useState(null);

  useEffect(() => {
    const fetchFlight = async () => {
      try {
        const { data } = await axios.get(`/flights/${id}`);
        setFlight(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchFlight();
  }, [id]);

  const handleCancel = async () => {
    if (window.confirm('Are you sure you want to cancel this flight? This will refund all passengers.')) {
      try {
        await axios.post(`/flights/${id}/cancel`);
        alert('Flight cancelled successfully.');
        navigate('/company/home');
      } catch (error) {
        alert(error.response?.data?.message || 'Error cancelling flight');
      }
    }
  };

  if (!flight) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Flight: {flight.name} ({flight.flightId})</h2>
        {flight.status !== 'Cancelled' && (
          <button onClick={handleCancel} className="btn btn-danger">
            <Trash2 size={18} /> Cancel Flight
          </button>
        )}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="glass-panel" style={{ padding: '1.5rem', height: 'fit-content' }}>
          <h3>Details</h3>
          <ul style={{ listStyle: 'none', marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.8rem', color: 'var(--text-muted)' }}>
            <li><strong>Status:</strong> <span style={{ color: flight.status === 'Cancelled' ? 'var(--danger)' : 'var(--secondary)' }}>{flight.status}</span></li>
            <li><strong>Route:</strong> {flight.itinerary.join(' -> ')}</li>
            <li><strong>Fees:</strong> ${flight.fees}</li>
            <li><strong>Capacity:</strong> {flight.registeredPassengers?.length} / {flight.maxPassengers}</li>
          </ul>
        </div>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
            <Users size={20} /> Registered Passengers
          </h3>

          {flight.registeredPassengers?.length === 0 ? (
            <p>No passengers registered yet.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {flight.registeredPassengers.map(p => (
                <div key={p._id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', background: 'var(--surface-light)', borderRadius: '0.5rem' }}>
                  <div>
                    <strong>{p.name}</strong>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.email}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlightDetails;
