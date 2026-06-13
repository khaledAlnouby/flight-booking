import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { Plus, List } from 'lucide-react';

const CompanyHome = () => {
  const [flights, setFlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await axios.get('/flights');
        const user = JSON.parse(localStorage.getItem('user'));
        const myFlights = data.filter(f => f.company?._id === user._id || f.company === user._id);
        setFlights(myFlights);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <h2>Company Dashboard</h2>
        <button className="btn btn-primary" onClick={() => navigate('/company/add-flight')}>
          <Plus size={18} /> Add Flight
        </button>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <List size={20} /> My Flights
        </h3>

        {loading ? (
          <p>Loading flights...</p>
        ) : flights.length === 0 ? (
          <p>No flights added yet.</p>
        ) : (
          <div style={{ display: 'grid', gap: '1rem' }}>
            {flights.map(flight => (
              <div
                key={flight._id}
                onClick={() => navigate(`/company/flight/${flight._id}`)}
                style={{ padding: '1rem', background: 'var(--surface-light)', borderRadius: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer', transition: 'background 0.2s' }}
                onMouseOver={(e) => e.currentTarget.style.background = 'var(--primary)'}
                onMouseOut={(e) => e.currentTarget.style.background = 'var(--surface-light)'}
              >
                <div>
                  <h4>{flight.name} ({flight.flightId})</h4>
                  <p>Route: {flight.itinerary.join(' -> ')}</p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ color: 'var(--text)', fontWeight: 'bold' }}>${flight.fees}</span>
                  <p>Status: <span style={{ color: flight.status === 'Cancelled' ? 'var(--danger)' : 'var(--secondary)' }}>{flight.status}</span></p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CompanyHome;
