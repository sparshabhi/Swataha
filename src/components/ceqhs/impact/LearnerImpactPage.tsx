import React from 'react';
import {
  Sprout,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Users,
  Clock,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { SWATARA_IMPACT_INDICATORS } from '../../../data/impactEvidenceData';
import { ImpactIndicator } from '../../../types/impactEvidence';

interface LearnerImpactPageProps {
  onSelectIndicator: (ind: ImpactIndicator) => void;
}

export const LearnerImpactPage: React.FC<LearnerImpactPageProps> = ({ onSelectIndicator }) => {
  const learnerIndicators = SWATARA_IMPACT_INDICATORS.filter(
    (ind) => ind.impactLevel === 'learner' || ind.domain === 'Self-Awareness' || ind.domain === 'Self-Management & Regulation'
  );

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
            Impact Layer 1
          </span>
          <span className="text-xs text-stone-500 font-medium">Grades 1–5 Primary Cohort</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Learner Emotional Literacy &amp; Self-Regulation
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Detailed before-and-after change cards tracking learner developmental shifts. Metrics adhere strictly to observational and reflective evidence without psycho-diagnostic labeling or unsupported causal claims.
        </p>
      </div>

      {/* SECTION 5.7: ADULT-TO-LEARNER PATHWAY INFOGRAPHIC */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Adult-to-Learner Theory-of-Change Pathway
            </h2>
            <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900">
              Plausible Mechanism · Not Automatic Causality
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Demonstrating how adult somatic grounding models an emotionally safe container in which children gain the daily opportunity to practice self-regulation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 pt-2">
          {[
            {
              step: '1. Adult Awareness',
              desc: 'Educators notice personal somatic stress triggers and muscle tension before escalating.',
              evidence: '22 confidential journals',
            },
            {
              step: '2. Adult Regulation',
              desc: 'Teacher takes a 3-breath pause and models calm tonality in response to classroom friction.',
              evidence: '12 coaching walkthroughs',
            },
            {
              step: '3. Safe Classroom',
              desc: 'Predictable morning weather check-in establishes psychological safety without shame.',
              evidence: '18 active homerooms',
            },
            {
              step: '4. Learner Practice',
              desc: 'Children place weather tokens and engage 3-breath acoustic chime pauses post-recess.',
              evidence: '342 active learners',
            },
            {
              step: '5. Learner Agency',
              desc: 'Children independently articulate needs and resolve playground conflicts at the bench.',
              evidence: '69% bench resolution',
            },
          ].map((node, i) => (
            <div
              key={i}
              className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-2 flex flex-col justify-between"
            >
              <div>
                <span className="text-[10px] font-bold text-[#1B3626] uppercase tracking-wider block">
                  {node.step}
                </span>
                <p className="text-xs text-stone-700 mt-1 leading-snug">{node.desc}</p>
              </div>
              <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-400 font-mono">
                {node.evidence}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* SECTION 5.3: BEFORE-AND-AFTER CHANGE CARDS */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Approved Comparable Measures (Before &amp; After Change Cards)
          </h2>
          <span className="text-xs text-stone-500 italic">
            Mandatory Cautious Label: "Change observed during implementation"
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {learnerIndicators.map((ind) => {
            const absChange = (ind.endlineValue ?? ind.midlineValue ?? 0) - ind.baselineValue;
            const isPositive = ind.unit === 'min' ? absChange < 0 : absChange > 0;

            return (
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
                      <h3 className="text-base font-bold text-stone-900 mt-1">
                        {ind.name}
                      </h3>
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60 shrink-0">
                      {ind.evidenceStrength}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {ind.description}
                  </p>
                </div>

                {/* Quantitative Before-Midline-After Grid */}
                <div className="grid grid-cols-3 gap-2 p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 text-center">
                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">
                      Starting Point (Baseline)
                    </span>
                    <span className="text-base font-bold text-stone-600">
                      {ind.baselineValue} {ind.unit}
                    </span>
                    <span className="text-[10px] text-stone-400 block mt-0.5">Sep 2026</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">
                      Current Position (Midline)
                    </span>
                    <span className="text-base font-bold text-stone-900">
                      {ind.midlineValue ?? ind.endlineValue} {ind.unit}
                    </span>
                    <span className="text-[10px] text-emerald-800 font-medium block mt-0.5">Oct 2026</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold uppercase text-stone-400 block">
                      Change Observed
                    </span>
                    <span className={`text-base font-bold ${isPositive ? 'text-emerald-800' : 'text-stone-700'}`}>
                      {absChange > 0 ? `+${absChange.toFixed(1)}` : absChange.toFixed(1)} {ind.unit}
                    </span>
                    <span className="text-[10px] text-stone-500 block mt-0.5">
                      {isPositive ? 'Observed growth' : 'Latency reduction'}
                    </span>
                  </div>
                </div>

                {/* Contextual & Methodological Rigor */}
                <div className="space-y-1.5 text-[11px] text-stone-600">
                  <div className="flex items-center justify-between text-stone-500">
                    <span>Informant Source: <strong className="capitalize text-stone-800">{ind.informant.replace(/_/g, ' ')}</strong></span>
                    <span>Sample: <strong className="text-stone-800">{ind.sampleSize}</strong> (Resp: {ind.responseRate}%)</span>
                  </div>
                  <div className="p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-950 text-[10px] leading-relaxed">
                    <strong>Cautionary Interpretation:</strong> {ind.cautiousInterpretation}
                  </div>
                </div>

                {/* Footer Traceability Button */}
                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <span className="text-[11px] text-stone-400">
                    {ind.evidenceLinks.length} approved dossier record(s)
                  </span>
                  <button
                    onClick={() => onSelectIndicator(ind)}
                    className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B3626] bg-[#EAF0EB] hover:bg-[#d6e4d8] transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <span>View Evidence Provenance</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
