import React, { useState } from 'react';
import {
  ShieldAlert,
  CheckCircle2,
  Plus,
  Save,
  BarChart3,
  HelpCircle,
  Sparkles,
  AlertTriangle,
  Info,
  Check,
} from 'lucide-react';
import { SWATARA_NEEDS_BASELINE_RECORD, SwataraNeedsBaseline } from '../../data/swataraDemoData';

export const CeqhsNeedsBaselineView: React.FC = () => {
  const [data, setData] = useState<SwataraNeedsBaseline>(SWATARA_NEEDS_BASELINE_RECORD);
  const [isSaved, setIsSaved] = useState(false);
  const [newChallenge, setNewChallenge] = useState('');

  const handleAddChallenge = () => {
    if (!newChallenge.trim()) return;
    setData({
      ...data,
      priorityChallenges: [...data.priorityChallenges, newChallenge.trim()],
    });
    setNewChallenge('');
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.4 Baseline Module
              </span>
              <span className="text-xs text-stone-500">Year 1 Foundation Capture</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              School Needs and Baseline Assessment
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Captures observable school context, existing program overlap, and baseline indicators.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Changes saved
              </span>
            )}
            <button
              onClick={() => {
                setIsSaved(true);
                setTimeout(() => setIsSaved(false), 2500);
              }}
              className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Baseline Profile</span>
            </button>
          </div>
        </div>

        {/* NON-DIAGNOSTIC MANDATE BANNER */}
        <div className="mt-5 bg-amber-50/80 border border-amber-200/90 rounded-xl p-4 flex items-start gap-3 text-amber-950">
          <ShieldAlert className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="font-semibold block text-amber-900">
              Mandatory CEQHS Non-Diagnostic Language Policy (Section 6.4 &amp; 8.3)
            </strong>
            Never record diagnostic or clinical pathology labels (e.g., &quot;ADHD symptoms&quot;, &quot;oppositional disorder&quot;). All observations must strictly record observable behavior, environmental contexts, transition friction, and developmental supports.
          </div>
        </div>
      </div>

      {/* Grid: Strengths & Priority Challenges */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Strengths */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700" />
              Current School Strengths
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              {data.currentStrengths.length} identified
            </span>
          </div>

          <ul className="space-y-2 text-xs text-stone-700">
            {data.currentStrengths.map((st, i) => (
              <li key={i} className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/60 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{st}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Challenges */}
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-stone-100 pb-3">
            <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-700" />
              Priority Challenges (Observable Context)
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              {data.priorityChallenges.length} recorded
            </span>
          </div>

          <ul className="space-y-2 text-xs text-stone-700">
            {data.priorityChallenges.map((ch, i) => (
              <li key={i} className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/60 flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-700 mt-1.5 shrink-0" />
                <span className="leading-relaxed">{ch}</span>
              </li>
            ))}
          </ul>

          <div className="pt-2 flex items-center gap-2">
            <input
              type="text"
              value={newChallenge}
              onChange={(e) => setNewChallenge(e.target.value)}
              placeholder="Record observable challenge (e.g., transition noise at 1:15 PM)..."
              className="flex-1 text-xs px-3 py-2 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3626]"
              onKeyDown={(e) => e.key === 'Enter' && handleAddChallenge()}
            />
            <button
              onClick={handleAddChallenge}
              className="px-3 py-2 rounded-lg bg-[#1B3626] text-white text-xs font-semibold hover:bg-[#2D5A3D] cursor-pointer"
            >
              Add
            </button>
          </div>
        </div>
      </div>

      {/* Adult Staff Needs & Learner Needs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
            Adult Staff Needs (Distinct from Children)
          </h2>
          <p className="text-xs text-stone-500">
            Adult outcomes are not treated merely as an advanced version of child outcomes.
          </p>
          <ul className="space-y-2 text-xs text-stone-700">
            {data.adultStaffNeeds.map((need, i) => (
              <li key={i} className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                {need}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-3">
          <h2 className="text-sm font-bold text-stone-900 border-b border-stone-100 pb-3">
            Primary Learner Needs (Grades 1–5)
          </h2>
          <p className="text-xs text-stone-500">
            Developmentally sequenced for primary sensory-motor and affective recognition.
          </p>
          <ul className="space-y-2 text-xs text-stone-700">
            {data.learnerNeeds.map((need, i) => (
              <li key={i} className="p-3 rounded-lg bg-stone-50 border border-stone-100">
                {need}
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Existing Program Overlap (Section 6.4) */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-sm font-bold text-stone-900">
            Existing Program Overlap &amp; Integration Entry Points
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            How CEQHS practices integrate with programs already running in this school.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.existingProgramOverlap.map((prog, i) => (
            <div key={i} className="p-4 rounded-xl border border-stone-200 bg-[#FDFBF7] space-y-2">
              <div className="text-xs font-bold text-stone-900">
                {prog.programName}
              </div>
              <p className="text-xs text-stone-600">
                {prog.description}
              </p>
              <div className="pt-2 text-[11px] border-t border-stone-200/60">
                <span className="font-semibold text-stone-700">Synergy Analysis:</span> {prog.overlapAnalysis}
              </div>
              <div className="text-[11px] text-[#1B3626] font-medium bg-[#EAF0EB]/60 p-2 rounded-lg">
                <span className="font-semibold">Recommendation:</span> {prog.integrationRecommendation}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Baseline Ratings & Quantitative Measures */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
        <div className="border-b border-stone-100 pb-3">
          <h2 className="text-sm font-bold text-stone-900 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#1B3626]" />
            Baseline Measures &amp; Benchmarks (Year 1 Start)
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Pre-implementation data points against which growth will be evaluated.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {data.baselineRatings.map((rating, i) => (
            <div key={i} className="p-4 rounded-xl bg-stone-50 border border-stone-100 flex flex-col justify-between">
              <div>
                <div className="text-xs font-semibold text-stone-800 leading-snug">
                  {rating.metric}
                </div>
                <div className="text-[10px] text-stone-500 mt-1">
                  {rating.description}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-200/60">
                <div className="flex items-baseline justify-between">
                  <span className="text-2xl font-bold text-stone-900">{rating.score}%</span>
                  <span className="text-[10px] font-semibold text-stone-500">Target: {rating.benchmark}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-200 mt-1.5 overflow-hidden">
                  <div
                    className="h-full bg-[#1B3626] rounded-full"
                    style={{ width: `${rating.score}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
