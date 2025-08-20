import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Login from './pages/Login';
import { Moves } from './pages/Moves';

import Badges from './pages/Badges';
import BadgeDetail from './pages/BadgeDetail';
import Admin from './pages/Admin';
import AddMove from './pages/AddMove';
import AddBadge from './pages/AddBadge';
import AddEvent from './pages/AddEvent';
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
import JudgeVoting from './pages/JudgeVoting';
import MasterMove from './pages/MasterMove';
import Policy from './pages/Policy';
import TermsOfService from './pages/TermsOfService';
import ForgotPassword from './pages/ForgotPassword';
import VerifyPassword from './pages/VerifyPassword';
import Register from './pages/Register';
import LearnMore from './pages/LearnMore';
import Verify from './pages/Verify';
import VerifySuccess from './pages/VerifySuccess';
import NotFound from './pages/NotFound';

import { Toaster } from 'react-hot-toast';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';
import AdminRoute from './components/AdminRoute';
import { AuthProvider } from './context/AuthContext';
import { ProfileProvider } from './context/ProfileContext';
import CookieConsent from './components/CookieConsent';
import VersionIndicator from './components/VersionIndicator';

// Import styles
import './styles/base.css';
import './styles/fonts.css';
import './styles/components.css';
import './styles/pages/home.css';
import './styles/pages/moves.css';
import './styles/pages/badges.css';
import './styles/pages/events.css';
import './styles/pages/battles.css';
import './styles/pages/battle-room.css';
import './styles/pages/breaker-profile.css';
import './styles/pages/breakers.css';
import './styles/pages/landing.css';
import './styles/pages/login.css';
import './styles/pages/admin.css';
import './styles/pages/add-form.css';
import './styles/pages/badge-detail.css';
import './styles/pages/judge-voting.css';
import './styles/pages/master-move.css';
import './styles/pages/policy.css';
import './styles/pages/register.css';


function Page({ children }) {
  return <div className="page-container">{children}</div>;
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <AuthProvider>
      <ProfileProvider>
        <div className="min-h-screen bg-stone-900 text-stone-100 font-sans" style={{ ['--header-h']: '64px' }}>
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
            <Route path="/policy" element={
              <PublicRoute>
                <Page><Policy /></Page>
              </PublicRoute>
            } />
            <Route path="/terms" element={
              <PublicRoute>
                <Page><TermsOfService /></Page>
              </PublicRoute>
            } />
            <Route path="/forgot-password" element={
              <PublicRoute>
                <Page><ForgotPassword /></Page>
              </PublicRoute>
            } />
            <Route path="/verify-password" element={
              <PublicRoute>
                <Page><VerifyPassword /></Page>
              </PublicRoute>
            } />
            <Route path="/register" element={
              <PublicRoute>
                <Register />
              </PublicRoute>
            } />
            <Route path="/learnmore" element={
              <PublicRoute>
                <LearnMore />
              </PublicRoute>
            } />
            <Route path="/verify" element={
              <PublicRoute>
                <Verify />
              </PublicRoute>
            } />
            <Route path="/verify-success" element={
              <PublicRoute>
                <VerifySuccess />
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
            <Route path="/master-move" element={
              <ProtectedRoute>
                <Page><MasterMove /></Page>
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
            <Route path="/judge/:battleId" element={
              <ProtectedRoute>
                <Page><JudgeVoting /></Page>
              </ProtectedRoute>
            } />
            <Route path="/battles/:battleId/judge/:category" element={
              <ProtectedRoute>
                <Page><JudgeVoting /></Page>
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

            {/* Catch-all route for 404 */}
            <Route path="*" element={<NotFound />} />

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
        <CookieConsent />
        <VersionIndicator />
      </div>
      </ProfileProvider>
    </AuthProvider>
  );
}
