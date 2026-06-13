import { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import { Plane } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    type: 'Passenger',
    name: '',
    email: '',
    password: '',
    tel: '',
    // Company
    bio: '',
    address: '',
    location: '',
    username: '',
    logoImg: '',
    // Passenger
    photo: '',
    passportImg: ''
  });
  
  const [error, setError] = useState('');
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = await register(formData);
      if (user.type === 'Company') {
        navigate('/company/home');
      } else {
        navigate('/passenger/home');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="container animate-fade-in" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flex: 1, padding: '2rem 0' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <Plane size={48} color="var(--primary)" style={{ marginBottom: '1rem' }} />
          <h2>Create Account</h2>
          <p>Join our flight booking platform</p>
        </div>
        
        {error && <div style={{ color: 'var(--danger)', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="type" 
                value="Passenger" 
                checked={formData.type === 'Passenger'} 
                onChange={handleChange} 
              />
              Passenger
            </label>
            <label style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input 
                type="radio" 
                name="type" 
                value="Company" 
                checked={formData.type === 'Company'} 
                onChange={handleChange} 
              />
              Company
            </label>
          </div>

          <div className="form-group">
            <label className="form-label">{formData.type === 'Company' ? 'Company Name' : 'Full Name'}</label>
            <input name="name" type="text" className="form-input" value={formData.name} onChange={handleChange} required />
          </div>
          
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <input name="password" type="password" className="form-input" value={formData.password} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label className="form-label">Telephone</label>
            <input name="tel" type="text" className="form-input" value={formData.tel} onChange={handleChange} required />
          </div>

          {formData.type === 'Company' && (
            <>
              <div className="form-group">
                <label className="form-label">Username</label>
                <input name="username" type="text" className="form-input" value={formData.username} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input name="address" type="text" className="form-input" value={formData.address} onChange={handleChange} />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Register
          </button>
        </form>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <p>Already have an account? <Link to="/login">Login here</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
