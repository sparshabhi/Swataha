import React from 'react';
import {
  Sprout,
  Compass,
  Award,
  CheckCircle2,
  Clock,
  ShieldCheck,
  ArrowRight,
  Layers,
} from 'lucide-react';

export const ThreeYearJourneyPage: React.FC = () => {
  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#1B3626]">
            Longitudinal Progression
          </span>
          <span className="text-xs text-stone-500 font-medium">Three-Year Progressive Accreditation Pathway</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Three-Year Impact Journey
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Tracking the school's progression from Foundation Stage to System Integration and Culture Leadership. Human development requires longitudinal nurturing; we evaluate maturation of practice rather than ranking schools on static scores.
        </p>
      </div>

      {/* THREE-YEAR GROWTH PATHWAY (SECTION 8) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* YEAR 1: FOUNDATION (CURRENT STAGE) */}
        <div className="bg-white rounded-2xl p-6 border-2 border-[#1B3626] shadow-sm space-y-4 relative flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900">
                Current Active Stage
              </span>
              <span className="text-xs font-bold text-[#1B3626]">Year 1 of 3</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#EAF0EB] text-[#1B3626] flex items-center justify-center font-bold">
                Y1
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Foundation Stage</h2>
                <span className="text-xs text-stone-500">Routines, Awareness &amp; Baseline</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Establishing classroom emotional safety, morning weather check-in routines, 3-breath mindful pauses, and educator somatic trigger awareness.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2 text-xs">
              <div className="font-bold text-stone-900 text-xs">Stage 1 Verified Criteria:</div>
              <ul className="space-y-1.5 text-[11px] text-stone-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Comprehensive Baseline Survey Approved</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Annual Plan Approved by Architect</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>18/20 Classrooms Active Daily (88% Fidelity)</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                  <span>Confidential Adult Presence Journals Active</span>
                </li>
                <li className="flex items-center gap-2">
                  <Clock className="w-3.5 h-3.5 text-amber-600 shrink-0" />
                  <span>External Moderation Board Review (Pending)</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
            <span className="font-bold text-emerald-800">4 of 5 signed off</span>
            <span className="text-stone-400">Target: End of Year 1</span>
          </div>
        </div>

        {/* YEAR 2: INTEGRATION (UPCOMING) */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between opacity-90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-600">
                Upcoming Stage
              </span>
              <span className="text-xs font-bold text-stone-400">Year 2 of 3</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-700 flex items-center justify-center font-bold">
                Y2
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Integration Stage</h2>
                <span className="text-xs text-stone-500">Curriculum &amp; Relational Depth</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Embedding core practices across subject inquiries (IB Units of Inquiry), peer coaching walkthroughs, and learner-led restorative circles.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2 text-xs">
              <div className="font-bold text-stone-900 text-xs">Stage 2 Roadmap Milestones:</div>
              <ul className="space-y-1.5 text-[11px] text-stone-500">
                <li>• Curriculum adapter mapping into IB PYP units</li>
                <li>• Cross-classroom peer coaching walkthroughs</li>
                <li>• Student restorative ambassador program</li>
                <li>• Midline longitudinal evidence review</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-400">
            Prerequisite: Foundation Stage Accreditation
          </div>
        </div>

        {/* YEAR 3: CULTURE AND LEADERSHIP */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between opacity-90">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900">
                Final Accreditation
              </span>
              <span className="text-xs font-bold text-stone-400">Year 3 of 3</span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-900 flex items-center justify-center font-bold">
                Y3
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Culture &amp; Impact</h2>
                <span className="text-xs text-stone-500">Self-Sustaining Excellence</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Complete internal facilitation autonomy, institutionalized budget covenants, longitudinal child cohort outcomes, and lighthouse school mentoring.
            </p>

            <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2 text-xs">
              <div className="font-bold text-stone-900 text-xs">Stage 3 Accreditation Criteria:</div>
              <ul className="space-y-1.5 text-[11px] text-stone-500">
                <li>• 3-Year longitudinal developmental tracking</li>
                <li>• Full sustainability covenant locked in board budget</li>
                <li>• Certified internal Lead Facilitators on staff</li>
                <li>• Host network learning exchange visits</li>
              </ul>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-xs text-stone-400">
            Final Distinction: CEQHS Accredited Beacon School
          </div>
        </div>
      </div>
    </div>
  );
};
