import { FaUsers, FaTrophy, FaStar } from 'react-icons/fa';

export default function CrewSelection({ crews, onCrewSelect }) {
  return (
    <div className="crew-selection">
      <div className="crew-selection-header">
        <h1 className="selection-title">Crews i Danmark</h1>
      </div>
      
      <div className="crew-selection-grid">
        {crews.map((crew) => (
          <div
            key={crew.id}
            className="crew-selection-card"
            onClick={() => onCrewSelect(crew)}
          >
            <div className="card-header">
              <div className="crew-info">
                <div className="avatar-container">
                  <img
                    src={crew.logo}
                    alt={crew.name}
                    className="crew-avatar"
                  />
                </div>
                
                <div className="crew-details">
                  <h3 className="crew-name">{crew.name}</h3>
                  <div className="crew-stats">
                    <div className="crew-stat">
                      <FaUsers size={14} />
                      <span>{crew.memberCount} members</span>
                    </div>
                    <div className="crew-stat">
                      <FaTrophy size={14} />
                      <span>{crew.totalXP.toLocaleString()} XP</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="action-button">
                <div className="select-button">
                  <span>Select</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 