import React, { useState } from 'react';
import {
  ArrowLeft,
  Building2,
  Users,
  FileCheck2,
  Award,
  HelpCircle,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Send,
  PlusCircle,
  Eye,
  Calendar,
  Layers,
  Check,
  Flag,
  FileText,
  BarChart3,
  MessageSquare,
  Sparkles,
  ArrowRight,
  Filter,
  X,
  ExternalLink,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import {
  CEQHSPartnerSchool,
  DossierItemEvidence,
  MilestoneItem,
  SupportCaseItem,
  TrainingCohort,
  CEQHSStaffUser,
  AuditEventItem,
  CEQHSEducator,
} from '../../types/ceqhsUser';
import {
  SEED_EDUCATORS,
  SEED_SURVEY_COMPARISONS,
  TEN_DEVELOPMENTAL_MILESTONES_DEF,
} from '../../data/ceqhsUserData';

interface CeqhsSchoolWorkspaceProps {
  school: CEQHSPartnerSchool;
  allStaff: CEQHSStaffUser[];
  dossierItems: DossierItemEvidence[];
  milestones: MilestoneItem[];
  supportCases: SupportCaseItem[];
  cohorts: TrainingCohort[];
  auditLogs: AuditEventItem[];
  onBack: () => void;
  onViewAsSchoolAdmin?: (schoolId: string) => void;
  onUpdateDossierReview?: (
    itemId: string,
    decision: 'Approved' | 'Revision requested' | 'Flagged for follow-up',
    schoolFeedback: string,
    internalNotes: string,
    revisionReason?: string
  ) => void;
  onVerifyMilestone?: (milestoneId: string, notes: string) => void;
  onAddSupportCase?: (caseData: Partial<SupportCaseItem>) => void;
}

export const CeqhsSchoolWorkspace: React.FC<CeqhsSchoolWorkspaceProps> = ({
  school,
  allStaff,
  dossierItems,
  milestones,
  supportCases,
  cohorts,
  auditLogs,
  onBack,
  onViewAsSchoolAdmin,
  onUpdateDossierReview,
  onVerifyMilestone,
  onAddSupportCase,
}) => {
  // Exact 6 tabs per Prompt Section 7
  const [activeTab, setActiveTab] = useState<
    'overview' | 'educators' | 'practice' | 'dossier' | 'surveys' | 'support'
  >('overview');

  // Filtered datasets for this school
  const schoolEducators = SEED_EDUCATORS.filter((e) => e.schoolId === school.id);
  const schoolDossierItems = dossierItems.filter((d) => d.schoolId === school.id);
  const schoolMilestones = milestones.filter((m) => m.schoolId === school.id);
  const schoolCases = supportCases.filter((c) => c.schoolId === school.id);

  // Selected educator for profile modal
  const [selectedEducator, setSelectedEducator] = useState<CEQHSEducator | null>(null);

  // Practice & Reflections filter state
  const [practiceTypeFilter, setPracticeTypeFilter] = useState('All');
  const [gradeFilter, setGradeFilter] = useState('All');

  // Living Dossier section review state
  const [selectedDossierSection, setSelectedDossierSection] = useState('Classroom Practice');
  const [reviewerDecision, setReviewerDecision] = useState<'Approved' | 'Revision requested' | 'Flagged for follow-up'>('Approved');
  const [reviewerFeedback, setReviewerFeedback] = useState('');
  const [internalNote, setInternalNote] = useState('');
  const [isDossierReviewSubmitted, setIsDossierReviewSubmitted] = useState(false);

  // Support case modal state
  const [isNewCaseModalOpen, setIsNewCaseModalOpen] = useState(false);
  const [caseSubject, setCaseSubject] = useState('');
  const [caseCategory, setCaseCategory] = useState<'Pedagogical' | 'Technical' | 'Dossier Verification' | 'Implementation Rhythm'>('Pedagogical');
  const [casePriority, setCasePriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [caseNotes, setCaseNotes] = useState('');

  // 10 Living Dossier chapters per specification
  const DOSSIER_CHAPTERS = [
    { title: 'School Context', status: 'Approved', progress: 100 },
    { title: 'Leadership Commitment', status: 'Approved', progress: 100 },
    { title: 'Educator Development', status: 'Approved', progress: 92 },
    { title: 'Classroom Practice', status: 'Under Review', progress: 84 },
    { title: 'Relational Climate', status: 'Under Review', progress: 78 },
    { title: 'Student Experience', status: 'Under Review', progress: 74 },
    { title: 'Family Engagement', status: 'Drafting', progress: 50 },
    { title: 'Evidence Portfolio', status: 'Under Review', progress: 85 },
    { title: 'Self-Study Reflection', status: 'Drafting', progress: 40 },
    { title: 'CEQHS Verification', status: 'Pending Completion', progress: 20 },
  ];

  // Practice records data for Tab 3
  const PRACTICE_RECORDS = [
    {
      id: 'pr-1',
      title: 'Pre-Lesson 90-Second Transition Micro-Pause',
      educator: 'Asha Sharma',
      role: 'Teacher',
      date: 'Sep 14, 2026',
      type: 'Regulation',
      grade: 'Year 9',
      evidenceAttached: 'Audio chime timestamp log & pupil debrief (PDF)',
      reflectionNotes: 'Pupils arrived energized after lunch break. The 3-breath grounding chime settled vocal agitation within 45 seconds.',
      verificationStatus: 'Verified',
    },
    {
      id: 'pr-2',
      title: 'Restorative Clarification Circle on Group Project Dispute',
      educator: 'Maya Lin',
      role: 'Subject Lead',
      date: 'Sep 12, 2026',
      type: 'Dialogue',
      grade: 'Year 10',
      evidenceAttached: 'Circle structure protocol & anonymized student feedback',
      reflectionNotes: 'Used the restorative inquiry framework: What happened? Who was affected? What is needed to make it right? Resulted in collaborative resolution.',
      verificationStatus: 'Verified',
    },
    {
      id: 'pr-3',
      title: 'Empathetic Check-in & Emotional Agility Quadrant',
      educator: 'Elena Rostova',
      role: 'Vice Principal',
      date: 'Sep 10, 2026',
      type: 'Empathy',
      grade: 'Whole School',
      evidenceAttached: 'Staff morning briefing slide & self-rating summary',
      reflectionNotes: 'Staff rated emotional fatigue on a 1-5 scale before senior leadership meeting. Facilitated mutual support rather than transactional demands.',
      verificationStatus: 'Under Review',
    },
    {
      id: 'pr-4',
      title: 'Somatic Breath Regulation prior to Mathematics Exam',
      educator: 'Asha Sharma',
      role: 'Teacher',
      date: 'Sep 08, 2026',
      type: 'Regulation',
      grade: 'Year 11',
      evidenceAttached: 'Classroom observation notes by Lead Mentor',
      reflectionNotes: 'Exam anxiety visibly attenuated; pencil fidgeting and posture tightened during practice, then relaxed.',
      verificationStatus: 'Verified',
    },
    {
      id: 'pr-5',
      title: 'Student Voice Weekly Reflection Journal Excerpt',
      educator: 'Maya Lin',
      role: 'Subject Lead',
      date: 'Sep 05, 2026',
      type: 'Reflection',
      grade: 'Year 9',
      evidenceAttached: '3 anonymized pupil reflection snippets (Verified Safe)',
      reflectionNotes: 'Students reflected on times when an adult listened without interrupting. High positive sentiment recorded.',
      verificationStatus: 'Verified',
    },
  ];

  const filteredPractices = PRACTICE_RECORDS.filter((p) => {
    if (practiceTypeFilter !== 'All' && p.type !== practiceTypeFilter) return false;
    if (gradeFilter !== 'All' && p.grade !== gradeFilter) return false;
    return true;
  });

  const handleDossierReviewSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsDossierReviewSubmitted(true);
    setTimeout(() => {
      setIsDossierReviewSubmitted(false);
      setReviewerFeedback('');
      setInternalNote('');
    }, 1500);
  };

  const handleCreateSupportCase = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caseSubject.trim()) return;

    if (onAddSupportCase) {
      onAddSupportCase({
        schoolId: school.id,
        schoolName: school.name,
        subject: caseSubject,
        category: caseCategory,
        priority: casePriority,
        notes: caseNotes,
        status: 'Open',
        assignedTo: school.assignedOwnerName || 'Priya Sharma',
      });
    }

    setIsNewCaseModalOpen(false);
    setCaseSubject('');
    setCaseNotes('');
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Top Back Nav & Quick Actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Overview</span>
        </button>

        {onViewAsSchoolAdmin && (
          <button
            onClick={() => onViewAsSchoolAdmin(school.id)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            <span>Preview as School Admin</span>
            <ExternalLink className="w-3 h-3" />
          </button>
        )}
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* INSTITUTIONAL WORKSPACE HEADER (Exact specifications)           */}
      {/* ---------------------------------------------------------------- */}
      <header className="bg-white rounded-2xl border border-stone-200/90 p-6 sm:p-7 shadow-2xs">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
              <span>Cohort {school.cohortYear || '2026-Alpha'}</span>
              <span>·</span>
              <span>{school.region || 'South West Division'}</span>
              <span>·</span>
              <span>Lead: {school.schoolAdminName}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
              {school.name}
            </h1>
            <div className="flex items-center gap-3 mt-2 text-xs text-stone-600 flex-wrap">
              <span>
                <strong>CEQHS Lead:</strong> {school.assignedOwnerName}
              </span>
              <span className="text-stone-300">·</span>
              <span>
                <strong>Implementation Cycle:</strong> {school.implementationCycle || school.academicYear}
              </span>
              <span className="text-stone-300">·</span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                Phase: {school.currentPhase || 'PRACTISE'}
              </span>
              <span className="text-stone-300">·</span>
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold ${
                  school.healthState === 'Healthy'
                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                    : 'bg-amber-50 text-amber-900 border border-amber-200'
                }`}
              >
                {school.healthState}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-4 bg-[#FAF9F5] p-4 rounded-xl border border-stone-200/80 shrink-0">
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Dossier Readiness
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {school.dossierProgressPercent}%
              </div>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Active Teachers
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {school.activeTeachersCount}
              </div>
            </div>
            <div className="w-px h-8 bg-stone-200" />
            <div>
              <div className="text-[10px] uppercase font-bold text-stone-400 tracking-wider">
                Evidence
              </div>
              <div className="text-2xl font-bold text-stone-900">
                {school.evidenceCount}
              </div>
            </div>
          </div>
        </div>

        {/* 6 Workspace Tabs Navigation */}
        <div className="flex items-center gap-1 sm:gap-2 border-t border-stone-100 mt-6 pt-4 text-xs font-semibold overflow-x-auto">
          {[
            { id: 'overview', label: 'Implementation Overview' },
            { id: 'educators', label: `Educators (${schoolEducators.length || school.activeTeachersCount})` },
            { id: 'practice', label: 'Practice & Reflections' },
            { id: 'dossier', label: 'Living Dossier' },
            { id: 'surveys', label: 'Survey Data' },
            { id: 'support', label: `Support & Notes (${schoolCases.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition-colors ${
                activeTab === tab.id
                  ? 'bg-[#1B3626] text-white font-bold shadow-2xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* TAB 1: IMPLEMENTATION OVERVIEW                                    */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Developmental Milestones (10 Total) */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-5">
              <div>
                <h2 className="text-base font-bold text-stone-900 tracking-tight">
                  Ten Developmental Milestones (Accreditation Path)
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Institutional milestones required for CEQHS accreditation and Living Dossier sign-off.
                </p>
              </div>
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-[#1B3626]/10 text-[#1B3626]">
                {school.milestonesReachedCount} of 10 Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {TEN_DEVELOPMENTAL_MILESTONES_DEF.map((def, idx) => {
                const milestoneState = schoolMilestones.find((m) => m.key === def.key);
                const isVerified = idx < school.milestonesReachedCount || milestoneState?.status === 'Verified';
                const isInProgress = idx === school.milestonesReachedCount;

                return (
                  <div
                    key={def.key}
                    className={`p-4 rounded-xl border flex items-start justify-between gap-3 transition-all ${
                      isVerified
                        ? 'bg-emerald-50/40 border-emerald-200 text-stone-900'
                        : isInProgress
                        ? 'bg-amber-50/40 border-amber-300 text-stone-900'
                        : 'bg-stone-50/50 border-stone-200 text-stone-400'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isVerified ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                        ) : isInProgress ? (
                          <Clock className="w-4 h-4 text-amber-700 shrink-0 animate-spin" />
                        ) : (
                          <div className="w-4 h-4 rounded-full border border-stone-300 shrink-0" />
                        )}
                        <h4 className="text-xs font-bold text-stone-900">
                          {def.name}
                        </h4>
                      </div>
                      <p className="text-[11px] text-stone-500 pl-6">
                        {def.requirement}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      {isVerified ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900">
                          Verified
                        </span>
                      ) : isInProgress ? (
                        <button
                          onClick={() => {
                            if (onVerifyMilestone && milestoneState) {
                              onVerifyMilestone(milestoneState.id, 'Verified by CEQHS Supervisor');
                            }
                          }}
                          className="text-[10px] font-bold px-2.5 py-1 rounded bg-amber-100 hover:bg-amber-200 text-amber-950 transition-colors"
                        >
                          Verify →
                        </button>
                      ) : (
                        <span className="text-[10px] text-stone-400">
                          Upcoming
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* School EQ Profile Summary & Timeline */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* School EQ Profile Summary */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                School EQ Profile Summary
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {school.notes ||
                  `${school.name} is demonstrating robust educator engagement across secondary departments. Transition micro-pauses have become routine in Year 9 and 10 classrooms.`}
              </p>

              <div className="space-y-3 pt-2 border-t border-stone-100">
                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-stone-700">Educator Practice Consistency</span>
                    <span className="font-bold text-stone-900">84%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-[#1B3626] rounded-full w-[84%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-stone-700">Student Relational Safety Index</span>
                    <span className="font-bold text-stone-900">79%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-[#1B3626] rounded-full w-[79%]" />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-stone-700">Restorative Dialogue Adoption</span>
                    <span className="font-bold text-stone-900">73%</span>
                  </div>
                  <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                    <div className="h-full bg-[#1B3626] rounded-full w-[73%]" />
                  </div>
                </div>
              </div>
            </div>

            {/* Practice Activity Timeline */}
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
              <h3 className="text-base font-bold text-stone-900">
                Recent Practice Activity Timeline
              </h3>
              <div className="space-y-3">
                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-[#1B3626] mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">Classroom Micro-Pause Cycle logged</span>
                    <p className="text-stone-500 text-[11px]">
                      Asha Sharma logged 14th practice session with Year 9 advisory group.
                    </p>
                    <span className="text-[10px] text-stone-400">Today, 09:12 AM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">Dossier Item Submitted: Student Voice Survey</span>
                    <p className="text-stone-500 text-[11px]">
                      Elena Rostova uploaded cross-grade relational safety aggregate with 320 responses.
                    </p>
                    <span className="text-[10px] text-stone-400">Yesterday, 04:30 PM</span>
                  </div>
                </div>

                <div className="flex items-start gap-3 text-xs">
                  <div className="w-2 h-2 rounded-full bg-stone-400 mt-1.5 shrink-0" />
                  <div>
                    <span className="font-bold text-stone-900">Milestone Verified: First Practice Cycle</span>
                    <p className="text-stone-500 text-[11px]">
                      Marcus Vance signed off on initial 14-day classroom rhythm documentation.
                    </p>
                    <span className="text-[10px] text-stone-400">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 2: EDUCATORS ROSTER & PRACTICE PROGRESS                       */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'educators' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="p-5 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Educator Practice Progress & Stages
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Roster tracking individual educator developmental progression: Baseline → Explore → Focus → Practise → Reflect → Adapt → Embed → Endline.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700 self-start sm:self-center">
              {schoolEducators.length} Sample Profiles Visible
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-5">Educator</th>
                  <th className="py-3 px-3">Role</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3 text-center">Practices</th>
                  <th className="py-3 px-3">Last Active</th>
                  <th className="py-3 px-3 text-center">Baseline</th>
                  <th className="py-3 px-3 text-center">Endline</th>
                  <th className="py-3 px-5 text-right">Profile</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium">
                {schoolEducators.map((edu) => (
                  <tr key={edu.id} className="hover:bg-[#FAF9F5]/70 transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full bg-[#1B3626]/10 text-[#1B3626] font-bold flex items-center justify-center text-xs">
                          {edu.avatarInitials}
                        </div>
                        <div>
                          <span className="font-bold text-stone-900 block">{edu.name}</span>
                          <span className="text-[11px] text-stone-400">{edu.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-stone-700">{edu.role}</td>
                    <td className="py-3.5 px-3">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {edu.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 text-center font-bold text-stone-900">
                      {edu.practiceCount}
                    </td>
                    <td className="py-3.5 px-3 text-stone-500 text-[11px]">
                      {edu.lastActive}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {edu.baselineCompleted ? (
                        <span className="text-emerald-700 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-center">
                      {edu.endlineCompleted ? (
                        <span className="text-emerald-700 font-bold">✓</span>
                      ) : (
                        <span className="text-stone-300">—</span>
                      )}
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => setSelectedEducator(edu)}
                        className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] transition-colors"
                      >
                        View Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 3: PRACTICE & REFLECTIONS                                     */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'practice' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-4 shadow-2xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-stone-400" />
              <span className="font-bold text-stone-700">Filter Practices:</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 text-[11px]">Type:</span>
                <select
                  value={practiceTypeFilter}
                  onChange={(e) => setPracticeTypeFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 focus:outline-none"
                >
                  <option value="All">All Types</option>
                  <option value="Regulation">Regulation</option>
                  <option value="Empathy">Empathy</option>
                  <option value="Dialogue">Dialogue</option>
                  <option value="Reflection">Reflection</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5">
                <span className="text-stone-500 text-[11px]">Grade Level:</span>
                <select
                  value={gradeFilter}
                  onChange={(e) => setGradeFilter(e.target.value)}
                  className="px-2.5 py-1 rounded-lg border border-stone-300 bg-white font-semibold text-stone-800 focus:outline-none"
                >
                  <option value="All">All Grades</option>
                  <option value="Year 9">Year 9</option>
                  <option value="Year 10">Year 10</option>
                  <option value="Year 11">Year 11</option>
                  <option value="Whole School">Whole School</option>
                </select>
              </div>
            </div>
          </div>

          {/* Practice Cards */}
          <div className="space-y-3">
            {filteredPractices.map((rec) => (
              <div
                key={rec.id}
                className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-3 hover:border-stone-300 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                  <div>
                    <span className="font-bold text-sm text-stone-900">
                      {rec.title}
                    </span>
                    <div className="flex items-center gap-2 text-[11px] text-stone-500 mt-0.5">
                      <span>{rec.educator} ({rec.role})</span>
                      <span>·</span>
                      <span>{rec.grade}</span>
                      <span>·</span>
                      <span>{rec.date}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-center">
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-[#1B3626]/10 text-[#1B3626]">
                      {rec.type}
                    </span>
                    <span className="px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      {rec.verificationStatus}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-stone-600 space-y-2">
                  <div>
                    <strong className="text-stone-800 text-[11px] block">Evidence Attached:</strong>
                    <span className="text-stone-500">{rec.evidenceAttached}</span>
                  </div>
                  <div>
                    <strong className="text-stone-800 text-[11px] block">Reflection Notes:</strong>
                    <p className="italic text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/60">
                      "{rec.reflectionNotes}"
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 4: LIVING DOSSIER PREVIEW & REVIEWER ACTIONS                 */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'dossier' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column: 10 Living Dossier Chapters */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs space-y-3">
            <h3 className="font-bold text-sm text-stone-900 border-b border-stone-100 pb-2">
              Living Dossier Chapters (10)
            </h3>
            <div className="space-y-1.5">
              {DOSSIER_CHAPTERS.map((chap) => {
                const isSelected = chap.title === selectedDossierSection;
                return (
                  <button
                    key={chap.title}
                    onClick={() => setSelectedDossierSection(chap.title)}
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs ${
                      isSelected
                        ? 'bg-[#1B3626] text-white font-bold shadow-2xs'
                        : 'hover:bg-stone-50 text-stone-700'
                    }`}
                  >
                    <span>{chap.title}</span>
                    <div className="flex items-center gap-2">
                      <span className={`text-[10px] ${isSelected ? 'text-stone-200' : 'text-stone-400'}`}>
                        {chap.progress}%
                      </span>
                      <ChevronRight className="w-3.5 h-3.5 opacity-60" />
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Active Section Preview & Reviewer Controls */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <div>
                  <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Chapter Review
                  </span>
                  <h3 className="text-base font-bold text-stone-900">
                    {selectedDossierSection}
                  </h3>
                </div>
                <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-900 border border-amber-200">
                  Ready for CEQHS Review
                </span>
              </div>

              <div className="text-xs text-stone-600 space-y-3">
                <p>
                  This chapter synthesizes observed teacher micro-pauses, classroom transition protocols, and student voice samples collected between August and September 2026.
                </p>
                <div className="p-3 bg-[#FAF9F5] rounded-xl border border-stone-200/70 space-y-1">
                  <span className="font-bold text-stone-800 text-[11px] block">
                    Curated Evidence Artifacts (3 items):
                  </span>
                  <ul className="list-disc pl-4 space-y-0.5 text-stone-600 text-[11px]">
                    <li>Advisory Circle Micro-Pause Implementation in Year 9 (Maya Lin)</li>
                    <li>Cross-Grade Student Voice Council: Relational Safety Survey (Elena Rostova)</li>
                    <li>Somatic Breath Regulation before Midterm Assessments (Asha Sharma)</li>
                  </ul>
                </div>
              </div>

              {/* Reviewer Action Form */}
              <form onSubmit={handleDossierReviewSubmit} className="pt-4 border-t border-stone-100 space-y-3">
                <h4 className="font-bold text-xs text-stone-900">
                  CEQHS Reviewer Actions
                </h4>

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={reviewerDecision === 'Approved'}
                      onChange={() => setReviewerDecision('Approved')}
                      className="text-[#1B3626]"
                    />
                    <span>Approve Section</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={reviewerDecision === 'Revision requested'}
                      onChange={() => setReviewerDecision('Revision requested')}
                      className="text-[#1B3626]"
                    />
                    <span>Request Revision</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-xs font-semibold text-stone-700 cursor-pointer">
                    <input
                      type="radio"
                      name="decision"
                      checked={reviewerDecision === 'Flagged for follow-up'}
                      onChange={() => setReviewerDecision('Flagged for follow-up')}
                      className="text-[#1B3626]"
                    />
                    <span>Flag for Lead</span>
                  </label>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Feedback for School Team
                  </label>
                  <textarea
                    rows={2}
                    value={reviewerFeedback}
                    onChange={(e) => setReviewerFeedback(e.target.value)}
                    placeholder="Commendations, formative suggestions, or revision instructions..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-stone-700 mb-1">
                    Internal CEQHS Note (Confidential)
                  </label>
                  <input
                    type="text"
                    value={internalNote}
                    onChange={(e) => setInternalNote(e.target.value)}
                    placeholder="Private observation notes for CEQHS supervisory team..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  />
                </div>

                <div className="flex items-center justify-end pt-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-colors"
                  >
                    {isDossierReviewSubmitted ? 'Decision Recorded' : 'Submit Review Decision'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 5: SURVEY DATA & PRACTICE LINKAGE                             */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'surveys' && (
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
            <div className="pb-4 border-b border-stone-100 mb-4">
              <h3 className="text-base font-bold text-stone-900">
                Baseline vs. Endline Survey Growth Metrics
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Statistically grounded emotional climate surveys directly connected to observed classroom practice evidence.
              </p>
            </div>

            <div className="space-y-5">
              {SEED_SURVEY_COMPARISONS.map((metric) => (
                <div
                  key={metric.id}
                  className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/80 space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[10px] font-bold text-[#1B3626] uppercase tracking-wider block">
                        {metric.domain}
                      </span>
                      <h4 className="text-xs font-bold text-stone-900">
                        {metric.measure}
                      </h4>
                    </div>

                    <div className="flex items-center gap-3 self-start sm:self-center">
                      <div className="text-center">
                        <span className="text-[10px] text-stone-400 block">Baseline</span>
                        <span className="font-bold text-sm text-stone-700">{metric.baselineScore}%</span>
                      </div>
                      <span className="text-stone-300">→</span>
                      <div className="text-center">
                        <span className="text-[10px] text-emerald-700 block font-bold">Endline</span>
                        <span className="font-bold text-sm text-emerald-700">{metric.endlineScore}%</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 ml-1">
                        +{metric.endlineScore - metric.baselineScore}%
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-stone-600">
                    {metric.qualitativeSummary}
                  </p>

                  <div className="pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] text-stone-500 flex-wrap gap-2">
                    <span>
                      <strong>Observed practice grounding:</strong> {metric.observedPracticeNotes}
                    </span>
                    <span className="font-bold text-[#1B3626]">
                      {metric.relatedEvidenceCount} artifacts verified
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* TAB 6: SUPPORT & NOTES                                            */}
      {/* ---------------------------------------------------------------- */}
      {activeTab === 'support' && (
        <div className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-4 border-b border-stone-100">
            <div>
              <h3 className="text-base font-bold text-stone-900">
                Advisory Support & Case Logs
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Supervisory inquiries, school requests, and coaching follow-ups.
              </p>
            </div>
            <button
              onClick={() => setIsNewCaseModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              <span>Log Advisory Note / Case</span>
            </button>
          </div>

          <div className="space-y-3">
            {schoolCases.length > 0 ? (
              schoolCases.map((c) => (
                <div
                  key={c.id}
                  className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{c.subject}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        c.priority === 'urgent'
                          ? 'bg-rose-100 text-rose-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      {c.priority.toUpperCase()}
                    </span>
                  </div>
                  <p className="text-stone-600">{c.notes}</p>
                  <div className="flex items-center justify-between text-[11px] text-stone-400 pt-1 border-t border-stone-200/60">
                    <span>Assigned: {c.assignedTo}</span>
                    <span>Status: {c.status}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-stone-400 py-6 text-center italic">
                No active advisory cases logged for this school.
              </p>
            )}
          </div>
        </div>
      )}

      {/* EDUCATOR PROFILE MODAL */}
      {selectedEducator && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-base text-stone-900">
                  {selectedEducator.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {selectedEducator.role} · {selectedEducator.schoolName}
                </p>
              </div>
              <button
                onClick={() => setSelectedEducator(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200/80">
                <span className="font-bold text-stone-800 text-[11px] block">
                  Current Practice Focus:
                </span>
                <p className="text-stone-600 mt-0.5">{selectedEducator.currentFocus}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-stone-700">
                <div className="p-2.5 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Total Practices:</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedEducator.practiceCount}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Reflections Logged:</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedEducator.reflectionsCount}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Evidence Attached:</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedEducator.evidenceCount}</span>
                </div>
                <div className="p-2.5 rounded-lg border border-stone-200">
                  <span className="text-stone-400 block text-[10px]">Peer Observations:</span>
                  <span className="font-bold text-stone-900 text-sm">{selectedEducator.peerObservationsCount}</span>
                </div>
              </div>

              <div>
                <span className="font-bold text-stone-800 text-[11px] block mb-1">
                  Developmental Stages:
                </span>
                <div className="flex flex-wrap gap-1">
                  {selectedEducator.journeyStages.map((stg) => (
                    <span
                      key={stg.stage}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        stg.completed
                          ? 'bg-emerald-100 text-emerald-900 border border-emerald-200'
                          : 'bg-stone-100 text-stone-400'
                      }`}
                    >
                      {stg.stage} {stg.completed && '✓'}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-stone-100">
              <button
                onClick={() => setSelectedEducator(null)}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}

      {/* NEW SUPPORT CASE MODAL */}
      {isNewCaseModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <h3 className="font-bold text-sm text-stone-900">
                Log Advisory Note / Support Case
              </h3>
              <button
                onClick={() => setIsNewCaseModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSupportCase} className="space-y-3 pt-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Subject *
                </label>
                <input
                  type="text"
                  value={caseSubject}
                  onChange={(e) => setCaseSubject(e.target.value)}
                  placeholder="e.g. Guidance on Year 9 peer observation rubric"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Category
                </label>
                <select
                  value={caseCategory}
                  onChange={(e) => setCaseCategory(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white focus:outline-none focus:border-[#1B3626]"
                >
                  <option value="Pedagogical">Pedagogical</option>
                  <option value="Dossier Verification">Dossier Verification</option>
                  <option value="Implementation Rhythm">Implementation Rhythm</option>
                  <option value="Technical">Technical</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Advisory Notes
                </label>
                <textarea
                  rows={3}
                  value={caseNotes}
                  onChange={(e) => setCaseNotes(e.target.value)}
                  placeholder="Context, guidance provided, or recommended follow-up date..."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsNewCaseModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 font-semibold hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white font-bold shadow-xs"
                >
                  Save Case Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
