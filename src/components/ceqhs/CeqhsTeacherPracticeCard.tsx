import React, { useState } from 'react';
import {
  Sparkles,
  BookOpen,
  ShieldCheck,
  Camera,
  ChevronDown,
  ChevronUp,
  Info,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { CEQHSPracticeDefinition, PrimaryCurriculumType } from '../../types/ceqhsGovernance';

interface CeqhsTeacherPracticeCardProps {
  practice: CEQHSPracticeDefinition;
  grade: string;
  primaryCurriculum: PrimaryCurriculumType;
  curriculumConnectionLabel?: string;
  onOpenEvidenceCapture?: (practiceName: string, grade: string) => void;
}

export const CeqhsTeacherPracticeCard: React.FC<CeqhsTeacherPracticeCardProps> = ({
  practice,
  grade,
  primaryCurriculum,
  curriculumConnectionLabel = 'School-approved wellbeing and self-awareness connection',
  onOpenEvidenceCapture,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  // Determine which adaptation to highlight based on the grade
  const isFoundation = grade === 'Grade 1' || grade === 'Grade 2';
  const isDeveloping = grade === 'Grade 3' || grade === 'Grade 4';
  const isTransition = grade === 'Grade 5';

  const relevantAdaptation = isFoundation
    ? practice.adaptationsFoundation
    : isDeveloping
    ? practice.adaptationsDeveloping
    : practice.adaptationsTransition;

  const bandLabel = isFoundation
    ? 'Foundation Adaptation (Grade 1–2)'
    : isDeveloping
    ? 'Developing Adaptation (Grade 3–4)'
    : 'Transition Adaptation (Grade 5)';

  return (
    <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-4 text-xs text-stone-800">
      {/* Top Meta Bar */}
      <div className="flex items-start justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
              {grade}
            </span>
            <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-100 text-stone-700">
              Phase {practice.phaseNumber}
            </span>
            <span className="text-[11px] font-semibold text-stone-500 font-mono">
              {practice.suggestedDuration}
            </span>
          </div>
          <h3 className="text-base font-bold text-stone-900 mt-1.5">
            {practice.name}
          </h3>
        </div>

        <button
          onClick={() => onOpenEvidenceCapture?.(practice.name, grade)}
          className="px-3 py-1.5 rounded-lg bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
        >
          <Camera className="w-3.5 h-3.5" />
          Capture Evidence
        </button>
      </div>

      {/* Purpose & Objective */}
      <div className="space-y-1.5">
        <p className="text-stone-700 leading-relaxed">
          <strong className="text-stone-900">Purpose:</strong> {practice.purpose}
        </p>
        <p className="text-[#1B3626] font-medium bg-[#EAF0EB]/50 p-2.5 rounded-lg border border-[#2D5A3D]/15">
          <strong className="text-[#1B3626]">Student-Facing Objective:</strong> "{practice.studentFacingObjective}"
        </p>
      </div>

      {/* Curriculum Connection Badge (Section 12 requirement) */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-amber-50/70 border border-amber-200/70 text-amber-900 text-[11px]">
        <BookOpen className="w-3.5 h-3.5 text-amber-800 shrink-0" />
        <div>
          <span className="font-semibold">{primaryCurriculum}:</span>{' '}
          <span className="text-amber-800">{curriculumConnectionLabel}</span>
        </div>
      </div>

      {/* Recommended Grade-Specific Adaptation */}
      <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 space-y-1">
        <span className="font-bold text-stone-800 text-[11px] flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-[#2D5A3D]" />
          {bandLabel}:
        </span>
        <p className="text-stone-700 text-xs leading-relaxed">
          {relevantAdaptation}
        </p>
      </div>

      {/* Collapsible Details: Prompts & Privacy Reminder */}
      <div className="pt-1">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-semibold text-[#2D5A3D] hover:text-[#1B3626] flex items-center gap-1"
        >
          {isExpanded ? 'Hide Implementation Details' : 'View Teacher Guidance & Privacy Safeguards'}
          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>

        {isExpanded && (
          <div className="mt-3 space-y-3 pt-3 border-t border-stone-100 animate-in fade-in duration-150">
            <div>
              <span className="font-bold text-stone-900 block mb-1">Teacher Facilitation Guidance:</span>
              <p className="text-stone-600 leading-relaxed">{practice.teacherGuidance}</p>
            </div>

            <div>
              <span className="font-bold text-stone-900 block mb-1">Suggested Capture Prompts:</span>
              <ul className="list-disc list-inside space-y-0.5 text-stone-600 text-[11px]">
                {practice.suggestedEvidencePrompts.map((prompt, idx) => (
                  <li key={idx}>{prompt}</li>
                ))}
              </ul>
            </div>

            {/* Data Minimisation & Safeguarding Notice */}
            <div className="p-2.5 rounded-lg bg-stone-100 border border-stone-200 text-stone-700 flex items-start gap-2 text-[11px]">
              <Lock className="w-3.5 h-3.5 text-stone-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-stone-800">Privacy Safeguard:</strong>{' '}
                Do not include student full names in your classroom reflection or artifacts. Student voice is captured using de-identified summaries (e.g. "Grade {grade.replace('Grade ', '')} student").
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
