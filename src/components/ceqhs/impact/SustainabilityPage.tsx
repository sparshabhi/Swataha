import React from 'react';
import {
  Compass,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SWATARA_SUSTAINABILITY_DIMENSIONS } from '../../../data/impactEvidenceData';

export const SustainabilityPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-teal-100 text-teal-900">
            Impact Layer 8
          </span>
          <span className="text-xs text-stone-500 font-medium">Long-Term Institutional Capacity</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Sustainability Readiness Profile
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          A multi-dimensional readiness diagnostic assessing whether CEQHS routines will endure without ongoing external intervention. Displayed as an institutional profile across 10 governance pillars—never a single reductive score.
        </p>
      </div>

      {/* 10 DIMENSIONS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SWATARA_SUSTAINABILITY_DIMENSIONS.map((dim) => {
          const isInst = dim.status === 'Institutionalized';
          const isDev = dim.status === 'Developing';

          return (
            <div
              key={dim.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-bold text-stone-900 text-xs leading-snug">
                    {dim.title}
                  </h3>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      isInst
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                        : isDev
                        ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-900 border border-rose-200/60'
                    }`}
                  >
                    {dim.status}
                  </span>
                </div>

                <div className="text-[11px] text-stone-500">
                  Leadership Lead: <strong className="text-stone-800">{dim.leadRole}</strong>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/60">
                  {dim.evidenceNotes}
                </p>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-emerald-900 font-medium text-[10px]">
                  Next Step: {dim.nextStep}
                </span>
                <span className="text-stone-400 font-mono text-[10px]">
                  Level {dim.scoreLevel} / 3
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
