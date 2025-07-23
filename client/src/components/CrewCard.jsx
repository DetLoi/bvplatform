import { FaCircle } from 'react-icons/fa';

export default function CrewCard({ member }) {
  const getLevelClass = (level) => {
    if (level >= 20) return 'grandmaster';
    if (level >= 15) return 'master';
    if (level >= 12) return 'skilled';
    if (level >= 8) return 'advanced';
    if (level >= 5) return 'intermediate';
    return 'beginner';
  };

  return (
    <div className="crew-member-card">
      <div className="card-header">
        <div className="crew-member-info">
          <div className="avatar-container">
            <img
              src={member.profileImage}
              alt={member.name}
              className="member-avatar"
            />
            <div className={`status-indicator ${member.status === 'online' ? 'online' : 'offline'}`}>
              <FaCircle size={6} />
            </div>
          </div>
          
          <div className="crew-member-details">
            <h3 className="crew-member-name">{member.name}</h3>
            <div className="crew-member-level">
              <span className={`level-text level-${getLevelClass(member.level)}`}>
                {member.level}
              </span>
            </div>
            <div className="crew-member-specialty">
              <span className="specialty-text">{member.specialty}</span>
            </div>
          </div>
        </div>
        
        <div className="crew-member-xp">
          <span className="xp-value">{member.xp.toLocaleString()}</span>
          <span className="xp-label">XP</span>
        </div>
      </div>
    </div>
  );
} 