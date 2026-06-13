import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from '../../api/axios';
import { PlaneTakeoff } from 'lucide-react';

const AddFlight = () => {
  const [formData, setFormData] = useState({
    name: '',
    flightId: '',
    itinerary: '',
    fees: '',
    maxPassengers: '',
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        itinerary: formData.itinerary.split(',').map(s => s.trim()),
        fees: Number(formData.fees),
        maxPassengers: Number(formData.maxPassengers),
      };
      await axios.post('/flights', payload);
      navigate('/company/home');
    } catch (error) {
      alert(error.response?.data?.message || 'Error adding flight');
    }
  };

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <PlaneTakeoff size={24} color="var(--primary)" /> Add New Flight
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Flight Name</label>
            <input name="name" type="text" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Flight ID</label>
            <input name="flightId" type="text" className="form-input" required onChange={handleChange} />
          </div>
          <div className="form-group">
            <label className="form-label">Itinerary (comma separated cities)</label>
            <input name="itinerary" type="text" className="form-input" placeholder="e.g. New York, London, Paris" required onChange={handleChange} />
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Fees ($)</label>
              <input name="fees" type="number" className="form-input" required onChange={handleChange} />
            </div>
            <div className="form-group" style={{ flex: 1 }}>
              <label className="form-label">Max Passengers</label>
              <input name="maxPassengers" type="number" className="form-input" required onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="button" className="btn btn-outline" style={{ flex: 1 }} onClick={() => navigate('/company/home')}>Cancel</button>
            <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Flight</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddFlight;
