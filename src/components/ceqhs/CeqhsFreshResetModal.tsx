import React, { useState } from 'react';
import {
  AlertTriangle,
  RotateCcw,
  CheckCircle2,
  X,
  ShieldAlert,
  Database,
  Layers,
  FileText,
  Lock,
} from 'lucide-react';
import { EnvironmentResetRecord } from '../../types/ceqhsGovernance';

interface CeqhsFreshResetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onExecuteReset: (resetEvent: EnvironmentResetRecord) => void;
  currentSchoolCount: number;
  currentStaffCount: number;
  currentDossierCount: number;
}

export const CeqhsFreshResetModal: React.FC<CeqhsFreshResetModalProps> = ({
  isOpen,
  onClose,
  onExecuteReset,
  currentSchoolCount,
  currentStaffCount,
  currentDossierCount,
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [resetNotes, setResetNotes] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetCompleteRecord, setResetCompleteRecord] = useState<EnvironmentResetRecord | null>(null);

  if (!isOpen) return null;

  const REQUIRED_PHRASE = 'RESET CEQHS PILOT DATA';
  const isPhraseMatched = confirmationInput.trim() === REQUIRED_PHRASE;

  const handlePerformReset = () => {
    if (!isPhraseMatched) return;

    setIsResetting(true);

    setTimeout(() => {
      const resetRecord: EnvironmentResetRecord = {
        id: `reset-audit-${Date.now()}`,
        timestamp: new Date().toISOString(),
        operator: 'Saugat Singh',
        operatorRole: 'Founder and Chief Program Architect',
        environmentName: 'Development Pilot Environment',
        deploymentId: 'ais-pilot-2026.09-release1',
        confirmationPhraseUsed: 'RESET CEQHS PILOT DATA',
        recordsRemovedCount: currentSchoolCount + currentStaffCount + currentDossierCount + 14,
        recordsRetainedCount: 28, // Core curriculum frameworks, Grade 1-5 phases, practices, Super Admin
        categoriesPurged: [
          'Sample Schools & Test Tenants',
          'Sample Teachers & Classroom Educators',
          'Test Student Enrolment Records',
          'Test Dossier Chapters & Submissions',
          'Sample Field Captures & Reflections',
          'Test Review Comments & Checkpoints',
          'Test Notifications & Support Tickets',
          'Transient Mock Audit Logs',
        ],
        resetVersion: '1.0.0-pilot-pristine',
        notes: resetNotes.trim() || 'Controlled pilot development reset executed by Founder Saugat Singh.',
      };

      onExecuteReset(resetRecord);
      setResetCompleteRecord(resetRecord);
      setIsResetting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-xl w-full shadow-2xl border border-stone-200 overflow-hidden flex flex-col">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-stone-900 text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <RotateCcw className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold">Protected Pilot Fresh-Start Reset</h2>
              <span className="text-[11px] text-stone-300 font-mono">
                Environment: Development Pilot (ID: ais-pilot-2026.09)
              </span>
            </div>
          </div>
          {!resetCompleteRecord && (
            <button
              onClick={onClose}
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 text-xs text-stone-800">
          {resetCompleteRecord ? (
            <div className="space-y-4 text-center py-4">
              <div className="w-12 h-12 rounded-full bg-[#EAF0EB] text-[#1B3626] flex items-center justify-center mx-auto border border-[#2D5A3D]/20">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Clean Pilot Baseline Successfully Recreated
                </h3>
                <p className="text-xs text-stone-600 mt-1 max-w-md mx-auto">
                  All test schools, users, and evidence have been purged. The platform is reset to the approved Grade 1–5 configuration with Saugat Singh as the sole Super Admin.
                </p>
              </div>

              <div className="bg-stone-50 rounded-xl border p-4 text-left font-mono text-[11px] space-y-1 text-stone-700">
                <div>Operator: {resetCompleteRecord.operator} ({resetCompleteRecord.operatorRole})</div>
                <div>Timestamp: {resetCompleteRecord.timestamp}</div>
                <div>Purged Records: {resetCompleteRecord.recordsRemovedCount}</div>
                <div>Retained System Definitions: {resetCompleteRecord.recordsRetainedCount}</div>
                <div>Reset Version: {resetCompleteRecord.resetVersion}</div>
              </div>

              <button
                onClick={onClose}
                className="w-full py-2.5 rounded-lg bg-[#1B3626] text-white font-bold text-xs hover:bg-[#2D5A3D] transition-colors"
              >
                Close & Return to Pilot Dashboard
              </button>
            </div>
          ) : (
            <>
              {/* Warning Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-300 text-amber-900 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Sole Authority Governance Action</span>
                  <p className="text-[11px] text-amber-800 leading-relaxed">
                    This action will permanently purge all test partner schools, test teacher accounts, test dossiers, reviews, support tickets, and test submissions from active storage.
                  </p>
                </div>
              </div>

              {/* Data Breakdown */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl border border-rose-200 bg-rose-50/50 space-y-1">
                  <span className="text-[11px] font-bold text-rose-900 flex items-center gap-1">
                    <X className="w-3.5 h-3.5" /> Records to Remove:
                  </span>
                  <ul className="text-[10px] text-rose-800 space-y-0.5 list-disc list-inside">
                    <li>All test schools & tenants</li>
                    <li>All non-founder users</li>
                    <li>All test dossiers & evidence</li>
                    <li>Test support cases & notes</li>
                  </ul>
                </div>

                <div className="p-3 rounded-xl border border-emerald-200 bg-emerald-50/50 space-y-1">
                  <span className="text-[11px] font-bold text-emerald-900 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Data to Retain:
                  </span>
                  <ul className="text-[10px] text-emerald-800 space-y-0.5 list-disc list-inside">
                    <li>Super Admin: Saugat Singh</li>
                    <li>Curriculum Frameworks (IB, OX, CA, NC)</li>
                    <li>Grade 1–5 Phases (Phases 0–5)</li>
                    <li>Grade 1–5 Practice Library</li>
                  </ul>
                </div>
              </div>

              {/* Reset Notes */}
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Audit Notes / Reason for Reset
                </label>
                <input
                  type="text"
                  value={resetNotes}
                  onChange={(e) => setResetNotes(e.target.value)}
                  placeholder="e.g. Preparing for clean partner school cohort onboarding"
                  className="w-full text-xs p-2.5 rounded-lg border border-stone-300 focus:ring-2 focus:ring-[#2D5A3D]"
                />
              </div>

              {/* Confirmation Input */}
              <div className="space-y-1.5 pt-1">
                <label className="block font-semibold text-stone-900">
                  To confirm, type <strong className="font-mono text-rose-700 bg-rose-50 px-1.5 py-0.5 rounded border border-rose-200">{REQUIRED_PHRASE}</strong> below:
                </label>
                <input
                  type="text"
                  value={confirmationInput}
                  onChange={(e) => setConfirmationInput(e.target.value)}
                  placeholder="Type confirmation phrase exactly"
                  className="w-full text-xs p-2.5 font-mono rounded-lg border border-stone-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-2.5 pt-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 rounded-lg border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={!isPhraseMatched || isResetting}
                  onClick={handlePerformReset}
                  className={`px-4 py-2 rounded-lg text-white text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs ${
                    isPhraseMatched && !isResetting
                      ? 'bg-rose-700 hover:bg-rose-800'
                      : 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  }`}
                >
                  <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
                  {isResetting ? 'Executing Reset...' : 'Execute Fresh-Start Reset'}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
