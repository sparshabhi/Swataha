import React from 'react';
import {
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  BookOpen,
  Sprout,
  Users,
  BarChart3,
  Award,
  Layers,
  Compass,
  FileText,
  Calendar,
  Check,
} from 'lucide-react';
import {
  SWATARA_CORE_SCHOOL,
  SWATARA_IMPACT_METRICS,
  SWATARA_AWARD_STATE,
  CANON_ACTIVITIES,
} from '../../data/swataraDemoData';

interface CeqhsLivingDashboardProps {
  onNavigate: (route: string) => void;
  onApproveTermPlan?: () => void;
  isPlanApproved?: boolean;
}

export const CeqhsLivingDashboard: React.FC<CeqhsLivingDashboardProps> = ({
  onNavigate,
  onApproveTermPlan,
  isPlanApproved = false,
}) => {
  const school = SWATARA_CORE_SCHOOL;
  const metrics = SWATARA_IMPACT_METRICS;
  const award = SWATARA_AWARD_STATE;

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* ---------------------------------------------------------------- */}
      {/* 1. HERO CONTEXT & QUESTION BANNER (SECTION 6.1 & 8.1)            */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2.5 mb-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
                <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3D]" />
                {school.implementationPhase}
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {school.curriculum} · {school.grades}
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {school.name}
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              A curriculum-aware implementation living record adapting the universal CEQHS competency core into daily primary classroom routines and adult educator presence.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => onNavigate('plan')}
              className="px-4 py-2.5 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <span>View Annual Plan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('profile')}
              className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              School Profile
            </button>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* MAIN DASHBOARD MESSAGE (SECTION 10 PROMPT MANDATE)               */}
        {/* "Your next step: Review the Year 1 Self-Regulation plan..."      */}
        {/* ---------------------------------------------------------------- */}
        <div className="mt-6 bg-[#FAF8F5] border border-amber-200/80 rounded-xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <AlertTriangle className="w-5 h-5 text-amber-800" />
            </div>
            <div>
              <div className="text-[11px] font-bold uppercase tracking-wider text-amber-900">
                Immediate Action Required · Term 1 Implementation
              </div>
              <p className="text-sm font-semibold text-stone-900 mt-0.5">
                {isPlanApproved ? (
                  <span className="text-emerald-800 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-emerald-600" />
                    Year 1 Term 1 plan and activities have been reviewed and approved for active rollout.
                  </span>
                ) : (
                  school.nextActionMessage
                )}
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Answers: <strong className="text-stone-700">What should we do next?</strong> Approve the two draft practices. <strong className="text-stone-700">Why does it matter?</strong> Sets up morning emotional regulation routines. <strong className="text-stone-700">What evidence do we need?</strong> Reach logs and student weather slips.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
            {!isPlanApproved ? (
              <button
                onClick={onApproveTermPlan}
                className="px-4 py-2 rounded-lg bg-[#2D5A3D] hover:bg-[#1B3626] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Approve 2 Activities</span>
              </button>
            ) : (
              <span className="px-3 py-1 rounded-md bg-emerald-100 text-emerald-800 text-xs font-semibold">
                Approved
              </span>
            )}
            <button
              onClick={() => onNavigate('plan')}
              className="px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Review Plan
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 2. FOUR CORE PRINCIPLES BANNER (SECTION 14 ARCHITECTURAL MANDATE) */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          {
            title: 'CEQHS Core',
            subtitle: 'What we believe & develop',
            desc: '5 Universal Domains (Self-Awareness, Self-Regulation, Social Awareness, Relationship Skills, Values-in-Action).',
            icon: Sprout,
            color: 'bg-emerald-50 text-emerald-900 border-emerald-200/60',
            route: 'curriculum',
          },
          {
            title: 'Curriculum Adapter',
            subtitle: 'Where curriculum gives entry',
            desc: 'IB PYP ATL self-management & affective sub-cluster translation layer.',
            icon: BookOpen,
            color: 'bg-blue-50 text-blue-900 border-blue-200/60',
            route: 'curriculum',
          },
          {
            title: 'School Plan',
            subtitle: 'What this school will do',
            desc: 'Year 1 Foundation objectives, daily micro-pauses, and monthly staff circles.',
            icon: Compass,
            color: 'bg-amber-50 text-amber-950 border-amber-200/60',
            route: 'plan',
          },
          {
            title: 'Evidence System',
            subtitle: 'How we know we improve',
            desc: '4-level verification: Reach, Fidelity, Learning, and Impact (not attendance).',
            icon: BarChart3,
            color: 'bg-stone-50 text-stone-900 border-stone-200',
            route: 'evidence',
          },
        ].map((pillar) => {
          const Icon = pillar.icon;
          return (
            <div
              key={pillar.title}
              onClick={() => onNavigate(pillar.route)}
              className={`rounded-2xl border p-5 cursor-pointer hover:shadow-sm transition-all ${pillar.color}`}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="w-8 h-8 rounded-lg bg-white/80 shadow-2xs flex items-center justify-center">
                  <Icon className="w-4 h-4" />
                </div>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </div>
              <div className="text-xs font-bold uppercase tracking-wider opacity-70">
                {pillar.title}
              </div>
              <div className="text-sm font-bold mt-0.5">
                {pillar.subtitle}
              </div>
              <p className="text-xs opacity-80 mt-1.5 leading-relaxed">
                {pillar.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 3. IMPLEMENTATION & EVIDENCE PULSE (4 LEVELS)                     */}
      {/* ---------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Evidence & Impact Metrics */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-stone-100 pb-4">
            <div>
              <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-[#1B3626]" />
                Four-Level Evidence &amp; Impact Pulse
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {metrics.disclaimer}
              </p>
            </div>
            <button
              onClick={() => onNavigate('evidence')}
              className="text-xs font-semibold text-[#1B3626] hover:underline flex items-center gap-1 cursor-pointer"
            >
              Full Evidence Ledger
              <ArrowRight className="w-3 h-3" />
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                1. Reach
              </div>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {metrics.reach.metric}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {metrics.reach.trend}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {metrics.reach.sublabel}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                2. Fidelity
              </div>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {metrics.fidelity.metric}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                Adherence High
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {metrics.fidelity.sublabel}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                3. Learning
              </div>
              <div className="text-2xl font-bold text-stone-900 mt-1">
                {metrics.learning.metric}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                {metrics.learning.trend}
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                {metrics.learning.baselineComparison}
              </div>
            </div>

            <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
              <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                4. Impact
              </div>
              <div className="text-2xl font-bold text-emerald-800 mt-1">
                {metrics.impact.metric}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold mt-1">
                Reactive Conflicts
              </div>
              <div className="text-[10px] text-stone-500 mt-0.5">
                Observed in transitions
              </div>
            </div>
          </div>

          {/* Qualitative Observable Shifts */}
          <div className="bg-[#FAF8F5] rounded-xl p-4 border border-stone-200/70">
            <div className="text-xs font-bold uppercase tracking-wider text-stone-600 mb-2">
              Recent Verified Practice Shifts (Non-Diagnostic Context)
            </div>
            <ul className="space-y-1.5 text-xs text-stone-700">
              {metrics.impact.observedShifts.map((shift, i) => (
                <li key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                  <span>{shift}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Right Col: Three-Year Award Progress (Section 6.10) */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col justify-between">
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-amber-700" />
                <h2 className="text-base font-bold text-stone-900">
                  Three-Year Award
                </h2>
              </div>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                {award.currentYear}
              </span>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs font-semibold mb-1.5">
                <span className="text-stone-700">Foundation Completion</span>
                <span className="text-stone-900">{award.overallCompletion}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-stone-100 overflow-hidden">
                <div
                  className="h-full bg-[#2D5A3D] rounded-full transition-all duration-500"
                  style={{ width: `${award.overallCompletion}%` }}
                />
              </div>
            </div>

            <div className="space-y-2 pt-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Core Requirements (5 Verified)
              </div>
              {award.requirements.slice(0, 3).map((req) => (
                <div key={req.id} className="text-xs flex items-center justify-between py-1 border-b border-stone-50">
                  <span className="text-stone-700 truncate max-w-[200px]">{req.title}</span>
                  {req.isCompleted ? (
                    <span className="text-emerald-700 font-semibold flex items-center gap-1">
                      <Check className="w-3 h-3" /> Done
                    </span>
                  ) : (
                    <span className="text-amber-800 font-medium">Pending</span>
                  )}
                </div>
              ))}
            </div>

            {/* Incomplete Evidence Notice */}
            <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3 text-[11px] text-amber-950">
              <strong>Action Needed:</strong> Term 1 Adult Self-Regulation and Grade 3 Observer Checkpoint pending submission before moderated review.
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 mt-4">
            <button
              onClick={() => onNavigate('award')}
              className="w-full py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Inspect Award Ledger</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* 4. CURRENT ACTIVE ACTIVITIES & SCHEDULE (SECTION 6.6)            */}
      {/* ---------------------------------------------------------------- */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4 mb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-[#1B3626]" />
              Term 1 Primary Classroom Practices
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Approved activities connecting the CEQHS Universal Core to IB PYP ATL self-management.
            </p>
          </div>
          <button
            onClick={() => onNavigate('activities')}
            className="text-xs font-semibold text-[#1B3626] hover:underline flex items-center gap-1 cursor-pointer"
          >
            Explore Activity Library ({CANON_ACTIVITIES.length})
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {CANON_ACTIVITIES.slice(0, 2).map((act) => (
            <div
              key={act.id}
              className="p-5 rounded-xl border border-stone-200 hover:border-stone-300 transition-all bg-[#FDFBF7]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF0EB] text-[#1B3626]">
                      {act.domain}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      {act.duration}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-900">
                    {act.title}
                  </h3>
                </div>

                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    act.status === 'Approved for Pilot'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {isPlanApproved ? 'Active in Homerooms' : act.status}
                </span>
              </div>

              <p className="text-xs text-stone-600 mt-2 leading-relaxed line-clamp-2">
                {act.purpose}
              </p>

              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500">
                <span>{act.curriculumConnection}</span>
                <button
                  onClick={() => onNavigate('activities')}
                  className="font-semibold text-[#1B3626] hover:underline cursor-pointer"
                >
                  View Facilitation
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
