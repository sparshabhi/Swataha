import React from 'react';
import {
  HeartHandshake,
  ShieldCheck,
  UserCheck,
  Lock,
  ArrowRight,
  TrendingUp,
  AlertCircle,
} from 'lucide-react';
import { SWATARA_IMPACT_INDICATORS } from '../../../data/impactEvidenceData';
import { ImpactIndicator } from '../../../types/impactEvidence';

interface AdultPracticeImpactPageProps {
  onSelectIndicator: (ind: ImpactIndicator) => void;
}

export const AdultPracticeImpactPage: React.FC<AdultPracticeImpactPageProps> = ({ onSelectIndicator }) => {
  const adultIndicator = SWATARA_IMPACT_INDICATORS.find((ind) => ind.impactLevel === 'adult');

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900">
            Impact Layer 2
          </span>
          <span className="text-xs text-stone-500 font-medium">Faculty &amp; Staff (22 Educators)</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Adult Professional Practice &amp; Somatic Modeling
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Adult development is never treated as merely an advanced version of child SEL, and attendance hours never equal practice mastery. We track observable shifts in somatic pausing, mindful communication, and emotional presence during classroom friction.
        </p>
      </div>

      {/* Adult Competency Growth Ledger */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core Metric Card */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
              Observable Adult Shift Under Friction
            </h2>
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200/60">
              Strong School-Level Evidence
            </span>
          </div>

          {adultIndicator && (
            <div className="p-5 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">{adultIndicator.name}</h3>
                  <span className="text-xs text-stone-500 font-mono">{adultIndicator.code}</span>
                </div>
                <div className="text-right">
                  <span className="text-2xl font-bold text-emerald-800">
                    {adultIndicator.endlineValue ?? adultIndicator.midlineValue}%
                  </span>
                  <span className="text-[10px] text-stone-400 block">Current adherence</span>
                </div>
              </div>

              {/* Baseline vs Current Progress Bar */}
              <div className="space-y-1">
                <div className="flex justify-between text-[11px] text-stone-500">
                  <span>Baseline (Sep): {adultIndicator.baselineValue}%</span>
                  <span className="font-semibold text-emerald-800">Growth: +52% points</span>
                </div>
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#1B3626] h-full rounded-full transition-all"
                    style={{ width: `${adultIndicator.endlineValue ?? adultIndicator.midlineValue}%` }}
                  />
                </div>
              </div>

              <p className="text-xs text-stone-700 leading-relaxed pt-1">
                {adultIndicator.description}
              </p>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200/60 text-amber-950 text-[11px]">
                <strong>Scientific Restraint:</strong> {adultIndicator.cautiousInterpretation}
              </div>

              <div className="pt-2 flex items-center justify-between border-t border-stone-200/60">
                <span className="text-[11px] text-stone-500">
                  Sample: {adultIndicator.sampleSize} educators · {adultIndicator.responseRate}% audit rate
                </span>
                <button
                  onClick={() => onSelectIndicator(adultIndicator)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B3626] bg-[#EAF0EB] hover:bg-[#d6e4d8] transition-colors flex items-center gap-1 cursor-pointer"
                >
                  <span>View Coaching Provenance</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 8 Adult Competency Domains Status */}
          <div className="space-y-2 pt-2">
            <h3 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
              8 Adult Professional Presence Domains
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {[
                { name: '1. Self-Awareness of Physical Triggers', status: '78% Practicing' },
                { name: '2. Regulating Stress Under Pressure', status: '76% Practicing' },
                { name: '3. Relational & Non-Punitive Communication', status: '82% Practicing' },
                { name: '4. Mindful Routine Facilitation', status: '90% Practicing' },
                { name: '5. Non-Judgmental Peer Coaching', status: '64% Practicing' },
                { name: '6. Cultural & Sensory Inclusivity', status: '86% Practicing' },
                { name: '7. Values-Driven Ethical Modeling', status: '88% Practicing' },
                { name: '8. Confidential Reflexive Journaling', status: '86% Practicing' },
              ].map((dom, i) => (
                <div
                  key={i}
                  className="p-2.5 rounded-lg border border-stone-200/70 bg-white flex items-center justify-between"
                >
                  <span className="text-stone-800 font-medium text-[11px]">{dom.name}</span>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {dom.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Confidential Protection & Policy */}
        <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200/80 shadow-xs flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center border border-purple-200">
              <Lock className="w-5 h-5" />
            </div>

            <h3 className="text-base font-bold text-stone-900">
              Strict Non-Evaluative Journaling Policy
            </h3>

            <p className="text-xs text-stone-600 leading-relaxed">
              Teacher somatic reflection slips and personal trigger entries are encrypted and strictly protected from appraisal scrutiny.
            </p>

            <div className="p-3.5 rounded-xl bg-white border border-stone-200/80 text-stone-700 text-xs space-y-2">
              <div className="font-bold text-stone-900 text-xs">Governance Safeguards:</div>
              <ul className="space-y-1.5 text-[11px] list-disc list-inside text-stone-600">
                <li>Never used for performance reviews or salary decisions.</li>
                <li>Reported only in aggregate counts to protect psychological safety.</li>
                <li>Focuses on self-compassion and physiological reset routines.</li>
              </ul>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-purple-50 border border-purple-200 text-purple-950 text-[11px]">
            <strong>Institutional Standard:</strong> When adults feel safe to be human, students feel safe to learn.
          </div>
        </div>
      </div>
    </div>
  );
};
