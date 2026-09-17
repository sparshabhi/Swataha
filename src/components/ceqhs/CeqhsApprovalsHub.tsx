import React, { useState } from 'react';
import {
  ShieldCheck,
  Building2,
  Users,
  GraduationCap,
  BookOpen,
  GitBranch,
  Layers,
  CheckCircle2,
  XCircle,
  HelpCircle,
  Clock,
  ChevronRight,
  AlertCircle,
  FileText,
  UserCheck,
} from 'lucide-react';
import {
  ApprovalRequest,
  ApprovalDecision,
  ApprovalState,
} from '../../types/ceqhsGovernance';

interface CeqhsApprovalsHubProps {
  requests: ApprovalRequest[];
  onMakeDecision: (
    requestId: string,
    decision: 'Approved' | 'Rejected' | 'Request Clarification' | 'Activated' | 'Suspended',
    notes: string
  ) => void;
}

type ApprovalTab =
  | 'all'
  | 'ceqhs_member'
  | 'school'
  | 'school_admin'
  | 'teacher'
  | 'curriculum_mapping'
  | 'programme_version'
  | 'phase_change';

export const CeqhsApprovalsHub: React.FC<CeqhsApprovalsHubProps> = ({
  requests,
  onMakeDecision,
}) => {
  const [activeTab, setActiveTab] = useState<ApprovalTab>('all');
  const [selectedRequestId, setSelectedRequestId] = useState<string | null>(
    requests[0]?.id || null
  );
  const [decisionNotes, setDecisionNotes] = useState('');
  const [actionConfirming, setActionConfirming] = useState<
    'Approved' | 'Rejected' | 'Request Clarification' | 'Activated' | 'Suspended' | null
  >(null);

  const filteredRequests = requests.filter((r) => {
    if (activeTab === 'all') return true;
    return r.targetType === activeTab;
  });

  const selectedRequest =
    requests.find((r) => r.id === selectedRequestId) || filteredRequests[0] || null;

  const handleExecuteDecision = (
    decision: 'Approved' | 'Rejected' | 'Request Clarification' | 'Activated' | 'Suspended'
  ) => {
    if (!selectedRequest) return;
    onMakeDecision(
      selectedRequest.id,
      decision,
      decisionNotes.trim() || `Decision confirmed by Founder Saugat Singh.`
    );
    setDecisionNotes('');
    setActionConfirming(null);
  };

  const getStatusBadge = (status: ApprovalState) => {
    switch (status) {
      case 'Active':
      case 'Approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
            <CheckCircle2 className="w-3 h-3" />
            {status}
          </span>
        );
      case 'Pending approval':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-300">
            <Clock className="w-3 h-3" />
            Pending Approval
          </span>
        );
      case 'Invitation sent':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-sky-50 text-sky-800 border border-sky-300">
            <Users className="w-3 h-3" />
            Invitation Sent
          </span>
        );
      case 'Rejected':
      case 'Suspended':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-rose-50 text-rose-800 border border-rose-300">
            <XCircle className="w-3 h-3" />
            {status}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-300">
            {status}
          </span>
        );
    }
  };

  const getTargetIcon = (type: ApprovalRequest['targetType']) => {
    switch (type) {
      case 'ceqhs_member':
        return <ShieldCheck className="w-4 h-4 text-[#2D5A3D]" />;
      case 'school':
        return <Building2 className="w-4 h-4 text-[#1B3626]" />;
      case 'school_admin':
        return <UserCheck className="w-4 h-4 text-emerald-700" />;
      case 'teacher':
        return <GraduationCap className="w-4 h-4 text-stone-700" />;
      case 'curriculum_mapping':
        return <BookOpen className="w-4 h-4 text-amber-700" />;
      case 'programme_version':
        return <GitBranch className="w-4 h-4 text-indigo-700" />;
      case 'phase_change':
        return <Layers className="w-4 h-4 text-teal-700" />;
      default:
        return <FileText className="w-4 h-4 text-stone-600" />;
    }
  };

  const getTargetTypeLabel = (type: ApprovalRequest['targetType']) => {
    switch (type) {
      case 'ceqhs_member':
        return 'CEQHS Member';
      case 'school':
        return 'Partner School';
      case 'school_admin':
        return 'School Admin';
      case 'teacher':
        return 'Teacher';
      case 'curriculum_mapping':
        return 'Curriculum Mapping';
      case 'programme_version':
        return 'Programme Version';
      case 'phase_change':
        return 'Phase Transition';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Single Owner Governance Banner */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-lg bg-[#EAF0EB] flex items-center justify-center text-[#1B3626] shrink-0 border border-[#2D5A3D]/20">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">Governance & Approval Hub</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1B3626] text-white">
                  Sole Authority
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Founder and Chief Program Architect <strong className="text-stone-900">Saugat Singh</strong> is the sole authority for authorizing CEQHS team members, partner school tenants, educators, and official curriculum alignments.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold px-3 py-2 bg-stone-50 rounded-lg border border-stone-200 text-stone-700">
            <Clock className="w-4 h-4 text-amber-700" />
            <span>
              {requests.filter((r) => r.status === 'Pending approval').length} Pending Decisions
            </span>
          </div>
        </div>

        {/* 7 Tabs conforming to Section 13 */}
        <div className="flex items-center gap-1.5 overflow-x-auto border-t border-stone-100 pt-4 mt-4 text-xs font-medium">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            All Submissions ({requests.length})
          </button>
          <button
            onClick={() => setActiveTab('ceqhs_member')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'ceqhs_member'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            CEQHS Members
          </button>
          <button
            onClick={() => setActiveTab('school')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'school'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Schools
          </button>
          <button
            onClick={() => setActiveTab('school_admin')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'school_admin'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            School Admins
          </button>
          <button
            onClick={() => setActiveTab('teacher')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'teacher'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Teachers
          </button>
          <button
            onClick={() => setActiveTab('curriculum_mapping')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'curriculum_mapping'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Curriculum Mappings
          </button>
          <button
            onClick={() => setActiveTab('programme_version')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'programme_version'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Programme Versions
          </button>
          <button
            onClick={() => setActiveTab('phase_change')}
            className={`px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors ${
              activeTab === 'phase_change'
                ? 'bg-[#1B3626] text-white font-semibold'
                : 'text-stone-600 hover:bg-stone-100'
            }`}
          >
            Phase Changes
          </button>
        </div>
      </div>

      {/* Two-column Layout: Request Queue & Detail Review Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
            Pending Queue ({filteredRequests.length})
          </div>

          {filteredRequests.length === 0 ? (
            <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
              No pending approval requests in this category.
            </div>
          ) : (
            filteredRequests.map((req) => {
              const isSelected = selectedRequest?.id === req.id;
              return (
                <div
                  key={req.id}
                  onClick={() => setSelectedRequestId(req.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-white border-[#2D5A3D] shadow-sm ring-1 ring-[#2D5A3D]/30'
                      : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="p-1.5 rounded bg-stone-50 border border-stone-200">
                        {getTargetIcon(req.targetType)}
                      </div>
                      <div>
                        <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                          {getTargetTypeLabel(req.targetType)}
                        </span>
                        <h4 className="text-sm font-bold text-stone-900 leading-tight">
                          {req.targetName}
                        </h4>
                      </div>
                    </div>
                    <div>{getStatusBadge(req.status)}</div>
                  </div>

                  {req.proposedRoleOrPhase && (
                    <p className="text-xs text-stone-600 mt-2 line-clamp-1">
                      {req.proposedRoleOrPhase}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-stone-100 text-[11px] text-stone-500">
                    <span>By: {req.submittedBy}</span>
                    <span>{req.submittedAt}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Right: Decision Workspace */}
        <div className="lg:col-span-7">
          {selectedRequest ? (
            <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-6 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/80 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-stone-500">
                    <span>{getTargetTypeLabel(selectedRequest.targetType)} Approval</span>
                    <span>·</span>
                    <span className="font-mono">{selectedRequest.id}</span>
                  </div>
                  <h3 className="text-lg font-bold text-stone-900 mt-0.5">
                    {selectedRequest.targetName}
                  </h3>
                </div>
                <div>{getStatusBadge(selectedRequest.status)}</div>
              </div>

              {/* Submission Details */}
              <div className="bg-stone-50 rounded-lg p-4 border border-stone-200/80 space-y-2.5 text-xs text-stone-700">
                <div className="font-bold text-stone-900 flex items-center gap-1.5">
                  <FileText className="w-3.5 h-3.5 text-stone-600" />
                  Submission Context & Metadata
                </div>
                <div className="grid grid-cols-2 gap-2 text-stone-600">
                  <div>
                    <span className="font-semibold text-stone-800">Submitted by:</span>{' '}
                    {selectedRequest.submittedBy}
                  </div>
                  <div>
                    <span className="font-semibold text-stone-800">Submitted date:</span>{' '}
                    {selectedRequest.submittedAt}
                  </div>
                  {selectedRequest.schoolName && (
                    <div className="col-span-2">
                      <span className="font-semibold text-stone-800">School tenant:</span>{' '}
                      {selectedRequest.schoolName}
                    </div>
                  )}
                </div>

                {selectedRequest.details && (
                  <div className="mt-3 pt-3 border-t border-stone-200 text-stone-700 space-y-1">
                    {Object.entries(selectedRequest.details).map(([key, value]) => (
                      <div key={key} className="flex items-start gap-2">
                        <span className="font-semibold capitalize text-stone-800 min-w-[120px]">
                          {key.replace(/([A-Z])/g, ' $1')}:
                        </span>
                        <span className="font-mono text-stone-600">
                          {Array.isArray(value) ? value.join(', ') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Founder Authority Decision Action Panel */}
              <div className="border border-[#2D5A3D]/30 bg-[#EAF0EB]/30 rounded-xl p-5 space-y-4">
                <div className="flex items-center gap-2 text-xs font-bold text-[#1B3626] uppercase tracking-wider">
                  <ShieldCheck className="w-4 h-4 text-[#2D5A3D]" />
                  Founder Decision Authority: Saugat Singh
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-800 mb-1">
                    Decision Rationale & Governance Notes (Immutable in Audit Log)
                  </label>
                  <textarea
                    rows={3}
                    value={decisionNotes}
                    onChange={(e) => setDecisionNotes(e.target.value)}
                    placeholder="Enter explicit approval rationale, boundary reminders, or requested adjustments..."
                    className="w-full text-xs p-3 rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-[#2D5A3D] bg-white"
                  />
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pt-2">
                  <button
                    onClick={() => handleExecuteDecision('Approved')}
                    className="px-4 py-2 rounded-lg bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-bold transition-colors flex items-center gap-1.5 shadow-xs"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Approve & Authorize
                  </button>

                  <button
                    onClick={() => handleExecuteDecision('Request Clarification')}
                    className="px-3.5 py-2 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <HelpCircle className="w-3.5 h-3.5 text-amber-700" />
                    Request Clarification
                  </button>

                  <button
                    onClick={() => handleExecuteDecision('Rejected')}
                    className="px-3.5 py-2 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-900 border border-rose-300 text-xs font-semibold transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5 text-rose-700" />
                    Reject Submission
                  </button>

                  {selectedRequest.status === 'Approved' && (
                    <button
                      onClick={() => handleExecuteDecision('Suspended')}
                      className="px-3.5 py-2 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 border border-stone-300 text-xs font-semibold transition-colors"
                    >
                      Suspend Participation
                    </button>
                  )}
                </div>
              </div>

              {/* Historical Decision Log */}
              {selectedRequest.decisionHistory.length > 0 && (
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
                    Approval History & Audit Trail
                  </h4>
                  <div className="divide-y divide-stone-100 border rounded-lg border-stone-200 text-xs">
                    {selectedRequest.decisionHistory.map((dec) => (
                      <div key={dec.id} className="p-3 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="font-semibold text-stone-900">
                            {dec.decisionMaker} ({dec.decisionMakerRole})
                          </div>
                          <span className="font-mono text-stone-500 text-[11px]">
                            {dec.timestamp}
                          </span>
                        </div>
                        <div className="text-stone-600">
                          State transitioned: <span className="font-semibold">{dec.previousState}</span> →{' '}
                          <span className="font-bold text-[#1B3626]">{dec.newState}</span>
                        </div>
                        <p className="text-stone-700 italic bg-stone-50 p-2 rounded border border-stone-100">
                          "{dec.notes}"
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-stone-200/80 p-12 text-center text-stone-500 text-xs">
              Select an approval submission from the queue to view its full context and execute decisions.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
