import React from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  ArrowRight,
  TrendingUp,
  Clock,
  Users,
  Sprout,
  Compass,
} from 'lucide-react';
import { SWATARA_IMPACT_INDICATORS } from '../../../data/impactEvidenceData';
import { ImpactIndicator } from '../../../types/impactEvidence';

interface ClassroomAndRelationshipPageProps {
  onSelectIndicator: (ind: ImpactIndicator) => void;
}

export const ClassroomAndRelationshipPage: React.FC<ClassroomAndRelationshipPageProps> = ({
  onSelectIndicator,
}) => {
  const classroomIndicators = SWATARA_IMPACT_INDICATORS.filter(
    (ind) => ind.impactLevel === 'classroom_relationship' || ind.code === 'LRN.REG.02'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900">
            Impact Layer 3
          </span>
          <span className="text-xs text-stone-500 font-medium">20 Primary Classrooms &amp; Shared Spaces</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Classroom Dynamics &amp; Relational Restorative Practice
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Observational tracking of classroom calm, transition latency following energetic play, peer perspective-taking circles, and student agency at the Restorative Bench.
        </p>
      </div>

      {/* Observational Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {classroomIndicators.map((ind) => (
          <div
            key={ind.id}
            className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700 font-mono">
                    {ind.code}
                  </span>
                  <h3 className="text-base font-bold text-stone-900 mt-1">{ind.name}</h3>
                </div>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60 shrink-0">
                  {ind.evidenceStrength}
                </span>
              </div>
              <p className="text-xs text-stone-600 leading-relaxed">{ind.description}</p>
            </div>

            <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 text-center">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Baseline</span>
                <span className="text-base font-bold text-stone-600">
                  {ind.baselineValue} {ind.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Current</span>
                <span className="text-base font-bold text-stone-900">
                  {ind.midlineValue ?? ind.endlineValue} {ind.unit}
                </span>
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400 block">Observed Shift</span>
                <span className="text-base font-bold text-emerald-800">
                  {ind.unit === 'min'
                    ? `-${(ind.baselineValue - (ind.midlineValue ?? 0)).toFixed(1)} min`
                    : `+${((ind.midlineValue ?? 0) - ind.baselineValue).toFixed(0)}%`}
                </span>
              </div>
            </div>

            <div className="space-y-1.5 text-[11px] text-stone-600">
              <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-950 text-[10px] leading-relaxed">
                <strong>Methodological Context:</strong> {ind.cautiousInterpretation}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
              <span className="text-[11px] text-stone-400">
                Sample: {ind.sampleSize} · Verified via {ind.informant.replace(/_/g, ' ')}
              </span>
              <button
                onClick={() => onSelectIndicator(ind)}
                className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B3626] bg-[#EAF0EB] hover:bg-[#d6e4d8] transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>View Evidence</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Focus Showcase: Restorative Bench Protocol */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Classroom Practice Showcase: The 4-Part Restorative Conversation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
          {[
            {
              step: 'Step 1: Grounding Breath',
              desc: 'Both peers take a synchronized 3-breath acoustic chime pause before speaking.',
            },
            {
              step: 'Step 2: Weather Reflection',
              desc: '"What happened, and what inner weather were you carrying when it started?"',
            },
            {
              step: 'Step 3: Relational Impact',
              desc: '"Who was impacted, and what was the hardest part for the other person?"',
            },
            {
              step: 'Step 4: Mutual Repair Covenant',
              desc: '"What concrete, dignified action will make things right today?"',
            },
          ].map((s, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-white border border-stone-200/80 space-y-1">
              <span className="text-[10px] font-bold text-[#1B3626] uppercase">{s.step}</span>
              <p className="text-[11px] text-stone-600 leading-snug">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
