import React, { useState } from 'react';
import {
  CheckCircle2,
  Users,
  Clock,
  ArrowDown,
  Info,
  Layers,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import {
  SWATARA_IMPLEMENTATION_FUNNEL,
  SWATARA_EVIDENCE_LINKS,
} from '../../../data/impactEvidenceData';
import { EvidenceLink } from '../../../types/impactEvidence';

interface ImplementationQualityPageProps {
  onSelectEvidence: (ev: EvidenceLink) => void;
}

export const ImplementationQualityPage: React.FC<ImplementationQualityPageProps> = ({
  onSelectEvidence,
}) => {
  const [filterCohort, setFilterCohort] = useState<'All Learners' | 'Early Primary (Grades 1–2)' | 'Upper Primary (Grades 3–5)'>('All Learners');

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
            Impact Layer 6
          </span>
          <span className="text-xs text-stone-500 font-medium">Fidelity, Dose &amp; Exposure</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Implementation Quality &amp; Exposure Funnel
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          A rigorous delivery audit tracking drop-off from enrollment to independent practice. This prevents the school from confusing programme availability on paper with genuine student and educator exposure.
        </p>
      </div>

      {/* SECTION 5.5: THE IMPLEMENTATION FUNNEL */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Student Exposure &amp; Fidelity Funnel
            </h2>
            <p className="text-xs text-stone-500">
              Tracking drop-off at every progressive threshold from eligibility to evidence.
            </p>
          </div>

          <select
            value={filterCohort}
            onChange={(e) => setFilterCohort(e.target.value as any)}
            className="px-3 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-700 text-xs font-medium cursor-pointer self-start sm:self-auto"
          >
            <option value="All Learners">All Learners (Grades 1–5)</option>
            <option value="Early Primary (Grades 1–2)">Early Primary (Grades 1–2)</option>
            <option value="Upper Primary (Grades 3–5)">Upper Primary (Grades 3–5)</option>
          </select>
        </div>

        {/* Funnel Steps */}
        <div className="space-y-3">
          {SWATARA_IMPLEMENTATION_FUNNEL.map((step, idx) => (
            <div
              key={idx}
              className="p-4 rounded-xl border border-stone-200/80 bg-[#FAF8F5] hover:bg-white hover:border-emerald-700/40 transition-all space-y-2"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="w-6 h-6 rounded-full bg-[#1B3626] text-white text-xs font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-stone-900 text-xs">{step.stage}</h3>
                    <span className="text-[11px] text-stone-500">{step.dropOffReason}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:text-right shrink-0">
                  <div>
                    <span className="text-base font-bold text-stone-900">
                      {step.reachedCount} / {step.eligibleCount}
                    </span>
                    <span className="text-[10px] text-stone-400 block">students</span>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#EAF0EB] text-[#1B3626]">
                    {step.percentageOfEligible}%
                  </span>
                </div>
              </div>

              {/* Progress Bar with drop-off indication */}
              <div className="w-full bg-stone-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-[#1B3626] h-full rounded-full transition-all"
                  style={{ width: `${step.percentageOfEligible}%` }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1">
                <span>Record Ref: <strong className="font-mono text-stone-600">{step.evidenceRecordRef}</strong></span>
                <button
                  onClick={() => onSelectEvidence(SWATARA_EVIDENCE_LINKS['ev-reach-01'])}
                  className="text-emerald-900 font-medium hover:underline cursor-pointer"
                >
                  Verify audit log →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Classroom Fidelity Breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Classroom Reach
          </span>
          <div className="text-2xl font-bold text-stone-900">18 / 20</div>
          <p className="text-xs text-stone-500">90% of primary classrooms active daily.</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Facilitation Fidelity Score
          </span>
          <div className="text-2xl font-bold text-emerald-800">88.4%</div>
          <p className="text-xs text-stone-500">Adherence to 3-breath acoustic chime protocols.</p>
        </div>

        <div className="bg-white rounded-xl p-5 border border-stone-200/80 shadow-xs space-y-1">
          <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block">
            Coaching Walkthroughs
          </span>
          <div className="text-2xl font-bold text-blue-900">12 completed</div>
          <p className="text-xs text-stone-500">Unannounced supportive observations in Term 1.</p>
        </div>
      </div>
    </div>
  );
};
