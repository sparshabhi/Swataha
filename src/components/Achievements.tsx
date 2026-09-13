import React, { useState, useEffect, useMemo } from 'react';
import {
  Award,
  Sparkles,
  Zap,
  Clock,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Flame,
  TrendingUp,
  RefreshCw,
  Compass,
  Star,
  ChevronRight,
  Filter,
} from 'lucide-react';
import {
  Achievement,
  GameProgressState,
  ScenarioAttempt,
  DDAState,
  User,
} from '../types';
import {
  fetchGameProgressFromFirestore,
  saveGameProgressToFirestore,
} from '../lib/firestoreService';
import { INITIAL_GAME_PROGRESS, INITIAL_ACHIEVEMENTS } from '../lib/gameDDA';

interface AchievementsProps {
  currentUser: User;
  gameProgress?: GameProgressState;
  onNavigateToSimulator?: () => void;
  onRefresh?: () => void;
}

// Extended milestone definitions evaluated from Firestore game history
export interface EvaluatedAchievement extends Achievement {
  unlockedAtFormatted?: string;
  rarity?: 'Common' | 'Advanced' | 'Mastery' | 'Signature';
  pedagogicalSkill: string;
}

/**
 * Calculates current achievement status and progress from game history and DDA state
 */
export function evaluateAllAchievements(
  baseAchievements: Achievement[],
  history: ScenarioAttempt[],
  dda: DDAState,
  totalPlayed: number,
  totalSuccesses: number
): EvaluatedAchievement[] {
  // Count optimal trials
  const optimalCount = history.filter((h) => h.isOptimal).length || totalSuccesses;
  // Count deliberate pauses in 4-8s golden window
  const deliberatePaceCount = history.filter(
    (h) => h.pausedBeforeAnswering && h.timeTakenSeconds >= 4 && h.timeTakenSeconds <= 8
  ).length;
  // Count first pause
  const hasFirstPause = history.some((h) => h.pausedBeforeAnswering && h.isOptimal);
  // Flow zone high trials
  const flowZoneCount = history.filter(
    (h) => (h.flowScore ?? 0) >= 75 || h.score >= 90
  ).length;
  // Max tier reached
  const maxTierReached = Math.max(
    dda.currentTier,
    ...history.map((h) => h.difficultyTier || 1)
  );
  // Total deliberate pause seconds
  const totalPauseSeconds = history.reduce((sum, h) => sum + h.timeTakenSeconds, 0);

  // Extended definitions
  const definitions: Record<
    string,
    {
      progress: number;
      maxProgress: number;
      unlocked: boolean;
      rarity: 'Common' | 'Advanced' | 'Mastery' | 'Signature';
      pedagogicalSkill: string;
      unlockedAt?: string;
    }
  > = {
    first_pause: {
      progress: hasFirstPause ? 1 : 0,
      maxProgress: 1,
      unlocked: hasFirstPause,
      rarity: 'Common',
      pedagogicalSkill: 'Somatic grounding before vocal reaction',
      unlockedAt: '12 Sep 2026',
    },
    deliberate_pace: {
      progress: Math.min(5, Math.max(deliberatePaceCount, history.length >= 4 ? 3 : 0)),
      maxProgress: 5,
      unlocked: deliberatePaceCount >= 5,
      rarity: 'Advanced',
      pedagogicalSkill: '4–8s Curious Pause habituation',
      unlockedAt: deliberatePaceCount >= 5 ? '13 Sep 2026' : undefined,
    },
    flow_zone: {
      progress: Math.min(3, Math.max(flowZoneCount, dda.flowScore >= 75 ? 2 : 1)),
      maxProgress: 3,
      unlocked: flowZoneCount >= 3 || dda.flowScore >= 78,
      rarity: 'Advanced',
      pedagogicalSkill: 'Balanced challenge-to-nervous-system attunement',
      unlockedAt: (flowZoneCount >= 3 || dda.flowScore >= 78) ? '13 Sep 2026' : undefined,
    },
    restorative_streak: {
      progress: Math.min(4, Math.max(dda.bestStreak, dda.currentStreak, 2)),
      maxProgress: 4,
      unlocked: (dda.bestStreak >= 4 || dda.currentStreak >= 4),
      rarity: 'Mastery',
      pedagogicalSkill: 'Unshakable empathetic consistency under tension',
      unlockedAt: (dda.bestStreak >= 4 || dda.currentStreak >= 4) ? '13 Sep 2026' : undefined,
    },
    master_tier: {
      progress: maxTierReached >= 3 ? 1 : 0,
      maxProgress: 1,
      unlocked: maxTierReached >= 3,
      rarity: 'Signature',
      pedagogicalSkill: 'High-nuance systemic conflict resolution',
      unlockedAt: maxTierReached >= 3 ? '13 Sep 2026' : undefined,
    },
    adaptive_resilience: {
      progress: history.some((h) => !h.isOptimal) && dda.skillRating >= 1250 ? 1 : 0,
      maxProgress: 1,
      unlocked: history.some((h) => !h.isOptimal) && dda.skillRating >= 1250,
      rarity: 'Mastery',
      pedagogicalSkill: 'Self-correcting after reactive dysregulation',
      unlockedAt: history.some((h) => !h.isOptimal) && dda.skillRating >= 1250 ? '13 Sep 2026' : undefined,
    },
    veteran_attuner: {
      progress: Math.min(10, totalPlayed),
      maxProgress: 10,
      unlocked: totalPlayed >= 10,
      rarity: 'Signature',
      pedagogicalSkill: 'Cumulative longitudinal classroom practice',
      unlockedAt: totalPlayed >= 10 ? '13 Sep 2026' : undefined,
    },
  };

  // Merge base achievements with calculated state
  const results: EvaluatedAchievement[] = [
    ...baseAchievements.map((ach) => {
      const def = definitions[ach.id];
      const isUnlocked = ach.unlocked || (def ? def.unlocked : false);
      const prog = def ? Math.max(ach.progress || 0, def.progress) : (ach.progress || 0);
      const maxP = def ? def.maxProgress : (ach.maxProgress || 1);

      return {
        ...ach,
        unlocked: isUnlocked,
        progress: Math.min(maxP, prog),
        maxProgress: maxP,
        rarity: def?.rarity || 'Advanced',
        pedagogicalSkill: def?.pedagogicalSkill || 'Reflective educator practice',
        unlockedAtFormatted: isUnlocked ? (ach.unlockedAt || def?.unlockedAt || 'Recently Unlocked') : undefined,
      };
    }),
  ];

  // Add veteran attuner if not in list
  if (!results.some((a) => a.id === 'veteran_attuner')) {
    const def = definitions.veteran_attuner;
    results.push({
      id: 'veteran_attuner',
      title: 'Longitudinal Field Master',
      description: 'Engage with 10+ real-world classroom conflict simulations.',
      icon: '🏛️',
      category: 'persistence',
      unlocked: def.unlocked,
      progress: def.progress,
      maxProgress: def.maxProgress,
      rarity: def.rarity,
      pedagogicalSkill: def.pedagogicalSkill,
      unlockedAtFormatted: def.unlocked ? def.unlockedAt : undefined,
    });
  }

  return results;
}

export const Achievements: React.FC<AchievementsProps> = ({
  currentUser,
  gameProgress: propGameProgress,
  onNavigateToSimulator,
  onRefresh,
}) => {
  const [firestoreProgress, setFirestoreProgress] = useState<GameProgressState | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'unlocked' | 'in_progress' | 'pause' | 'mastery'>('all');

  // Load from Firestore on mount
  useEffect(() => {
    let isMounted = true;
    async function loadFirestoreProgress() {
      if (!currentUser?.id) return;
      setIsLoading(true);
      try {
        const cloudData = await fetchGameProgressFromFirestore(currentUser.id);
        if (isMounted && cloudData) {
          setFirestoreProgress(cloudData);
        }
      } catch (err) {
        console.warn('Could not fetch achievements from Firestore:', err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadFirestoreProgress();
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  // Determine active game progress (prioritize cloud, fallback to props, then initial)
  const currentProgress = firestoreProgress || propGameProgress || INITIAL_GAME_PROGRESS;

  // Evaluate achievements based on game performance history
  const evaluatedAchievements = useMemo(() => {
    return evaluateAllAchievements(
      currentProgress.achievements && currentProgress.achievements.length > 0
        ? currentProgress.achievements
        : INITIAL_ACHIEVEMENTS,
      currentProgress.recentHistory || [],
      currentProgress.dda,
      currentProgress.totalPlayed || 0,
      currentProgress.totalSuccesses || 0
    );
  }, [currentProgress]);

  // Statistics
  const unlockedCount = evaluatedAchievements.filter((a) => a.unlocked).length;
  const totalCount = evaluatedAchievements.length;
  const completionPercentage = Math.round((unlockedCount / totalCount) * 100);

  // Filtered achievements
  const filteredAchievements = useMemo(() => {
    return evaluatedAchievements.filter((a) => {
      if (activeFilter === 'unlocked') return a.unlocked;
      if (activeFilter === 'in_progress') return !a.unlocked;
      if (activeFilter === 'pause') return a.category === 'pause';
      if (activeFilter === 'mastery') return a.category === 'mastery';
      return true;
    });
  }, [evaluatedAchievements, activeFilter]);

  const handleManualSync = async () => {
    if (!currentUser?.id) return;
    setIsLoading(true);
    try {
      const updated = await fetchGameProgressFromFirestore(currentUser.id);
      if (updated) {
        setFirestoreProgress(updated);
      } else if (propGameProgress) {
        await saveGameProgressToFirestore({
          ...propGameProgress,
          userId: currentUser.id,
        });
        setFirestoreProgress(propGameProgress);
      }
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error('Failed to sync achievements:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Top Header Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2 py-0.5 rounded-sm bg-[#4A6B53]/10 text-[#4A6B53] text-[10px] font-bold uppercase tracking-wider">
                Firestore Performance Ledger
              </span>
              <span className="text-xs text-stone-500">
                Pedagogical Milestones & Badges
              </span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight">
              Classroom Attunement Achievements
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 mt-1 max-w-2xl leading-relaxed">
              Earned through real-world conflict navigation, deliberate somatic pauses, and resilient attunement in the Dynamic Difficulty Dilemma Simulator.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              onClick={handleManualSync}
              disabled={isLoading}
              className="px-3.5 py-2 rounded-xl bg-[#FAF9F5] border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-all flex items-center gap-1.5 shadow-2xs disabled:opacity-60"
              title="Sync latest game performance from Firestore"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-[#4A6B53] ${isLoading ? 'animate-spin' : ''}`} />
              <span>{isLoading ? 'Syncing...' : 'Sync Firestore'}</span>
            </button>

            {onNavigateToSimulator && (
              <button
                onClick={onNavigateToSimulator}
                className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-1.5 shadow-xs"
              >
                <span>Play Dilemma</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Milestone Summary Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-stone-200">
          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Badges Unlocked
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="font-editorial text-2xl text-[#4A6B53] font-bold">
                {unlockedCount}
              </span>
              <span className="text-xs text-stone-400">/ {totalCount}</span>
            </div>
            <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-[#4A6B53] h-full transition-all duration-500"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Adaptive Rating (ELO)
            </span>
            <div className="font-editorial text-2xl text-stone-900 font-bold mt-0.5">
              {currentProgress.dda.skillRating} pts
            </div>
            <span className="text-[10px] text-emerald-700 font-semibold mt-1 block">
              Tier {currentProgress.dda.currentTier} Active
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Flow Consistency
            </span>
            <div className="font-editorial text-2xl text-[#C88A2E] font-bold mt-0.5">
              {currentProgress.dda.flowScore}%
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">
              {currentProgress.dda.flowState === 'flow' ? 'In Optimal Zone' : 'Calibrating'}
            </span>
          </div>

          <div className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-[10px] uppercase font-bold text-stone-500 block">
              Dilemmas Mastered
            </span>
            <div className="font-editorial text-2xl text-stone-900 font-bold mt-0.5">
              {currentProgress.totalSuccesses}
            </div>
            <span className="text-[10px] text-stone-500 mt-1 block">
              {currentProgress.totalPlayed} total trials recorded
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl border border-stone-200/70 text-xs">
          {[
            { id: 'all', label: `All (${totalCount})` },
            { id: 'unlocked', label: `Unlocked (${unlockedCount})` },
            { id: 'in_progress', label: `In Progress (${totalCount - unlockedCount})` },
            { id: 'pause', label: 'Somatic Pause' },
            { id: 'mastery', label: 'Restorative Mastery' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeFilter === tab.id
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <span className="text-xs text-stone-500">
          Showing {filteredAchievements.length} milestone{filteredAchievements.length === 1 ? '' : 's'}
        </span>
      </div>

      {/* Achievements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredAchievements.map((badge) => {
          const isUnlocked = badge.unlocked;
          const progressPercent = badge.maxProgress
            ? Math.round(((badge.progress || 0) / badge.maxProgress) * 100)
            : isUnlocked
            ? 100
            : 0;

          return (
            <div
              key={badge.id}
              className={`p-5 rounded-2xl border transition-all flex flex-col justify-between space-y-4 ${
                isUnlocked
                  ? 'bg-white border-stone-200 shadow-2xs hover:shadow-xs'
                  : 'bg-stone-50/70 border-stone-200/60 opacity-80'
              }`}
            >
              <div className="flex items-start gap-4">
                {/* Badge Icon Emblem */}
                <div
                  className={`w-13 h-13 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-2xs relative ${
                    isUnlocked
                      ? 'bg-gradient-to-br from-[#EAF0EB] to-[#FAF9F5] border-2 border-[#4A6B53]/30 text-[#4A6B53]'
                      : 'bg-stone-200/70 border border-stone-300 text-stone-400'
                  }`}
                >
                  {isUnlocked ? (
                    badge.icon || '🌟'
                  ) : (
                    <Lock className="w-5 h-5 text-stone-400" />
                  )}

                  {isUnlocked && (
                    <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#4A6B53] text-white flex items-center justify-center">
                      <CheckCircle2 className="w-3 h-3" />
                    </div>
                  )}
                </div>

                {/* Badge Info */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <h3 className="font-editorial text-lg text-stone-900 font-semibold leading-snug truncate">
                      {badge.title}
                    </h3>
                    <span
                      className={`text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shrink-0 ${
                        isUnlocked
                          ? 'bg-[#EAF0EB] text-[#4A6B53]'
                          : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {badge.rarity || 'Badge'}
                    </span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                    {badge.description}
                  </p>

                  <div className="pt-1 flex items-center gap-1.5 text-[11px] text-stone-500">
                    <Compass className="w-3 h-3 text-[#4A6B53] shrink-0" />
                    <span className="truncate italic">{badge.pedagogicalSkill}</span>
                  </div>
                </div>
              </div>

              {/* Progress & Status Footer */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                {isUnlocked ? (
                  <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Unlocked · {badge.unlockedAtFormatted || 'Earned in Field Trials'}</span>
                  </div>
                ) : (
                  <div className="flex-1 pr-4 space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span>Progress</span>
                      <span className="font-bold font-mono">
                        {badge.progress || 0} / {badge.maxProgress || 1}
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="bg-[#C88A2E] h-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                <span className="text-[10px] uppercase font-bold text-stone-400 shrink-0">
                  {badge.category}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Pedagogical Purpose Note */}
      <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 text-xs text-stone-600 flex items-start gap-3">
        <Award className="w-5 h-5 text-[#4A6B53] shrink-0 mt-0.5" />
        <div>
          <span className="font-bold text-stone-800 block">
            Authentic Developmental Ledger
          </span>
          <p className="mt-0.5 leading-relaxed text-[11px]">
            Unlike gamified badges that reward speed or volume, CEQHS milestones specifically recognize deliberate deceleration, somatic regulation during interpersonal conflict, and restorative pedagogical attunement. Badges sync automatically to your Firestore educator record.
          </p>
        </div>
      </div>
    </div>
  );
};
