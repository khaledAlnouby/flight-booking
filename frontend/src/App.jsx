import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useContext } from 'react';
import AuthContext from './context/AuthContext';

import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/layout/Navbar';
import CompanyHome from './pages/company/CompanyHome';
import PassengerHome from './pages/passenger/PassengerHome';
import AddFlight from './pages/company/AddFlight';
import FlightDetails from './pages/company/FlightDetails';
import Profile from './components/Profile';
import Messages from './components/Messages';

function App() {
  const { user, loading } = useContext(AuthContext);

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>Loading app...</div>;

  return (
    <Router>
      {user && <Navbar />}
      <Routes>
        <Route path="/" element={
          user ? <Navigate to={user.type === 'Company' ? '/company/home' : '/passenger/home'} /> : <Navigate to="/login" />
        } />
        
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Company Routes */}
        <Route path="/company/*" element={
          <ProtectedRoute allowedRole="Company">
            <Routes>
              <Route path="home" element={<CompanyHome />} />
              <Route path="add-flight" element={<AddFlight />} />
              <Route path="flight/:id" element={<FlightDetails />} />
              <Route path="profile" element={<Profile role="Company" />} />
              <Route path="messages" element={<Messages />} />
              <Route path="*" element={<Navigate to="home" replace />} />
            </Routes>
          </ProtectedRoute>
        } />

        {/* Passenger Routes */}
        <Route path="/passenger/*" element={
          <ProtectedRoute allowedRole="Passenger">
            <Routes>
              <Route path="home" element={<PassengerHome />} />
              <Route path="profile" element={<Profile role="Passenger" />} />
              <Route path="messages" element={<Messages />} />
              <Route path="*" element={<Navigate to="home" replace />} />
            </Routes>
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
