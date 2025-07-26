export function LevelSummary({ masteredByCategory, totalByCategory }) {
  /* Objects keyed by category name, e.g.
     masteredByCategory = { Toprock: 8, Footwork: 3 }
     totalByCategory    = { Toprock: 10, Footwork: 18 }
  */
  const categories = Object.keys(totalByCategory);

  return (
    <div className="level-summary">
      {categories.map((category) => {
        const mastered = masteredByCategory[category] || 0;
        const total = totalByCategory[category];
        const pct = Math.round((mastered / total) * 100);
        return (
          <div key={category} className="level-item">
            <div className="level-label">{category}</div>
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
