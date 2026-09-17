import React, { useState } from 'react';
import {
  HelpCircle,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Building2,
  User,
  Check,
  X,
} from 'lucide-react';
import { SupportCaseItem, CEQHSPartnerSchool, CEQHSStaffUser } from '../../types/ceqhsUser';

interface CeqhsFollowUpProps {
  supportCases: SupportCaseItem[];
  schools: CEQHSPartnerSchool[];
  staff: CEQHSStaffUser[];
  onAddSupportCase: (caseData: Partial<SupportCaseItem>) => void;
  onResolveSupportCase: (caseId: string) => void;
  onOpenSchoolWorkspace: (schoolId: string) => void;
}

export const CeqhsFollowUp: React.FC<CeqhsFollowUpProps> = ({
  supportCases,
  schools,
  staff,
  onAddSupportCase,
  onResolveSupportCase,
  onOpenSchoolWorkspace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // Modal form state
  const [formSchoolId, setFormSchoolId] = useState(schools[0]?.id || '');
  const [formCategory, setFormCategory] = useState<any>('Training');
  const [formPriority, setFormPriority] = useState<any>('High');
  const [formDescription, setFormDescription] = useState('');
  const [formDueDate, setFormDueDate] = useState('2026-09-22');
  const [formOwnerId, setFormOwnerId] = useState(staff[0]?.id || '');

  const filteredCases = supportCases.filter((sc) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      sc.caseNumber.toLowerCase().includes(q) ||
      sc.schoolName.toLowerCase().includes(q) ||
      sc.description.toLowerCase().includes(q) ||
      sc.category.toLowerCase().includes(q);

    const matchesStatus = statusFilter === 'all' || sc.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesCategory = categoryFilter === 'all' || sc.category.toLowerCase() === categoryFilter.toLowerCase();

    return matchesSearch && matchesStatus && matchesCategory;
  });

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDescription.trim()) return;

    const targetSchool = schools.find((s) => s.id === formSchoolId) || schools[0];
    const targetOwner = staff.find((s) => s.id === formOwnerId) || staff[0];

    onAddSupportCase({
      schoolId: targetSchool.id,
      schoolName: targetSchool.name,
      category: formCategory,
      priority: formPriority,
      description: formDescription,
      dueDate: formDueDate,
      ownerId: targetOwner.id,
      ownerName: targetOwner.name,
      relatedPersonName: targetSchool.schoolAdminName,
      relatedPersonRole: 'School Administrator',
      internalNotes: 'Created via CEQHS Support Case Manager.',
    });

    setIsCreateModalOpen(false);
    setFormDescription('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>Case Management & Action Tracking</span>
            <span>·</span>
            <span>School Partner Support</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Support & Follow-up Cases
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Institutional follow-ups, training pacing interventions, safeguarding flags, and partner school queries.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Open New Case</span>
          </button>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cases by number, school, category, or keyword..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20 focus:border-[#1B3626]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none"
            >
              <option value="all">All ({supportCases.length})</option>
              <option value="open">Open</option>
              <option value="in progress">In Progress</option>
              <option value="awaiting school">Awaiting School</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">Category:</span>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none"
            >
              <option value="all">All Categories</option>
              <option value="training">Training</option>
              <option value="dossier clarification">Dossier Clarification</option>
              <option value="onboarding">Onboarding</option>
              <option value="safeguarding / sensitivity concern">Safeguarding / Sensitivity</option>
            </select>
          </div>
        </div>
      </div>

      {/* Cases List */}
      <div className="grid grid-cols-1 gap-3.5">
        {filteredCases.map((sc) => (
          <div
            key={sc.id}
            className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                  {sc.caseNumber}
                </span>
                <span className="text-stone-300">·</span>
                <button
                  onClick={() => onOpenSchoolWorkspace(sc.schoolId)}
                  className="text-xs font-bold text-stone-900 hover:text-[#1B3626] hover:underline"
                >
                  {sc.schoolName}
                </button>
                <span className="text-stone-300">·</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-stone-200 text-stone-700">
                  {sc.category}
                </span>
                <span className="text-stone-300">·</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    sc.priority === 'Urgent'
                      ? 'bg-rose-100 text-rose-800'
                      : sc.priority === 'High'
                      ? 'bg-amber-100 text-amber-900'
                      : 'bg-stone-100 text-stone-700'
                  }`}
                >
                  {sc.priority} Priority
                </span>
              </div>

              <p className="text-xs text-stone-800 font-medium leading-relaxed">
                {sc.description}
              </p>

              <div className="text-[11px] text-stone-500 flex flex-wrap items-center gap-3">
                <span>Owner: <strong className="text-stone-700">{sc.ownerName}</strong></span>
                <span>·</span>
                <span>School Contact: {sc.relatedPersonName} ({sc.relatedPersonRole})</span>
                <span>·</span>
                <span>Due: <strong className="text-stone-800">{sc.dueDate}</strong></span>
              </div>

              {sc.internalNotes && (
                <div className="text-[11px] text-stone-500 italic bg-stone-50 p-2 rounded-lg border border-stone-200/60 mt-1">
                  CEQHS Note: {sc.internalNotes}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {sc.status !== 'Resolved' ? (
                <button
                  onClick={() => onResolveSupportCase(sc.id)}
                  className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold transition-colors flex items-center gap-1 shadow-2xs"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Mark Resolved</span>
                </button>
              ) : (
                <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  Resolved
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* CREATE SUPPORT CASE MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-900">
                Create Support / Follow-up Action
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Partner School</label>
                <select
                  value={formSchoolId}
                  onChange={(e) => setFormSchoolId(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                >
                  {schools.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                  >
                    <option value="Training">Training</option>
                    <option value="Dossier clarification">Dossier Clarification</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Safeguarding / sensitivity concern">Safeguarding / Sensitivity</option>
                    <option value="Implementation stall">Implementation Stall</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Priority</label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                    <option value="Urgent">Urgent</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Case Description & Objective</label>
                <textarea
                  rows={3}
                  required
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Describe the issue, support request, or follow-up reason..."
                  className="w-full text-xs p-2.5 border border-stone-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Assigned CEQHS Staff</label>
                  <select
                    value={formOwnerId}
                    onChange={(e) => setFormOwnerId(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-300 rounded-lg"
                  >
                    {staff.map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1B3626] hover:bg-[#284f38] rounded-lg shadow-xs"
                >
                  Create Case
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
