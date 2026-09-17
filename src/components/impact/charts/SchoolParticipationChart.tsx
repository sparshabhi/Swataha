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
  Line,
  ComposedChart,
} from 'recharts';
import { Users, Calendar, CheckCircle2, TrendingUp, Info } from 'lucide-react';

interface CohortData {
  cohort: string;
  enrolled: number;
  participating: number;
  participationRate: number;
  responseRate: number;
}

interface MonthlyDoseData {
  month: string;
  planned: number;
  delivered: number;
  cumulativePlanned: number;
  cumulativeDelivered: number;
  adherencePercent: number;
}

const COHORT_PARTICIPATION_DATA: CohortData[] = [
  { cohort: 'Grade 1', enrolled: 30, participating: 29, participationRate: 96.7, responseRate: 94 },
  { cohort: 'Grade 2', enrolled: 32, participating: 30, participationRate: 93.8, responseRate: 92 },
  { cohort: 'Grade 3', enrolled: 31, participating: 29, participationRate: 93.5, responseRate: 95 },
  { cohort: 'Grade 4', enrolled: 30, participating: 28, participationRate: 93.3, responseRate: 93 },
  { cohort: 'Grade 5', enrolled: 30, participating: 28, participationRate: 93.3, responseRate: 96 },
  { cohort: 'Faculty/Staff', enrolled: 25, participating: 24, participationRate: 96.0, responseRate: 98 },
];

const MONTHLY_DOSE_DATA: MonthlyDoseData[] = [
  { month: 'Sep', planned: 5, delivered: 5, cumulativePlanned: 5, cumulativeDelivered: 5, adherencePercent: 100 },
  { month: 'Oct', planned: 6, delivered: 6, cumulativePlanned: 11, cumulativeDelivered: 11, adherencePercent: 100 },
  { month: 'Nov', planned: 6, delivered: 5, cumulativePlanned: 17, cumulativeDelivered: 16, adherencePercent: 94 },
  { month: 'Dec', planned: 4, delivered: 4, cumulativePlanned: 21, cumulativeDelivered: 20, adherencePercent: 95 },
  { month: 'Jan', planned: 6, delivered: 5, cumulativePlanned: 27, cumulativeDelivered: 25, adherencePercent: 93 },
  { month: 'Feb', planned: 5, delivered: 5, cumulativePlanned: 32, cumulativeDelivered: 30, adherencePercent: 94 },
  { month: 'Mar', planned: 6, delivered: 5, cumulativePlanned: 38, cumulativeDelivered: 35, adherencePercent: 92 },
  { month: 'Apr', planned: 5, delivered: 5, cumulativePlanned: 43, cumulativeDelivered: 40, adherencePercent: 93 },
  { month: 'May', planned: 5, delivered: 4, cumulativePlanned: 48, cumulativeDelivered: 44, adherencePercent: 92 },
];

export const SchoolParticipationChart: React.FC = () => {
  const [viewMode, setViewMode] = useState<'cohorts' | 'dose'>('cohorts');

  const totalEnrolledLearners = 153;
  const totalParticipatingLearners = 144;
  const overallLearnerReach = Math.round((totalParticipatingLearners / totalEnrolledLearners) * 100);

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-xs space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#4A6B53] uppercase tracking-wider">
              School-Level Participation & Reach
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold font-mono">
              AY 2026–2027
            </span>
          </div>
          <h3 className="text-lg font-editorial font-bold text-stone-900 mt-0.5">
            Cohort Participation & Dose Delivery Adherence
          </h3>
          <p className="text-xs text-stone-600 mt-0.5">
            Transparent tracking of learner enrollment, active attendance, faculty engagement, and scheduled session dose.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs self-start sm:self-auto">
          <button
            onClick={() => setViewMode('cohorts')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'cohorts'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Cohort Reach (Grades 1–5 & Staff)</span>
          </button>
          <button
            onClick={() => setViewMode('dose')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              viewMode === 'dose'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Calendar className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Monthly Dose Adherence</span>
          </button>
        </div>
      </div>

      {/* KPI Highlight Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Learner Reach</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#1B3626]">{overallLearnerReach}%</span>
            <span className="text-[11px] text-stone-500 font-mono">(144/153)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> Exceeds 90% benchmark
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Faculty Participation</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#1B3626]">96%</span>
            <span className="text-[11px] text-stone-500 font-mono">(24/25)</span>
          </div>
          <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-1 mt-0.5">
            <CheckCircle2 className="w-3 h-3" /> High adult engagement
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Session Dose Delivered</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-emerald-800">44 / 48</span>
            <span className="text-[11px] text-stone-500 font-mono">(91.7%)</span>
          </div>
          <span className="text-[10px] text-stone-600 font-medium mt-0.5 block">
            4 rescheduled weather days
          </span>
        </div>

        <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wider block">Avg Response Rate</span>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xl font-bold font-mono text-[#1B3626]">94.6%</span>
          </div>
          <span className="text-[10px] text-stone-500 font-mono mt-0.5 block">
            Missingness: &lt; 5.4%
          </span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {viewMode === 'cohorts' ? (
            <BarChart
              data={COHORT_PARTICIPATION_DATA}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="cohort"
                tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 35]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as CohortData;
                    return (
                      <div className="bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 text-xs space-y-1.5">
                        <div className="font-bold text-stone-900 border-b border-stone-100 pb-1 flex justify-between gap-4">
                          <span>{label}</span>
                          <span className="text-emerald-700 font-mono">{data.participationRate}% Active</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-stone-600 font-mono">
                          <div className="flex justify-between gap-3">
                            <span className="text-stone-500">Enrolled / Total:</span>
                            <span className="font-bold text-stone-800">{data.enrolled}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-stone-500">Active Participants:</span>
                            <span className="font-bold text-[#1B3626]">{data.participating}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-stone-500">Survey Response Rate:</span>
                            <span className="font-bold text-emerald-800">{data.responseRate}%</span>
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
                dataKey="enrolled"
                name="Total Enrolled / Staff"
                fill="#E2E8F0"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
              <Bar
                dataKey="participating"
                name="Actively Participating"
                fill="#1B3626"
                radius={[6, 6, 0, 0]}
                barSize={24}
              />
            </BarChart>
          ) : (
            <ComposedChart
              data={MONTHLY_DOSE_DATA}
              margin={{ top: 15, right: 20, left: -10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" vertical={false} />
              <XAxis
                dataKey="month"
                tick={{ fill: '#4B5563', fontSize: 12, fontWeight: 500 }}
                axisLine={{ stroke: '#D1D5DB' }}
                tickLine={false}
              />
              <YAxis
                tick={{ fill: '#6B7280', fontSize: 11 }}
                axisLine={false}
                tickLine={false}
                domain={[0, 8]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload as MonthlyDoseData;
                    return (
                      <div className="bg-white p-3.5 rounded-xl shadow-lg border border-stone-200 text-xs space-y-1.5">
                        <div className="font-bold text-stone-900 border-b border-stone-100 pb-1 flex justify-between gap-4">
                          <span>{label} 2026–2027</span>
                          <span className="text-emerald-700 font-mono">{data.adherencePercent}% Adherence</span>
                        </div>
                        <div className="space-y-1 text-[11px] text-stone-600 font-mono">
                          <div className="flex justify-between gap-3">
                            <span className="text-stone-500">Planned Sessions:</span>
                            <span className="font-bold text-stone-800">{data.planned}</span>
                          </div>
                          <div className="flex justify-between gap-3">
                            <span className="text-stone-500">Delivered Sessions:</span>
                            <span className="font-bold text-emerald-800">{data.delivered}</span>
                          </div>
                          <div className="flex justify-between gap-3 pt-1 border-t border-stone-100">
                            <span className="text-stone-500">Cumulative Progress:</span>
                            <span className="font-bold text-[#1B3626]">
                              {data.cumulativeDelivered} / {data.cumulativePlanned}
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
                dataKey="planned"
                name="Planned Sessions"
                fill="#E2E8F0"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
              <Bar
                dataKey="delivered"
                name="Delivered Sessions"
                fill="#2D5A3D"
                radius={[6, 6, 0, 0]}
                barSize={20}
              />
            </ComposedChart>
          )}
        </ResponsiveContainer>
      </div>

      {/* Narrative Context Note */}
      <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200/80 text-[11px] text-stone-600 flex items-start gap-2.5">
        <Info className="w-4 h-4 text-[#4A6B53] shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong className="text-stone-800">Fidelity & Dosage Grounding:</strong> Learner outcomes are directly grounded in actual practice opportunity. Swataha Core School sustained a 94.1% learner reach and delivered 44 of 48 curriculum sessions (91.7% dose adherence), meeting CEQHS manual criteria for high-fidelity evaluation.
        </p>
      </div>
    </div>
  );
};
