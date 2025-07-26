import { useState } from 'react';
import { useProfile } from '../context/ProfileContext';
import { useCrews } from '../hooks/useCrews';
import { useAutoRefresh } from '../hooks/useAutoRefresh';
import CrewCard from '../components/CrewCard';
import CrewSelection from '../components/CrewSelection';
import { FaUsers, FaTrophy, FaChartLine, FaArrowLeft } from 'react-icons/fa';
import '../styles/pages/crews.css';

// Helper function to convert numeric level to CSS class
const getLevelClass = (level) => {
  if (level >= 20) return 'grandmaster';
  if (level >= 15) return 'master';
  if (level >= 12) return 'skilled';
  if (level >= 8) return 'advanced';
  if (level >= 5) return 'intermediate';
  return 'beginner';
};

export default function Crews() {
  const { xp, level, progress, masteredMoves } = useProfile();
  const [selectedCrew, setSelectedCrew] = useState(null);
  const [activeTab, setActiveTab] = useState('crew');
  
  // Use the API hook
  const { crews, loading, error } = useCrews();

  // Auto-refresh data when user profile changes
  useAutoRefresh(() => {
    // The ProfileContext will automatically update the masteredMoves, xp, level, etc.
    // This hook ensures the component re-renders when data changes
  });

  const tabs = [
    { id: 'crew', label: 'Crew', icon: FaUsers },
    { id: 'stats', label: 'Stats', icon: FaChartLine }
  ];

  const handleCrewSelect = (crew) => {
    setSelectedCrew(crew);
  };

  const handleBackToSelection = () => {
    setSelectedCrew(null);
    setActiveTab('crew');
  };

  // Show loading state
  if (loading) {
    return (
      <div className="main-content">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading crews...</p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="main-content">
        <div className="error-container">
          <p>Error loading crews: {error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      </div>
    );
  }

  // Show crew selection if no crew is selected
  if (!selectedCrew) {
    return (
      <div className="main-content">
        <CrewSelection crews={crews} onCrewSelect={handleCrewSelect} />
      </div>
    );
  }

  return (
    <div className="main-content">
      <div className="profile-page">
        {/* Back Button */}
        <button 
          className="back-button"
          onClick={handleBackToSelection}
        >
          <FaArrowLeft size={16} />
          <span>Back to Crews</span>
        </button>

        {/* Profile Header */}
        <div className="profile-header-section">
          <div className="profile-hero">
            <div className="profile-avatar">
              <img
                src={selectedCrew.logo}
                alt={selectedCrew.name}
                className="hero-avatar"
              />
            </div>
            <div className="profile-details">
              <h1 className="profile-title">{selectedCrew.name}</h1>

            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="profile-tabs">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                className={`profile-tab ${activeTab === tab.id ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Tab Content */}
        <div className="tab-content">
          {activeTab === 'crew' && (
            <div className="crew-section">
              <div className="crew-header">
                <h2 className="section-title">Crew Members</h2>
                <div className="crew-stats-overview">
                  <div className="crew-stat">
                    <span className="crew-stat-number">{selectedCrew.members ? selectedCrew.members.length : 0}</span>
                    <span className="crew-stat-label">Members</span>
                  </div>
                  <div className="crew-stat">
                    <span className="crew-stat-number">{selectedCrew.location || 'N/A'}</span>
                    <span className="crew-stat-label">Location</span>
                  </div>
                  <div className="crew-stat">
                    <span className="crew-stat-number">{selectedCrew.founded ? new Date(selectedCrew.founded).getFullYear() : 'N/A'}</span>
                    <span className="crew-stat-label">Founded</span>
                  </div>
                </div>
              </div>
              
              <div className="crew-container">
                <div className="crew-grid">
                  {selectedCrew.members && selectedCrew.members.map((member) => (
                    <div key={member._id || member.id} className="crew-member-card">
                      <div className="card-header">
                        <div className="crew-member-info">
                          <div className="avatar-container">
                            <img 
                              src={member.profileImage || '/placeholder.jpg'} 
                              alt={member.username || member.name}
                              className="member-avatar"
                            />
                            <div className={`status-indicator ${member.status === 'online' ? 'online' : 'offline'}`}>
                              <span>●</span>
                            </div>
                          </div>
                          
                          <div className="crew-member-details">
                            <h3 className="crew-member-name">{member.username || member.name}</h3>
                            <div className="crew-member-level">
                              <span className="level-icon">
                                {member.level >= 15 ? '👑' : member.level >= 10 ? '⭐' : '🔰'}
                              </span>
                              <span className="level-text">Level {member.level || 1}</span>
                            </div>
                          
                          </div>
                        </div>

                        <div className="action-button">
                          <div className="xp-display">
                            <span className="xp-value">{member.xp ? member.xp.toLocaleString() : 'N/A'}</span>
                            <span className="xp-label">XP</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="stats-section">
              <h2 className="section-title">Crew Statistics</h2>
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Crew Overview</h3>
                  <div className="crew-overview-grid">
                    <div className="overview-item">
                      <div className="overview-icon">👥</div>
                      <div className="overview-content">
                        <span className="overview-value">{selectedCrew.members ? selectedCrew.members.length : 0}</span>
                        <span className="overview-label">Members</span>
                      </div>
                    </div>
                    <div className="overview-item">
                      <div className="overview-icon">📍</div>
                      <div className="overview-content">
                        <span className="overview-value">{selectedCrew.location || 'N/A'}</span>
                        <span className="overview-label">Location</span>
                      </div>
                    </div>
                    <div className="overview-item">
                      <div className="overview-icon">🏆</div>
                      <div className="overview-content">
                        <span className="overview-value">{selectedCrew.founded ? new Date(selectedCrew.founded).getFullYear() : 'N/A'}</span>
                        <span className="overview-label">Founded</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="stat-card">
                  <h3>Top Members</h3>
                  <div className="top-members-list">
                    {selectedCrew.members && selectedCrew.members
                      .filter(member => member.xp) // Only include members with XP data
                      .sort((a, b) => (b.xp || 0) - (a.xp || 0))
                      .slice(0, 5)
                      .map((member, index) => (
                        <div key={member._id || member.id} className="top-member-item">
                          <div className="member-rank">#{index + 1}</div>
                          <div className="member-info">
                            <span className="member-name">{member.username || member.name}</span>
                          </div>
                          <div className="member-xp">{member.xp ? member.xp.toLocaleString() : 'N/A'} XP</div>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}