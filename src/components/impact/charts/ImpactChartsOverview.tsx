import React, { useState } from 'react';
import { SchoolParticipationChart } from './SchoolParticipationChart';
import { EmotionalClimateTrendsChart } from './EmotionalClimateTrendsChart';
import { AlignmentProgressChart } from './AlignmentProgressChart';
import { Users, HeartHandshake, Compass, BarChart3, Layers, Sparkles } from 'lucide-react';

interface ImpactChartsOverviewProps {
  initialActiveChart?: 'all' | 'participation' | 'climate' | 'alignment';
}

export const ImpactChartsOverview: React.FC<ImpactChartsOverviewProps> = ({
  initialActiveChart = 'all',
}) => {
  const [activeChart, setActiveChart] = useState<'all' | 'participation' | 'climate' | 'alignment'>(
    initialActiveChart
  );

  return (
    <div className="space-y-6">
      {/* Top Filter Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 sm:p-5 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#EAF0EB] text-[#1B3626] flex items-center justify-center font-bold">
            <BarChart3 className="w-5 h-5 text-[#2D5A3D]" />
          </div>
          <div>
            <h4 className="text-sm font-bold text-stone-900">
              Interactive Impact Visualizations (Recharts)
            </h4>
            <p className="text-[11px] text-stone-500">
              Quantitative telemetry, longitudinal climate trajectories, and institutional fidelity alignment.
            </p>
          </div>
        </div>

        {/* Chart View Filters */}
        <div className="flex flex-wrap items-center bg-stone-100 p-1 rounded-xl border border-stone-200 text-xs">
          <button
            onClick={() => setActiveChart('all')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Complete Suite (All 3)</span>
          </button>
          <button
            onClick={() => setActiveChart('participation')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'participation'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>1. Participation</span>
          </button>
          <button
            onClick={() => setActiveChart('climate')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'climate'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <HeartHandshake className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>2. Climate Trends</span>
          </button>
          <button
            onClick={() => setActiveChart('alignment')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
              activeChart === 'alignment'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>3. Alignment</span>
          </button>
        </div>
      </div>

      {/* Render Selected Charts */}
      {(activeChart === 'all' || activeChart === 'participation') && (
        <SchoolParticipationChart />
      )}

      {(activeChart === 'all' || activeChart === 'climate') && (
        <EmotionalClimateTrendsChart />
      )}

      {(activeChart === 'all' || activeChart === 'alignment') && (
        <AlignmentProgressChart />
      )}
    </div>
  );
};
