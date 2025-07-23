import { Routes, Route, useLocation } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import { Moves } from './pages/Moves';
import Badges from './pages/Badges';
import BadgeDetail from './pages/BadgeDetail';
import Profile from './pages/Profile';
import Admin from './pages/Admin';
import AddMove from './pages/AddMove';
import AddBadge from './pages/AddBadge';
import AddEvent from './pages/AddEvent';
import AddCrew from './pages/AddCrew';
import AddUser from './pages/AddUser';
import Breakers from './pages/Breakers';
import BreakerProfile from './pages/BreakerProfile';
import Events from './pages/Events';
import Battles from './pages/Battles';
import BattleRoom from './pages/BattleRoom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header'; // Husk at opret Header.jsx
import { FaEdit } from 'react-icons/fa';

function Page({ children }) {
  return <div className="page-container">{children}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [coverPhoto, setCoverPhoto] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const location = useLocation();

  return (
    <div className="min-h-screen bg-stone-900 text-stone-100 font-sans">
      <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

      {location.pathname === '/' && (
        <div className="cover-photo-wrapper">
          <img
            src={coverPhoto || 'https://via.placeholder.com/1200x200?text=Cover+Photo'}
            alt="Cover"
            className="cover-photo"
          />
          {isEditing && (
            <label className="edit-icon-cover" tabIndex={0} aria-label="Edit cover photo">
              <FaEdit />
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setCoverPhoto(URL.createObjectURL(e.target.files[0]))}
                hidden
              />
            </label>
          )}
        </div>
      )}

      <Routes>
        <Route path="/" element={<Page><Home coverPhoto={coverPhoto} setCoverPhoto={setCoverPhoto} isEditing={isEditing} setIsEditing={setIsEditing} /></Page>} />
        <Route path="/moves" element={<Page><Moves /></Page>} />
        <Route path="/badges" element={<Page><Badges /></Page>} />
        <Route path="/badges/:id" element={<Page><BadgeDetail /></Page>} />
        <Route path="/profile" element={<Page><Profile /></Page>} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/admin/add-move" element={<AddMove />} />
        <Route path="/admin/add-badge" element={<AddBadge />} />
        <Route path="/admin/add-event" element={<AddEvent />} />
        <Route path="/admin/add-crew" element={<AddCrew />} />
        <Route path="/admin/add-user" element={<AddUser />} />
        <Route path="/breakers" element={<Page><Breakers /></Page>} />
        <Route path="/breakers/:breakerId" element={<Page><BreakerProfile /></Page>} />
        <Route path="/events" element={<Page><Events /></Page>} />
        <Route path="/battles" element={<Page><Battles /></Page>} />
        <Route path="/battles/:battleId" element={<Page><BattleRoom /></Page>} />
      </Routes>

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: '#333',
            color: '#fff',
            fontWeight: 600,
            borderRadius: '12px',
          },
          success: {
            iconTheme: {
              primary: '#00ffc3',
              secondary: '#111',
            },
          },
        }}
      />
    </div>
  );
}
