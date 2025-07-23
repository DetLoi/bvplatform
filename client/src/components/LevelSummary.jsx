export function LevelSummary({ masteredByLevel, totalByLevel }) {
  /* Objects keyed by level name, e.g.
     masteredByLevel = { Beginner: 8, Novice: 3 }
     totalByLevel    = { Beginner:10, Novice:18 }
  */
  const levels = Object.keys(totalByLevel);

  return (
    <div className="level-summary">
      {levels.map((lvl) => {
        const mastered = masteredByLevel[lvl] || 0;
        const total = totalByLevel[lvl];
        const pct = Math.round((mastered / total) * 100);
        return (
          <div key={lvl} className="level-item">
            <span className={`level-dot level-${lvl.toLowerCase()}`}></span>
            <div className="level-label">{lvl}</div>
            <div className="level-bar">
              <div className="level-fill" style={{ width: `${pct}%` }} />
            </div>
            <div className="level-count">{mastered}/{total}</div>
          </div>
        );
      })}
    </div>
  );
}
