import React, { useState } from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
} from 'recharts';
import { HeartHandshake, TrendingUp, Sparkles, ShieldCheck, CheckCircle2, Info } from 'lucide-react';

interface ClimateWavePoint {
  waveKey: string;
  waveLabel: string;
  date: string;
  belonging: number;
  emotionalSafety: number;
  adultSafety: number;
  helpSeeking: number;
  // Domain scores
  selfAwareness: number;
  selfManagement: number;
  socialAwareness: number;
  relationshipSkills: number;
  decisionMaking: number;
}

const CLIMATE_TRENDS_DATA: ClimateWavePoint[] = [
  {
    waveKey: 'baseline',
    waveLabel: 'Baseline',
    date: 'Sep 2026',
    belonging: 74,
    emotionalSafety: 68,
    adultSafety: 71,
    helpSeeking: 65,
    selfAwareness: 64,
    selfManagement: 60,
    socialAwareness: 68,
    relationshipSkills: 62,
    decisionMaking: 58,
  },
  {
    waveKey: 'early_check',
    waveLabel: 'Early Check',
    date: 'Oct 2026',
    belonging: 79,
    emotionalSafety: 74,
    adultSafety: 76,
    helpSeeking: 71,
    selfAwareness: 71,
    selfManagement: 66,
    socialAwareness: 73,
    relationshipSkills: 68,
    decisionMaking: 64,
  },
  {
    waveKey: 'midline',
    waveLabel: 'Midline',
    date: 'Jan 2027',
    belonging: 85,
    emotionalSafety: 82,
    adultSafety: 83,
    helpSeeking: 78,
    selfAwareness: 79,
    selfManagement: 73,
    socialAwareness: 81,
    relationshipSkills: 76,
    decisionMaking: 72,
  },
  {
    waveKey: 'endline',
    waveLabel: 'Endline',
    date: 'May 2027',
    belonging: 91,
    emotionalSafety: 88,
    adultSafety: 89,
    helpSeeking: 86,
    selfAwareness: 86,
    selfManagement: 82,
    socialAwareness: 89,
    relationshipSkills: 85,
    decisionMaking: 81,
  },
  {
    waveKey: 'follow_up',
    waveLabel: 'Follow-Up',
    date: 'Sep 2027 (Proj.)',
    belonging: 93,
    emotionalSafety: 90,
    adultSafety: 91,
    helpSeeking: 88,
    selfAwareness: 88,
    selfManagement: 84,
    socialAwareness: 91,
    relationshipSkills: 87,
    decisionMaking: 83,
  },
];

export const EmotionalClimateTrendsChart: React.FC = () => {
  const [metricCategory, setMetricCategory] = useState<'climate' | 'domains'>('climate');

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">
              Longitudinal Growth Trends
            </span>
            <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 text-[10px] font-bold font-mono">
              Multi-Wave Analysis
            </span>
          </div>
          <h3 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
            Emotional Climate & Developmental Trajectories
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Multi-wave tracking across Baseline, Early Check, Midline, Endline, and Year 2 maintenance.
          </p>
        </div>

        {/* View Switcher */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setMetricCategory('climate')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              metricCategory === 'climate'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>School Climate & Safety</span>
          </button>
          <button
            onClick={() => setMetricCategory('domains')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              metricCategory === 'domains'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>5 Core CEQHS Domains</span>
          </button>
        </div>
      </div>

      {/* Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {metricCategory === 'climate' ? (
          <>
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Classroom Belonging</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">91%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+17%)</span>
              </div>
              <span className="text-[10px] text-stone-500 block mt-0.5">Up from 74% baseline</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Emotional Safety</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">88%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+20%)</span>
              </div>
              <span className="text-[10px] text-stone-500 block mt-0.5">Safe asking for help</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Adult Staff Safety</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">89%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+18%)</span>
              </div>
              <span className="text-[10px] text-stone-500 block mt-0.5">Non-punitive reflection</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Help-Seeking</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">86%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+21%)</span>
              </div>
              <span className="text-[10px] text-stone-500 block mt-0.5">Learner voice growth</span>
            </div>
          </>
        ) : (
          <>
            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Self-Awareness</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">86%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+22%)</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">Exceeds 85% target</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Self-Management</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">82%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+22%)</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">Exceeds 80% target</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Social Awareness</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">89%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+21%)</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">Highest scoring domain</span>
            </div>

            <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
              <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Decision-Making</span>
              <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-xl font-bold font-mono text-[#1B3626]">81%</span>
                <span className="text-[11px] text-emerald-700 font-mono font-bold">(+23%)</span>
              </div>
              <span className="text-[10px] text-emerald-800 font-medium">Strongest % gain</span>
            </div>
          </>
        )}
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={CLIMATE_TRENDS_DATA}
            margin={{ top: 15, right: 25, left: -10, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
            <XAxis
              dataKey="waveLabel"
              tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
              axisLine={{ stroke: '#D1D5DB' }}
              tickLine={false}
            />
            <YAxis
              tick={{ fill: '#6B7280', fontSize: 11 }}
              axisLine={false}
              tickLine={false}
              domain={[50, 100]}
              ticks={[50, 60, 70, 80, 90, 100]}
            />
            <ReferenceLine
              y={85}
              stroke="#D97706"
              strokeDasharray="4 4"
              label={{
                value: 'Accreditation Benchmark (85%)',
                fill: '#B45309',
                fontSize: 10,
                position: 'insideTopRight',
              }}
            />
            <Tooltip
              content={({ active, payload, label }) => {
                if (active && payload && payload.length) {
                  const data = payload[0].payload as ClimateWavePoint;
                  return (
                    <div className="bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 text-xs space-y-2 min-w-[200px]">
                      <div className="font-bold text-stone-900 border-b border-stone-100 pb-1 flex justify-between">
                        <span>{label} Wave</span>
                        <span className="text-stone-500 font-mono text-[11px]">{data.date}</span>
                      </div>
                      <div className="space-y-1 text-[11px]">
                        {payload.map((entry, index) => (
                          <div key={`item-${index}`} className="flex items-center justify-between gap-3">
                            <span className="flex items-center gap-1.5 text-stone-600">
                              <span
                                className="w-2.5 h-2.5 rounded-full inline-block"
                                style={{ backgroundColor: entry.color }}
                              />
                              {entry.name}:
                            </span>
                            <span className="font-bold font-mono text-stone-800">{entry.value}%</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Legend
              verticalAlign="top"
              align="right"
              wrapperStyle={{ paddingBottom: 10, fontSize: 12 }}
            />

            {metricCategory === 'climate' ? (
              <>
                <Line
                  type="monotone"
                  dataKey="belonging"
                  name="Classroom Belonging"
                  stroke="#1B3626"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1B3626' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="emotionalSafety"
                  name="Emotional Safety"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#059669' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="adultSafety"
                  name="Adult Staff Safety"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#7C3AED' }}
                  activeDot={{ r: 6 }}
                />
                <Line
                  type="monotone"
                  dataKey="helpSeeking"
                  name="Help-Seeking Confidence"
                  stroke="#2563EB"
                  strokeWidth={2}
                  strokeDasharray="4 2"
                  dot={{ r: 3.5, fill: '#2563EB' }}
                  activeDot={{ r: 6 }}
                />
              </>
            ) : (
              <>
                <Line
                  type="monotone"
                  dataKey="selfAwareness"
                  name="Self-Awareness"
                  stroke="#1B3626"
                  strokeWidth={2.5}
                  dot={{ r: 4, fill: '#1B3626' }}
                />
                <Line
                  type="monotone"
                  dataKey="selfManagement"
                  name="Self-Management"
                  stroke="#D97706"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#D97706' }}
                />
                <Line
                  type="monotone"
                  dataKey="socialAwareness"
                  name="Social Awareness"
                  stroke="#059669"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#059669' }}
                />
                <Line
                  type="monotone"
                  dataKey="relationshipSkills"
                  name="Relationship Skills"
                  stroke="#2563EB"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#2563EB' }}
                />
                <Line
                  type="monotone"
                  dataKey="decisionMaking"
                  name="Responsible Decision-Making"
                  stroke="#7C3AED"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#7C3AED' }}
                />
              </>
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Ethical Safeguard Note */}
      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-[#4A6B53] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Non-Diagnostic Formative Measurement:</strong> Emotional climate indicators are aggregated at the school level and reported as developmental progressions. Individual student scores are never ranked, and results are used strictly to inform adult coaching, classroom routines, and institutional support.
        </p>
      </div>
    </div>
  );
};
