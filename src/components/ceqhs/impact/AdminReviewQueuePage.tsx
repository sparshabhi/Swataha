import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Lock,
  MessageSquare,
  Search,
  Filter,
  FileCheck2,
  BookOpen,
  Users,
  Eye,
  Check,
} from 'lucide-react';
import { SWATARA_REVIEW_QUEUE_ITEMS, SWATARA_IMPACT_INDICATORS } from '../../../data/impactEvidenceData';
import { ReviewQueueItem } from '../../../types/impactEvidence';

export const AdminReviewQueuePage: React.FC = () => {
  const [items, setItems] = useState<ReviewQueueItem[]>(SWATARA_REVIEW_QUEUE_ITEMS);
  const [activeTab, setActiveTab] = useState<'queue' | 'comparison' | 'library' | 'quality'>('queue');
  const [filterSchool, setFilterSchool] = useState<string>('All Schools');
  const [filterStatus, setFilterStatus] = useState<string>('All Statuses');
  const [activeItem, setActiveItem] = useState<ReviewQueueItem | null>(null);
  const [reviewerNote, setReviewerNote] = useState<string>('');

  const handleUpdateStatus = (id: string, newStatus: ReviewQueueItem['status']) => {
    setItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              status: newStatus,
              reviewerNotes: reviewerNote || item.reviewerNotes,
            }
          : item
      )
    );
    setActiveItem(null);
    setReviewerNote('');
  };

  const filteredItems = items.filter((item) => {
    if (filterSchool !== 'All Schools' && item.schoolName !== filterSchool) return false;
    if (filterStatus !== 'All Statuses' && item.status !== filterStatus) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-stone-900 text-white">
            CEQHS Administrator &amp; Reviewer Portal
          </span>
          <span className="text-xs text-stone-500 font-medium">Chief Program Architect Oversight</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Dossier Evidence Review &amp; Moderation Queue
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Technical inspection console for CEQHS reviewers to audit sample sizes, response rates, measurement limitations, and sign off on evidence artifacts submitted by partner schools.
        </p>

        {/* Sub-navigation tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-4 mt-4 border-t border-stone-100">
          {[
            { id: 'queue', label: `Evidence Review Queue (${items.filter((i) => i.status === 'Awaiting Review').length} Pending)` },
            { id: 'comparison', label: 'School Comparison (Improvement Only · No Rankings)' },
            { id: 'library', label: 'Indicator & Measure Library' },
            { id: 'quality', label: 'Data Quality & Missingness Audit' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1B3626] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* TAB 1: EVIDENCE REVIEW QUEUE */}
      {activeTab === 'queue' && (
        <div className="space-y-4">
          {/* Filter Bar */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-bold text-stone-400 uppercase text-[10px]">Filters:</span>

              <select
                value={filterSchool}
                onChange={(e) => setFilterSchool(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-700 font-medium cursor-pointer"
              >
                <option value="All Schools">All Partner Schools</option>
                <option value="Swataha Core School">Swataha Core School</option>
                <option value="Oakridge Primary Partner">Oakridge Primary Partner</option>
                <option value="Greenwood International">Greenwood International</option>
                <option value="Kathmandu Valley Pilot School">Kathmandu Valley Pilot School</option>
              </select>

              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-700 font-medium cursor-pointer"
              >
                <option value="All Statuses">All Verification Statuses</option>
                <option value="Awaiting Review">Awaiting Review</option>
                <option value="Accepted">Accepted</option>
                <option value="Accepted with Note">Accepted with Note</option>
                <option value="Clarification Requested">Clarification Requested</option>
              </select>
            </div>

            <span className="text-[11px] text-stone-500">
              Showing {filteredItems.length} submission(s)
            </span>
          </div>

          {/* Queue Items */}
          <div className="space-y-3">
            {filteredItems.map((item) => {
              const isPending = item.status === 'Awaiting Review';
              const isAccepted = item.status === 'Accepted' || item.status === 'Accepted with Note';

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all space-y-3"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-stone-700 bg-stone-100 px-2 py-0.5 rounded">
                        {item.criterionCode}
                      </span>
                      <h3 className="font-bold text-stone-900 text-sm">{item.criterionTitle}</h3>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                        isPending
                          ? 'bg-amber-100 text-amber-900'
                          : isAccepted
                          ? 'bg-emerald-100 text-emerald-900'
                          : 'bg-blue-100 text-blue-900'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-xs text-stone-500">
                    <span>
                      School: <strong className="text-stone-800">{item.schoolName}</strong>
                    </span>
                    <span>
                      Stage: <strong className="text-stone-800">{item.ceqhsStage}</strong>
                    </span>
                    <span>
                      Submitted by: <strong className="text-stone-800">{item.submittedBy}</strong> ({item.submissionDate})
                    </span>
                  </div>

                  <p className="text-xs text-stone-700 bg-[#FAF8F5] p-3 rounded-xl border border-stone-200/70">
                    {item.evidenceSummary}
                  </p>

                  {item.reviewerNotes && (
                    <div className="text-[11px] text-stone-600 italic bg-white p-2.5 rounded-lg border border-stone-200/60">
                      <strong>Moderator Log:</strong> {item.reviewerNotes}
                    </div>
                  )}

                  {/* Actions */}
                  <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[10px] text-stone-400 font-mono">ID: {item.id}</span>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'Accepted')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#1B3626] text-white hover:bg-[#2D5A3D] cursor-pointer"
                      >
                        Accept Evidence
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'Accepted with Note')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-100 text-emerald-900 hover:bg-emerald-200 cursor-pointer"
                      >
                        Accept with Note
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(item.id, 'Clarification Requested')}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold bg-stone-100 text-stone-700 hover:bg-stone-200 cursor-pointer"
                      >
                        Request Clarification
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: SCHOOL COMPARISON FOR IMPROVEMENT ONLY (NO RANKINGS) */}
      {activeTab === 'comparison' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  Network Improvement Matrix
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase bg-amber-100 text-amber-900">
                  Strict Anti-Ranking Policy
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Evaluates implementation support needs across the network. League tables and public rankings are strictly forbidden under Section 2.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs">Swataha Core School (Primary Pilot)</h3>
              <p className="text-stone-600 text-[11px]">
                Strong classroom fidelity (88%); 18/20 classrooms active daily. Priority need: Restorative bench staff yard duty calibration.
              </p>
              <div className="text-[10px] text-emerald-800 font-bold">Stage: Year 1 Foundation (On Track)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs">Oakridge Primary Partner</h3>
              <p className="text-stone-600 text-[11px]">
                Baseline completed with 84% response rate. Priority need: Grade 1 tactile token interviews to improve early primary voice.
              </p>
              <div className="text-[10px] text-emerald-800 font-bold">Stage: Year 1 Foundation (Active)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs">Greenwood International</h3>
              <p className="text-stone-600 text-[11px]">
                Curriculum integration draft submitted. Priority need: Resolve IB PYP ATL terminology alignment and delivery dosage.
              </p>
              <div className="text-[10px] text-amber-800 font-bold">Stage: Year 2 Integration (Clarification Needed)</div>
            </div>

            <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
              <h3 className="font-bold text-stone-900 text-xs">Kathmandu Valley Pilot School</h3>
              <p className="text-stone-600 text-[11px]">
                Nepal National Curriculum (NCF 2076) Continuous Assessment System (CAS) verified. Excellent teacher presence.
              </p>
              <div className="text-[10px] text-emerald-800 font-bold">Stage: Year 1 Foundation (Approved)</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: INDICATOR & MEASURE LIBRARY */}
      {activeTab === 'library' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <h2 className="text-base font-bold text-stone-900">
            Approved CEQHS Indicator &amp; Measure Library
          </h2>
          <div className="space-y-3">
            {SWATARA_IMPACT_INDICATORS.map((ind) => (
              <div
                key={ind.id}
                className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-stone-700 font-bold">{ind.code}</span>
                    <h3 className="font-bold text-stone-900">{ind.name}</h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {ind.evidenceStrength}
                  </span>
                </div>
                <p className="text-stone-600 text-[11px]">{ind.description}</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[10px] text-stone-500 pt-1">
                  <div><strong>Calculation:</strong> {ind.calculationMethod}</div>
                  <div><strong>Interpretation:</strong> {ind.interpretationGuide}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DATA QUALITY & MISSINGNESS AUDIT */}
      {activeTab === 'quality' && (
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4 text-xs">
          <h2 className="text-base font-bold text-stone-900">
            Network Data Quality &amp; Missingness Registry
          </h2>
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 text-amber-950 leading-relaxed">
            <strong>Section 11 Core Rule:</strong> Missing data is <em>never</em> represented as zero. When longitudinal or follow-up evidence is missing or incomplete, the dashboard displays "Insufficient Evidence" rather than calculating inaccurate arithmetic averages.
          </div>
          <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-2">
            <h3 className="font-bold text-stone-900 text-xs">Swataha Core School Audit Status:</h3>
            <ul className="space-y-1.5 text-stone-600 text-[11px] list-disc list-inside">
              <li>Baseline survey missingness: <strong>4.2%</strong> (Well within the &lt; 10% acceptable threshold).</li>
              <li>Daily advisory classroom audit missingness: <strong>0.0%</strong> (All 20 classrooms accounted for weekly).</li>
              <li>Teacher confidential reflection missingness: <strong>13.6%</strong> (3 faculty missed week 4 reflection; accounted for by authorized leave).</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
