import React, { useState } from 'react';
import {
  Flame,
  Sparkles,
  CheckCircle2,
  Calendar,
  Trophy,
  Award,
  ArrowRight,
  Zap,
} from 'lucide-react';
import { triggerStreakFirework } from '../lib/celebration';

interface ConsecutiveReflectionStreakCardProps {
  streakDays: number;
  totalReflections: number;
  onOpenCapture: () => void;
  hasReflectedToday?: boolean;
}

export const ConsecutiveReflectionStreakCard: React.FC<ConsecutiveReflectionStreakCardProps> = ({
  streakDays = 3,
  totalReflections = 8,
  onOpenCapture,
  hasReflectedToday = false,
}) => {
  const [showCelebrationBanner, setShowCelebrationBanner] = useState(false);

  // Milestones: 3 days (Attuned), 5 days (Weekly Rhythm), 7 days (Deep Practice), 14 days (Cultural Habit)
  const milestones = [
    { days: 3, label: '3-Day Attunement', reward: 'Somatic Awareness' },
    { days: 5, label: '5-Day Rhythm', reward: 'Weekly Balance' },
    { days: 7, label: '7-Day Immersion', reward: 'Resilient Habit' },
    { days: 14, label: '14-Day Transformative', reward: 'Cultural Mastery' },
  ];

  // Find current and next milestone
  const nextMilestone = milestones.find((m) => m.days > streakDays) || milestones[milestones.length - 1];
  const prevMilestoneDays = milestones.filter((m) => m.days <= streakDays).pop()?.days || 0;
  const progressToNext = Math.min(
    100,
    Math.round((streakDays / nextMilestone.days) * 100)
  );

  // Days of current week status
  const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const todayDayIndex = (new Date().getDay() + 6) % 7; // Monday is 0

  const handleCelebrate = () => {
    triggerStreakFirework();
    setShowCelebrationBanner(true);
    setTimeout(() => {
      setShowCelebrationBanner(false);
    }, 4500);
  };

  return (
    <div className="bg-gradient-to-r from-white via-[#FAF9F5] to-[#FAF3E7]/50 border border-amber-200/90 rounded-2xl p-5 shadow-2xs space-y-4 relative overflow-hidden transition-all">
      {/* Background Glow */}
      <div className="absolute -bottom-10 -right-10 w-44 h-44 bg-amber-200/20 rounded-full blur-2xl pointer-events-none" />

      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-[#C88A2E] text-white flex items-center justify-center shrink-0 shadow-md">
            <Flame className="w-5 h-5 animate-pulse" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                Daily Reflection Consistency
              </span>
              <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold text-[10px] border border-amber-300 flex items-center gap-1">
                <Sparkles className="w-2.5 h-2.5 text-amber-600" />
                <span>Active Rhythm</span>
              </span>
            </div>

            <h4 className="font-editorial text-lg sm:text-xl font-bold text-stone-900">
              {streakDays} Consecutive Days of Reflective Practice
            </h4>
          </div>
        </div>

        {/* Action Button: Trigger Firework Celebration */}
        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={handleCelebrate}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-[#C88A2E] hover:from-amber-600 hover:to-[#b07724] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm hover:scale-105 active:scale-95 transition-all"
            title="Celebrate consecutive reflection streak with fireworks"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Celebrate Streak 🎉</span>
          </button>

          {!hasReflectedToday && (
            <button
              onClick={onOpenCapture}
              className="px-3 py-1.5 rounded-xl bg-[#4A6B53] hover:bg-[#3d5945] text-white text-xs font-semibold flex items-center gap-1 shadow-2xs transition-all"
            >
              <span>Log Today</span>
              <ArrowRight className="w-3 h-3" />
            </button>
          )}
        </div>
      </div>

      {/* Visual Progress Bar to Next Milestone */}
      <div className="space-y-1.5 bg-white/90 p-3.5 rounded-xl border border-amber-200/60 shadow-2xs">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-stone-800">
              Milestone: {nextMilestone.label}
            </span>
            <span className="text-stone-400">·</span>
            <span className="text-stone-500 text-[11px]">
              {Math.max(0, nextMilestone.days - streakDays)} more daily reflection
              {nextMilestone.days - streakDays === 1 ? '' : 's'} to unlock
            </span>
          </div>

          <span className="font-mono font-bold text-amber-800 text-xs">
            {streakDays} / {nextMilestone.days} Days ({progressToNext}%)
          </span>
        </div>

        {/* The Animated Progress Bar */}
        <div className="w-full bg-stone-100 h-3 rounded-full overflow-hidden border border-stone-200 relative">
          <div
            className="bg-gradient-to-r from-amber-400 via-[#C88A2E] to-emerald-600 h-full rounded-full transition-all duration-700 ease-out relative"
            style={{ width: `${progressToNext}%` }}
          >
            {/* Shimmer effect */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Milestone Steps Markers */}
        <div className="flex items-center justify-between pt-1 text-[10px] text-stone-500">
          {milestones.map((m) => {
            const isReached = streakDays >= m.days;
            return (
              <div
                key={m.days}
                className={`flex items-center gap-1 ${
                  isReached ? 'text-amber-800 font-bold' : 'text-stone-400'
                }`}
              >
                <div
                  className={`w-2 h-2 rounded-full ${
                    isReached ? 'bg-amber-600 ring-2 ring-amber-300' : 'bg-stone-300'
                  }`}
                />
                <span className="hidden sm:inline">{m.days}d: {m.label}</span>
                <span className="sm:hidden">{m.days}d</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Week Reflection Check-in Tracker */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs pt-1">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider">
            This Week's Attunement:
          </span>
          <div className="flex items-center gap-1.5">
            {daysOfWeek.map((day, idx) => {
              // Mark days active based on streak
              const isActive = idx <= todayDayIndex && idx > todayDayIndex - streakDays;
              const isToday = idx === todayDayIndex;

              return (
                <div
                  key={day}
                  className={`w-7 h-7 rounded-lg flex flex-col items-center justify-center text-[10px] transition-all ${
                    isActive
                      ? 'bg-emerald-100 border border-emerald-300 text-emerald-800 font-bold shadow-2xs'
                      : isToday
                      ? 'bg-amber-50 border border-amber-300 text-amber-800 font-semibold ring-1 ring-amber-400'
                      : 'bg-stone-100 text-stone-400 border border-stone-200'
                  }`}
                  title={`${day}: ${isActive ? 'Reflection logged' : isToday ? 'Today' : 'Upcoming'}`}
                >
                  <span>{day[0]}</span>
                  {isActive && <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600 -mt-0.5" />}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-[11px] text-stone-600 italic">
          Total lifetime entries: <strong>{totalReflections} reflective moments</strong>
        </div>
      </div>

      {/* Firework Celebration Popup / Notification */}
      {showCelebrationBanner && (
        <div className="bg-gradient-to-r from-amber-500 to-[#C88A2E] text-white p-3 rounded-xl shadow-lg flex items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
          <div className="flex items-center gap-2.5">
            <Trophy className="w-5 h-5 text-amber-200 shrink-0" />
            <div className="text-xs">
              <strong className="block text-sm font-bold">
                Consecutive Reflection Rhythm Achieved! 🌟
              </strong>
              <span>
                Your consistent daily inquiry creates the neural habit of somatic calm under classroom pressure.
              </span>
            </div>
          </div>
          <button
            onClick={() => setShowCelebrationBanner(false)}
            className="text-white/80 hover:text-white text-xs px-2 py-1 font-bold"
          >
            ✕
          </button>
        </div>
      )}
    </div>
  );
};
