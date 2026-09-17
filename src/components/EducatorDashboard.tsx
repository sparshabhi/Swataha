import React, { useState, useEffect, useMemo } from 'react';
import {
  Compass,
  Sparkles,
  BookOpen,
  Calendar,
  ArrowRight,
  Plus,
  Mic,
  FileText,
  Camera,
  Heart,
  Quote,
  Clock,
  ChevronRight,
  Eye,
  CheckCircle,
  Gamepad2,
  Zap,
  Award,
  CheckCircle2,
  Lock,
  X,
  RefreshCw,
} from 'lucide-react';
import {
  User,
  JourneyPhase,
  Theme,
  JourneyEntry,
  CalendarEvent,
  EntryType,
  GameProgressState,
  PersonalDevelopmentGoal,
} from '../types';
import { THEMES } from '../mockData';
import { evaluateAllAchievements } from './Achievements';
import {
  fetchGameProgressFromFirestore,
  fetchPersonalGoalsFromFirestore,
  savePersonalGoalToFirestore,
  deletePersonalGoalFromFirestore,
} from '../lib/firestoreService';
import { INITIAL_ACHIEVEMENTS, INITIAL_GAME_PROGRESS } from '../lib/gameDDA';
import { PersonalDevelopmentGoals } from './PersonalDevelopmentGoals';
import { DailyReflectionPromptCard } from './DailyReflectionPromptCard';
import { ConsecutiveReflectionStreakCard } from './ConsecutiveReflectionStreakCard';
import { INITIAL_MAYA_GOALS } from '../data/goalTemplates';
import { DailyPrompt } from '../data/dailyPrompts';
import { triggerStreakFirework } from '../lib/celebration';

interface EducatorDashboardProps {
  currentUser: User;
  phases: JourneyPhase[];
  currentTheme: Theme;
  entries: JourneyEntry[];
  calendarEvents: CalendarEvent[];
  onOpenCapture: (
    type?: EntryType,
    themeId?: string,
    prompt?: string,
    title?: string,
    competency?: string,
    goalId?: string
  ) => void;
  onSelectTheme: (themeId: string) => void;
  onNavigateTab: (tab: string) => void;
  gameProgress?: GameProgressState;
}

export const EducatorDashboard: React.FC<EducatorDashboardProps> = ({
  currentUser,
  phases,
  currentTheme,
  entries,
  calendarEvents,
  onOpenCapture,
  onSelectTheme,
  onNavigateTab,
  gameProgress,
}) => {
  // Counts based on author's authentic contributions
  const userEntries = entries.filter((e) => e.authorId === currentUser.id);
  const practiceCount = userEntries.filter((e) => e.type === 'practice').length + 11; // base seed offset
  const reflectionCount = userEntries.filter((e) => e.type === 'reflection').length + 7;
  const momentCount = userEntries.filter((e) => e.type === 'moment').length + 5;
  const evidenceCount = userEntries.filter((e) => e.type === 'evidence').length + 13;
  const voiceCount = userEntries.filter((e) => e.type === 'voice').length + 2;

  const currentPhaseId = '03_PRACTISE';

  // State for subtle Theme Spotlight notification
  const [isSpotlightDismissed, setIsSpotlightDismissed] = useState(false);

  // Firestore game progress for achievements
  const [cloudProgress, setCloudProgress] = useState<GameProgressState | null>(null);

  useEffect(() => {
    let isMounted = true;
    if (currentUser?.id) {
      fetchGameProgressFromFirestore(currentUser.id)
        .then((data) => {
          if (isMounted && data) {
            setCloudProgress(data);
          }
        })
        .catch((err) => console.warn('Could not fetch achievements from Firestore in dashboard:', err));
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  const activeProgress = cloudProgress || gameProgress || INITIAL_GAME_PROGRESS;

  // Evaluate achievements based on game performance history from Firestore
  const evaluatedAchievements = useMemo(() => {
    return evaluateAllAchievements(
      activeProgress.achievements && activeProgress.achievements.length > 0
        ? activeProgress.achievements
        : INITIAL_ACHIEVEMENTS,
      activeProgress.recentHistory || [],
      activeProgress.dda,
      activeProgress.totalPlayed || 0,
      activeProgress.totalSuccesses || 0
    );
  }, [activeProgress]);

  // Derive Theme Spotlight based on date or common themes from user's recent journey entries
  const themeSpotlight = useMemo(() => {
    // 1. Analyze user's recent journey entries
    const themeFrequency: Record<string, number> = {};
    userEntries.forEach((entry) => {
      const tId = entry.themeId;
      if (tId) {
        themeFrequency[tId] = (themeFrequency[tId] || 0) + 1;
      }
    });

    const sortedThemes = Object.entries(themeFrequency).sort((a, b) => b[1] - a[1]);
    const topThemeId = sortedThemes[0]?.[0];

    // Current date heuristics
    const now = new Date();
    const month = now.getMonth(); // 8 is September
    const dayOfWeek = now.getDay(); // 0 is Sun, 1 is Mon...

    let selectedTheme: Theme;
    let rationale = '';
    let prompt = '';

    if (topThemeId && themeFrequency[topThemeId] >= 2) {
      // User has demonstrated clear focus in entries
      if (topThemeId === 'empathetic-discipline') {
        selectedTheme = THEMES.find((t) => t.id === 'triggered-teacher') || THEMES[1];
        rationale = `Suggested sister theme based on your ${themeFrequency[topThemeId]} entries in Empathetic Discipline`;
        prompt = 'You have been practicing compassionate boundaries with students; today, try noticing where adult frustration first surfaces in your own body.';
      } else {
        selectedTheme = THEMES.find((t) => t.id === topThemeId) || THEMES[0];
        rationale = `Deepening momentum from your recent ${selectedTheme.title} entries`;
        prompt = 'Take a moment today to observe how students respond when you hold an open pause before reacting.';
      }
    } else {
      // Date-based seasonal curriculum spotlight
      if (month >= 8 && month <= 10) {
        // Autumn term: focus on grounding and relational safety
        if (dayOfWeek === 1 || dayOfWeek === 2) {
          selectedTheme = THEMES.find((t) => t.id === 'empathetic-discipline') || THEMES[0];
          rationale = 'Seasonal Spotlight · Mid-September Transitions';
          prompt = 'Practice the 4-second grounding exhale before speaking during crowded room transitions.';
        } else if (dayOfWeek === 3 || dayOfWeek === 4) {
          selectedTheme = THEMES.find((t) => t.id === 'belonging-agency') || THEMES[2];
          rationale = 'Mid-Week Attunement · Classroom Culture';
          prompt = 'Notice which student remains quiet during whole-group discussions and invite a low-stakes entrance point.';
        } else {
          selectedTheme = THEMES.find((t) => t.id === 'triggered-teacher') || THEMES[1];
          rationale = 'End-of-Week Somatic Reset';
          prompt = 'Pause to ground both feet on the floor before responding to unexpected afternoon interruptions.';
        }
      } else {
        selectedTheme = THEMES.find((t) => t.id === 'student-agency') || THEMES[3];
        rationale = 'Seasonal Focus · Transferring Ownership';
        prompt = 'Allow a student struggle to unfold for 10 extra seconds before stepping in with guidance.';
      }
    }

    return {
      theme: selectedTheme,
      rationale,
      prompt,
    };
  }, [userEntries]);

  // Personal Development Goals State
  const [goals, setGoals] = useState<PersonalDevelopmentGoal[]>(() => {
    const saved = localStorage.getItem(`ceqhs_goals_${currentUser.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return INITIAL_MAYA_GOALS;
  });

  // Load from Firestore if user has stored goals
  useEffect(() => {
    let isMounted = true;
    if (currentUser?.id) {
      fetchPersonalGoalsFromFirestore(currentUser.id).then((cloudGoals) => {
        if (isMounted && cloudGoals && cloudGoals.length > 0) {
          setGoals(cloudGoals);
          localStorage.setItem(`ceqhs_goals_${currentUser.id}`, JSON.stringify(cloudGoals));
        }
      });
    }
    return () => {
      isMounted = false;
    };
  }, [currentUser?.id]);

  const handleSaveGoal = async (goal: PersonalDevelopmentGoal) => {
    setGoals((prev) => {
      const exists = prev.some((g) => g.id === goal.id);
      const updated = exists ? prev.map((g) => (g.id === goal.id ? goal : g)) : [goal, ...prev];
      localStorage.setItem(`ceqhs_goals_${currentUser.id}`, JSON.stringify(updated));
      return updated;
    });
    if (currentUser?.id) {
      await savePersonalGoalToFirestore(goal);
    }
  };

  const handleDeleteGoal = async (goalId: string) => {
    setGoals((prev) => {
      const updated = prev.filter((g) => g.id !== goalId);
      localStorage.setItem(`ceqhs_goals_${currentUser.id}`, JSON.stringify(updated));
      return updated;
    });
    if (currentUser?.id) {
      await deletePersonalGoalFromFirestore(currentUser.id, goalId);
    }
  };

  const handleStartReflectionFromPrompt = (prompt: DailyPrompt) => {
    onOpenCapture(
      'reflection',
      currentTheme.id,
      prompt.reflectionStarter,
      `Reflection: ${prompt.question}`,
      prompt.suggestedCompetency
    );
  };

  const handleOpenCaptureForGoal = (goal: PersonalDevelopmentGoal) => {
    const activeTip = goal.weeklyTips[goal.currentWeekTipIndex] || goal.weeklyTips[0];
    onOpenCapture(
      'reflection',
      currentTheme.id,
      `Practicing ${goal.competency} (Week ${activeTip?.weekNumber || 1}: ${activeTip?.habit || activeTip?.focusHabit || ''}): `,
      `Observation: ${goal.title}`,
      goal.competency,
      goal.id
    );
  };

  // Calculate streak from user reflections
  const streakDays = useMemo(() => {
    const reflections = userEntries.filter((e) => e.type === 'reflection' || e.type === 'practice');
    return Math.max(4, Math.min(14, 4 + Math.floor(reflections.length / 2)));
  }, [userEntries]);

  const hasReflectedToday = useMemo(() => {
    const todayStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    return userEntries.some((e) => e.date.includes(todayStr));
  }, [userEntries]);

  // Day of week micro-prompts
  const microPrompts = [
    { day: 'Monday', action: 'Notice', text: 'What emotion are you bringing into the classroom today?' },
    { day: 'Wednesday', action: 'Try', text: 'Before correcting, ask one curious question.' },
    { day: 'Friday', action: 'Reflect', text: 'What happened differently because you paused?' },
  ];

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Daily Reflection Prompt Card (Top of Home Tab) */}
      <DailyReflectionPromptCard
        currentPhaseId={currentPhaseId}
        onStartReflection={handleStartReflectionFromPrompt}
        streakCount={streakDays}
      />

      {/* Header Greeting */}
      <section className="bg-white/70 border border-stone-200/80 rounded-2xl p-6 sm:p-8 shadow-2xs backdrop-blur-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Living Field Journal
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
              Good morning, {currentUser.name.split(' ')[0]}
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              {currentUser.schoolName} · Academic Year {currentUser.academicYear} · {currentUser.title}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#FAF9F5] border border-stone-200 rounded-xl text-left">
              <span className="text-[11px] uppercase tracking-wider text-stone-500 font-medium block">
                Active Theme
              </span>
              <span className="text-sm font-semibold text-[#252525]">{currentTheme.title}</span>
            </div>
          </div>
        </div>

        {/* Horizontal Journey Indicator */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              The CEQHS School Journey
            </span>
            <span className="text-xs font-medium text-[#4A6B53] bg-[#EAF0EB] px-2.5 py-0.5 rounded-full">
              Phase 03: You are currently practicing Empathetic Discipline
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {phases.map((phase) => {
              const isActive = phase.id === currentPhaseId;
              const isPast = phase.id === '01_EXPLORE' || phase.id === '02_FOCUS';

              return (
                <div
                  key={phase.id}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    isActive
                      ? 'bg-[#EAF0EB] border-[#4A6B53] ring-1 ring-[#4A6B53] shadow-xs'
                      : isPast
                      ? 'bg-[#F4F1EA] border-stone-200/80 text-stone-600'
                      : 'bg-white/50 border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span>{phase.number}</span>
                    {isPast && <span className="text-[#4A6B53]">✓</span>}
                    {isActive && <span className="w-2 h-2 rounded-full bg-[#4A6B53] animate-pulse" />}
                  </div>
                  <div className={`text-xs font-bold mt-1 ${isActive ? 'text-[#252525]' : ''}`}>
                    {phase.name}
                  </div>
                  <div className="text-[10px] text-stone-500 truncate mt-0.5">{phase.question}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Subtle Theme Spotlight Notification */}
      {!isSpotlightDismissed ? (
        <div className="bg-gradient-to-r from-[#FAF9F5] via-white to-[#EAF0EB]/50 border border-[#4A6B53]/30 rounded-2xl p-5 shadow-2xs relative overflow-hidden transition-all">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-start gap-3.5">
              <div className="w-10 h-10 rounded-xl bg-[#EAF0EB] text-[#4A6B53] flex items-center justify-center shrink-0 border border-[#4A6B53]/20 shadow-2xs mt-0.5">
                <Sparkles className="w-5 h-5 text-[#4A6B53]" />
              </div>

              <div className="space-y-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-[#4A6B53] text-white text-[10px] font-bold uppercase tracking-wider">
                    Theme Spotlight
                  </span>
                  <span className="text-xs font-semibold text-stone-700">
                    {themeSpotlight.rationale}
                  </span>
                </div>

                <div className="flex flex-wrap items-baseline gap-2">
                  <h3 className="font-editorial text-lg sm:text-xl font-bold text-[#252525]">
                    {themeSpotlight.theme.title}
                  </h3>
                  <span className="text-xs text-stone-500 italic">
                    "{themeSpotlight.theme.question}"
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                  {themeSpotlight.prompt}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
              <button
                onClick={() => onSelectTheme(themeSpotlight.theme.id)}
                className="px-3.5 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-1 shadow-2xs"
              >
                <span>Explore Theme</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onOpenCapture('practice')}
                className="px-3 py-2 rounded-xl bg-white border border-stone-200 text-stone-700 text-xs font-semibold hover:bg-stone-50 transition-all shadow-2xs"
              >
                Log Practice
              </button>

              <button
                onClick={() => setIsSpotlightDismissed(true)}
                className="p-2 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                title="Dismiss spotlight notification"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-end -mt-4">
          <button
            onClick={() => setIsSpotlightDismissed(false)}
            className="text-[11px] text-stone-500 hover:text-[#4A6B53] flex items-center gap-1.5 underline transition-colors"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#4A6B53]" />
            <span>Show Theme Spotlight ({themeSpotlight.theme.title})</span>
          </button>
        </div>
      )}

      {/* Consecutive Reflection Streak Progress Bar & Reward Firework */}
      <ConsecutiveReflectionStreakCard
        streakDays={streakDays}
        totalReflections={reflectionCount + practiceCount}
        onOpenCapture={() => onOpenCapture('reflection', currentTheme.id)}
        hasReflectedToday={hasReflectedToday}
      />

      {/* Main 2-Column Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Columns */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section: PERSONAL DEVELOPMENT GOALS (SEI Adults UEQ / Neural Net Objectives) */}
          <PersonalDevelopmentGoals
            currentUser={currentUser}
            goals={goals}
            userEntries={userEntries}
            onSaveGoal={handleSaveGoal}
            onDeleteGoal={handleDeleteGoal}
            onOpenCaptureForGoal={handleOpenCaptureForGoal}
          />

          {/* Card 1: YOUR CURRENT FOCUS */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#EAF0EB]/50 rounded-full blur-2xl -mr-10 -mt-10 pointer-events-none" />

            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
                Your Current Focus
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full bg-[#FAF3E7] text-[#C88A2E] font-medium border border-[#C88A2E]/20">
                Theme Exploration
              </span>
            </div>

            <h2 className="text-2xl font-bold text-[#252525]">{currentTheme.title}</h2>

            <div className="mt-3 p-3.5 rounded-xl bg-[#FAF9F5] border-l-4 border-[#4A6B53] text-stone-800">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-1">
                Theme Invitation
              </span>
              <p className="font-editorial italic text-lg sm:text-xl text-[#252525] leading-snug">
                "{currentTheme.question}"
              </p>
            </div>

            <p className="text-sm text-stone-600 mt-3.5 leading-relaxed">
              {currentTheme.overview}
            </p>

            <div className="mt-5 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onSelectTheme(currentTheme.id)}
                className="px-4 py-2 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-1.5"
              >
                <span>Explore theme inquiry</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onOpenCapture('practice')}
                className="px-4 py-2 rounded-xl bg-[#EAF0EB] text-[#4A6B53] text-xs font-semibold hover:bg-[#dce5dd] transition-colors flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Log a practice experiment</span>
              </button>
            </div>
          </div>

          {/* Interactive DDA Game Simulator Card */}
          <div className="bg-[#252525] text-[#FAF9F5] border border-stone-800 rounded-2xl p-6 shadow-md relative overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm bg-[#4A6B53] text-white">
                  Dynamic Difficulty Engine
                </span>
                <span className="text-xs text-stone-400">Classroom Dilemma Simulator</span>
              </div>
              {gameProgress && (
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-amber-400 font-bold">Tier {gameProgress.dda.currentTier}</span>
                  <span className="text-stone-400">·</span>
                  <span className="text-emerald-400 font-bold">{gameProgress.dda.skillRating} ELO</span>
                </div>
              )}
            </div>

            <h3 className="font-editorial text-2xl sm:text-3xl text-white font-normal mt-1">
              The Curious Pause Dilemma Challenge
            </h3>

            <p className="text-xs sm:text-sm text-stone-300 mt-2 leading-relaxed">
              Step into realistic student disregulations, parent escalations, and colleague tensions. The DDA algorithm continuously monitors your reaction latency and pedagogical accuracy to maintain your optimal flow zone.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-stone-700/60">
              <div className="flex items-center gap-3 text-xs text-stone-400">
                <div className="flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-400" />
                  <span>Adaptive Pacing & Nuance</span>
                </div>
                <span>·</span>
                <span>{gameProgress?.totalPlayed || 0} dilemmas solved</span>
              </div>

              <button
                onClick={() => onNavigateTab('simulator')}
                className="px-5 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3d5945] text-white text-xs font-bold transition-all flex items-center gap-2 shadow-xs active:scale-[0.99]"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>Launch Dilemma Challenge</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Section: RECENT ACHIEVEMENTS & MILESTONES (Retrieved from Firestore Game History) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-sm bg-[#4A6B53]/10 text-[#4A6B53]">
                    Firestore Ledger
                  </span>
                  <span className="text-xs text-stone-500">
                    Game Performance Milestones
                  </span>
                </div>
                <h3 className="font-editorial text-xl sm:text-2xl text-[#252525] font-normal">
                  Recent Achievements & Badges
                </h3>
              </div>

              <button
                onClick={() => onNavigateTab('achievements')}
                className="text-xs font-semibold text-[#4A6B53] hover:text-[#3d5945] flex items-center gap-1 self-start sm:self-auto hover:underline"
              >
                <span>View all ({evaluatedAchievements.length})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Earned by holding deliberate somatic pauses, achieving flow calibration, and choosing empathetic classroom resolutions.
            </p>

            {/* Badges Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
              {evaluatedAchievements
                .slice()
                .sort((a, b) => (b.unlocked ? 1 : 0) - (a.unlocked ? 1 : 0))
                .slice(0, 3)
                .map((badge) => {
                  const isUnlocked = badge.unlocked;
                  const progressPct = badge.maxProgress
                    ? Math.round(((badge.progress || 0) / badge.maxProgress) * 100)
                    : isUnlocked
                    ? 100
                    : 0;

                  return (
                    <div
                      key={badge.id}
                      className={`p-3.5 rounded-xl border flex flex-col justify-between space-y-3 transition-all ${
                        isUnlocked
                          ? 'bg-[#FAF9F5] border-stone-200/90 shadow-2xs'
                          : 'bg-stone-50/60 border-stone-200/60 opacity-80'
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center text-lg shrink-0 shadow-2xs relative ${
                            isUnlocked
                              ? 'bg-[#EAF0EB] text-[#4A6B53] border border-[#4A6B53]/30'
                              : 'bg-stone-200 text-stone-400 border border-stone-300'
                          }`}
                        >
                          {isUnlocked ? badge.icon : <Lock className="w-4 h-4" />}
                          {isUnlocked && (
                            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full bg-[#4A6B53] text-white flex items-center justify-center">
                              <CheckCircle2 className="w-2.5 h-2.5" />
                            </div>
                          )}
                        </div>

                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-bold text-stone-900 truncate">
                            {badge.title}
                          </h4>
                          <span className="text-[10px] text-stone-500 line-clamp-1">
                            {badge.pedagogicalSkill}
                          </span>
                        </div>
                      </div>

                      {/* Status / Progress bar */}
                      <div className="pt-2 border-t border-stone-200/60">
                        {isUnlocked ? (
                          <div className="flex items-center justify-between text-[10px]">
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3" />
                              <span>Earned</span>
                            </span>
                            <span className="text-stone-400 font-mono">
                              {badge.unlockedAtFormatted || 'Field Verified'}
                            </span>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <div className="flex items-center justify-between text-[10px] text-stone-500">
                              <span>Progress</span>
                              <span className="font-mono font-semibold">
                                {badge.progress || 0}/{badge.maxProgress || 1}
                              </span>
                            </div>
                            <div className="w-full bg-stone-200 h-1.5 rounded-full overflow-hidden">
                              <div
                                className="bg-[#C88A2E] h-full transition-all"
                                style={{ width: `${progressPct}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
            </div>

            {/* Bottom summary bar */}
            <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-[#4A6B53]" />
                <span>
                  <strong>{evaluatedAchievements.filter((a) => a.unlocked).length}</strong> of{' '}
                  {evaluatedAchievements.length} Badges Unlocked
                </span>
                <span className="text-stone-400">·</span>
                <span className="font-mono text-stone-700">
                  {activeProgress.dda.skillRating} ELO (Tier {activeProgress.dda.currentTier})
                </span>
              </div>

              <button
                onClick={() => onNavigateTab('achievements')}
                className="text-xs font-semibold text-[#4A6B53] hover:underline"
              >
                Inspect Ledger & All Milestones →
              </button>
            </div>
          </div>

          {/* Card 3: THIS WEEK PRACTICE INVITATION */}
          <div className="bg-[#FAF3E7] border border-[#C88A2E]/30 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-[#C88A2E]">
                This Week's Micro-Practice
              </span>
              <span className="text-xs font-medium text-stone-600">September Week 3</span>
            </div>

            <h3 className="font-editorial text-2xl text-[#252525] font-normal">
              Pause before solving
            </h3>

            <p className="text-sm text-stone-700 mt-2 leading-relaxed font-normal">
              When a student brings you a problem this week, try asking one curious question before offering a solution.
            </p>

            <div className="mt-4 pt-3 border-t border-[#C88A2E]/20 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onOpenCapture('practice')}
                  className="px-4 py-2 rounded-xl bg-[#C88A2E] text-white text-xs font-semibold hover:bg-[#b07824] transition-colors shadow-2xs"
                >
                  Try it in class
                </button>
                <button
                  onClick={() => onOpenCapture('reflection')}
                  className="px-4 py-2 rounded-xl bg-white/80 text-stone-700 text-xs font-semibold hover:bg-white transition-colors border border-stone-300/80"
                >
                  Reflect later
                </button>
              </div>
              <span className="text-xs text-stone-500 italic hidden sm:inline">
                A gentle invitation, not a requirement.
              </span>
            </div>
          </div>

          {/* Card 5: ADD TO YOUR JOURNEY (Signature Action Bar) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Quick Capture
                </span>
                <h3 className="font-editorial text-xl text-[#252525] font-normal">
                  Add to Your Living Journey
                </h3>
              </div>
              <span className="text-xs text-stone-500">Capture what mattered today</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 mt-4">
              {[
                { type: 'practice' as EntryType, label: '+ Practice', icon: Plus, color: 'hover:bg-[#EAF0EB] hover:border-[#4A6B53]' },
                { type: 'reflection' as EntryType, label: '+ Reflection', icon: FileText, color: 'hover:bg-[#FAF3E7] hover:border-[#C88A2E]' },
                { type: 'moment' as EntryType, label: '+ Moment', icon: Sparkles, color: 'hover:bg-[#F8EDE9] hover:border-[#C45D3E]' },
                { type: 'evidence' as EntryType, label: '+ Evidence', icon: Camera, color: 'hover:bg-[#EBF2F6] hover:border-[#3F6C8A]' },
                { type: 'voice' as EntryType, label: '+ Voice', icon: Mic, color: 'hover:bg-purple-50 hover:border-purple-300' },
              ].map((btn) => (
                <button
                  key={btn.type}
                  onClick={() => onOpenCapture(btn.type)}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border border-stone-200 bg-[#FAF9F5] text-stone-800 text-xs font-semibold transition-all hover:scale-[1.02] shadow-2xs ${btn.color}`}
                >
                  <btn.icon className="w-5 h-5 mb-1 text-stone-700" />
                  <span>{btn.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Recent Contributions in Timeline */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                  Living Record
                </span>
                <h3 className="font-editorial text-xl text-[#252525] font-normal">
                  Your Recent Entries
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('journey')}
                className="text-xs font-semibold text-[#4A6B53] hover:underline flex items-center gap-1"
              >
                <span>View all in My Journey</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-3">
              {entries.slice(0, 3).map((entry) => (
                <div
                  key={entry.id}
                  className="p-3.5 rounded-xl border border-stone-200 bg-[#FAF9F5] hover:bg-stone-50 transition-colors flex items-start justify-between gap-3"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                          entry.type === 'moment'
                            ? 'bg-[#FAF3E7] text-[#C88A2E]'
                            : entry.type === 'practice'
                            ? 'bg-[#EAF0EB] text-[#4A6B53]'
                            : entry.type === 'voice'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-stone-200 text-stone-700'
                        }`}
                      >
                        {entry.type}
                      </span>
                      <span className="text-xs text-stone-500">{entry.date}</span>
                    </div>
                    <div className="text-sm font-semibold text-stone-900">{entry.title}</div>
                    <p className="text-xs text-stone-600 line-clamp-1">{entry.description}</p>
                  </div>

                  <span className="text-[10px] px-2 py-0.5 rounded-md bg-white border border-stone-200 text-stone-600 font-medium shrink-0">
                    {entry.visibility}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Sidebar Column */}
        <div className="space-y-6">
          {/* Card 2: YOUR JOURNEY (Non-evaluative counts) */}
          <div className="bg-[#F4F1EA] border border-stone-200 rounded-2xl p-6 shadow-2xs">
            <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
              Your Journey Record
            </span>
            <h3 className="font-editorial text-xl text-[#252525] font-normal mt-0.5">
              Reflective Contributions
            </h3>
            <p className="text-xs text-stone-500 mt-1 mb-4">
              A record of presence and continuous care, not an achievement score.
            </p>

            <div className="grid grid-cols-2 gap-2.5">
              <div className="p-3 rounded-xl bg-white border border-stone-200/80">
                <div className="text-2xl font-editorial font-bold text-[#4A6B53]">{practiceCount}</div>
                <div className="text-xs font-semibold text-stone-600 mt-0.5">Practices</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200/80">
                <div className="text-2xl font-editorial font-bold text-[#C88A2E]">{reflectionCount}</div>
                <div className="text-xs font-semibold text-stone-600 mt-0.5">Reflections</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200/80">
                <div className="text-2xl font-editorial font-bold text-[#C45D3E]">{momentCount}</div>
                <div className="text-xs font-semibold text-stone-600 mt-0.5">Moments</div>
              </div>
              <div className="p-3 rounded-xl bg-white border border-stone-200/80">
                <div className="text-2xl font-editorial font-bold text-[#3F6C8A]">{evidenceCount}</div>
                <div className="text-xs font-semibold text-stone-600 mt-0.5">Evidence Items</div>
              </div>
            </div>

            <div className="mt-3 p-3 rounded-xl bg-white border border-stone-200/80 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl">🎙</span>
                <span className="text-xs font-semibold text-stone-700">Voice Reflections</span>
              </div>
              <span className="text-lg font-bold font-editorial text-purple-700">{voiceCount}</span>
            </div>
          </div>

          {/* Card 6: YOUR INTENTION & REFLECTION MIRROR */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
                  Your Opening Intention
                </span>
                <span className="text-[10px] text-stone-400">{currentUser.intentionDate}</span>
              </div>
              <div className="mt-2 p-3.5 rounded-xl bg-[#EAF0EB]/60 border border-[#4A6B53]/20">
                <p className="text-xs text-stone-800 italic leading-relaxed">
                  "{currentUser.intention}"
                </p>
              </div>
            </div>

            {/* Reflection Mirror */}
            {currentUser.reflectionMirror && (
              <div className="pt-3 border-t border-stone-200">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#C45D3E]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Reflection Mirror</span>
                </div>
                <p className="text-xs font-medium text-stone-700 mt-1">
                  You wrote this earlier in your journey:
                </p>
                <div className="mt-1.5 p-3 rounded-lg bg-[#F8EDE9]/60 text-xs text-stone-700 italic border border-[#C45D3E]/20">
                  "{currentUser.reflectionMirror.earlyReflection}"
                </div>
                <div className="mt-2 text-xs text-stone-600">
                  <span className="font-semibold text-stone-800">What are you noticing now?</span>
                </div>
                <button
                  onClick={() => onOpenCapture('reflection')}
                  className="mt-2 w-full py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-xs font-medium text-stone-700 transition-colors"
                >
                  Record Mirror Reflection
                </button>
              </div>
            )}
          </div>

          {/* Card 4: COMING UP (Journey Calendar Dates) */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-500">
                Coming Up
              </span>
              <button
                onClick={() => onNavigateTab('calendar')}
                className="text-xs font-semibold text-[#4A6B53] hover:underline"
              >
                Full Calendar
              </button>
            </div>

            <div className="space-y-2.5">
              {calendarEvents.slice(0, 4).map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-xl border border-stone-200/80 bg-[#FAF9F5] flex items-start gap-3"
                >
                  <div className="w-12 text-center shrink-0 pt-0.5">
                    <span className="block text-xs font-bold text-stone-900 leading-none">
                      {evt.monthDay.split(' ')[0]}
                    </span>
                    <span className="text-[10px] text-stone-500 uppercase">
                      {evt.monthDay.split(' ')[1]}
                    </span>
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.2 rounded-sm ${
                          evt.type === 'LEARN'
                            ? 'bg-blue-100 text-blue-800'
                            : evt.type === 'PRACTISE'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {evt.type}
                      </span>
                    </div>
                    <div className="text-xs font-medium text-stone-900 truncate mt-0.5">
                      {evt.title}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Micro-prompts: Tips & Nudges */}
          <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-200 text-xs space-y-2">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-400 block">
              Gentle Weekly Invitations
            </span>
            {microPrompts.map((nudge) => (
              <div key={nudge.day} className="flex items-start gap-2 pt-1">
                <span className="font-semibold text-[#4A6B53] shrink-0 w-16">{nudge.day}:</span>
                <span className="text-stone-600">{nudge.text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
