import { FaStar } from 'react-icons/fa';

export function LevelSummary({ masteredByCategory, totalByCategory }) {
  /* Objects keyed by category name, e.g.
     masteredByCategory = { Toprock: 8, Footwork: 3 }
     totalByCategory    = { Toprock: 10, Footwork: 18 }
  */
  const categories = Object.keys(totalByCategory);

  // Calculate overall progress
  const totalMastered = Object.values(masteredByCategory).reduce((sum, count) => sum + count, 0);
  const totalAvailable = Object.values(totalByCategory).reduce((sum, count) => sum + count, 0);
  const overallProgress = totalAvailable > 0 ? Math.round((totalMastered / totalAvailable) * 100) : 0;

  return (
    <div className="section-card section-card--centered-header">
      {/* Header with overall stats */}
      <div className="section-header">
        <div className="foundation-progress-title-section">
          <div className="foundation-progress-text">
            <h3 className="section-heading">Foundation Progress</h3>
            <p className="section-subtitle">Track your mastery by category</p>
          </div>
        </div>
        <div className="foundation-progress-overview">
          <div className="foundation-overview-stat">
            <span className="foundation-overview-value">{totalMastered}</span>
            <span className="foundation-overview-label">Mastered</span>
          </div>
          <div className="foundation-overview-stat">
            <span className="foundation-overview-value">{totalAvailable}</span>
            <span className="foundation-overview-label">Total</span>
          </div>
          <div className="foundation-overview-stat">
            <span className="foundation-overview-value">{overallProgress}%</span>
            <span className="foundation-overview-label">Complete</span>
          </div>
        </div>
      </div>

      {/* Category progress bars */}
      <div className="foundation-categories-grid">
        {categories.map((category) => {
          const mastered = masteredByCategory[category] || 0;
          const total = totalByCategory[category];
          const percentage = Math.round((mastered / total) * 100);
          
          return (
            <div key={category} className="foundation-category-card">
              <div className="foundation-category-header">
                <div className="foundation-category-info">
                  <h4 className="foundation-category-name">{category}</h4>
                  <p className="foundation-category-stats">{mastered} of {total} moves</p>
                </div>
                <div className="foundation-category-percentage">
                  {percentage}%
                </div>
              </div>
              
              <div className="foundation-category-progress">
                <div className="foundation-progress-bar">
                  <div 
                    className="foundation-progress-fill" 
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
