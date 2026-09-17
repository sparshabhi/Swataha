import React, { useState } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine,
  Cell,
} from 'recharts';
import { Compass, Award, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface FidelityAlignmentItem {
  indicator: string;
  achieved: number;
  target: number;
  category: string;
  status: 'exceeds' | 'meets' | 'developing';
}

interface DomainAlignmentItem {
  domain: string;
  baseline: number;
  current: number;
  target: number;
  growth: number;
}

const FIDELITY_ALIGNMENT_DATA: FidelityAlignmentItem[] = [
  { indicator: 'Core Components Adherence', achieved: 92, target: 90, category: 'Curriculum', status: 'exceeds' },
  { indicator: 'Protected Timetable Time', achieved: 91, target: 90, category: 'Scheduling', status: 'exceeds' },
  { indicator: 'Dose Delivery (Sessions)', achieved: 92, target: 85, category: 'Dosage', status: 'exceeds' },
  { indicator: 'Learner Reach Rate', achieved: 94, target: 90, category: 'Reach', status: 'exceeds' },
  { indicator: 'Faculty Onboarding Active', achieved: 96, target: 90, category: 'Adult Capacity', status: 'exceeds' },
  { indicator: 'Minimum Dose (≥80% att)', achieved: 88, target: 85, category: 'Dosage', status: 'meets' },
  { indicator: 'Values-in-Action Dossiers', achieved: 89, target: 80, category: 'Authentic Tasks', status: 'exceeds' },
];

const DOMAIN_ALIGNMENT_DATA: DomainAlignmentItem[] = [
  { domain: 'Self-Awareness', baseline: 64, current: 86, target: 85, growth: 22 },
  { domain: 'Self-Management', baseline: 60, current: 82, target: 80, growth: 22 },
  { domain: 'Social Awareness', baseline: 68, current: 89, target: 85, growth: 21 },
  { domain: 'Relationship Skills', baseline: 62, current: 85, target: 85, growth: 23 },
  { domain: 'Decision-Making', baseline: 58, current: 81, target: 80, growth: 23 },
];

export const AlignmentProgressChart: React.FC = () => {
  const [alignmentMode, setAlignmentMode] = useState<'fidelity' | 'domains'>('fidelity');

  const overallFidelityScore = Math.round(
    FIDELITY_ALIGNMENT_DATA.reduce((acc, curr) => acc + curr.achieved, 0) / FIDELITY_ALIGNMENT_DATA.length
  );

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">
              Accreditation & Quality Alignment
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold font-mono">
              100% Benchmarks Met
            </span>
          </div>
          <h3 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
            Institutional Alignment Progress vs Standards
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Demonstrating alignment across implementation fidelity criteria and developmental domain benchmarks.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setAlignmentMode('fidelity')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              alignmentMode === 'fidelity'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Curriculum & Fidelity Alignment</span>
          </button>
          <button
            onClick={() => setAlignmentMode('domains')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              alignmentMode === 'domains'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Award className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>5-Domain Benchmark Alignment</span>
          </button>
        </div>
      </div>

      {/* Alignment Highlights Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Average Alignment</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#1B3626]">{overallFidelityScore}%</span>
            <span className="text-[11px] text-emerald-700 font-mono font-bold">(Target: 90%)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Fully accredited grade
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Core Fidelity Rate</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#1B3626]">92%</span>
          </div>
          <span className="text-[10px] text-stone-500 block mt-0.5">Audited delivery quality</span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Domain Alignment</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#1B3626]">5 of 5</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> 100% meet/exceed target
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Average Domain Gain</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-800">+22.2%</span>
          </div>
          <span className="text-[10px] text-stone-500 block mt-0.5">Sept 2026 to May 2027</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {alignmentMode === 'fidelity' ? (
            <BarChart
              data={FIDELITY_ALIGNMENT_DATA}
              layout="vertical"
              margin={{ top: 10, right: 30, left: 40, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" horizontal={false} />
              <XAxis
                type="number"
                domain={[70, 100]}
                ticks={[70, 75, 80, 85, 90, 95, 100]}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
              />
              <YAxis
                type="category"
                dataKey="indicator"
                tick={{ fill: '#374151', fontSize: 11, fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
                width={160}
              />
              <ReferenceLine
                x={90}
                stroke="#D97706"
                strokeDasharray="4 4"
                label={{
                  value: 'Target (90%)',
                  fill: '#B45309',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as FidelityAlignmentItem;
                    return (
                      <div className="bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 text-xs space-y-1.5 min-w-[200px]">
                        <div className="font-bold text-stone-900 border-b border-stone-100 pb-1 flex justify-between">
                          <span>{data.indicator}</span>
                          <span className="text-emerald-700 font-mono">{data.achieved}%</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-stone-600 font-mono">
                          <div className="flex justify-between">
                            <span className="text-stone-500">Category:</span>
                            <span className="text-stone-800">{data.category}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Target Standard:</span>
                            <span className="text-stone-800">{data.target}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Variance:</span>
                            <span className="font-bold text-emerald-700">
                              +{data.achieved - data.target}%
                            </span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-stone-100">
                            <span className="text-stone-500">Audit Status:</span>
                            <span className="font-bold text-[#1B3626] uppercase">
                              {data.status === 'exceeds' ? 'Exceeds Benchmark' : 'Meets Benchmark'}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="achieved"
                name="Achieved Level (%)"
                fill="#1B3626"
                radius={[0, 6, 6, 0]}
                barSize={16}
              >
                {FIDELITY_ALIGNMENT_DATA.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.achieved >= 90 ? '#1B3626' : '#2D5A3D'}
                  />
                ))}
              </Bar>
            </BarChart>
          ) : (
            <BarChart
              data={DOMAIN_ALIGNMENT_DATA}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="domain"
                tick={{ fill: '#4B5563', fontSize: 11, fontWeight: 500 }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
              />
              <YAxis
                domain={[50, 100]}
                ticks={[50, 60, 70, 80, 90, 100]}
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <ReferenceLine
                y={85}
                stroke="#D97706"
                strokeDasharray="4 4"
                label={{
                  value: 'CEQHS Target (85%)',
                  fill: '#B45309',
                  fontSize: 10,
                  position: 'insideTopRight',
                }}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as DomainAlignmentItem;
                    return (
                      <div className="bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 text-xs space-y-1.5 min-w-[210px]">
                        <div className="font-bold text-stone-900 border-b border-stone-100 pb-1 flex justify-between">
                          <span>{label}</span>
                          <span className="text-emerald-700 font-mono font-bold">
                            +{data.growth}% Gain
                          </span>
                        </div>
                        <div className="space-y-1 text-[11px] text-stone-600 font-mono">
                          <div className="flex justify-between">
                            <span className="text-stone-500">Baseline (Sept):</span>
                            <span className="text-stone-800">{data.baseline}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Endline (May):</span>
                            <span className="font-bold text-[#1B3626]">{data.current}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-stone-500">Accreditation Target:</span>
                            <span className="text-amber-700 font-bold">{data.target}%</span>
                          </div>
                          <div className="flex justify-between pt-1 border-t border-stone-100">
                            <span className="text-stone-500">Alignment Status:</span>
                            <span className="font-bold text-emerald-800">
                              {data.current >= data.target ? 'Target Achieved' : 'In Progress'}
                            </span>
                          </div>
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
              <Bar
                dataKey="baseline"
                name="Baseline Score"
                fill="#CBD5E1"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="current"
                name="Endline Score"
                fill="#1B3626"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="target"
                name="Accreditation Target"
                fill="#FBBF24"
                radius={[6, 6, 0, 0]}
                barSize={12}
              />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Context note */}
      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#4A6B53] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Standards-Based Assessment:</strong> Alignment benchmarks correspond to Section 11 of the CEQHS Living Journey implementation guidelines. Meeting core fidelity and protected timetable standards ensures that observed student growth is authentic, reproducible, and institutionally supported.
        </p>
      </div>
    </div>
  );
};
