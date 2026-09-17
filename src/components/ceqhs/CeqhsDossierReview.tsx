import React, { useState } from 'react';
import {
  FileCheck2,
  Filter,
  Search,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Eye,
  ShieldAlert,
  ArrowRight,
  RefreshCw,
  Flag,
  Check,
  Building2,
  User,
  X,
  FileText,
  BookOpen,
  Layers,
} from 'lucide-react';
import { DossierItemEvidence, CEQHSPartnerSchool } from '../../types/ceqhsUser';
import { CeqhsDossierHub } from '../dossier/CeqhsDossierHub';

interface CeqhsDossierReviewProps {
  dossierItems: DossierItemEvidence[];
  schools: CEQHSPartnerSchool[];
  initialStatusFilter?: string;
  onUpdateDossierReview: (
    itemId: string,
    decision: 'Approved' | 'Revision requested' | 'Flagged for follow-up',
    schoolFeedback: string,
    internalNotes: string,
    revisionReason?: string
  ) => void;
  onOpenSchoolWorkspace: (schoolId: string) => void;
}

export const CeqhsDossierReview: React.FC<CeqhsDossierReviewProps> = ({
  dossierItems,
  schools,
  initialStatusFilter,
  onUpdateDossierReview,
  onOpenSchoolWorkspace,
}) => {
  const [viewMode, setViewMode] = useState<'hub' | 'items'>('hub');
  const [statusFilter, setStatusFilter] = useState<string>(initialStatusFilter || 'all');
  const [schoolFilter, setSchoolFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [inspectItem, setInspectItem] = useState<DossierItemEvidence | null>(null);

  // Form State in Inspection Modal
  const [schoolFeedback, setSchoolFeedback] = useState('');
  const [internalNotes, setInternalNotes] = useState('');
  const [revisionReason, setRevisionReason] = useState('');

  // Filter items
  const filteredItems = dossierItems.filter((item) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.schoolName.toLowerCase().includes(q) ||
      item.submittedBy.toLowerCase().includes(q) ||
      item.sectionDomain.toLowerCase().includes(q);

    const matchesStatus =
      statusFilter === 'all' || item.reviewStatus.toLowerCase() === statusFilter.toLowerCase();
    const matchesSchool = schoolFilter === 'all' || item.schoolId === schoolFilter;

    return matchesSearch && matchesStatus && matchesSchool;
  });

  const handleOpenInspect = (item: DossierItemEvidence) => {
    setInspectItem(item);
    setSchoolFeedback(item.schoolVisibleFeedback || '');
    setInternalNotes(item.ceqhsInternalNotes || '');
    setRevisionReason('');
  };

  const handleDecision = (decision: 'Approved' | 'Revision requested' | 'Flagged for follow-up') => {
    if (!inspectItem) return;
    if (decision === 'Revision requested' && !revisionReason.trim()) {
      alert('Please specify the revision reason for the school.');
      return;
    }

    onUpdateDossierReview(
      inspectItem.id,
      decision,
      schoolFeedback,
      internalNotes,
      decision === 'Revision requested' ? revisionReason : undefined
    );
    setInspectItem(null);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Navigation & View Switcher */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>CEQHS Living Implementation Dossiers</span>
            <span>·</span>
            <span>Primary Schools (Grades 1–5)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 tracking-tight">
            Dossier & Evidence Verification
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Manage full 23-section school dossiers, audit classroom artifacts, and verify publication readiness.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <div className="flex p-1 bg-stone-100 rounded-xl border border-stone-200">
            <button
              type="button"
              onClick={() => setViewMode('hub')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'hub'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5 text-[#2E523A]" />
              23-Section Dossier Hub & Studio
            </button>
            <button
              type="button"
              onClick={() => setViewMode('items')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                viewMode === 'items'
                  ? 'bg-white text-stone-900 shadow-2xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-[#2E523A]" />
              Evidence Items Queue ({dossierItems.filter((d) => d.reviewStatus === 'Awaiting review').length})
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'hub' ? (
        <CeqhsDossierHub
          currentUserRole="super_admin"
          currentUserName="Saugat Singh"
        />
      ) : (
        <>
          {/* Controls Bar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by artifact title, domain, contributor, or school name..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20 focus:border-[#1B3626]"
          />
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20"
            >
              <option value="all">All ({dossierItems.length})</option>
              <option value="awaiting review">Awaiting Review</option>
              <option value="in review">In Review</option>
              <option value="approved">Approved</option>
              <option value="revision requested">Revision Requested</option>
              <option value="flagged for follow-up">Flagged</option>
            </select>
          </div>

          {/* School */}
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

      {/* Items List */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
              <tr>
                <th className="py-3 px-4">Artifact & Domain</th>
                <th className="py-3 px-3">Partner School</th>
                <th className="py-3 px-3">Submitted By</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3">Date</th>
                <th className="py-3 px-3">Assigned Reviewer</th>
                <th className="py-3 px-4 text-right">Review Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {filteredItems.map((item) => (
                <tr
                  key={item.id}
                  className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  onClick={() => handleOpenInspect(item)}
                >
                  {/* Artifact Title */}
                  <td className="py-3.5 px-4">
                    <div className="font-bold text-stone-900 group-hover:text-[#1B3626] transition-colors">
                      {item.title}
                    </div>
                    <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                      <span className="font-semibold text-stone-700">{item.sectionDomain}</span>
                      <span>·</span>
                      <span>v{item.version}</span>
                      {item.isSensitiveContent && (
                        <span className="px-1.5 py-0.2 rounded text-[9px] font-bold bg-rose-100 text-rose-700">
                          Sensitive
                        </span>
                      )}
                    </div>
                  </td>

                  {/* School */}
                  <td className="py-3.5 px-3">
                    <div className="font-semibold text-stone-900">{item.schoolName}</div>
                    <span className="text-[10px] text-stone-400 font-mono">{item.tenantId}</span>
                  </td>

                  {/* Submitted By */}
                  <td className="py-3.5 px-3">
                    <div className="text-stone-900">{item.submittedBy}</div>
                    <span className="text-[10px] text-stone-500">{item.submittedByRole}</span>
                  </td>

                  {/* Status */}
                  <td className="py-3.5 px-3">
                    <span
                      className={`inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                        item.reviewStatus === 'Approved'
                          ? 'bg-emerald-100 text-emerald-800'
                          : item.reviewStatus === 'Revision requested'
                          ? 'bg-rose-100 text-rose-800'
                          : item.reviewStatus === 'Flagged for follow-up'
                          ? 'bg-amber-100 text-amber-900 border border-amber-200'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {item.reviewStatus}
                    </span>
                  </td>

                  {/* Date */}
                  <td className="py-3.5 px-3 text-stone-500 text-[11px] whitespace-nowrap">
                    {item.submittedDate}
                  </td>

                  {/* Reviewer */}
                  <td className="py-3.5 px-3 text-stone-700 text-xs">
                    {item.assignedReviewerName}
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                    <button
                      onClick={() => handleOpenInspect(item)}
                      className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors inline-flex items-center gap-1 shadow-2xs"
                    >
                      <span>Inspect</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ---------------------------------------------------------------- */}
      {/* EVIDENCE INSPECTION & DUAL FEEDBACK MODAL                        */}
      {/* ---------------------------------------------------------------- */}
      {inspectItem && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {inspectItem.sectionDomain} · Version {inspectItem.version}
                </span>
                <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                  {inspectItem.title}
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  {inspectItem.schoolName} · Submitted by {inspectItem.submittedBy} ({inspectItem.submittedByRole})
                </p>
              </div>
              <button
                onClick={() => setInspectItem(null)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Artifact Content */}
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-3">
              <div>
                <span className="font-bold text-stone-700 block mb-1">Practice Summary:</span>
                <p className="text-stone-800 leading-relaxed">{inspectItem.evidenceSummary}</p>
              </div>

              {inspectItem.studentVoiceExcerpt && (
                <div className="pt-2 border-t border-stone-200/80">
                  <span className="font-bold text-stone-700 block mb-1">Student Voice Excerpt:</span>
                  <p className="italic text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200">
                    {inspectItem.studentVoiceExcerpt}
                  </p>
                </div>
              )}

              {inspectItem.teacherReflectionExcerpt && (
                <div className="pt-2 border-t border-stone-200/80">
                  <span className="font-bold text-stone-700 block mb-1">Teacher Reflection:</span>
                  <p className="text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200">
                    {inspectItem.teacherReflectionExcerpt}
                  </p>
                </div>
              )}
            </div>

            {/* School-Visible Feedback */}
            <div>
              <label className="block text-xs font-bold text-emerald-900 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-emerald-700" />
                <span>School-Visible Feedback (Transmitted to School Admin)</span>
              </label>
              <textarea
                rows={3}
                value={schoolFeedback}
                onChange={(e) => setSchoolFeedback(e.target.value)}
                placeholder="Enter developmental recommendations or validation notes..."
                className="w-full p-2.5 text-xs bg-white border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#1B3626]"
              />
            </div>

            {/* CEQHS Internal Note */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-500" />
                <span>CEQHS Internal Note (Confidential to CEQHS Staff)</span>
              </label>
              <textarea
                rows={2}
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
                placeholder="Internal audit notes, moderation flags, or sensitive context..."
                className="w-full p-2.5 text-xs bg-stone-50 border border-stone-300 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#1B3626]"
              />
            </div>

            {/* Revision Reason */}
            <div>
              <label className="block text-xs font-semibold text-rose-800 mb-1">
                Revision Reason (Required if requesting revision)
              </label>
              <input
                type="text"
                value={revisionReason}
                onChange={(e) => setRevisionReason(e.target.value)}
                placeholder="Explain what additions or amendments are required..."
                className="w-full px-3 py-2 text-xs border border-rose-200 bg-rose-50/40 rounded-lg text-stone-900"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                type="button"
                onClick={() => handleDecision('Flagged for follow-up')}
                className="px-3 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <Flag className="w-3.5 h-3.5" />
                <span>Flag Follow-up</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision('Revision requested')}
                className="px-3 py-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-800 border border-rose-300 text-xs font-bold transition-colors flex items-center gap-1"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Request Revision</span>
              </button>

              <button
                type="button"
                onClick={() => handleDecision('Approved')}
                className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Approve & Include in Dossier</span>
              </button>
            </div>
          </div>
        </div>
      )}
        </>
      )}
    </div>
  );
};
