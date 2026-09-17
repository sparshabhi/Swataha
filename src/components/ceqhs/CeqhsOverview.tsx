import React, { useState } from 'react';
import {
  Building2,
  Users,
  FileCheck2,
  FolderOpen,
  ArrowRight,
  AlertTriangle,
  Clock,
  CheckCircle2,
  MessageSquare,
  Sparkles,
  ExternalLink,
  PlusCircle,
  BarChart3,
  Award,
  ChevronRight,
  Mail,
  Phone,
  X,
} from 'lucide-react';
import {
  CEQHSStaffUser,
  CEQHSPartnerSchool,
  DossierItemEvidence,
  MilestoneItem,
  PriorityQueueItem,
  RecentActivityItem,
  SupportCaseItem,
} from '../../types/ceqhsUser';

interface CeqhsOverviewProps {
  currentUser: CEQHSStaffUser;
  schools: CEQHSPartnerSchool[];
  dossierItems: DossierItemEvidence[];
  milestones: MilestoneItem[];
  priorityQueue: PriorityQueueItem[];
  recentActivity: RecentActivityItem[];
  supportCases: SupportCaseItem[];
  onNavigate: (route: string, filterParam?: string) => void;
  onOpenSchoolWorkspace: (schoolId: string) => void;
  onAddSchool: () => void;
}

export const CeqhsOverview: React.FC<CeqhsOverviewProps> = ({
  currentUser,
  schools,
  dossierItems,
  milestones,
  priorityQueue,
  recentActivity,
  supportCases,
  onNavigate,
  onOpenSchoolWorkspace,
  onAddSchool,
}) => {
  // Modal state for messaging school lead
  const [messagingSchool, setMessagingSchool] = useState<CEQHSPartnerSchool | null>(null);
  const [messageSubject, setMessageSubject] = useState('');
  const [messageBody, setMessageBody] = useState('');
  const [isMessageSent, setIsMessageSent] = useState(false);

  // Totals for Section 1: Network Health Strip
  const partnerSchoolsCount = schools.length;
  const activeTeachersCount = schools.reduce((acc, s) => acc + (s.activeTeachersCount || 0), 0);
  const evidenceCollectedCount = schools.reduce((acc, s) => acc + (s.evidenceCount || 0), 0);
  const dossiersInProgressCount = schools.filter((s) => s.dossierProgressPercent < 100).length;

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!messageBody.trim()) return;
    setIsMessageSent(true);
    setTimeout(() => {
      setIsMessageSent(false);
      setMessagingSchool(null);
      setMessageSubject('');
      setMessageBody('');
    }, 1200);
  };

  return (
    <div className="space-y-8 pb-16">
      {/* ---------------------------------------------------------------- */}
      {/* SECTION 1: NETWORK HEALTH STRIP                                  */}
      {/* Clean summary strip across the top.                             */}
      {/* Large, clear, uncrowded numbers.                                */}
      {/* ---------------------------------------------------------------- */}
      <section>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Card 1: Partner Schools */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold tracking-wide">Partner Schools</span>
              <Building2 className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {partnerSchoolsCount}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              3 active partner institutions
            </p>
          </div>

          {/* Card 2: Active Teachers */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold tracking-wide">Active Teachers</span>
              <Users className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {activeTeachersCount}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              Across 3 school cohorts
            </p>
          </div>

          {/* Card 3: Evidence Collected */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold tracking-wide">Evidence Collected</span>
              <FileCheck2 className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {evidenceCollectedCount}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              Verified classroom artifacts
            </p>
          </div>

          {/* Card 4: Dossiers in Progress */}
          <div className="bg-white rounded-2xl border border-stone-200/90 p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between text-stone-500 mb-2">
              <span className="text-xs font-semibold tracking-wide">Dossiers in Progress</span>
              <FolderOpen className="w-4 h-4 text-stone-400" />
            </div>
            <div className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
              {dossiersInProgressCount}
            </div>
            <p className="text-[11px] text-stone-400 mt-1 font-medium">
              2026–27 accreditation cycle
            </p>
          </div>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 2: NEEDS ATTENTION                                       */}
      {/* Strictly show high-value items requiring CEQHS action.           */}
      {/* Clean card list / table format with direct navigation links.     */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-base font-bold text-stone-900 tracking-tight">
                Needs Attention
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              High-priority supervisory actions requiring review, verification, or pastoral follow-up.
            </p>
          </div>
          <span className="text-xs font-semibold text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
            {priorityQueue.length} Priority Items
          </span>
        </div>

        <div className="divide-y divide-stone-100">
          {priorityQueue.map((item) => (
            <div
              key={item.id}
              className="py-3.5 sm:py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF9F5]/70 -mx-3 px-3 rounded-xl transition-colors"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2.5 flex-wrap">
                  <span className="text-xs font-bold text-stone-900">
                    {item.title}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="text-xs font-semibold text-[#1B3626]">
                    {item.schoolName}
                  </span>
                  <span className="text-stone-300">·</span>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    {item.category}
                  </span>
                </div>
                <p className="text-xs text-stone-600">
                  {item.detail}
                </p>
              </div>

              <div className="shrink-0 self-start sm:self-center">
                <button
                  onClick={() => {
                    if (item.actionRoute === 'school-workspace') {
                      onOpenSchoolWorkspace(item.schoolId);
                    } else {
                      onNavigate(item.actionRoute);
                    }
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-800 text-xs font-bold shadow-2xs hover:border-stone-400 transition-all flex items-center gap-1.5"
                >
                  <span>{item.actionLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-500" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 3: PARTNER SCHOOLS SNAPSHOT                              */}
      {/* Table of schools with requested columns:                        */}
      {/* School, Health, Implementation Cycle, Active Teachers,          */}
      {/* Evidence Items, Dossier Readiness, Primary Lead, Quick Actions. */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-bold text-stone-900 tracking-tight">
              Partner Schools Snapshot
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Active schools in the CEQHS network and current implementation phases.
            </p>
          </div>
          <button
            onClick={() => onNavigate('schools')}
            className="text-xs font-bold text-[#1B3626] hover:underline flex items-center gap-1 self-start sm:self-center"
          >
            <span>View Full Directory</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-stone-200/80 text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-5">School</th>
                <th className="py-3 px-3">Health</th>
                <th className="py-3 px-3">Implementation Phase</th>
                <th className="py-3 px-3 text-center">Active Teachers</th>
                <th className="py-3 px-3 text-center">Evidence Items</th>
                <th className="py-3 px-4">Dossier Readiness</th>
                <th className="py-3 px-3">Primary Lead</th>
                <th className="py-3 px-5 text-right">Quick Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {schools.map((school) => {
                const healthBadge =
                  school.healthState === 'Healthy' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                      Healthy
                    </span>
                  ) : school.healthState === 'Needs Support' ? (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                      <AlertTriangle className="w-3 h-3 text-amber-600" />
                      Needs Support
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-700 border border-stone-200">
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-500" />
                      Watch
                    </span>
                  );

                return (
                  <tr
                    key={school.id}
                    className="hover:bg-[#FAF9F5]/80 transition-colors group"
                  >
                    {/* School Name & Location */}
                    <td className="py-4 px-5">
                      <div
                        onClick={() => onOpenSchoolWorkspace(school.id)}
                        className="cursor-pointer"
                      >
                        <span className="font-bold text-stone-900 text-sm group-hover:text-[#1B3626] transition-colors">
                          {school.name}
                        </span>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1.5 mt-0.5">
                          <span>{school.location}</span>
                          <span>·</span>
                          <span className="font-mono text-stone-400">{school.code}</span>
                        </div>
                      </div>
                    </td>

                    {/* Health */}
                    <td className="py-4 px-3">
                      {healthBadge}
                    </td>

                    {/* Implementation Cycle / Phase */}
                    <td className="py-4 px-3">
                      <div>
                        <span className="font-bold text-stone-800 text-[11px] uppercase tracking-wider block">
                          Phase: {school.currentPhase || 'PRACTISE'}
                        </span>
                        <span className="text-[10px] text-stone-400">
                          Cycle {school.implementationCycle || school.academicYear}
                        </span>
                      </div>
                    </td>

                    {/* Active Teachers */}
                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-stone-900 text-sm">
                        {school.activeTeachersCount}
                      </span>
                    </td>

                    {/* Evidence Items */}
                    <td className="py-4 px-3 text-center">
                      <span className="font-bold text-stone-900 text-sm">
                        {school.evidenceCount}
                      </span>
                    </td>

                    {/* Dossier Readiness (%) */}
                    <td className="py-4 px-4 min-w-[140px]">
                      <div className="flex items-center justify-between text-xs mb-1">
                        <span className="font-bold text-stone-800">
                          {school.dossierProgressPercent}%
                        </span>
                        <span className="text-[10px] text-stone-400">
                          {school.milestonesReachedCount}/10 milestones
                        </span>
                      </div>
                      <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          style={{ width: `${school.dossierProgressPercent}%` }}
                          className="h-full bg-[#1B3626] rounded-full"
                        />
                      </div>
                    </td>

                    {/* Primary Lead */}
                    <td className="py-4 px-3">
                      <div className="text-xs font-semibold text-stone-800">
                        {school.schoolAdminName}
                      </div>
                      <div className="text-[10px] text-stone-400">
                        CEQHS: {school.assignedOwnerName}
                      </div>
                    </td>

                    {/* Quick Actions */}
                    <td className="py-4 px-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onOpenSchoolWorkspace(school.id)}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
                          title="Open dedicated school workspace"
                        >
                          Workspace
                        </button>
                        <button
                          onClick={() => onNavigate('dossier-review')}
                          className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-[11px] transition-colors"
                          title="Review school evidence queue"
                        >
                          Evidence
                        </button>
                        <button
                          onClick={() => setMessagingSchool(school)}
                          className="p-1.5 rounded-lg text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                          title={`Message Lead: ${school.schoolAdminName}`}
                        >
                          <Mail className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* ---------------------------------------------------------------- */}
      {/* SECTION 4: QUICK ACTIONS / LAUNCHER                              */}
      {/* Small, calm module with common CEQHS tasks:                      */}
      {/* Onboard School, Review Evidence Queue, Generate Network Report,  */}
      {/* View Milestone Progress.                                         */}
      {/* ---------------------------------------------------------------- */}
      <section className="bg-white rounded-2xl border border-stone-200/90 p-6 shadow-2xs">
        <div className="mb-4">
          <h2 className="text-base font-bold text-stone-900 tracking-tight">
            Quick Actions & Common Workflows
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Direct shortcuts to key supervisory workflows across the CEQHS network.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Action 1: Onboard School */}
          <button
            onClick={onAddSchool}
            className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/90 text-left hover:border-[#1B3626] hover:bg-stone-50 transition-all group shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-[#1B3626] text-white flex items-center justify-center mb-3">
                <PlusCircle className="w-4 h-4" />
              </div>
              <div className="font-bold text-stone-900 text-xs group-hover:text-[#1B3626] transition-colors">
                Onboard School
              </div>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                Launch 7-step onboarding wizard for a new partner school.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-[#1B3626]">
              <span>Start Setup</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 2: Review Evidence Queue */}
          <button
            onClick={() => onNavigate('dossier-review')}
            className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/90 text-left hover:border-[#1B3626] hover:bg-stone-50 transition-all group shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center mb-3">
                <FileCheck2 className="w-4 h-4" />
              </div>
              <div className="font-bold text-stone-900 text-xs group-hover:text-[#1B3626] transition-colors">
                Review Evidence Queue
              </div>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                Audit educator submissions and approve living dossier items.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-[#1B3626]">
              <span>Open Queue</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 3: Generate Network Report */}
          <button
            onClick={() => onNavigate('reports')}
            className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/90 text-left hover:border-[#1B3626] hover:bg-stone-50 transition-all group shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center mb-3">
                <BarChart3 className="w-4 h-4" />
              </div>
              <div className="font-bold text-stone-900 text-xs group-hover:text-[#1B3626] transition-colors">
                Generate Network Report
              </div>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                Synthesize cross-school practice depth and survey comparisons.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-[#1B3626]">
              <span>View Reports</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>

          {/* Action 4: View Milestone Progress */}
          <button
            onClick={() => onNavigate('milestones')}
            className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/90 text-left hover:border-[#1B3626] hover:bg-stone-50 transition-all group shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="w-8 h-8 rounded-lg bg-stone-800 text-white flex items-center justify-center mb-3">
                <Award className="w-4 h-4" />
              </div>
              <div className="font-bold text-stone-900 text-xs group-hover:text-[#1B3626] transition-colors">
                View Milestone Progress
              </div>
              <p className="text-[11px] text-stone-500 mt-1 leading-relaxed">
                Track and verify the 10 developmental milestones for accreditation.
              </p>
            </div>
            <div className="mt-4 pt-2 border-t border-stone-200/60 flex items-center justify-between text-[11px] font-bold text-[#1B3626]">
              <span>Check Milestones</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </button>
        </div>
      </section>

      {/* Message School Lead Modal */}
      {messagingSchool && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-bold text-sm text-stone-900">
                  Message School Lead
                </h3>
                <p className="text-xs text-stone-500">
                  {messagingSchool.schoolAdminName} · {messagingSchool.name}
                </p>
              </div>
              <button
                onClick={() => setMessagingSchool(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {isMessageSent ? (
              <div className="py-8 text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                <h4 className="font-bold text-sm text-stone-900">Message Dispatched</h4>
                <p className="text-xs text-stone-500">
                  A copy has been routed to {messagingSchool.schoolAdminEmail} and logged in audit history.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendMessage} className="space-y-4 pt-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={messageSubject}
                    onChange={(e) => setMessageSubject(e.target.value)}
                    placeholder="e.g. Implementation check-in & upcoming evidence review"
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    Advisory Note / Message
                  </label>
                  <textarea
                    rows={4}
                    value={messageBody}
                    onChange={(e) => setMessageBody(e.target.value)}
                    placeholder="Provide supportive guidance, clarify milestone evidence expectations, or suggest an advisory call..."
                    className="w-full px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:border-[#1B3626]"
                    required
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                  <button
                    type="button"
                    onClick={() => setMessagingSchool(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 text-xs font-semibold hover:bg-stone-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Send Message</span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
