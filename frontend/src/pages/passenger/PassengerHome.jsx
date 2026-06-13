import { useState, useEffect, useContext } from 'react';
import axios from '../../api/axios';
import AuthContext from '../../context/AuthContext';
import { Search, MapPin } from 'lucide-react';

const PassengerHome = () => {
  const [flights, setFlights] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchFlights = async () => {
      try {
        const { data } = await axios.get('/flights');
        setFlights(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchFlights();
  }, []);

  const handleBook = async (id) => {
    try {
      await axios.post(`/flights/${id}/book`);
      alert('Flight booked successfully!');
      // reload flights to update status
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error booking flight');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem' }}>
      <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h2>Welcome, {user.name}</h2>
        <p>Your Balance: <span style={{ color: 'var(--secondary)', fontWeight: 'bold' }}>${user.accountBalance || 0}</span></p>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <div className="form-group" style={{ marginBottom: 0, display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="form-input"
              style={{ paddingLeft: '2.5rem' }}
              placeholder="Search destination city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button className="btn btn-primary">Search</button>
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <h3 style={{ marginBottom: '1.5rem' }}>Available Flights</h3>

        {loading ? (
          <p>Loading flights...</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {flights.filter(f => search === '' || f.itinerary.some(city => city.toLowerCase().includes(search.toLowerCase()))).map(flight => (
              <div key={flight._id} style={{ padding: '1.5rem', background: 'var(--surface-light)', borderRadius: '0.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <h4>{flight.name}</h4>
                  <span style={{ color: 'var(--secondary)', fontWeight: 'bold', fontSize: '1.25rem' }}>${flight.fees}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', color: 'var(--text-muted)' }}>
                  <MapPin size={16} style={{ marginTop: '0.2rem' }} />
                  <p style={{ fontSize: '0.9rem' }}>{flight.itinerary.join(' -> ')}</p>
                </div>

                <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    Seats: {flight.registeredPassengers?.length || 0} / {flight.maxPassengers}
                  </span>
                  <button
                    onClick={() => handleBook(flight._id)}
                    className="btn btn-primary"
                    style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                    disabled={flight.registeredPassengers?.length >= flight.maxPassengers}
                  >
                    Take it?
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PassengerHome;
