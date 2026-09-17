import React, { useState, useEffect, useRef } from 'react';
import {
  Sparkles,
  Timer,
  Award,
  Zap,
  Flame,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Sliders,
  ChevronRight,
  RefreshCw,
  Eye,
  HeartHandshake,
  Activity,
  Compass,
  ArrowUpRight,
  TrendingUp,
  Volume2,
  VolumeX,
} from 'lucide-react';
import {
  DifficultyTier,
  ScenarioItem,
  ScenarioOption,
  ScenarioAttempt,
  GameProgressState,
  UserSettings,
} from '../types';
import { SCENARIOS, calculateNextDDA } from '../lib/gameDDA';
import { DDAGrowthChart } from './DDAGrowthChart';

interface DDAGameSimulatorProps {
  gameProgress: GameProgressState;
  onUpdateGameProgress: (newProgress: GameProgressState) => void;
  userSettings: UserSettings;
  onOpenSettings: () => void;
}

export const DDAGameSimulator: React.FC<DDAGameSimulatorProps> = ({
  gameProgress,
  onUpdateGameProgress,
  userSettings,
  onOpenSettings,
}) => {
  // Current active scenario selected based on DDA tier
  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<ScenarioOption | null>(null);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [showDiagnostics, setShowDiagnostics] = useState(false);
  const [unlockedNotice, setUnlockedNotice] = useState<string | null>(null);
  const [adjustmentNotice, setAdjustmentNotice] = useState<string | null>(null);

  // Timer & Pause telemetry
  const [timeRemaining, setTimeRemaining] = useState<number>(
    gameProgress.dda.adaptiveTimerSeconds || 18
  );
  const [timeElapsed, setTimeElapsed] = useState<number>(0);
  const [pauseMeter, setPauseMeter] = useState<number>(0); // 0 to 100% of minimum deliberate pause
  const timerRef = useRef<any>(null);
  const pauseIntervalRef = useRef<any>(null);
  const adjustmentNoticeTimeoutRef = useRef<number | null>(null);
  const unlockedNoticeTimeoutRef = useRef<number | null>(null);
  const autoAdvanceTimeoutRef = useRef<number | null>(null);

  const clearQueuedTimeouts = () => {
    if (adjustmentNoticeTimeoutRef.current) {
      window.clearTimeout(adjustmentNoticeTimeoutRef.current);
      adjustmentNoticeTimeoutRef.current = null;
    }

    if (unlockedNoticeTimeoutRef.current) {
      window.clearTimeout(unlockedNoticeTimeoutRef.current);
      unlockedNoticeTimeoutRef.current = null;
    }

    if (autoAdvanceTimeoutRef.current) {
      window.clearTimeout(autoAdvanceTimeoutRef.current);
      autoAdvanceTimeoutRef.current = null;
    }
  };

  // Filter available scenarios based on player's current adaptive tier, or fall back
  const currentTier = gameProgress.dda.currentTier;
  const filteredScenarios = SCENARIOS.filter((s) => s.difficultyTier === currentTier);
  const scenariosPool = filteredScenarios.length > 0 ? filteredScenarios : SCENARIOS;
  const activeScenario = scenariosPool[currentScenarioIndex % scenariosPool.length] || SCENARIOS[0];

  // Reset timer on scenario change
  useEffect(() => {
    setSelectedOption(null);
    setHasSubmitted(false);
    setTimeElapsed(0);
    setPauseMeter(0);

    const allocatedTime =
      userSettings.timerMode === 'timed'
        ? 15
        : gameProgress.dda.adaptiveTimerSeconds || 18;
    setTimeRemaining(allocatedTime);

    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);

    if (userSettings.timerMode !== 'zen') {
      timerRef.current = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    // Elapsed timer & deliberate pause tracker
    const startTime = Date.now();
    const minPauseSec = activeScenario.minimumDeliberatePauseSeconds || 4;

    pauseIntervalRef.current = setInterval(() => {
      const elapsed = (Date.now() - startTime) / 1000;
      setTimeElapsed(elapsed);
      const ratio = Math.min(100, Math.round((elapsed / minPauseSec) * 100));
      setPauseMeter(ratio);
    }, 250);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    };
  }, [currentScenarioIndex, currentTier, userSettings.timerMode, activeScenario.minimumDeliberatePauseSeconds, gameProgress.dda.adaptiveTimerSeconds]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
      clearQueuedTimeouts();
    };
  }, []);

  // Handle option selection
  const handleSelectOption = (opt: ScenarioOption) => {
    if (hasSubmitted) return;
    setSelectedOption(opt);
    setHasSubmitted(true);

    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseIntervalRef.current) clearInterval(pauseIntervalRef.current);
    clearQueuedTimeouts();

    const minPauseSec = activeScenario.minimumDeliberatePauseSeconds || 4;
    const pausedEnough = timeElapsed >= minPauseSec;

    // Run DDA algorithm
    const { nextDDA, unlockedAchievements, adjustmentReason } = calculateNextDDA(
      gameProgress.dda,
      {
        score: opt.score,
        isOptimal: opt.isOptimal,
        timeTakenSeconds: Number(timeElapsed.toFixed(1)),
        pausedEnough,
        difficultyTier: activeScenario.difficultyTier,
      },
      userSettings
    );

    // Show adjustment reason
    setAdjustmentNotice(adjustmentReason);
    adjustmentNoticeTimeoutRef.current = window.setTimeout(() => setAdjustmentNotice(null), 5000);

    // Update achievements
    const updatedAchievements = gameProgress.achievements.map((ach) => {
      if (unlockedAchievements.includes(ach.id) && !ach.unlocked) {
        setUnlockedNotice(`Badge Unlocked: ${ach.title}!`);
        unlockedNoticeTimeoutRef.current = window.setTimeout(() => setUnlockedNotice(null), 4000);
        return {
          ...ach,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
          progress: ach.maxProgress || 1,
        };
      }
      return ach;
    });

    const newAttempt: ScenarioAttempt = {
      scenarioId: activeScenario.id,
      scenarioTitle: activeScenario.title,
      chosenOptionId: opt.id,
      isOptimal: opt.isOptimal,
      score: opt.score,
      timeTakenSeconds: Number(timeElapsed.toFixed(1)),
      pausedBeforeAnswering: pausedEnough,
      difficultyTier: activeScenario.difficultyTier,
      timestamp: new Date().toISOString(),
      adjustmentNote: adjustmentReason,
      skillRatingAfter: nextDDA.skillRating,
      flowScore: nextDDA.flowScore,
    };

    const newGameProgress: GameProgressState = {
      ...gameProgress,
      dda: nextDDA,
      totalPlayed: gameProgress.totalPlayed + 1,
      totalSuccesses: gameProgress.totalSuccesses + (opt.isOptimal ? 1 : 0),
      achievements: updatedAchievements,
      recentHistory: [newAttempt, ...gameProgress.recentHistory.slice(0, 24)],
      updatedAt: new Date().toISOString(),
    };

    onUpdateGameProgress(newGameProgress);

    // Auto advance if configured
    if (userSettings.autoAdvance) {
      autoAdvanceTimeoutRef.current = window.setTimeout(() => {
        handleNextScenario();
      }, 4500);
    }
  };

  const handleNextScenario = () => {
    setCurrentScenarioIndex((prev) => prev + 1);
  };

  // Flow status label
  const flowStateLabel =
    gameProgress.dda.flowState === 'flow'
      ? 'Optimal Flow'
      : gameProgress.dda.flowState === 'boredom'
      ? 'Low Challenge (Adapting Nuance)'
      : 'High Cognitive Load (Gentle Support)';

  const flowStateColor =
    gameProgress.dda.flowState === 'flow'
      ? 'bg-emerald-500 text-emerald-950'
      : gameProgress.dda.flowState === 'boredom'
      ? 'bg-amber-400 text-amber-950'
      : 'bg-rose-400 text-rose-950';

  const tierNames = [
    'Foundational Groundwork',
    'Emerging Classroom Nuance',
    'Complex Multi-Party Tension',
    'High-Stakes Crisis Response',
    'Systemic Masterclass Dilemma',
  ];

  return (
    <div className="max-w-5xl mx-auto space-y-6 pb-16">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-stone-200 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2 py-0.5 rounded-sm bg-[#4A6B53]/15 text-[#4A6B53] text-[10px] font-bold uppercase tracking-wider">
              Dynamic Difficulty Engine (DDA)
            </span>
            <span className="text-xs text-stone-500 font-medium">
              Real-time Emotional & Pedagogical Challenge Lab
            </span>
          </div>
          <h1 className="font-editorial text-3xl text-stone-900 font-normal">
            The Curious Pause Simulator
          </h1>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl leading-relaxed">
            Face realistic educational tensions. The system continuously measures your somatic pause quality, response accuracy, and latency, dynamically tuning scenario difficulty to keep you in flow while preserving developmental rigor.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const el = document.getElementById('dda-growth-chart-section');
              if (el) el.scrollIntoView({ behavior: 'smooth' });
            }}
            className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 shadow-2xs transition-colors"
            title="View difficulty adjustment trend line chart"
          >
            <TrendingUp className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Growth Chart</span>
          </button>
          <button
            onClick={() => setShowDiagnostics(!showDiagnostics)}
            className="px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 flex items-center gap-1.5 shadow-2xs transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>{showDiagnostics ? 'Hide DDA Analytics' : 'DDA Telemetry'}</span>
          </button>
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 shadow-2xs transition-colors"
            title="DDA Settings"
          >
            <Activity className="w-4 h-4 text-stone-600" />
          </button>
        </div>
      </div>

      {/* DDA Dynamic Telemetry Bar */}
      <div className="p-4 rounded-2xl bg-[#EFECE4] border border-stone-300/80 shadow-xs space-y-3">
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {/* Tier */}
          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Adaptive Tier
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-editorial text-xl font-bold text-[#4A6B53]">
                Tier {gameProgress.dda.currentTier}
              </span>
              <span className="text-[10px] text-stone-500 font-medium truncate">
                / 5
              </span>
            </div>
            <div className="text-[10px] text-stone-600 truncate mt-0.5 font-medium">
              {tierNames[gameProgress.dda.currentTier - 1]}
            </div>
          </div>

          {/* Flow Channel */}
          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Engagement Flow
            </span>
            <div className="flex items-center gap-1.5 mt-1">
              <span
                className={`w-2 h-2 rounded-full animate-pulse ${
                  gameProgress.dda.flowState === 'flow' ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
              <span className="text-xs font-bold text-stone-800">
                {gameProgress.dda.flowScore}% Score
              </span>
            </div>
            <div className="text-[10px] text-stone-500 truncate mt-0.5 font-medium">
              {flowStateLabel}
            </div>
          </div>

          {/* Skill Rating */}
          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Skill ELO Rating
            </span>
            <div className="font-editorial text-xl font-bold text-stone-900 mt-0.5">
              {gameProgress.dda.skillRating}
            </div>
            <div className="text-[10px] text-stone-500 truncate mt-0.5 font-medium">
              Rolling Acc: {gameProgress.dda.rollingSuccessRate}%
            </div>
          </div>

          {/* Response Latency */}
          <div className="p-2.5 rounded-xl bg-white border border-stone-200">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Somatic Pause
            </span>
            <div className="font-editorial text-xl font-bold text-[#C88A2E] mt-0.5">
              {gameProgress.dda.rollingAvgTime}s avg
            </div>
            <div className="text-[10px] text-stone-500 truncate mt-0.5 font-medium">
              Golden Window: 4–8s
            </div>
          </div>

          {/* Streak */}
          <div className="p-2.5 rounded-xl bg-white border border-stone-200 col-span-2 sm:col-span-1">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Mastery Streak
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <Flame className="w-4 h-4 text-amber-500" />
              <span className="font-editorial text-xl font-bold text-stone-900">
                {gameProgress.dda.currentStreak}
              </span>
              <span className="text-[10px] text-stone-500 ml-1">
                (Best: {gameProgress.dda.bestStreak})
              </span>
            </div>
            <div className="text-[10px] text-stone-500 truncate mt-0.5 font-medium">
              {gameProgress.totalPlayed} dilemmas played
            </div>
          </div>
        </div>

        {/* Dynamic Countdown Bar */}
        {userSettings.timerMode !== 'zen' && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium">
              <div className="flex items-center gap-1.5">
                <Timer className="w-3.5 h-3.5 text-stone-500" />
                <span>Adaptive Decision Window</span>
              </div>
              <span>{timeRemaining}s remaining</span>
            </div>
            <div className="w-full h-1.5 bg-stone-300/80 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-1000 ${
                  timeRemaining > 6
                    ? 'bg-[#4A6B53]'
                    : timeRemaining > 3
                    ? 'bg-amber-500'
                    : 'bg-rose-500 animate-pulse'
                }`}
                style={{
                  width: `${(timeRemaining / (gameProgress.dda.adaptiveTimerSeconds || 18)) * 100}%`,
                }}
              />
            </div>
          </div>
        )}
      </div>

      {/* DDA Adjustment & Achievement Alerts */}
      {adjustmentNotice && (
        <div className="p-3 rounded-xl bg-[#EAF0EB] border border-[#4A6B53]/30 text-xs text-[#252525] flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[#4A6B53] shrink-0" />
            <span className="font-semibold text-[#4A6B53]">Dynamic Adjustment:</span>
            <span>{adjustmentNotice}</span>
          </div>
          <span className="text-[10px] text-stone-500 uppercase font-bold">Auto-Tuned</span>
        </div>
      )}

      {unlockedNotice && (
        <div className="p-3 rounded-xl bg-[#FAF3E7] border border-[#C88A2E]/50 text-xs text-stone-900 flex items-center gap-2.5 shadow-md">
          <Award className="w-4 h-4 text-[#C88A2E] shrink-0" />
          <span className="font-bold text-[#C88A2E]">{unlockedNotice}</span>
        </div>
      )}

      {/* DDA Telemetry Details Drawer */}
      {showDiagnostics && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-3">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-[#4A6B53]" />
              <h3 className="font-editorial text-lg text-stone-900 font-normal">
                DDA Live Diagnostics & Telemetry
              </h3>
            </div>
            <span className="text-[11px] text-stone-500 font-medium">
              Algorithm: ELO + Rolling Moving Average + Flow Zone Mapping
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-bold text-stone-700 block uppercase tracking-wider text-[10px]">
                Distractor Nuance Weight
              </span>
              <div className="text-stone-900 font-semibold">
                Level {gameProgress.dda.nuanceLevel} / 5
              </div>
              <p className="text-[11px] text-stone-500">
                Higher nuance makes incorrect choices appear plausible and deceptively traditional.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-bold text-stone-700 block uppercase tracking-wider text-[10px]">
                Adaptive Window Calibration
              </span>
              <div className="text-stone-900 font-semibold">
                {gameProgress.dda.adaptiveTimerSeconds} seconds
              </div>
              <p className="text-[11px] text-stone-500">
                Pacing automatically shrinks on fast mastery and expands when cognitive load rises.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1">
              <span className="font-bold text-stone-700 block uppercase tracking-wider text-[10px]">
                Last Adjustment Trace
              </span>
              <div className="text-stone-800 font-medium line-clamp-2">
                {gameProgress.dda.lastAdjustmentReason}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Active Dilemma Scenario Card */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-sm overflow-hidden">
        {/* Scenario Context Banner */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#FAF9F5] flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#EAF0EB] text-[#4A6B53] text-[10px] font-bold uppercase tracking-wider">
              {activeScenario.gradeBand}
            </span>
            <span className="text-xs text-stone-600 font-medium">
              {activeScenario.context}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-stone-500">
            <span className="px-2 py-0.5 rounded-sm bg-stone-200/80 text-stone-700 text-[10px] font-semibold">
              Tier {activeScenario.difficultyTier} Dilemma
            </span>
          </div>
        </div>

        {/* Incident Narrative */}
        <div className="p-6 space-y-5">
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal leading-snug">
            {activeScenario.title}
          </h2>

          <p className="text-sm sm:text-base text-stone-800 leading-relaxed font-sans">
            {activeScenario.situation}
          </p>

          {/* Student/Colleague Voice in Tension */}
          <div className="p-4 rounded-xl bg-[#FAF3E7] border-l-3 border-[#C88A2E] text-stone-800 space-y-1">
            <span className="text-[10px] uppercase font-bold text-[#C88A2E] tracking-wider block">
              Spoken in the Moment:
            </span>
            <div className="font-serif italic text-base text-stone-900">
              {activeScenario.studentOrColleagueVoice}
            </div>
          </div>

          {/* The Curious Pause Anchor Prompt */}
          <div className="p-4 rounded-xl bg-[#F4F1EA] border border-stone-200/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-bold text-[#4A6B53] tracking-wider block">
                The Curious Pause Reframing
              </span>
              <p className="text-xs font-semibold text-stone-800">
                {activeScenario.curiosityQuestion}
              </p>
            </div>

            {/* Somatic Pause Window Meter */}
            <div className="flex items-center gap-2 shrink-0">
              <div className="text-[11px] font-medium text-stone-500">
                {pauseMeter >= 100 ? (
                  <span className="text-emerald-700 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Paused & Grounded
                  </span>
                ) : (
                  <span className="text-stone-500">
                    Pause to ground ({timeElapsed.toFixed(1)}s /{' '}
                    {activeScenario.minimumDeliberatePauseSeconds}s)
                  </span>
                )}
              </div>
              <div className="w-16 h-2 bg-stone-300 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-150 ${
                    pauseMeter >= 100 ? 'bg-emerald-600' : 'bg-[#C88A2E]'
                  }`}
                  style={{ width: `${pauseMeter}%` }}
                />
              </div>
            </div>
          </div>

          {/* 4 Pedagogical Response Options */}
          <div className="space-y-3 pt-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500 block">
              Choose your educational response:
            </span>

            <div className="grid grid-cols-1 gap-3">
              {activeScenario.options.map((option, idx) => {
                const isSelected = selectedOption?.id === option.id;
                let cardStyle =
                  'border-stone-200 bg-[#FAF9F5] hover:border-stone-400 hover:bg-white text-stone-800';

                if (hasSubmitted) {
                  if (option.isOptimal) {
                    cardStyle = 'border-emerald-500 bg-emerald-50 text-emerald-950 shadow-xs';
                  } else if (isSelected && !option.isOptimal) {
                    cardStyle = 'border-rose-400 bg-rose-50 text-rose-950 shadow-xs';
                  } else {
                    cardStyle = 'border-stone-200 bg-stone-50 text-stone-400 opacity-60';
                  }
                }

                return (
                  <button
                    key={option.id}
                    disabled={hasSubmitted}
                    onClick={() => handleSelectOption(option)}
                    className={`w-full p-4 rounded-xl border text-left transition-all relative text-sm ${cardStyle}`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full border border-stone-300 font-bold text-xs flex items-center justify-center shrink-0 mt-0.5">
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <div className="flex-1 leading-relaxed">{option.text}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Post-Choice Pedagogical Debrief */}
          {hasSubmitted && selectedOption && (
            <div className="pt-4 border-t border-stone-200 space-y-4 animate-in fade-in duration-300">
              <div
                className={`p-4 rounded-xl border ${
                  selectedOption.isOptimal
                    ? 'bg-[#EAF0EB] border-[#4A6B53]/40 text-stone-900'
                    : 'bg-[#FFF5F5] border-rose-300 text-stone-900'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  {selectedOption.isOptimal ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-[#4A6B53]" />
                      <span className="font-editorial text-lg text-[#4A6B53] font-bold">
                        Masterful Human Attunement (+{selectedOption.score} pts)
                      </span>
                    </>
                  ) : (
                    <>
                      <AlertCircle className="w-5 h-5 text-rose-600" />
                      <span className="font-editorial text-lg text-rose-700 font-bold">
                        Reactive Pattern Detected ({selectedOption.responseStyle.replace('_', ' ')})
                      </span>
                    </>
                  )}
                </div>

                <div className="space-y-2 text-xs sm:text-sm">
                  <div>
                    <span className="font-bold text-stone-800">Pedagogical Rationale: </span>
                    <span className="text-stone-700">{selectedOption.pedagogicalRationale}</span>
                  </div>

                  <div>
                    <span className="font-bold text-stone-800">Human & Relational Impact: </span>
                    <span className="text-stone-700">{selectedOption.humanImpact}</span>
                  </div>

                  {selectedOption.somaticNote && (
                    <div className="p-2.5 rounded-lg bg-white/70 border border-stone-200/60 text-xs text-stone-600 mt-1">
                      <span className="font-bold text-stone-800">Somatic Attunement: </span>
                      {selectedOption.somaticNote}
                    </div>
                  )}
                </div>
              </div>

              {/* Next Dilemma CTA */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
                <div className="text-xs text-stone-500">
                  Adaptive Engine calibrated for next dilemma
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const el = document.getElementById('dda-growth-chart-section');
                      if (el) el.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="px-3.5 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all flex items-center gap-1.5 shadow-2xs"
                  >
                    <TrendingUp className="w-3.5 h-3.5 text-[#4A6B53]" />
                    <span>Inspect Trajectory</span>
                  </button>

                  <button
                    onClick={handleNextScenario}
                    className="px-5 py-2.5 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-2 shadow-xs active:scale-[0.99]"
                  >
                    <span>Next Dilemma</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Difficulty Adjustment & Growth Trajectory Line Chart (Recharts) */}
      <div id="dda-growth-chart-section">
        <DDAGrowthChart
          history={gameProgress.recentHistory}
          currentDDA={gameProgress.dda}
        />
      </div>

      {/* Recent History Telemetry */}
      {gameProgress.recentHistory.length > 0 && (
        <div className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-600">
              Recent Dilemma Performance & Dynamic Adaptations
            </span>
            <span className="text-[11px] text-stone-400">Last 10 trials</span>
          </div>

          <div className="divide-y divide-stone-100">
            {gameProgress.recentHistory.slice(0, 5).map((h, i) => (
              <div key={i} className="py-2.5 flex items-center justify-between text-xs gap-3">
                <div className="flex items-center gap-2.5 truncate">
                  {h.isOptimal ? (
                    <CheckCircle2 className="w-4 h-4 text-[#4A6B53] shrink-0" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                  )}
                  <span className="font-medium text-stone-800 truncate">{h.scenarioTitle}</span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded-sm bg-stone-100 text-stone-600">
                    Tier {h.difficultyTier}
                  </span>
                </div>

                <div className="flex items-center gap-3 shrink-0 text-stone-500 text-[11px]">
                  <span>{h.timeTakenSeconds}s latency</span>
                  <span className="font-semibold text-stone-700">
                    {h.score === 100 ? '+100' : `${h.score}`}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
