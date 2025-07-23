import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer } from 'recharts';

export function StyleRadar({ data }) {
  /* data example:
     [ { category:'Toprock', score:70 }, { category:'Footwork', score:40 } ... ]
  */
  return (
    <div className="style-radar">
      <ResponsiveContainer width="100%" aspect={1}>
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="#444" />
          <PolarAngleAxis dataKey="category" tick={{ fill:'#ccc', fontSize:8 }} />
          <Radar name="Style" dataKey="score" stroke="none" fill="#00ff" fillOpacity={0.4} />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
