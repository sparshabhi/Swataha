import React, { useState } from 'react';
import {
  Target,
  Plus,
  Calendar,
  Clock,
  CheckCircle2,
  Sparkles,
  FileText,
  Upload,
  ChevronRight,
  BookOpen,
  ArrowRight,
  Edit2,
  Trash2,
  AlertCircle,
  HelpCircle,
  Award,
  Layers,
  Heart,
  Brain,
  Compass,
  Check,
  X,
  ExternalLink,
} from 'lucide-react';
import {
  PersonalDevelopmentGoal,
  JourneyEntry,
  User,
  SEIAssessmentSource,
  SEICompetencyCategory,
  WeeklyActionTip,
} from '../types';
import {
  SEI_COMPETENCIES,
  generateWeeklyTipsForCompetency,
} from '../data/goalTemplates';
import { triggerStreakFirework } from '../lib/celebration';

interface PersonalDevelopmentGoalsProps {
  currentUser: User;
  goals: PersonalDevelopmentGoal[];
  userEntries: JourneyEntry[];
  onSaveGoal: (goal: PersonalDevelopmentGoal) => void;
  onDeleteGoal: (goalId: string) => void;
  onOpenCaptureForGoal?: (goal: PersonalDevelopmentGoal) => void;
}

export const PersonalDevelopmentGoals: React.FC<PersonalDevelopmentGoalsProps> = ({
  currentUser,
  goals,
  userEntries,
  onSaveGoal,
  onDeleteGoal,
  onOpenCaptureForGoal,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<PersonalDevelopmentGoal | null>(null);
  const [isAssessmentModalOpen, setIsAssessmentModalOpen] = useState(false);
  const [expandedTipsGoalId, setExpandedTipsGoalId] = useState<string | null>(null);
  const [selectedAssessmentFilter, setSelectedAssessmentFilter] = useState<string>('all');

  // New Goal Form State
  const [formData, setFormData] = useState<{
    title: string;
    assessmentSource: SEIAssessmentSource;
    assessmentReportName: string;
    assessmentReportDate: string;
    competency: string;
    timeframeWeeks: number;
    targetDate: string;
    actionPlan: string;
    notes: string;
    weeklyTips: WeeklyActionTip[];
  }>({
    title: '',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    assessmentReportName: 'Maya_Lin_SEI_Adults_UEQ_Profile_2026.pdf',
    assessmentReportDate: '12 September 2026',
    competency: SEI_COMPETENCIES[0].name,
    timeframeWeeks: 6,
    targetDate: '24 October 2026',
    actionPlan: '',
    notes: '',
    weeklyTips: generateWeeklyTipsForCompetency(SEI_COMPETENCIES[0].name, 6),
  });

  const handleOpenCreate = () => {
    const defaultCompetency = SEI_COMPETENCIES[0].name;
    const initialTips = generateWeeklyTipsForCompetency(defaultCompetency, 6);
    const now = new Date();
    const target = new Date(now.getTime() + 6 * 7 * 24 * 60 * 60 * 1000);
    const targetStr = `${target.getDate()} ${target.toLocaleString('default', { month: 'short' })} ${target.getFullYear()}`;

    setFormData({
      title: '',
      assessmentSource: 'SEI Adults (UEQ Profile)',
      assessmentReportName: `${currentUser.name.replace(/\s+/g, '_')}_SEI_Assessment_Report.pdf`,
      assessmentReportDate: `${now.getDate()} ${now.toLocaleString('default', { month: 'short' })} ${now.getFullYear()}`,
      competency: defaultCompetency,
      timeframeWeeks: 6,
      targetDate: targetStr,
      actionPlan: '',
      notes: '',
      weeklyTips: initialTips,
    });
    setEditingGoal(null);
    setIsCreateModalOpen(true);
  };

  const handleOpenEdit = (goal: PersonalDevelopmentGoal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      assessmentSource: goal.assessmentSource,
      assessmentReportName: goal.assessmentReportName || '',
      assessmentReportDate: goal.assessmentReportDate || '',
      competency: goal.competency,
      timeframeWeeks: goal.timeframeWeeks,
      targetDate: goal.targetDate,
      actionPlan: goal.actionPlan,
      notes: goal.notes || '',
      weeklyTips: [...goal.weeklyTips],
    });
    setIsCreateModalOpen(true);
  };

  const handleCompetencyChange = (compName: string) => {
    const comp = SEI_COMPETENCIES.find((c) => c.name === compName);
    const updatedTips = generateWeeklyTipsForCompetency(compName, formData.timeframeWeeks);
    setFormData((prev) => ({
      ...prev,
      competency: compName,
      assessmentSource: comp?.assessmentSource || prev.assessmentSource,
      weeklyTips: updatedTips,
      title: prev.title || `Develop ${compName} in Daily Practice`,
      actionPlan: prev.actionPlan || (comp ? comp.description : ''),
    }));
  };

  const handleTimeframeChange = (weeks: number) => {
    const now = new Date();
    const target = new Date(now.getTime() + weeks * 7 * 24 * 60 * 60 * 1000);
    const targetStr = `${target.getDate()} ${target.toLocaleString('default', { month: 'short' })} ${target.getFullYear()}`;
    const updatedTips = generateWeeklyTipsForCompetency(formData.competency, weeks);

    setFormData((prev) => ({
      ...prev,
      timeframeWeeks: weeks,
      targetDate: targetStr,
      weeklyTips: updatedTips,
    }));
  };

  const handleToggleTipCompletion = (goal: PersonalDevelopmentGoal, tipIndex: number) => {
    const updatedTips = goal.weeklyTips.map((tip, idx) => {
      if (idx === tipIndex) {
        return { ...tip, isCompleted: !tip.isCompleted };
      }
      return tip;
    });

    const completedCount = updatedTips.filter((t) => t.isCompleted).length;
    const progress = Math.min(100, Math.round((completedCount / updatedTips.length) * 80 + (goal.linkedEntryIds.length > 0 ? 20 : 0)));

    const updatedGoal: PersonalDevelopmentGoal = {
      ...goal,
      weeklyTips: updatedTips,
      progressPercentage: progress,
      status: progress >= 100 ? 'Completed' : progress >= 50 ? 'On Track' : 'In Progress',
      updatedAt: new Date().toISOString(),
    };

    onSaveGoal(updatedGoal);

    if (updatedTips[tipIndex].isCompleted) {
      triggerStreakFirework();
    }
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    const compMeta = SEI_COMPETENCIES.find((c) => c.name === formData.competency);

    const goalToSave: PersonalDevelopmentGoal = {
      id: editingGoal ? editingGoal.id : `goal-${Date.now()}`,
      userId: currentUser.id,
      title: formData.title.trim() || `Professional Growth in ${formData.competency}`,
      assessmentSource: formData.assessmentSource,
      assessmentReportName: formData.assessmentReportName,
      assessmentReportDate: formData.assessmentReportDate,
      competency: formData.competency,
      competencyCategory: compMeta?.category || 'Know Yourself',
      timeframeWeeks: formData.timeframeWeeks,
      targetDate: formData.targetDate,
      actionPlan: formData.actionPlan,
      weeklyTips: formData.weeklyTips,
      currentWeekTipIndex: editingGoal ? editingGoal.currentWeekTipIndex : 0,
      linkedEntryIds: editingGoal ? editingGoal.linkedEntryIds : [],
      status: editingGoal ? editingGoal.status : 'In Progress',
      progressPercentage: editingGoal ? editingGoal.progressPercentage : 15,
      createdAt: editingGoal ? editingGoal.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: formData.notes,
    };

    onSaveGoal(goalToSave);
    setIsCreateModalOpen(false);
    triggerStreakFirework();
  };

  // Filter goals
  const filteredGoals = goals.filter((g) => {
    if (selectedAssessmentFilter === 'all') return true;
    if (selectedAssessmentFilter === 'ueq') return g.assessmentSource.includes('UEQ Profile');
    if (selectedAssessmentFilter === 'neural') return g.assessmentSource.includes('Neural Net');
    return true;
  });

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs space-y-6">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-[#3F6C8A]/10 text-[#3F6C8A] text-[10px] font-bold uppercase tracking-wider">
              SEI Adults Assessment
            </span>
            <span className="text-xs font-semibold text-stone-500">
              UEQ Profile & Neural Net Objectives
            </span>
          </div>

          <h3 className="font-editorial text-2xl text-[#252525] font-normal">
            Personal Development Goals
          </h3>

          <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
            Short-term growth objectives agreed during your SEI assessment briefing. Practice target competencies in set timeframes with weekly reminders linked to your daily reflections.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
          <button
            onClick={() => setIsAssessmentModalOpen(true)}
            className="px-3 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs"
            title="View SEI Adult Assessment Briefing Context"
          >
            <FileText className="w-3.5 h-3.5 text-stone-600" />
            <span>Briefing Reports</span>
          </button>

          <button
            onClick={handleOpenCreate}
            className="px-3.5 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Growth Goal</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-stone-400 text-[11px] font-medium mr-1">Assessment Source:</span>
          <button
            onClick={() => setSelectedAssessmentFilter('all')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedAssessmentFilter === 'all'
                ? 'bg-[#4A6B53] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            All Objectives ({goals.length})
          </button>
          <button
            onClick={() => setSelectedAssessmentFilter('ueq')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedAssessmentFilter === 'ueq'
                ? 'bg-[#4A6B53] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            UEQ Profiles
          </button>
          <button
            onClick={() => setSelectedAssessmentFilter('neural')}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
              selectedAssessmentFilter === 'neural'
                ? 'bg-[#4A6B53] text-white shadow-2xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Neural Net Profiles
          </button>
        </div>

        <div className="text-[11px] text-stone-500 hidden sm:block">
          {goals.filter((g) => g.status === 'Completed').length} of {goals.length} completed
        </div>
      </div>

      {/* Goals Cards List */}
      {filteredGoals.length === 0 ? (
        <div className="p-8 text-center bg-[#FAF9F5] rounded-xl border border-dashed border-stone-300 space-y-3">
          <Target className="w-8 h-8 text-stone-400 mx-auto" />
          <p className="text-sm font-medium text-stone-700">
            No personal development goals defined for this assessment filter yet.
          </p>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Following your SEI Adult briefing, establish 1 or 2 targeted competencies to practice over the next 4 to 8 weeks.
          </p>
          <button
            onClick={handleOpenCreate}
            className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] inline-flex items-center gap-1.5 shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Development Goal</span>
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGoals.map((goal) => {
            // Find linked entries
            const linkedEntries = userEntries.filter((e) =>
              goal.linkedEntryIds.includes(e.id) ||
              (goal.competency && e.competency === goal.competency) ||
              (e.goalId === goal.id)
            );

            const activeTip = goal.weeklyTips[goal.currentWeekTipIndex] || goal.weeklyTips[0];
            const isTipsExpanded = expandedTipsGoalId === goal.id;

            return (
              <div
                key={goal.id}
                className="bg-[#FAF9F5] border border-stone-200/90 hover:border-stone-300 rounded-xl p-5 shadow-2xs transition-all space-y-4"
              >
                {/* Top Row: Meta Badges & Actions */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2">
                      {/* Competency Category Pill */}
                      <span className="px-2.5 py-0.5 rounded-md bg-[#4A6B53]/10 text-[#4A6B53] text-[10px] font-bold uppercase tracking-wider">
                        {goal.competencyCategory} · {goal.competency}
                      </span>

                      {/* Assessment Source Badge */}
                      <span className="px-2.5 py-0.5 rounded-md bg-stone-200/70 text-stone-700 text-[10px] font-medium flex items-center gap-1">
                        <FileText className="w-3 h-3 text-stone-500" />
                        <span>{goal.assessmentSource}</span>
                      </span>

                      {/* Timeframe countdown */}
                      <span className="text-[11px] text-stone-500 flex items-center gap-1 font-mono">
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>Target: {goal.targetDate} ({goal.timeframeWeeks} wks)</span>
                      </span>
                    </div>

                    <h4 className="font-editorial text-lg sm:text-xl font-bold text-[#252525]">
                      {goal.title}
                    </h4>

                    <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                      <strong className="text-stone-800">Action Plan ("How"):</strong> {goal.actionPlan}
                    </p>
                  </div>

                  {/* Status & Menu */}
                  <div className="flex items-center gap-2 self-start sm:self-center shrink-0">
                    <span
                      className={`px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center gap-1 shadow-2xs ${
                        goal.status === 'Completed'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : goal.status === 'On Track'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-blue-50 text-blue-800 border border-blue-200'
                      }`}
                    >
                      {goal.status === 'Completed' && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />}
                      <span>{goal.status}</span>
                    </span>

                    <button
                      onClick={() => handleOpenEdit(goal)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/70 transition-colors"
                      title="Edit Goal"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onDeleteGoal(goal.id)}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      title="Delete Goal"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar & Linked Entries Metric */}
                <div className="space-y-1.5 bg-white rounded-lg p-3 border border-stone-200/70">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-stone-700">Competency Progress</span>
                      <span className="text-[11px] text-stone-400">·</span>
                      <span className="text-[11px] text-stone-500">
                        {goal.weeklyTips.filter((t) => t.isCompleted).length} of {goal.weeklyTips.length} weekly habits practiced
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
                        <BookOpen className="w-3 h-3" />
                        <span>{linkedEntries.length} Daily Reflections Linked</span>
                      </span>
                      <span className="font-mono font-bold text-stone-800 text-xs">
                        {goal.progressPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden border border-stone-200">
                    <div
                      className="bg-gradient-to-r from-[#4A6B53] to-[#C88A2E] h-full transition-all duration-500 rounded-full"
                      style={{ width: `${goal.progressPercentage}%` }}
                    />
                  </div>
                </div>

                {/* Weekly Coaching Tip & Action Reminder */}
                {activeTip && (
                  <div className="bg-gradient-to-r from-[#FAF3E7] to-amber-50/60 border border-[#C88A2E]/30 rounded-xl p-4 space-y-2.5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-md bg-[#C88A2E] text-white text-[10px] font-bold uppercase tracking-wider">
                          Weekly Coaching Tip · Week {activeTip.weekNumber}
                        </span>
                        <span className="text-xs font-bold text-stone-800">
                          {activeTip.focusHabit}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleTipCompletion(goal, goal.currentWeekTipIndex)}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 shadow-2xs ${
                            activeTip.isCompleted
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-white border border-[#C88A2E] text-[#C88A2E] hover:bg-[#C88A2E]/10'
                          }`}
                        >
                          <Check className="w-3.5 h-3.5" />
                          <span>{activeTip.isCompleted ? 'Practiced This Week ✓' : 'Mark Practiced'}</span>
                        </button>

                        <button
                          onClick={() =>
                            setExpandedTipsGoalId(isTipsExpanded ? null : goal.id)
                          }
                          className="text-[11px] text-[#C88A2E] hover:underline font-medium"
                        >
                          {isTipsExpanded ? 'Hide Full Roadmap' : `View All ${goal.weeklyTips.length} Weeks →`}
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-stone-700 leading-relaxed italic bg-white/70 p-2.5 rounded-lg border border-amber-200/60">
                      "{activeTip.tip}"
                    </p>

                    {/* Expanded All Weekly Tips Roadmap */}
                    {isTipsExpanded && (
                      <div className="pt-3 mt-2 border-t border-amber-200/60 space-y-2">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-stone-600">
                          Full {goal.timeframeWeeks}-Week Professional Learning Roadmap:
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {goal.weeklyTips.map((tip, tipIdx) => (
                            <div
                              key={tip.weekNumber}
                              className={`p-2.5 rounded-lg border text-xs flex items-start justify-between gap-2 ${
                                tip.isCompleted
                                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                                  : tipIdx === goal.currentWeekTipIndex
                                  ? 'bg-amber-100/60 border-[#C88A2E] text-stone-800'
                                  : 'bg-white/80 border-stone-200 text-stone-600'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-[10px] uppercase">
                                    Wk {tip.weekNumber}: {tip.focusHabit}
                                  </span>
                                  {tipIdx === goal.currentWeekTipIndex && (
                                    <span className="text-[9px] bg-[#C88A2E] text-white px-1.5 py-0.2 rounded font-semibold">
                                      Active
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] leading-snug line-clamp-2">
                                  {tip.tip}
                                </p>
                              </div>

                              <button
                                onClick={() => handleToggleTipCompletion(goal, tipIdx)}
                                className={`p-1 rounded shrink-0 transition-colors ${
                                  tip.isCompleted
                                    ? 'text-emerald-700 bg-emerald-100 hover:bg-emerald-200'
                                    : 'text-stone-400 hover:text-stone-700 bg-stone-100'
                                }`}
                                title={tip.isCompleted ? 'Mark uncompleted' : 'Mark completed'}
                              >
                                <Check className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Bottom Bar: Linked Daily Reflections Action */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2 border-t border-stone-200/60 text-xs">
                  <div className="flex items-center gap-2 text-stone-600">
                    <Sparkles className="w-4 h-4 text-[#4A6B53]" />
                    <span>
                      {linkedEntries.length > 0 ? (
                        <>
                          Recent linked reflection:{' '}
                          <strong className="text-stone-800">
                            "{linkedEntries[0].title}"
                          </strong>{' '}
                          ({linkedEntries[0].date})
                        </>
                      ) : (
                        'No reflections linked yet. Capture classroom observations to reinforce this goal.'
                      )}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    {onOpenCaptureForGoal && (
                      <button
                        onClick={() => onOpenCaptureForGoal(goal)}
                        className="px-3 py-1.5 rounded-lg bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-all flex items-center gap-1 shadow-2xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Log Reflection for this Goal</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Briefing Reports & Assessment Modal */}
      {isAssessmentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252525]/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#F8F7F3] rounded-2xl border border-stone-300 shadow-xl overflow-hidden p-6 space-y-5">
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#3F6C8A]/10 text-[#3F6C8A] flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-editorial text-xl font-bold text-stone-900">
                    SEI Adults Assessment Briefing Context
                  </h3>
                  <p className="text-xs text-stone-500">
                    Unlocking EQ (UEQ) Profile & Neural Net Brain Analytics
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-4 text-xs text-stone-700 leading-relaxed">
              <div className="bg-white p-4 rounded-xl border border-stone-200 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
                    <FileText className="w-4 h-4 text-[#3F6C8A]" />
                    <span>Uploaded Assessment Reports</span>
                  </div>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                    Verified in Briefing
                  </span>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-stone-800">
                      Maya_Lin_SEI_Adults_UEQ_Profile_Report_2026.pdf
                    </strong>
                    <span className="text-[10px] text-stone-400 font-mono">08 Sep 2026</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">
                    Highlights: High baseline in Emotional Literacy; development opportunity in increasing curious pauses under emotional pressure.
                  </p>
                </div>

                <div className="p-3 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                  <div className="flex items-center justify-between">
                    <strong className="text-stone-800">
                      Maya_Lin_Brain_Profile_NeuralNet_Analysis.pdf
                    </strong>
                    <span className="text-[10px] text-stone-400 font-mono">11 Sep 2026</span>
                  </div>
                  <p className="text-stone-500 text-[11px]">
                    Neural Net: High Rational Execution drive. Goal to blend emotional attunement with lesson pacing.
                  </p>
                </div>
              </div>

              <div className="bg-[#FAF3E7] p-4 rounded-xl border border-[#C88A2E]/30 space-y-2">
                <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-[#C88A2E]" />
                  <span>Briefing Protocol: From Assessment to Daily Practice</span>
                </div>
                <p>
                  During the CEQHS briefing dialogue, educators select 1 or 2 high-leverage competencies from their SEI report. Instead of abstract goals, the platform creates continuous weekly reminders and links daily reflections directly to measurable habit shifts in the classroom.
                </p>
              </div>
            </div>

            <div className="flex justify-end pt-2 border-t border-stone-200">
              <button
                onClick={() => setIsAssessmentModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-stone-800 text-white text-xs font-semibold hover:bg-stone-700"
              >
                Close Briefing Window
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create / Edit Goal Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252525]/40 backdrop-blur-xs overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-[#F8F7F3] rounded-2xl border border-stone-300 shadow-xl overflow-hidden p-6 space-y-5 my-6 max-h-[90vh] flex flex-col">
            <div className="flex items-start justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-editorial text-xl font-bold text-stone-900">
                  {editingGoal ? 'Edit Development Goal' : 'Define Personal Development Goal'}
                </h3>
                <p className="text-xs text-stone-500">
                  SEI Adults Assessment · UEQ Profile or Neural Net Competency
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveForm} className="space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* Row 1: Assessment Source & Report Name */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Assessment Profile
                  </label>
                  <select
                    value={formData.assessmentSource}
                    onChange={(e) =>
                      setFormData({ ...formData, assessmentSource: e.target.value as SEIAssessmentSource })
                    }
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                  >
                    <option value="SEI Adults (UEQ Profile)">SEI Adults (UEQ Profile)</option>
                    <option value="SEI Adults (Neural Net)">SEI Adults (Neural Net)</option>
                    <option value="SEI Leadership Profile">SEI Leadership Profile</option>
                    <option value="CEQHS Baseline Self-Assessment">CEQHS Baseline Self-Assessment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Assessment Report Document
                  </label>
                  <div className="flex items-center gap-1.5">
                    <input
                      type="text"
                      value={formData.assessmentReportName}
                      onChange={(e) => setFormData({ ...formData, assessmentReportName: e.target.value })}
                      placeholder="e.g. Maya_Lin_SEI_Report_2026.pdf"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                    />
                  </div>
                </div>
              </div>

              {/* Row 2: Competency Selection */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Target SEI Competency
                </label>
                <select
                  value={formData.competency}
                  onChange={(e) => handleCompetencyChange(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                >
                  {SEI_COMPETENCIES.map((c) => (
                    <option key={c.id} value={c.name}>
                      [{c.category}] {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Goal Title */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Goal Statement / Objective
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Practice Curious Pauses to Increase Empathy Under Classroom Stress"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                  required
                />
              </div>

              {/* Row 3: Timeframe & Target Date */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Timeframe (Weeks)
                  </label>
                  <select
                    value={formData.timeframeWeeks}
                    onChange={(e) => handleTimeframeChange(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                  >
                    <option value={4}>4 Weeks (Sprint Cycle)</option>
                    <option value={6}>6 Weeks (Mid-Term Cycle)</option>
                    <option value={8}>8 Weeks (Deepening Cycle)</option>
                    <option value={12}>12 Weeks (Full Term Cycle)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                    Target Completion Date
                  </label>
                  <input
                    type="text"
                    value={formData.targetDate}
                    onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                    placeholder="e.g. 24 October 2026"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                  />
                </div>
              </div>

              {/* Action Plan ("How") */}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-700 mb-1">
                  Action Plan ("How will you practice this?")
                </label>
                <textarea
                  rows={3}
                  value={formData.actionPlan}
                  onChange={(e) => setFormData({ ...formData, actionPlan: e.target.value })}
                  placeholder="Describe your classroom strategy agreed in the briefing..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800 text-xs focus:ring-1 focus:ring-[#4A6B53] outline-hidden"
                  required
                />
              </div>

              {/* Weekly Action Tips Preview & Customization */}
              <div className="space-y-2 border-t border-stone-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-700">
                    Weekly Actionable Reminders ({formData.weeklyTips.length} Weeks)
                  </span>
                  <span className="text-[10px] text-stone-400">
                    Auto-generated from SEI Competency Framework
                  </span>
                </div>

                <div className="space-y-2 max-h-48 overflow-y-auto p-2 bg-stone-100 rounded-xl">
                  {formData.weeklyTips.map((tip, idx) => (
                    <div key={idx} className="bg-white p-2.5 rounded-lg border border-stone-200 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-[10px] text-[#4A6B53]">
                          Week {tip.weekNumber}: {tip.focusHabit}
                        </span>
                      </div>
                      <input
                        type="text"
                        value={tip.tip}
                        onChange={(e) => {
                          const updated = [...formData.weeklyTips];
                          updated[idx] = { ...updated[idx], tip: e.target.value };
                          setFormData({ ...formData, weeklyTips: updated });
                        }}
                        className="w-full px-2 py-1 text-xs border border-stone-200 rounded-md bg-stone-50 text-stone-700"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] shadow-2xs"
                >
                  {editingGoal ? 'Update Goal' : 'Save Goal to Dashboard'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
