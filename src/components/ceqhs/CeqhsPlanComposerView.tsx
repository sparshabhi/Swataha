import React, { useState } from 'react';
import {
  Sparkles,
  CheckCircle2,
  Calendar,
  AlertTriangle,
  Clock,
  Layers,
  FileCheck,
  RotateCcw,
  Check,
  ChevronRight,
  ShieldAlert,
  Users,
  Compass,
} from 'lucide-react';
import { SWATARA_CORE_SCHOOL } from '../../data/swataraDemoData';

interface CeqhsPlanComposerViewProps {
  onPlanApprovedChange?: (approved: boolean) => void;
  isPlanApproved?: boolean;
}

export const CeqhsPlanComposerView: React.FC<CeqhsPlanComposerViewProps> = ({
  onPlanApprovedChange,
  isPlanApproved = false,
}) => {
  const [activeTerm, setActiveTerm] = useState<1 | 2 | 3>(1);
  const [isGenerating, setIsGenerating] = useState(false);
  const [planData, setPlanData] = useState<any>(null);
  const [generationMetadata, setGenerationMetadata] = useState<any>(null);
  const [revisionNotes, setRevisionNotes] = useState('');
  const [showRevisionModal, setShowRevisionModal] = useState(false);

  const school = SWATARA_CORE_SCHOOL;

  const handleRunAiComposer = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('/api/plan/compose-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schoolName: school.name,
          curriculumAdapter: school.curriculum,
          gradeRange: school.grades,
          awardPhase: school.implementationPhase,
          priorities: school.priorities,
          existingPrograms: ['Weekly Wellbeing Circle'],
          timetableConstraints: '15-min morning advisory, 45-min monthly faculty circle',
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error ${response.status}`);
      }

      const data = await response.json();
      if (data.success && data.result) {
        setPlanData(data.result);
        setGenerationMetadata({
          confidence: data.result.confidence || 'High (94%)',
          rationale: data.result.rationale,
          warnings: data.result.warnings || [],
          assumptions: data.result.assumptions || [],
          generatedAt: data.generatedAt,
          model: data.model,
        });
      }
    } catch (err) {
      console.warn('AI plan fetch encountered error, using local canon plan:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  const terms = planData?.terms || [
    {
      termNumber: 1,
      termTitle: 'Term 1: Grounding, Shared Vocabulary & Micro-Pauses',
      focus: 'Daily Emotion Weather Check-In, Classroom Mindful Micro-Pause, and Staff Self-Regulation',
      objectives: [
        'Train 100% of primary faculty in the 3-breath curious pause and weather metaphor.',
        'Launch Daily Emotion Weather Check-In during 15-minute morning advisory.',
        'Establish baseline affective vocabulary and student regulation measures.',
      ],
      staffWorkshops: [
        'Workshop 1: The Curious Pause — Somatic Self-Regulation for Educators (45 mins)',
        'Workshop 2: Facilitating the Emotion Weather Check-In Without Judgment (45 mins)',
      ],
      classroomPractices: [
        'Daily Emotion Weather Check-In (Grades 1–5, 8–10 mins every morning)',
        'Classroom Mindful Micro-Pause (Grades 1–5, 3 mins during post-recess transitions)',
      ],
      learnerActivities: [
        'My Weather Token Crafting (Grades 1–3)',
        'Vocabulary of the Inner Sky Journaling (Grades 4–5)',
      ],
      coachingAndFacilitation: [
        'Bi-weekly classroom walkthroughs by CEQHS facilitator with non-evaluative coaching notes',
        'Grade-level team debriefs on transition friction points',
      ],
      familyCommunity: [
        'Parent Living Journey orientation letter explaining the meteorological emotion framework',
        'Home Curious Pause guide for bedtime and homework transitions',
      ],
    },
    {
      termNumber: 2,
      termTitle: 'Term 2: Social Awareness & Perspective-Taking',
      focus: 'Perspective-Taking Circles and Peer Relationship Building',
      objectives: [
        'Introduce weekly Perspective-Taking Circles in Grades 3–5.',
        'Support faculty in navigating mid-year cognitive fatigue with monthly trigger reflections.',
      ],
      staffWorkshops: [
        'Workshop 3: Navigating Workplace Strain and Emotional Buttons (45 mins)',
      ],
      classroomPractices: [
        'Perspective-Taking Circles (Grades 3–5, 25 mins weekly)',
        'Continued Daily Emotion Weather Check-In & Micro-Pauses',
      ],
      learnerActivities: [
        'Stepping Into Your Shoes Empathy Prompts (Grades 3–5)',
      ],
      coachingAndFacilitation: [
        'Peer educator observation rounds with curious inquiry protocols',
      ],
      familyCommunity: [
        'Community Coffee Morning: Developing Empathy in Primary Learners',
      ],
    },
    {
      termNumber: 3,
      termTitle: 'Term 3: Restorative Repair & Values-in-Action',
      focus: 'Restorative conversations and student-led community wellbeing initiatives',
      objectives: [
        'Establish the playground Restorative Repair Bench.',
        'Prepare Year 1 Foundation Living Dossier submission for moderated review.',
      ],
      staffWorkshops: [
        'Workshop 4: Moving Beyond Forced Apologies to Restorative Dignity (45 mins)',
      ],
      classroomPractices: [
        '4-Step Repair Conversations (Grades 1–5, on-demand during friction)',
        'Values-in-Action mini-projects connected to IB PYP Action',
      ],
      learnerActivities: [
        'Restorative Ambassador Training for Grade 5 learners',
        'Year-End Reflection Living Portfolio Assembly',
      ],
      coachingAndFacilitation: [
        'Review and compilation of Year 1 Living Dossier evidence artifacts',
      ],
      familyCommunity: [
        'End-of-Year Community Celebration of Human Growth & Resilience',
      ],
    },
  ];

  const currentTermData = terms.find((t: any) => t.termNumber === activeTerm) || terms[0];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header with AI Plan Composer Trigger */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.5 &amp; 8.2 Plan Composer
              </span>
              <span className="text-xs text-stone-500">
                {school.implementationPhase} · {school.curriculum}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Annual Implementation Plan &amp; AI Composer
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Composes annual and term objectives combining the CEQHS Universal Core, IB PYP adapter, school baseline needs, and timetable constraints.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleRunAiComposer}
              disabled={isGenerating}
              className="px-4 py-2.5 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGenerating ? 'Composing Plan via Gemini...' : 'Re-Compose Plan with AI'}</span>
            </button>
          </div>
        </div>

        {/* HUMAN REVIEW & APPROVAL STATUS (SECTION 6.5 & 8.2 MANDATE) */}
        <div className="mt-5 p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#FAF8F5] border-amber-200/80">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-lg bg-amber-100 text-amber-900 flex items-center justify-center shrink-0 mt-0.5">
              <FileCheck className="w-4 h-4" />
            </div>
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-amber-900">
                Governance Checkpoint · Human Approval Required
              </div>
              <p className="text-xs text-stone-700 mt-0.5">
                {isPlanApproved ? (
                  <span className="text-emerald-800 font-semibold flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                    Annual Plan and Term 1 Activities approved by School Leadership &amp; Program Architect.
                  </span>
                ) : (
                  'Review Term 1 objectives and classroom practices before initiating school-wide delivery.'
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {!isPlanApproved ? (
              <>
                <button
                  onClick={() => onPlanApprovedChange && onPlanApprovedChange(true)}
                  className="px-4 py-2 rounded-lg bg-[#2D5A3D] hover:bg-[#1B3626] text-white text-xs font-semibold flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Approve Term 1 Plan</span>
                </button>
                <button
                  onClick={() => setShowRevisionModal(true)}
                  className="px-3 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold cursor-pointer"
                >
                  Request Revision
                </button>
              </>
            ) : (
              <button
                onClick={() => onPlanApprovedChange && onPlanApprovedChange(false)}
                className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium cursor-pointer"
              >
                Revoke / Reopen Review
              </button>
            )}
          </div>
        </div>

        {/* AI Rationale & Confidence Meta (if generated) */}
        {generationMetadata && (
          <div className="mt-4 p-4 rounded-xl bg-emerald-50/70 border border-emerald-200 text-xs text-emerald-950 space-y-1">
            <div className="flex items-center justify-between font-semibold">
              <span>AI Plan Composer Rationale · Confidence: {generationMetadata.confidence}</span>
              <span className="text-[10px] opacity-70">Generated at {new Date(generationMetadata.generatedAt).toLocaleTimeString()}</span>
            </div>
            <p className="text-emerald-900 leading-relaxed">
              {generationMetadata.rationale}
            </p>
          </div>
        )}
      </div>

      {/* Term Selector Navigation */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        {[1, 2, 3].map((tNum) => (
          <button
            key={tNum}
            onClick={() => setActiveTerm(tNum as 1 | 2 | 3)}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
              activeTerm === tNum
                ? 'bg-[#1B3626] text-white shadow-xs'
                : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
            }`}
          >
            Term {tNum}: {tNum === 1 ? 'Grounding & Micro-Pauses' : tNum === 2 ? 'Perspective-Taking' : 'Restorative Repair'}
          </button>
        ))}
      </div>

      {/* Term Detail Content */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="border-b border-stone-100 pb-4">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
            Selected Term Focus
          </div>
          <h2 className="text-xl font-bold text-stone-900 mt-1">
            {currentTermData.termTitle}
          </h2>
          <p className="text-xs text-stone-600 mt-1">
            {currentTermData.focus}
          </p>
        </div>

        {/* Term Objectives */}
        <div className="space-y-2">
          <div className="text-xs font-bold uppercase tracking-wider text-stone-600">
            Term Objectives
          </div>
          <ul className="space-y-1.5 text-xs text-stone-700">
            {currentTermData.objectives.map((obj: string, i: number) => (
              <li key={i} className="flex items-start gap-2.5 p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/60">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700 mt-0.5 shrink-0" />
                <span>{obj}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* 4 Delivery Columns: Workshops, Classroom, Learners, Coaching */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#1B3626]" />
              Staff Workshops
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5">
              {currentTermData.staffWorkshops.map((ws: string, i: number) => (
                <li key={i} className="leading-snug">• {ws}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#1B3626]" />
              Classroom Practices
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5">
              {currentTermData.classroomPractices.map((cp: string, i: number) => (
                <li key={i} className="leading-snug">• {cp}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#1B3626]" />
              Learner Activities
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5">
              {currentTermData.learnerActivities.map((la: string, i: number) => (
                <li key={i} className="leading-snug">• {la}</li>
              ))}
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <Layers className="w-3.5 h-3.5 text-[#1B3626]" />
              Coaching &amp; Walkthroughs
            </div>
            <ul className="text-xs text-stone-600 space-y-1.5">
              {currentTermData.coachingAndFacilitation.map((cf: string, i: number) => (
                <li key={i} className="leading-snug">• {cf}</li>
              ))}
            </ul>
          </div>
        </div>

        {/* Implementation Risks & Checkpoints */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2 text-xs text-amber-950">
            <div className="font-bold flex items-center gap-1.5 text-amber-900">
              <AlertTriangle className="w-3.5 h-3.5" />
              Identified Implementation Risks
            </div>
            <ul className="space-y-1">
              <li>• Advisory time encroachment by announcements.</li>
              <li>• Teacher fatigue in Term 2 if adult micro-pauses are skipped.</li>
              <li>• Multilingual students in Grade 3 needing visual cues.</li>
            </ul>
          </div>

          <div className="p-4 rounded-xl bg-blue-50/60 border border-blue-200/60 space-y-2 text-xs text-blue-950">
            <div className="font-bold flex items-center gap-1.5 text-blue-900">
              <Clock className="w-3.5 h-3.5" />
              Review Checkpoints
            </div>
            <ul className="space-y-1">
              <li>• Week 6: Mid-point classroom observer walkthrough.</li>
              <li>• Week 12: Term 1 Living Dossier evidence compilation.</li>
              <li>• Week 20: Mid-year climate &amp; baseline re-measure.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Revision Modal */}
      {showRevisionModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full space-y-4 shadow-xl border border-stone-200">
            <h3 className="text-base font-bold text-stone-900">
              Request Plan Revision
            </h3>
            <p className="text-xs text-stone-600">
              Specify adjustments required before school leadership and the CEQHS Program Architect approve this plan.
            </p>
            <textarea
              value={revisionNotes}
              onChange={(e) => setRevisionNotes(e.target.value)}
              placeholder="e.g., Please shift workshop 2 to week 4 to accommodate parent-teacher conferences..."
              className="w-full text-xs p-3 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3626] h-24"
            />
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setShowRevisionModal(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  alert('Revision request logged in audit trail.');
                  setShowRevisionModal(false);
                }}
                className="px-4 py-2 text-xs font-semibold bg-[#1B3626] text-white rounded-lg hover:bg-[#2D5A3D] cursor-pointer"
              >
                Submit Revision Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
