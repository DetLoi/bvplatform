import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useBadges } from '../hooks/useBadges';
import { isBadgeUnlocked } from '../utils/badgeUtils';

export default function DashboardBadges({ allMoves, masteredMoves }) {
  const navigate = useNavigate();
  const { badges, loading } = useBadges();
  const [selectedBadgeId, setSelectedBadgeId] = useState(null);

  const unlockedBadges = useMemo(() => {
    return (badges || [])
      .filter(b => isBadgeUnlocked(b, masteredMoves, allMoves))
      .filter(b => b?.name !== 'Grandmaster');
  }, [badges, masteredMoves, allMoves]);

  if (loading) {
    return (
      <div className="section-card section-card--with-link">
        <div className="section-header">
          <h2 className="section-heading">Badges</h2>
        </div>
        <div className="ub-loading">
          <div className="ub-spinner"></div>
          <p className="ub-loading-text">Loading badges...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="section-card section-card--with-link">
      <div className="section-header">
        <h2 className="section-heading">Badges</h2>
        <button className="ub-btn ub-btn--link" onClick={() => navigate('/badges')}>View all</button>
      </div>

      {unlockedBadges.length === 0 ? (
        <div className="no-badges-cta">
          <div className="cta-icon">🏆</div>
          <h3>Complete a mission to earn a badge</h3>
          <p>Master moves in each category to unlock prestigious badges</p>
          <button className="cta-button" onClick={() => navigate('/badges')}>View All Badges</button>
        </div>
      ) : (
        <>
          {!selectedBadgeId ? (
            <div className="ub-archive">
              {unlockedBadges.map((badge) => (
                <button
                  key={badge._id || badge.name}
                  className="ub-tile"
                  onClick={() => setSelectedBadgeId(badge._id || badge.name)}
                  title={badge.name}
                >
                  <div className="ub-badge-icon">
                    {badge.image?.startsWith('/uploads/') ? (
                      <img src={`http://localhost:5000${badge.image}`} alt={badge.name} className="ub-badge-media" />
                    ) : (
                      <img src={badge.image} alt={badge.name} className="ub-badge-media" />
                    )}
                  </div>
                  <span className="ub-tile__status">{badge.name}</span>
                </button>
              ))}
            </div>
          ) : (
            (() => {
              const badge = unlockedBadges.find(b => (b._id || b.name) === selectedBadgeId);
              if (!badge) return null;
              return (
                <div className="ub-detail">
                  <div className="ub-detail-header">
                    <div className="ub-detail-status">
                      <div className="ub-badge-icon ub-badge-icon--lg">
                        {badge.image?.startsWith('/uploads/') ? (
                          <img src={`http://localhost:5000${badge.image}`} alt={badge.name} className="ub-badge-media" />
                        ) : (
                          <img src={badge.image} alt={badge.name} className="ub-badge-media" />
                        )}
                      </div>
                      <span>{badge.name}</span>
                    </div>

                  </div>
                                     <div className="ub-detail-body">
                     {badge.description ? (
                       <p style={{ margin: 0 }}>{badge.description}</p>
                     ) : (
                      <p style={{ margin: 0, opacity: 0.85 }}>Badge earned through your mastered moves.</p>
                     )}
                     <div className="ub-detail-actions" style={{ justifyContent: 'center' }}>
                        <button className="ub-btn ub-btn--primary" onClick={() => setSelectedBadgeId(null)}>
                          Back to archive
                        </button>
                     </div>
                   </div>
                </div>
              );
            })()
          )}
        </>
      )}
    </div>
  );
}


