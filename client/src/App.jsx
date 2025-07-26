import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { Moves } from './pages/Moves';
import Badges from './pages/Badges';
import BadgeDetail from './pages/BadgeDetail';
import Crews from './pages/Crews';
import Admin from './pages/Admin';
import AddMove from './pages/AddMove';
import AddBadge from './pages/AddBadge';
import AddEvent from './pages/AddEvent';
import AddCrew from './pages/AddCrew';
import AddUser from './pages/AddUser';
import EditMove from './pages/EditMove';
import EditBadge from './pages/EditBadge';
import EditEvent from './pages/EditEvent';
import EditUser from './pages/EditUser';
import Breakers from './pages/Breakers';
import BreakerProfile from './pages/BreakerProfile';
import Events from './pages/Events';
import Battles from './pages/Battles';
import BattleRoom from './pages/BattleRoom';
import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';

function Page({ children }) {
  return <div className="page-container">{children}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="min-h-screen bg-stone-900 text-stone-100 font-sans">
          <Header menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          <Routes>
            {/* Public routes - only accessible when not logged in */}
            <Route path="/" element={
              <PublicRoute>
                <Landing />
              </PublicRoute>
            } />
            <Route path="/login" element={
              <PublicRoute>
                <Login />
              </PublicRoute>
            } />

            {/* Protected routes - only accessible when logged in */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Page><Home /></Page>
              </ProtectedRoute>
            } />
            <Route path="/moves" element={
              <ProtectedRoute>
                <Page><Moves /></Page>
              </ProtectedRoute>
            } />
            <Route path="/badges" element={
              <ProtectedRoute>
                <Page><Badges /></Page>
              </ProtectedRoute>
            } />
            <Route path="/badges/:id" element={
              <ProtectedRoute>
                <Page><BadgeDetail /></Page>
              </ProtectedRoute>
            } />
            <Route path="/crews" element={
              <ProtectedRoute>
                <Page><Crews /></Page>
              </ProtectedRoute>
            } />
            <Route path="/breakers" element={
              <ProtectedRoute>
                <Page><Breakers /></Page>
              </ProtectedRoute>
            } />
            <Route path="/breakers/:breakerId" element={
              <ProtectedRoute>
                <Page><BreakerProfile /></Page>
              </ProtectedRoute>
            } />
            <Route path="/events" element={
              <ProtectedRoute>
                <Page><Events /></Page>
              </ProtectedRoute>
            } />
            <Route path="/battles" element={
              <ProtectedRoute>
                <Page><Battles /></Page>
              </ProtectedRoute>
            } />
            <Route path="/battles/:battleId" element={
              <ProtectedRoute>
                <Page><BattleRoom /></Page>
              </ProtectedRoute>
            } />

            {/* Admin routes - require admin status */}
            <Route path="/admin" element={
              <AdminRoute>
                <Admin />
              </AdminRoute>
            } />
            <Route path="/admin/add-move" element={
              <AdminRoute>
                <AddMove />
              </AdminRoute>
            } />
            <Route path="/admin/add-badge" element={
              <AdminRoute>
                <AddBadge />
              </AdminRoute>
            } />
            <Route path="/admin/add-event" element={
              <AdminRoute>
                <AddEvent />
              </AdminRoute>
            } />
            <Route path="/admin/add-crew" element={
              <AdminRoute>
                <AddCrew />
              </AdminRoute>
            } />
            <Route path="/admin/add-user" element={
              <AdminRoute>
                <AddUser />
              </AdminRoute>
            } />
            <Route path="/admin/edit-move/:id" element={
              <AdminRoute>
                <EditMove />
              </AdminRoute>
            } />
            <Route path="/admin/edit-badge/:id" element={
              <AdminRoute>
                <EditBadge />
              </AdminRoute>
            } />
            <Route path="/admin/edit-event/:id" element={
              <AdminRoute>
                <EditEvent />
              </AdminRoute>
            } />
            <Route path="/admin/edit-user/:id" element={
              <AdminRoute>
                <EditUser />
              </AdminRoute>
            } />
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
      </ProfileProvider>
    </AuthProvider>
  );
}
