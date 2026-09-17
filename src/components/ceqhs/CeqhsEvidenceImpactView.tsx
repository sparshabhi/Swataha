import React, { useState } from 'react';
import {
  BarChart3,
  CheckCircle2,
  FileCheck,
  Plus,
  ShieldCheck,
  Calendar,
  Users,
  AlertCircle,
  HelpCircle,
  TrendingUp,
  X,
  Check,
} from 'lucide-react';
import {
  SWATARA_SAMPLE_IMPLEMENTATIONS,
  SWATARA_IMPACT_METRICS,
  SwataraImplementationRecord,
} from '../../data/swataraDemoData';

interface CeqhsEvidenceImpactViewProps {
  onNavigateToImpactEvidence?: () => void;
}

export const CeqhsEvidenceImpactView: React.FC<CeqhsEvidenceImpactViewProps> = ({
  onNavigateToImpactEvidence,
}) => {
  const [records, setRecords] = useState<SwataraImplementationRecord[]>(SWATARA_SAMPLE_IMPLEMENTATIONS);
  const [showLogModal, setShowLogModal] = useState(false);
  const [newActivity, setNewActivity] = useState('Daily Emotion Weather Check-In');
  const [newGrade, setNewGrade] = useState('Grade 3 Cosmos');
  const [newFacilitator, setNewFacilitator] = useState('Sarita Sharma');
  const [newStudents, setNewStudents] = useState('25');
  const [newFidelity, setNewFidelity] = useState('90');
  const [newObservation, setNewObservation] = useState('');
  const [newShift, setNewShift] = useState('');

  const metrics = SWATARA_IMPACT_METRICS;

  const handleCreateRecord = () => {
    if (!newObservation.trim()) return;
    const rec: SwataraImplementationRecord = {
      id: `impl-rec-${Date.now().toString().slice(-4)}`,
      date: new Date().toISOString().split('T')[0],
      activityId: 'act-manual',
      activityTitle: newActivity,
      grade: newGrade,
      cohortName: 'Primary Lower Wing',
      facilitatorName: newFacilitator,
      studentsScheduled: parseInt(newStudents) || 25,
      studentsAttended: parseInt(newStudents) || 25,
      reachPercentage: 100,
      fidelityScore: parseInt(newFidelity) || 90,
      learningEvidence: 'Students actively named emotional state with weather imagery.',
      observableBehaviorShift: newShift || 'Calmer entry and faster focus on reading inquiry.',
      teacherObservation: newObservation,
      evidenceArtifactType: 'reflection_slips',
      status: 'Logged',
    };
    setRecords([rec, ...records]);
    setShowLogModal(false);
    setNewObservation('');
    setNewShift('');
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.9 Evidence System
              </span>
              <span className="text-xs text-stone-500 font-medium">
                4 Levels of Rigorous Verification
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Evidence and Impact Ledger
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Tracks reach, practice fidelity, learner understanding, and observable school climate shifts.
            </p>
          </div>

          <button
            onClick={() => setShowLogModal(true)}
            className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Log Implementation Evidence</span>
          </button>
        </div>

        {/* CAUTIOUS LANGUAGE NOTICE (SECTION 6.9 & 8.1) */}
        <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-stone-800 text-xs">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-5 h-5 text-[#1B3626] shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-stone-900">
                Evidence Integrity Guarantee: Cautious Attribution Policy
              </strong>
              {metrics.disclaimer} We distinguish between correlation and causation by reporting verifiable environmental indicators rather than unsubstantiated claims.
            </div>
          </div>
          {onNavigateToImpactEvidence && (
            <button
              onClick={onNavigateToImpactEvidence}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-[#1B3626] bg-[#EAF0EB] hover:bg-[#d6e4d8] transition-colors shrink-0 cursor-pointer self-start sm:self-auto"
            >
              Open Comprehensive Impact Suite →
            </button>
          )}
        </div>
      </div>

      {/* 4 Levels Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Level 1: Reach */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {metrics.reach.title}
            </div>
            <div className="text-3xl font-bold text-stone-900 mt-2">
              {metrics.reach.metric}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-1">
              {metrics.reach.trend}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {metrics.reach.sublabel}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400">
            Who participated &amp; frequency
          </div>
        </div>

        {/* Level 2: Fidelity */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {metrics.fidelity.title}
            </div>
            <div className="text-3xl font-bold text-stone-900 mt-2">
              {metrics.fidelity.metric}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-1">
              {metrics.fidelity.trend}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {metrics.fidelity.sublabel}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400">
            Delivered as intended
          </div>
        </div>

        {/* Level 3: Learning */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {metrics.learning.title}
            </div>
            <div className="text-3xl font-bold text-stone-900 mt-2">
              {metrics.learning.metric}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-1">
              {metrics.learning.trend}
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {metrics.learning.baselineComparison}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400">
            Affective skill comprehension
          </div>
        </div>

        {/* Level 4: Impact */}
        <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              {metrics.impact.title}
            </div>
            <div className="text-3xl font-bold text-emerald-800 mt-2">
              {metrics.impact.metric}
            </div>
            <div className="text-xs font-semibold text-emerald-700 mt-1">
              Escalated Conflict Drop
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {metrics.impact.sublabel}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-stone-100 text-[10px] text-stone-400">
            Observable relational shifts
          </div>
        </div>
      </div>

      {/* Verified Implementation Records Table */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              Verified Classroom Practice Logs ({records.length})
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Detailed evidence entries linking classroom facilitation with student observations.
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {records.map((rec) => (
            <div
              key={rec.id}
              className="p-4 rounded-xl border border-stone-200 bg-[#FDFBF7] space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">
                      {rec.activityTitle}
                    </span>
                    <span className="text-xs text-stone-500">
                      · {rec.grade}
                    </span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                      {rec.status}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 mt-0.5">
                    Facilitator: {rec.facilitatorName} · Date: {rec.date}
                  </div>
                </div>

                <div className="flex items-center gap-4 text-xs font-semibold">
                  <span>Reach: {rec.studentsAttended}/{rec.studentsScheduled} ({rec.reachPercentage}%)</span>
                  <span>Fidelity: {rec.fidelityScore}%</span>
                </div>
              </div>

              <div className="text-xs text-stone-700 bg-white p-3 rounded-lg border border-stone-200/60 leading-relaxed">
                <strong className="text-stone-900">Teacher Observation:</strong> {rec.teacherObservation}
              </div>

              <div className="text-xs text-emerald-950 bg-emerald-50/60 p-2.5 rounded-lg border border-emerald-200/60 leading-relaxed">
                <strong>Observable Behavioral Shift:</strong> {rec.observableBehaviorShift}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Log Implementation Modal */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <h3 className="text-base font-bold text-stone-900">
                Log Implementation Evidence
              </h3>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Practice Name
                </label>
                <select
                  value={newActivity}
                  onChange={(e) => setNewActivity(e.target.value)}
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50"
                >
                  <option>Daily Emotion Weather Check-In</option>
                  <option>Classroom Mindful Micro-Pause</option>
                  <option>Perspective-Taking Circle</option>
                  <option>Repairing a Relationship Conversation</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Grade / Classroom
                  </label>
                  <input
                    type="text"
                    value={newGrade}
                    onChange={(e) => setNewGrade(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>
                <div>
                  <label className="font-semibold text-stone-700 block mb-1">
                    Fidelity Score (1–100%)
                  </label>
                  <input
                    type="number"
                    value={newFidelity}
                    onChange={(e) => setNewFidelity(e.target.value)}
                    className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Classroom Observation (Observable Context Only)
                </label>
                <textarea
                  value={newObservation}
                  onChange={(e) => setNewObservation(e.target.value)}
                  placeholder="Describe what students and teachers did (avoid diagnostic labels)..."
                  className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50 h-20"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-700 block mb-1">
                  Observable Behavioral Shift (Optional)
                </label>
                <input
                  type="text"
                  value={newShift}
                  onChange={(e) => setNewShift(e.target.value)}
                  placeholder="e.g., transition noise reduced, children initiated breath..."
                  className="w-full p-2 rounded-lg border border-stone-200 bg-stone-50"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-100">
              <button
                onClick={() => setShowLogModal(false)}
                className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleCreateRecord}
                className="px-4 py-2 text-xs font-semibold bg-[#1B3626] text-white rounded-lg hover:bg-[#2D5A3D] cursor-pointer"
              >
                Save Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
