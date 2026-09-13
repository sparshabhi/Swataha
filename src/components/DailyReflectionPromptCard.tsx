import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  BookOpen,
  RefreshCw,
  ArrowRight,
  Compass,
  Calendar,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Quote,
} from 'lucide-react';
import { JourneyPhase } from '../types';
import { getDailyPromptForPhase, DailyPrompt, PHASE_DAILY_PROMPTS } from '../data/dailyPrompts';
import { JOURNEY_PHASES } from '../mockData';

interface DailyReflectionPromptCardProps {
  currentPhaseId: string;
  onSelectPhase?: (phaseId: string) => void;
  onStartReflection: (prompt: DailyPrompt) => void;
  streakCount?: number;
}

export const DailyReflectionPromptCard: React.FC<DailyReflectionPromptCardProps> = ({
  currentPhaseId,
  onSelectPhase,
  onStartReflection,
  streakCount = 0,
}) => {
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>(currentPhaseId);
  const [promptOffset, setPromptOffset] = useState<number>(0);
  const [showPhaseDropdown, setShowPhaseDropdown] = useState<boolean>(false);

  // Sync if parent phase changes
  React.useEffect(() => {
    setSelectedPhaseId(currentPhaseId);
  }, [currentPhaseId]);

  const activePhase = useMemo(() => {
    return JOURNEY_PHASES.find((p) => p.id === selectedPhaseId) || JOURNEY_PHASES[2];
  }, [selectedPhaseId]);

  const dailyPrompt = useMemo(() => {
    return getDailyPromptForPhase(selectedPhaseId, promptOffset);
  }, [selectedPhaseId, promptOffset]);

  const handleCyclePrompt = () => {
    setPromptOffset((prev) => prev + 1);
  };

  const now = new Date();
  const dateFormatted = now.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative bg-gradient-to-r from-[#FAF9F5] via-white to-[#F2F5F3] border border-[#4A6B53]/35 rounded-2xl p-5 sm:p-6 shadow-2xs overflow-hidden transition-all">
      {/* Background Decorative Accent */}
      <div className="absolute -top-12 -right-12 w-48 h-48 bg-[#4A6B53]/5 rounded-full blur-2xl pointer-events-none" />

      <div className="relative space-y-4">
        {/* Top Header Row */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
          <div className="flex flex-wrap items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-[#4A6B53] text-white flex items-center justify-center shrink-0 shadow-2xs">
              <Sparkles className="w-4 h-4" />
            </div>

            <span className="text-[11px] font-bold uppercase tracking-wider text-[#4A6B53]">
              Daily Reflection Prompt
            </span>

            <span className="text-stone-300">·</span>

            <span className="text-xs text-stone-500 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-stone-400" />
              <span>{dateFormatted}</span>
            </span>
          </div>

          {/* Phase Badge & Switcher */}
          <div className="relative flex items-center gap-2">
            <button
              onClick={() => setShowPhaseDropdown(!showPhaseDropdown)}
              className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200/80 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-all border border-stone-200"
            >
              <Compass className="w-3.5 h-3.5 text-[#4A6B53]" />
              <span>
                Phase {activePhase.number}: {activePhase.name}
              </span>
              <ChevronDown className="w-3 h-3 text-stone-500" />
            </button>

            {showPhaseDropdown && (
              <div className="absolute right-0 top-full mt-1 w-64 bg-white border border-stone-200 rounded-xl shadow-lg p-2 z-20 space-y-1 text-xs">
                <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 border-b border-stone-100">
                  Select CEQHS Journey Phase
                </div>
                {JOURNEY_PHASES.map((phase) => (
                  <button
                    key={phase.id}
                    onClick={() => {
                      setSelectedPhaseId(phase.id);
                      setPromptOffset(0);
                      setShowPhaseDropdown(false);
                      if (onSelectPhase) onSelectPhase(phase.id);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      selectedPhaseId === phase.id
                        ? 'bg-[#EAF0EB] text-[#4A6B53] font-bold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>
                      {phase.number}. {phase.name}
                    </span>
                    <span className="text-[10px] text-stone-400 font-normal">
                      "{phase.question}"
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* The Prompt & Inquiry */}
        <div className="space-y-2.5">
          <div className="flex items-start gap-3">
            <Quote className="w-6 h-6 text-[#C88A2E] shrink-0 rotate-180 mt-1 opacity-70 hidden sm:block" />
            <div className="space-y-1.5 flex-1">
              <h3 className="font-editorial text-xl sm:text-2xl text-[#252525] font-normal leading-snug tracking-tight">
                "{dailyPrompt.question}"
              </h3>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
                <span className="px-2 py-0.5 rounded-md bg-[#FAF3E7] border border-[#C88A2E]/30 text-[#C88A2E] text-[10px] font-bold uppercase tracking-wider">
                  {dailyPrompt.pedagogicalAnchor}
                </span>

                <span className="text-stone-400">·</span>

                <span className="text-stone-600 text-xs italic">
                  Suggested Competency: <strong>{dailyPrompt.suggestedCompetency}</strong>
                </span>
              </div>
            </div>
          </div>

          <p className="text-xs text-stone-600 leading-relaxed bg-[#FAF9F5]/80 p-3 rounded-xl border border-stone-200/80">
            <strong className="text-stone-700">Why this matters today:</strong> {dailyPrompt.whyThisMatters}
          </p>
        </div>

        {/* Bottom Actions */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => onStartReflection(dailyPrompt)}
              className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-1.5 shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Reflect on This Question</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleCyclePrompt}
              className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all flex items-center gap-1 shadow-2xs"
              title="Explore another reflection inquiry for this phase"
            >
              <RefreshCw className="w-3.5 h-3.5 text-stone-500" />
              <span>Explore Another Inquiry</span>
            </button>
          </div>

          {streakCount > 0 && (
            <div className="text-xs text-stone-500 flex items-center gap-1.5 self-start sm:self-center">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Current reflection rhythm: <strong>{streakCount} consecutive days</strong></span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
