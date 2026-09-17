import React, { useState } from 'react';
import {
  School,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
  UserPlus,
  KeyRound,
  Lock,
  Unlock,
  ExternalLink,
  Clock,
  ShieldCheck,
  UserCheck,
  XCircle,
  Check,
  Search,
  X,
  FileSpreadsheet,
  Mail,
  Bell,
  BarChart3,
} from 'lucide-react';
import {
  User,
  SchoolSignal,
  JourneyEntry,
  JourneyPhase,
  TenantUser,
  Tenant,
} from '../types';
import { BulkTeacherEnrollModal } from './BulkTeacherEnrollModal';
import { StudentVoiceAnalytics } from './StudentVoiceAnalytics';

interface SchoolCoordinatorDashboardProps {
  currentUser: User;
  signals: SchoolSignal[];
  entries: JourneyEntry[];
  phases: JourneyPhase[];
  onNavigateTab: (tab: string) => void;
  tenantUsers?: TenantUser[];
  onApproveTeacher?: (userId: string) => void;
  onSuspendTeacher?: (userId: string) => void;
  onRejectTeacher?: (userId: string) => void;
  onLaunchTeacher?: (user: TenantUser) => void;
  onAddNewTeacher?: (userData: Omit<TenantUser, 'id' | 'joinedDate' | 'activeEntriesCount' | 'tenantName'>) => void;
  onBulkEnrollTeachers?: (
    teachers: Omit<TenantUser, 'id' | 'joinedDate' | 'activeEntriesCount' | 'tenantName'>[],
    autoActivate: boolean,
    sendWelcomeEmail: boolean
  ) => void;
  onOpenNotifications?: () => void;
  activeTenant?: Tenant;
}

export const SchoolCoordinatorDashboard: React.FC<SchoolCoordinatorDashboardProps> = ({
  currentUser,
  signals,
  entries,
  phases,
  onNavigateTab,
  tenantUsers = [],
  onApproveTeacher,
  onSuspendTeacher,
  onRejectTeacher,
  onLaunchTeacher,
  onAddNewTeacher,
  onBulkEnrollTeachers,
  onOpenNotifications,
  activeTenant,
}) => {
  const [selectedSignalTab, setSelectedSignalTab] = useState<string>('all');

  // Filter school tenant users for the current school
  const currentSchoolId = currentUser.schoolId || activeTenant?.id || 'tenant-a-oakridge';
  const schoolUsers = tenantUsers.filter((u) => u.tenantId === currentSchoolId);
  const teachers = schoolUsers.filter((u) => u.role === 'teacher');
  const pendingTeachers = teachers.filter((u) => u.status === 'pending_approval');
  const activeTeachers = teachers.filter((u) => u.status !== 'pending_approval');

  const [staffFilter, setStaffFilter] = useState<'pending' | 'active' | 'all'>(
    pendingTeachers.length > 0 ? 'pending' : 'active'
  );
  const [staffSearch, setStaffSearch] = useState('');
  const [approvalNotice, setApprovalNotice] = useState<string | null>(null);

  // Add teacher modal state
  const [isAddTeacherOpen, setIsAddTeacherOpen] = useState(false);
  const [isBulkEnrollOpen, setIsBulkEnrollOpen] = useState(false);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [newTeacherEmail, setNewTeacherEmail] = useState('');
  const [newTeacherDept, setNewTeacherDept] = useState('Humanities & Social Studies');
  const [newTeacherFocus, setNewTeacherFocus] = useState('Know Yourself (Emotional Literacy)');

  const dossierNominated = entries.filter((e) => e.includedInDossier);

  const handleApprove = (user: TenantUser) => {
    if (onApproveTeacher) {
      onApproveTeacher(user.id);
      setApprovalNotice(
        `Account for ${user.name} (${user.email}) is now OPEN. They can now log in directly as an educator from the main login screen.`
      );
      setTimeout(() => setApprovalNotice(null), 8000);
    }
  };

  const handleCreateTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherName.trim() || !newTeacherEmail.trim()) return;

    if (onAddNewTeacher) {
      onAddNewTeacher({
        tenantId: currentSchoolId,
        name: newTeacherName.trim(),
        email: newTeacherEmail.trim(),
        role: 'teacher',
        title: `${newTeacherDept} Educator`,
        department: newTeacherDept,
        competencyFocus: newTeacherFocus,
        status: 'active', // Added by coordinator -> immediately active
      });
      setApprovalNotice(
        `Educator account for ${newTeacherName} created and OPENED. They can log in immediately with their email.`
      );
      setTimeout(() => setApprovalNotice(null), 8000);
    }

    setNewTeacherName('');
    setNewTeacherEmail('');
    setIsAddTeacherOpen(false);
  };

  const filteredTeachers = (
    staffFilter === 'pending'
      ? pendingTeachers
      : staffFilter === 'active'
      ? activeTeachers
      : teachers
  ).filter(
    (t) =>
      t.name.toLowerCase().includes(staffSearch.toLowerCase()) ||
      t.email.toLowerCase().includes(staffSearch.toLowerCase()) ||
      (t.department && t.department.toLowerCase().includes(staffSearch.toLowerCase()))
  );

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C88A2E]">
              <School className="w-4 h-4" />
              <span>School-Level Living Dashboard</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
              Our CEQHS Journey ({currentUser.academicYear})
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              {currentUser.schoolName} · Facilitated by {currentUser.name} (Coordinator)
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('dossier')}
            className="px-4 py-2.5 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2 self-start md:self-auto shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Curate School Dossier</span>
          </button>
        </div>

        {/* Holistic School Counts (Not completion scores!) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div
            onClick={() => {
              const el = document.getElementById('educator-access-governance');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80 hover:border-[#4A6B53] cursor-pointer transition-all"
            title="Click to manage teacher access approvals"
          >
            <div className="flex items-center justify-between">
              <span className="text-2xl font-editorial font-bold text-[#252525]">
                {teachers.length || 28}
              </span>
              {pendingTeachers.length > 0 && (
                <span className="inline-flex items-center text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-amber-200 text-amber-900 border border-amber-300 animate-pulse">
                  {pendingTeachers.length} new
                </span>
              )}
            </div>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Educators</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#C45D3E]">143</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Moments</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#C88A2E]">87</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Reflections</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#3F6C8A]">64</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Evidence Items</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#4A6B53]">12</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Practices</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-purple-700">4</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Emerging Patterns</span>
          </div>
        </div>

        {/* Impact & Evidence Suite Callout (CEQHS Metrics Manual Grades 1-5) */}
        <div className="mt-8 p-5 rounded-2xl bg-gradient-to-r from-[#EAF0EB] via-[#F4F1EA] to-amber-50/70 border border-[#4A6B53]/30 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xs">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-[#4A6B53] text-white text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                CEQHS Metrics Manual
              </span>
              <span className="px-2 py-0.5 rounded bg-white text-stone-800 border border-stone-200 text-[10px] font-semibold">
                Grades 1–5 Measurement Architecture
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-bold">
                Strong Evidence Tier
              </span>
            </div>
            <h3 className="font-editorial text-lg font-bold text-[#252525]">
              Multi-Source Impact & Evidence Suite
            </h3>
            <p className="text-xs text-stone-600 max-w-2xl leading-relaxed">
              Domain profiles across 5 domains (Self-Awareness, Regulation, Social Awareness, Relationship Skills, Decision-Making), Grades 1–2 Guided Tasks, 0–4 Observation Logger, and Implementation Reach (94% Learners reached).
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('impact-evidence')}
            className="px-4 py-2.5 rounded-xl bg-[#4A6B53] hover:bg-[#3c5743] text-white text-xs font-semibold shadow-xs flex items-center gap-2 self-start md:self-auto transition-all shrink-0 cursor-pointer"
          >
            <BarChart3 className="w-4 h-4" />
            <span>Open Impact & Evidence Suite</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* School Journey Phase Map */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500">
              Campus Journey Progress Map
            </span>
            <span className="text-[#4A6B53] font-medium">
              Classroom experiments actively embedding
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {phases.map((p, idx) => {
              const isPast = idx < 2;
              const isCurrent = idx === 2;
              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border text-xs ${
                    isCurrent
                      ? 'bg-[#FAF3E7] border-[#C88A2E] ring-1 ring-[#C88A2E] font-bold text-stone-900'
                      : isPast
                      ? 'bg-[#EAF0EB] border-[#4A6B53]/30 text-[#4A6B53]'
                      : 'bg-[#FAF9F5] border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase">{p.number}</span>
                    {isPast && <span>✓</span>}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#C88A2E]" />}
                  </div>
                  <div className="font-semibold mt-1">{p.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coordinator Philosophy Box: Patterns over policing */}
      <div className="p-5 rounded-2xl bg-[#EAF0EB]/80 border border-[#4A6B53]/30 flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[#4A6B53] text-white flex items-center justify-center font-bold text-sm shrink-0">
          💡
        </div>
        <div className="space-y-1 text-sm text-stone-800">
          <span className="font-bold text-[#4A6B53]">The Coordinator Principle:</span>
          <p className="leading-relaxed">
            The coordinator dashboard does not police teachers or track compliance quotas ("Teacher X hasn’t uploaded 3 files").
            Instead, we surface <strong className="text-stone-900 font-semibold">emerging patterns, collective breakthroughs, and shared pedagogical struggles</strong> for constructive dialogue.
          </p>
        </div>
      </div>

      {/* ---------------------------------------------------- */}
      {/* TEACHER ACCOUNTS & ACCESS APPROVALS (SCHOOL GOVERNANCE) */}
      {/* ---------------------------------------------------- */}
      <section
        id="educator-access-governance"
        className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A6B53]">
              <KeyRound className="w-4 h-4" />
              <span>Campus Access Governance</span>
            </div>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal mt-0.5">
              Teacher Accounts & Access Approvals
            </h2>
            <p className="text-xs text-stone-600 mt-1 max-w-2xl">
              Self-registered teachers must be reviewed and opened here before they can log in as educators from the main login screen. School leadership maintains verified campus cohort access.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
            <button
              onClick={() => setIsBulkEnrollOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-300 text-xs font-semibold hover:bg-emerald-100 transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
              <span>+ Bulk CSV Enrollment</span>
            </button>
            <button
              onClick={() => setIsAddTeacherOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-[#1B3626] text-white text-xs font-semibold hover:bg-[#2B4E38] transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>+ Provision Teacher</span>
            </button>
          </div>
        </div>

        {/* Approval Notice Banner */}
        {approvalNotice && (
          <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-start justify-between gap-3 animate-in fade-in duration-200">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <strong className="block font-semibold">Account Activated</strong>
                <span>{approvalNotice}</span>
                {onOpenNotifications && (
                  <button
                    onClick={onOpenNotifications}
                    className="inline-flex items-center gap-1 font-bold text-emerald-800 hover:underline pt-0.5"
                  >
                    <Mail className="w-3 h-3 text-emerald-700" />
                    <span>View Welcome Email &amp; Notice in Notification Hub &rarr;</span>
                  </button>
                )}
              </div>
            </div>
            <button
              onClick={() => setApprovalNotice(null)}
              className="text-emerald-700 hover:text-emerald-950 text-xs font-bold"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Pending Alerts Banner if any teachers are waiting */}
        {pendingTeachers.length > 0 && (
          <div className="p-4 rounded-xl bg-amber-50/90 border border-amber-300 text-amber-950 text-xs flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse shrink-0" />
              <p>
                <strong className="font-bold">
                  {pendingTeachers.length} educator {pendingTeachers.length === 1 ? 'account is' : 'accounts are'} awaiting school activation.
                </strong>{' '}
                These teachers cannot log in from the main portal until you click <em>Approve & Open Account</em>.
              </p>
            </div>
            <button
              onClick={() => setStaffFilter('pending')}
              className="px-3 py-1 bg-amber-200/80 hover:bg-amber-300 text-amber-900 font-bold rounded-lg text-xs shrink-0 transition-colors"
            >
              View Pending ({pendingTeachers.length})
            </button>
          </div>
        )}

        {/* Filters and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-1.5 p-1 bg-stone-100/80 rounded-xl border border-stone-200/80 w-fit">
            <button
              onClick={() => setStaffFilter('pending')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                staffFilter === 'pending'
                  ? 'bg-white text-amber-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Pending Activation</span>
              {pendingTeachers.length > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-amber-200 text-amber-900">
                  {pendingTeachers.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setStaffFilter('active')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                staffFilter === 'active'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span>Active Educators ({activeTeachers.length})</span>
            </button>

            <button
              onClick={() => setStaffFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                staffFilter === 'all'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-stone-500" />
              <span>All Staff ({teachers.length})</span>
            </button>
          </div>

          <div className="relative max-w-xs w-full">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by educator name, email..."
              value={staffSearch}
              onChange={(e) => setStaffSearch(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-[#4A6B53] focus:bg-white transition-colors"
            />
          </div>
        </div>

        {/* Educators Roster List */}
        <div className="space-y-3">
          {filteredTeachers.length === 0 ? (
            <div className="p-8 text-center rounded-2xl border border-dashed border-stone-200 bg-stone-50/50">
              <Users className="w-8 h-8 text-stone-400 mx-auto mb-2 opacity-60" />
              <p className="text-xs font-medium text-stone-600">
                {staffFilter === 'pending'
                  ? 'No educator registrations currently pending approval. All teachers are active.'
                  : 'No educators match the selected criteria.'}
              </p>
            </div>
          ) : (
            filteredTeachers.map((teacher) => {
              const isPending = teacher.status === 'pending_approval';
              const isSuspended = teacher.status === 'suspended';

              return (
                <div
                  key={teacher.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                    isPending
                      ? 'bg-amber-50/40 border-amber-300 ring-1 ring-amber-200/60'
                      : isSuspended
                      ? 'bg-stone-100/80 border-stone-300 opacity-75'
                      : 'bg-[#FAF9F5] border-stone-200/80 hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start sm:items-center gap-3.5 min-w-0">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs ${
                        isPending
                          ? 'bg-amber-200 text-amber-900 border border-amber-400'
                          : 'bg-[#1B3626] text-white'
                      }`}
                    >
                      {teacher.avatarInitials ||
                        teacher.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .slice(0, 2)
                          .toUpperCase()}
                    </div>

                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm text-stone-900 truncate">
                          {teacher.name}
                        </span>
                        {isPending ? (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <Clock className="w-2.5 h-2.5" />
                            <span>Pending School Approval</span>
                          </span>
                        ) : isSuspended ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-700">
                            Access Suspended
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-600" />
                            <span>Account Open & Active</span>
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-600 mt-0.5">
                        <span className="font-medium text-stone-700">{teacher.email}</span>
                        {teacher.department && <span>· {teacher.department}</span>}
                        {teacher.competencyFocus && (
                          <span className="text-stone-500">
                            · Focus: {teacher.competencyFocus.split('(')[0]}
                          </span>
                        )}
                        {teacher.requestedAt && (
                          <span className="text-amber-800 font-medium">
                            · Requested: {teacher.requestedAt}
                          </span>
                        )}
                      </div>

                      {isPending && (
                        <p className="text-[11px] text-amber-800 mt-1 font-medium">
                          ⚠️ This teacher cannot log in from the main portal until activated by school leadership.
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start md:self-center shrink-0">
                    {isPending ? (
                      <>
                        <button
                          onClick={() => handleApprove(teacher)}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs cursor-pointer"
                        >
                          <KeyRound className="w-3.5 h-3.5" />
                          <span>Approve & Open Account</span>
                        </button>

                        {onLaunchTeacher && (
                          <button
                            onClick={() => onLaunchTeacher(teacher)}
                            className="px-3 py-1.5 rounded-lg bg-[#252525] hover:bg-black text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Open account and immediately enter Educator workspace"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            <span>Open & Launch Workspace</span>
                          </button>
                        )}

                        {onRejectTeacher && (
                          <button
                            onClick={() => onRejectTeacher(teacher.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-600 text-xs font-medium transition-colors cursor-pointer"
                            title="Reject registration"
                          >
                            Dismiss
                          </button>
                        )}
                      </>
                    ) : (
                      <>
                        {onLaunchTeacher && (
                          <button
                            onClick={() => onLaunchTeacher(teacher)}
                            className="px-3 py-1.5 rounded-lg bg-[#EAF0EB] hover:bg-[#d8e6da] text-[#1B3626] text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Log in directly as this educator from the coordinator portal"
                          >
                            <UserCheck className="w-3.5 h-3.5" />
                            <span>Launch Educator Workspace</span>
                          </button>
                        )}

                        {onSuspendTeacher && (
                          <button
                            onClick={() => onSuspendTeacher(teacher.id)}
                            className="px-2.5 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 text-xs font-medium transition-colors cursor-pointer"
                          >
                            {isSuspended ? 'Reactivate' : 'Suspend'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Provision Teacher Modal */}
      {isAddTeacherOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 text-stone-900 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setIsAddTeacherOpen(false)}
              className="absolute right-4 top-4 text-stone-400 hover:text-stone-700 p-1 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#4A6B53]">
                Educator Provisioning
              </span>
            </div>
            <h3 className="text-xl font-editorial font-bold text-stone-900 mb-1">
              Provision & Open Teacher Account
            </h3>
            <p className="text-xs text-stone-600 mb-4 leading-relaxed">
              Create and automatically activate an educator account for {currentUser.schoolName}. The teacher will be able to log in immediately from the main portal.
            </p>

            <form onSubmit={handleCreateTeacherSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Teacher Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="e.g. Rachel Adams"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  School Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={newTeacherEmail}
                  onChange={(e) => setNewTeacherEmail(e.target.value)}
                  placeholder="e.g. rachel.adams@oakridge.edu"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Department / Subject
                </label>
                <input
                  type="text"
                  value={newTeacherDept}
                  onChange={(e) => setNewTeacherDept(e.target.value)}
                  placeholder="e.g. Science & Discovery"
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl focus:outline-none focus:border-[#4A6B53]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Initial EQ Competency Focus
                </label>
                <select
                  value={newTeacherFocus}
                  onChange={(e) => setNewTeacherFocus(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-stone-300 rounded-xl bg-white focus:outline-none focus:border-[#4A6B53]"
                >
                  <option value="Know Yourself (Emotional Literacy)">Know Yourself (Emotional Literacy)</option>
                  <option value="Choose Yourself (Consequential Thinking)">Choose Yourself (Consequential Thinking)</option>
                  <option value="Choose Yourself (Intentional Action)">Choose Yourself (Intentional Action)</option>
                  <option value="Give Yourself (Empathy Cultivation)">Give Yourself (Empathy Cultivation)</option>
                  <option value="Give Yourself (Relational Dignity)">Give Yourself (Relational Dignity)</option>
                </select>
              </div>

              <div className="pt-3 flex items-center justify-end gap-2 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsAddTeacherOpen(false)}
                  className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#1B3626] hover:bg-[#2B4E38] text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
                >
                  Create & Open Account
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Bulk Teacher Enrollment Modal */}
      <BulkTeacherEnrollModal
        isOpen={isBulkEnrollOpen}
        onClose={() => setIsBulkEnrollOpen(false)}
        tenantId={currentSchoolId}
        tenantName={activeTenant?.name || currentUser.schoolName}
        existingUsers={tenantUsers}
        onBulkEnroll={(newTeachers, autoActivate, sendWelcomeEmail) => {
          if (onBulkEnrollTeachers) {
            onBulkEnrollTeachers(newTeachers, autoActivate, sendWelcomeEmail);
          }
          setApprovalNotice(
            `Successfully provisioned ${newTeachers.length} educators for ${activeTenant?.name || currentUser.schoolName}.`
          );
          setTimeout(() => setApprovalNotice(null), 9000);
        }}
      />

      {/* ---------------------------------------------------- */}
      {/* AGGREGATED STUDENT VOICE & EMOTIONAL CLIMATE ANALYTICS */}
      {/* ---------------------------------------------------- */}
      <StudentVoiceAnalytics
        entries={entries}
        schoolName={activeTenant?.name || currentUser.schoolName}
      />

      {/* School Signals (Emerging Patterns for Conversation) */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C88A2E]">
              Collective Diagnostics
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal">
              School Signals & Emerging Themes
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Patterns identified across educator field notes, reflections, and moments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="p-5 rounded-xl border border-stone-200/80 bg-[#FAF9F5] hover:bg-stone-50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 capitalize">
                  {sig.type}
                </span>
                <span className="text-sm font-editorial font-bold text-[#4A6B53]">
                  {sig.count} teachers noting this
                </span>
              </div>

              <h3 className="font-editorial text-xl font-normal text-stone-900">
                {sig.topic}
              </h3>

              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                {sig.note}
              </p>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>Recommended next action:</span>
                <span className="font-semibold text-[#4A6B53]">Agenda for Practice Circle</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Contributions Nominated for the Annual Dossier */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Living Curation
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal">
              Contributions Nominated for the School Dossier
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {dossierNominated.length} items flagged by teachers for inclusion in the annual publication.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('dossier')}
            className="text-xs font-semibold text-[#4A6B53] hover:underline flex items-center gap-1"
          >
            <span>Preview Annual Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {dossierNominated.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                    {item.type}
                  </span>
                  <span className="text-xs font-semibold text-stone-900">{item.authorName}</span>
                  <span className="text-xs text-stone-500">({item.authorRole})</span>
                </div>
                <div className="text-sm font-semibold text-stone-900">{item.title}</div>
                <p className="text-xs text-stone-600 line-clamp-1 italic">
                  "{item.whyDoesThisMatter || item.description}"
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-medium text-[#4A6B53] bg-[#EAF0EB] px-2.5 py-1 rounded-md">
                  ✓ Ready for Book
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
