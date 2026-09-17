import React from 'react';
import {
  ShieldCheck,
  AlertTriangle,
  Info,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SWATARA_CULTURE_HEALTH_MAP } from '../../../data/impactEvidenceData';

interface SchoolCulturePageProps {
  onNavigateDossier: (ref: string) => void;
}

export const SchoolCulturePage: React.FC<SchoolCulturePageProps> = ({ onNavigateDossier }) => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
            Impact Layer 4
          </span>
          <span className="text-xs text-stone-500 font-medium">Institution &amp; Climate</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          School-Culture Health Map
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          A systemic evaluation of school-level emotional climate, belonging, restorative responses, and psychological safety. Red and amber statuses reflect organizational conditions requiring administrative support—never individual deficits.
        </p>
      </div>

      {/* SECTION 5.8: STATUS DEFINITIONS LEGEND */}
      <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex flex-wrap items-center justify-between gap-4 text-xs">
        <span className="font-bold text-stone-700 text-[11px] uppercase tracking-wider">
          Standard Definitions:
        </span>
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
            <span className="text-stone-700"><strong>Green:</strong> Evidence indicates planned standard currently met</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
            <span className="text-stone-700"><strong>Amber:</strong> Partial, inconsistent, or incomplete evidence</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
            <span className="text-stone-700"><strong>Red:</strong> Standard not currently met / needs administrative review</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
            <span className="text-stone-700"><strong>Grey:</strong> Insufficient evidence gathered</span>
          </div>
        </div>
      </div>

      {/* HEALTH MAP GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SWATARA_CULTURE_HEALTH_MAP.map((item) => {
          const isGreen = item.status === 'green';
          const isAmber = item.status === 'amber';
          const isRed = item.status === 'red';

          return (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        isGreen
                          ? 'bg-emerald-600'
                          : isAmber
                          ? 'bg-amber-500'
                          : isRed
                          ? 'bg-rose-500'
                          : 'bg-stone-400'
                      }`}
                    />
                    <h3 className="font-bold text-stone-900 text-xs">{item.dimension}</h3>
                  </div>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      isGreen
                        ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                        : isAmber
                        ? 'bg-amber-50 text-amber-900 border border-amber-200/60'
                        : 'bg-rose-50 text-rose-900'
                    }`}
                  >
                    {item.statusLabel}
                  </span>
                </div>

                <p className="text-[11px] text-stone-500 leading-relaxed">
                  {item.description}
                </p>

                <div className="p-3 rounded-xl bg-[#FAF8F5] border border-stone-200/60 text-xs space-y-1">
                  <div className="font-semibold text-stone-800 text-[11px]">
                    Observed Practice Shift:
                  </div>
                  <p className="text-stone-600 text-[11px] leading-relaxed">
                    {item.observedShift}
                  </p>
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px]">
                <span className="text-stone-400 font-mono text-[10px]">
                  Ref: {item.dossierRef}
                </span>
                <button
                  onClick={() => onNavigateDossier(item.dossierRef)}
                  className="text-xs font-semibold text-[#1B3626] hover:underline cursor-pointer"
                >
                  Inspect Dossier Evidence →
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
