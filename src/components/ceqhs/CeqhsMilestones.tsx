import React, { useState } from 'react';
import {
  Award,
  Filter,
  Search,
  CheckCircle2,
  Clock,
  Building2,
  Check,
  RefreshCw,
  ArrowRight,
  FileCheck2,
  X,
} from 'lucide-react';
import { MilestoneItem, CEQHSPartnerSchool } from '../../types/ceqhsUser';

interface CeqhsMilestonesProps {
  milestones: MilestoneItem[];
  schools: CEQHSPartnerSchool[];
  initialStatusFilter?: string;
  onVerifyMilestone: (milestoneId: string, notes: string) => void;
  onRequestMilestoneRevision: (milestoneId: string, notes: string) => void;
  onOpenSchoolWorkspace: (schoolId: string) => void;
}

export const CeqhsMilestones: React.FC<CeqhsMilestonesProps> = ({
  milestones,
  schools,
  initialStatusFilter,
  onVerifyMilestone,
  onRequestMilestoneRevision,
  onOpenSchoolWorkspace,
}) => {
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeModalMilestone, setActiveModalMilestone] = useState<MilestoneItem | null>(null);
  const [verificationNote, setVerificationNote] = useState('');

  const filteredMilestones = milestones.filter((m) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      m.name.toLowerCase().includes(q) ||
      m.schoolName.toLowerCase().includes(q) ||
      m.criteria.toLowerCase().includes(q) ||
      m.phase.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' || m.status.toLowerCase() === statusFilter.toLowerCase();
    const matchesSchool = schoolFilter === 'all' || m.schoolId === schoolFilter;

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const handleVerifySubmit = () => {
    if (!activeModalMilestone) return;
    onVerifyMilestone(
      activeModalMilestone.id,
      verificationNote || 'Criteria verified against submitted school evidence.'
    );
    setActiveModalMilestone(null);
    setVerificationNote('');
  };

  const handleRevisionSubmit = () => {
    if (!activeModalMilestone) return;
    if (!verificationNote.trim()) {
      alert('Please state what additional evidence is required.');
      return;
    }
    onRequestMilestoneRevision(activeModalMilestone.id, verificationNote);
    setActiveModalMilestone(null);
    setVerificationNote('');
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>Accreditation & Standards</span>
            <span>·</span>
            <span>Developmental Progression Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Milestone Verification Hub
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Audit whole-school developmental milestones against verified evidence criteria and practitioner reflections.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-900 border border-emerald-200 text-xs font-bold">
            {milestones.filter((m) => m.status === 'Verified').length} of {milestones.length} Verified
          </span>
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
            placeholder="Search milestone name, phase, school, or criteria..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20 focus:border-[#1B3626]"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20"
            >
              <option value="all">All States ({milestones.length})</option>
              <option value="evidence submitted">Evidence Submitted (Ready)</option>
              <option value="verified">Verified</option>
              <option value="in progress">In Progress</option>
              <option value="not started">Not Started</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">School:</span>
            <select
              value={schoolFilter}
              onChange={(e) => setSchoolFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20"
            >
              <option value="all">All Schools</option>
              {schools.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Milestones Cards / Rows */}
      <div className="grid grid-cols-1 gap-4">
        {filteredMilestones.map((m) => (
          <div
            key={m.id}
            className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-stone-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
          >
            <div className="space-y-1.5 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-stone-100 text-stone-700">
                  {m.phase}
                </span>
                <span className="text-stone-300">·</span>
                <button
                  onClick={() => onOpenSchoolWorkspace(m.schoolId)}
                  className="text-xs font-bold text-stone-900 hover:text-[#1B3626] hover:underline"
                >
                  {m.schoolName}
                </button>
                <span className="text-stone-300">·</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                    m.status === 'Verified'
                      ? 'bg-emerald-100 text-emerald-800'
                      : m.status === 'Evidence Submitted'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-stone-900">
                {m.name}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed max-w-3xl">
                {m.criteria}
              </p>
              <p className="text-[11px] text-stone-400">
                Required Checkpoint: <span className="text-stone-600">{m.evidenceRequirements}</span>
              </p>

              {m.verificationNotes && (
                <div className="pt-2 text-[11px] text-stone-600 italic">
                  Note: “{m.verificationNotes}” {m.verifiedBy && `— Verified by ${m.verifiedBy} (${m.verifiedDate})`}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
              {m.status !== 'Verified' ? (
                <button
                  onClick={() => {
                    setActiveModalMilestone(m);
                    setVerificationNote('');
                  }}
                  className="px-3.5 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white font-bold text-xs shadow-xs transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Verify / Review</span>
                </button>
              ) : (
                <div className="flex items-center gap-1 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Accredited</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Verification Modal */}
      {activeModalMilestone && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase text-stone-400">{activeModalMilestone.phase}</span>
                <h3 className="text-base font-bold text-stone-900 mt-0.5">
                  Verify Milestone: {activeModalMilestone.name}
                </h3>
                <p className="text-xs text-stone-500">{activeModalMilestone.schoolName}</p>
              </div>
              <button
                onClick={() => setActiveModalMilestone(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-700 space-y-1.5">
              <div><strong>Criteria:</strong> {activeModalMilestone.criteria}</div>
              <div><strong>Required Evidence:</strong> {activeModalMilestone.evidenceRequirements}</div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Verification & Quality Audit Notes
              </label>
              <textarea
                rows={3}
                value={verificationNote}
                onChange={(e) => setVerificationNote(e.target.value)}
                placeholder="Document evidence verification notes, commendations, or reason for revision..."
                className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#1B3626]"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={handleRevisionSubmit}
                className="px-3.5 py-2 text-xs font-bold text-rose-800 bg-rose-50 hover:bg-rose-100 rounded-lg border border-rose-200"
              >
                Request Additional Evidence
              </button>
              <button
                type="button"
                onClick={handleVerifySubmit}
                className="px-4 py-2 text-xs font-bold text-white bg-[#1B3626] hover:bg-[#284f38] rounded-lg shadow-xs"
              >
                Approve & Mark Verified
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
