import React, { useState } from 'react';
import {
  ClipboardList,
  Clock,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  ArrowLeft,
  FileText,
  Eye,
  Users,
} from 'lucide-react';
import { CEQHSPartnerSchool } from '../../types/ceqhsUser';

interface CeqhsSurveysProps {
  schools: CEQHSPartnerSchool[];
  onBack: () => void;
}

interface SurveyItem {
  id: string;
  title: string;
  category: 'Student Climate' | 'Educator Self-Reflection' | 'Leadership Review';
  targetAudience: string;
  questionsCount: number;
  status: 'Pending Review' | 'Active & Collecting' | 'Completed';
  dueDate: string;
  responsesCount?: number;
  completionRate?: string;
  description: string;
  reviewNotes?: string;
}

const INITIAL_SURVEYS: SurveyItem[] = [
  {
    id: 'srv-1',
    title: 'Term 1 Secondary Climate & Emotional Safety Pulse',
    category: 'Student Climate',
    targetAudience: 'Grades 9–12 Students (All 3 Partner Schools)',
    questionsCount: 12,
    status: 'Pending Review',
    dueDate: 'Sep 25, 2026',
    description: 'Measures student perceptions of classroom relational safety, vulnerability tolerance, and teacher empathy signals.',
    reviewNotes: 'Requires CEQHS Reviewer sign-off on anonymization safeguarding before campus dispatch.',
  },
  {
    id: 'srv-2',
    title: 'Educator Micro-Pause & Somatic Check-In Evaluation',
    category: 'Educator Self-Reflection',
    targetAudience: 'Cohort 2026 Educators (144 Teachers)',
    questionsCount: 15,
    status: 'Pending Review',
    dueDate: 'Oct 02, 2026',
    description: 'Post-Module 2 self-audit evaluating adherence to the 90-second classroom reset and de-escalation protocols.',
    reviewNotes: 'Pending final review of qualitative Likert scales by CEQHS Pedagogy Lead.',
  },
  {
    id: 'srv-3',
    title: 'Baseline Relational Regard Benchmark',
    category: 'Student Climate',
    targetAudience: 'Oakridge & St. Jude High Schools',
    questionsCount: 10,
    status: 'Active & Collecting',
    dueDate: 'Sep 30, 2026',
    responsesCount: 342,
    completionRate: '86%',
    description: 'Initial benchmark captured during the orientation phase to establish emotional baseline before living journal rollout.',
  },
  {
    id: 'srv-4',
    title: 'Mid-Year School Leadership Culture Audit',
    category: 'Leadership Review',
    targetAudience: 'Principals & Vice-Principals',
    questionsCount: 18,
    status: 'Active & Collecting',
    dueDate: 'Nov 15, 2026',
    responsesCount: 12,
    completionRate: '100%',
    description: 'Evaluates administrative support, scheduling flexibility, and protected time for teacher reflective circles.',
  },
];

export const CeqhsSurveys: React.FC<CeqhsSurveysProps> = ({ schools, onBack }) => {
  const [surveys, setSurveys] = useState<SurveyItem[]>(INITIAL_SURVEYS);
  const [activeFilter, setActiveFilter] = useState<'all' | 'pending' | 'active'>('all');
  const [previewSurvey, setPreviewSurvey] = useState<SurveyItem | null>(null);
  const [notification, setNotification] = useState<string | null>(null);

  const pendingCount = surveys.filter((s) => s.status === 'Pending Review').length;

  const filteredSurveys = surveys.filter((s) => {
    if (activeFilter === 'pending') return s.status === 'Pending Review';
    if (activeFilter === 'active') return s.status === 'Active & Collecting';
    return true;
  });

  const handleApprove = (id: string) => {
    setSurveys((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, status: 'Active & Collecting', responsesCount: 0, completionRate: '0%' } : s
      )
    );
    setNotification('Survey approved and scheduled for institutional dispatch!');
    setTimeout(() => setNotification(null), 3000);
  };

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-[#4A6B53] hover:text-[#1B3626] mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspaces</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF0EB] text-[#4A6B53] flex items-center justify-center shrink-0">
              <ClipboardList className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                Surveys &amp; Climate Signals
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Manage student climate evaluations, educator self-assessments, and institutional surveys.
              </p>
            </div>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#4A6B53] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            All Surveys ({surveys.length})
          </button>
          <button
            onClick={() => setActiveFilter('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-colors cursor-pointer ${
              activeFilter === 'pending'
                ? 'bg-amber-700 text-white'
                : 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100'
            }`}
          >
            <span>Pending Review</span>
            <span className="w-4 h-4 rounded-full bg-amber-600 text-white text-[10px] flex items-center justify-center font-bold">
              {pendingCount}
            </span>
          </button>
          <button
            onClick={() => setActiveFilter('active')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
              activeFilter === 'active'
                ? 'bg-[#4A6B53] text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            Active &amp; Collecting
          </button>
        </div>
      </div>

      {notification && (
        <div className="mt-4 p-3 bg-[#EAF0EB] border border-[#4A6B53]/30 text-[#1B3626] text-xs rounded-xl flex items-center gap-2 font-medium">
          <CheckCircle2 className="w-4 h-4 text-[#4A6B53] shrink-0" />
          <span>{notification}</span>
        </div>
      )}

      {/* Survey Grid */}
      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredSurveys.map((survey) => {
          const isPending = survey.status === 'Pending Review';

          return (
            <div
              key={survey.id}
              className={`bg-white rounded-2xl border p-6 flex flex-col justify-between transition-all duration-200 ${
                isPending
                  ? 'border-amber-300/80 shadow-xs ring-1 ring-amber-200/50'
                  : 'border-stone-200 shadow-2xs hover:shadow-md'
              }`}
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                    {survey.category}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                      isPending
                        ? 'bg-amber-50 text-amber-800 border border-amber-200'
                        : 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    }`}
                  >
                    {isPending ? <Clock className="w-3 h-3" /> : <CheckCircle2 className="w-3 h-3" />}
                    {survey.status}
                  </span>
                </div>

                <h3 className="text-base font-bold text-stone-900 tracking-tight mb-2">
                  {survey.title}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed mb-4">
                  {survey.description}
                </p>

                <div className="space-y-1.5 text-xs text-stone-500 bg-stone-50 p-3 rounded-xl border border-stone-100">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-stone-400" />
                      Audience:
                    </span>
                    <span className="font-medium text-stone-800">{survey.targetAudience}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <FileText className="w-3.5 h-3.5 text-stone-400" />
                      Questions:
                    </span>
                    <span className="font-medium text-stone-800">{survey.questionsCount} items</span>
                  </div>
                  {survey.responsesCount !== undefined && (
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <BarChart3 className="w-3.5 h-3.5 text-emerald-600" />
                        Responses:
                      </span>
                      <span className="font-bold text-emerald-800">
                        {survey.responsesCount} completed ({survey.completionRate})
                      </span>
                    </div>
                  )}
                </div>

                {survey.reviewNotes && (
                  <div className="mt-3 p-2.5 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-900 flex items-start gap-1.5">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                    <span><strong>Review Note:</strong> {survey.reviewNotes}</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-stone-100 flex items-center justify-between gap-3">
                <button
                  onClick={() => setPreviewSurvey(survey)}
                  className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-stone-400" />
                  Preview Questions
                </button>

                {isPending ? (
                  <button
                    onClick={() => handleApprove(survey.id)}
                    className="px-3.5 py-1.5 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-medium shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve &amp; Publish
                  </button>
                ) : (
                  <span className="text-xs font-medium text-[#2F6A4F] bg-[#EAF0EB] px-2.5 py-1 rounded-full flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#4A6B53]" />
                    Live in Portal
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Preview Modal */}
      {previewSurvey && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200">
            <h3 className="text-lg font-bold text-stone-900 mb-1">{previewSurvey.title}</h3>
            <p className="text-xs text-stone-500 mb-4">{previewSurvey.description}</p>
            <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="font-bold text-stone-800 block mb-1">1. Emotional Safety:</span>
                <p className="text-stone-600 italic">
                  "When you experience strong frustration or overwhelm in class, how supported do you feel by your teachers?"
                </p>
                <div className="mt-2 flex gap-2 text-[11px] text-stone-500">
                  <span>1 (Not at all supported)</span>
                  <span>...</span>
                  <span>5 (Completely supported)</span>
                </div>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="font-bold text-stone-800 block mb-1">2. Vulnerability Tolerance:</span>
                <p className="text-stone-600 italic">
                  "How comfortable are you raising your hand to say 'I don't understand' during group instruction?"
                </p>
              </div>
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="font-bold text-stone-800 block mb-1">3. Micro-Pause Frequency:</span>
                <p className="text-stone-600 italic">
                  "How often does your teacher introduce brief resets, still breathing, or check-ins before difficult topics?"
                </p>
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setPreviewSurvey(null)}
                className="px-4 py-2 rounded-xl bg-stone-900 text-white text-xs font-semibold"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
