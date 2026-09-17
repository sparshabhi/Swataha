import React, { useState } from 'react';
import {
  Award,
  CheckCircle2,
  AlertTriangle,
  Clock,
  ShieldCheck,
  FileCheck,
  ChevronRight,
  ArrowRight,
  Info,
  Check,
} from 'lucide-react';
import { SWATARA_AWARD_STATE, SWATARA_CORE_SCHOOL } from '../../data/swataraDemoData';

export const CeqhsAwardProgressView: React.FC = () => {
  const [awardData, setAwardData] = useState(SWATARA_AWARD_STATE);
  const [submittedForReview, setSubmittedForReview] = useState(false);

  const school = SWATARA_CORE_SCHOOL;

  const handleSubmitReview = () => {
    setSubmittedForReview(true);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.10 Award Governance
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Three-Year Progressive Award Pathway
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Three-Year Award Progress &amp; Moderation
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Recognizes sustainable, verified implementation of emotional intelligence across learners and adults.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-xl bg-amber-100 text-amber-900 text-xs font-semibold">
              Current: {awardData.currentYear} ({awardData.overallCompletion}%)
            </span>
          </div>
        </div>

        {/* NON-ATTENDANCE RULE WARNING (SECTION 6.10 SPECIFICATION) */}
        <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-amber-200/80 flex items-start gap-3 text-stone-800 text-xs">
          <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-amber-950">
              Strict CEQHS Award Rule: No Award Granted Solely on Attendance
            </strong>
            {awardData.attendanceOnlyWarning} Verification requires documented classroom fidelity logs, adult reflective practice evidence, and observable behavioral shifts.
          </div>
        </div>
      </div>

      {/* 3-Year Stage Progression Visualizer */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {[
          {
            year: 'Year 1: Foundation',
            status: 'Active · 65% Completed',
            color: 'border-[#1B3626] bg-[#FDFBF7] ring-2 ring-[#1B3626]/20',
            active: true,
            desc: 'Needs & baseline capture, shared vocabulary, staff participation, initial classroom micro-pauses, and approved action plan.',
          },
          {
            year: 'Year 2: Integration',
            status: 'Upcoming Phase',
            color: 'border-stone-200 bg-white opacity-70',
            active: false,
            desc: 'Curriculum integration depth, coaching walkthroughs, repeated measures, practice fidelity, and targeted school initiatives.',
          },
          {
            year: 'Year 3: Impact & Leadership',
            status: 'Longitudinal Phase',
            color: 'border-stone-200 bg-white opacity-70',
            active: false,
            desc: 'Longitudinal analysis, learner agency, values-in-action projects, internal facilitators, and external moderated review.',
          },
        ].map((stage, i) => (
          <div
            key={i}
            className={`p-6 rounded-2xl border transition-all ${stage.color}`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Phase {i + 1}
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                {stage.status}
              </span>
            </div>
            <h3 className="text-base font-bold text-stone-900 mt-1">
              {stage.year}
            </h3>
            <p className="text-xs text-stone-600 mt-2 leading-relaxed">
              {stage.desc}
            </p>
          </div>
        ))}
      </div>

      {/* Checklist & Missing Evidence Section */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Year 1 Foundation Requirements Checklist
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              All 5 core requirements must be satisfied and verified by an external CEQHS moderator.
            </p>
          </div>

          {!submittedForReview ? (
            <button
              onClick={handleSubmitReview}
              className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 cursor-pointer"
            >
              <FileCheck className="w-3.5 h-3.5" />
              <span>Submit for Moderated Review</span>
            </button>
          ) : (
            <span className="px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Under Moderated Review
            </span>
          )}
        </div>

        <div className="space-y-3">
          {awardData.requirements.map((req) => (
            <div
              key={req.id}
              className={`p-4 rounded-xl border transition-all ${
                req.isCompleted
                  ? 'border-emerald-200/70 bg-emerald-50/20'
                  : 'border-amber-200/70 bg-amber-50/20'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-start gap-3">
                  <div className="mt-0.5">
                    {req.isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Clock className="w-4 h-4 text-amber-700" />
                    )}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-stone-900">
                      {req.title}
                    </h4>
                    <p className="text-xs text-stone-600 mt-0.5">
                      {req.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs shrink-0 self-end sm:self-center">
                  <span className="text-stone-500">
                    Evidence: {req.evidenceCount} / {req.requiredCount}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                      req.isCompleted
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-900'
                    }`}
                  >
                    {req.isCompleted ? 'Verified' : 'Action Required'}
                  </span>
                </div>
              </div>

              {req.missingEvidenceNote && (
                <div className="mt-3 pt-2.5 border-t border-amber-200/50 text-[11px] text-amber-950 font-medium flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-800 shrink-0" />
                  <span>{req.missingEvidenceNote}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Moderator Reviewer Notes */}
        {awardData.moderatorNotes && (
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1">
            <div className="font-bold text-stone-900">
              Senior Moderator Feedback (Saugat Singh Saud · Chief Program Architect)
            </div>
            <p className="leading-relaxed">
              {awardData.moderatorNotes}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
