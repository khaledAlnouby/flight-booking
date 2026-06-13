import { useState, useEffect } from 'react';
import axios from '../api/axios';
import { User } from 'lucide-react';

const Profile = ({ role }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get('/users/profile');
        setFormData(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put('/users/profile', formData);
      alert('Profile updated successfully!');

      // Update local storage user partial
      const stored = JSON.parse(localStorage.getItem('user'));
      localStorage.setItem('user', JSON.stringify({ ...stored, name: formData.name, email: formData.email }));
      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message || 'Error updating profile');
    }
  };

  if (loading) return <div className="container" style={{ padding: '2rem' }}>Loading...</div>;

  return (
    <div className="container animate-fade-in" style={{ padding: '2rem 1.5rem', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
          <User size={24} color="var(--primary)" /> {role} Profile
        </h2>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Name</label>
            <input name="name" type="text" className="form-input" value={formData.name || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input name="email" type="email" className="form-input" value={formData.email || ''} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label className="form-label">Telephone</label>
            <input name="tel" type="text" className="form-input" value={formData.tel || ''} onChange={handleChange} required />
          </div>

          {role === 'Company' ? (
            <>
              <div className="form-group">
                <label className="form-label">Address</label>
                <input name="address" type="text" className="form-input" value={formData.address || ''} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea name="bio" className="form-input" rows="3" value={formData.bio || ''} onChange={handleChange}></textarea>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label className="form-label">Account Balance ($)</label>
                <input name="accountBalance" type="number" className="form-input" value={formData.accountBalance || 0} onChange={handleChange} />
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">New Password (leave blank to keep current)</label>
            <input name="password" type="password" className="form-input" onChange={handleChange} />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            Update Profile
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
