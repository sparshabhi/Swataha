import React, { useState } from 'react';
import {
  FileCheck2,
  Sparkles,
  ShieldCheck,
  UserCheck,
  AlertTriangle,
  Lock,
  ExternalLink,
  CheckCircle2,
  Clock,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  SWATARA_DOSSIER_NARRATIVES,
  SWATARA_EVIDENCE_LINKS,
} from '../../../data/impactEvidenceData';
import { DossierNarrativeDraft, EvidenceLink } from '../../../types/impactEvidence';

interface DossierEvidencePageProps {
  onSelectEvidence: (ev: EvidenceLink) => void;
  userRole: 'school_management' | 'admin_reviewer';
}

export const DossierEvidencePage: React.FC<DossierEvidencePageProps> = ({
  onSelectEvidence,
  userRole,
}) => {
  const [narratives, setNarratives] = useState<DossierNarrativeDraft[]>(SWATARA_DOSSIER_NARRATIVES);
  const [activeTab, setActiveTab] = useState<'narratives' | 'evidence_records'>('narratives');

  const handleApproveNarrative = (id: string) => {
    setNarratives((prev) =>
      prev.map((n) =>
        n.id === id
          ? {
              ...n,
              status: 'Approved by Architect',
              approvedBy: 'Saugat Singh Saud (Chief Program Architect)',
              approvalDate: '2026-09-17',
            }
          : n
      )
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#1B3626]">
            Living Dossier Synchronization
          </span>
          <span className="text-xs text-stone-500 font-medium">Accreditation Evidence Repository</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Dossier Evidence &amp; Impact Narrative Assistant
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Every impact visual and claim links directly to primary records in the Living Dossier. AI-assisted narratives adhere strictly to the 7-part evidentiary structure and require explicit human architect approval before publication.
        </p>

        {/* Tab switch */}
        <div className="flex items-center gap-2 pt-4 mt-4 border-t border-stone-100">
          <button
            onClick={() => setActiveTab('narratives')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'narratives'
                ? 'bg-[#1B3626] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Structured Impact Narratives ({narratives.length})
          </button>
          <button
            onClick={() => setActiveTab('evidence_records')}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-colors ${
              activeTab === 'evidence_records'
                ? 'bg-[#1B3626] text-white shadow-xs'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Primary Evidence Artifacts ({Object.keys(SWATARA_EVIDENCE_LINKS).length})
          </button>
        </div>
      </div>

      {/* TAB 1: STRUCTURED IMPACT NARRATIVES */}
      {activeTab === 'narratives' && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-xs flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-800 shrink-0" />
              <span>
                <strong>AI Impact Assistant Rules (Section 15):</strong> Summarizes only approved evidence records. Distinguishes implementation, change, contribution, and causal limits. Drafts require human review.
              </span>
            </div>
          </div>

          <div className="space-y-6">
            {narratives.map((narrative) => {
              const isApproved = narrative.status === 'Approved by Architect';

              return (
                <div
                  key={narrative.id}
                  className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-5"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-stone-100">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-semibold text-stone-500">
                          {narrative.indicatorRef}
                        </span>
                        <h2 className="text-base font-bold text-stone-900">
                          {narrative.sectionTitle}
                        </h2>
                      </div>
                      <span className="text-xs text-stone-400">{narrative.academicPeriod}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-lg text-xs font-bold ${
                          isApproved
                            ? 'bg-emerald-50 text-emerald-900 border border-emerald-200/60'
                            : 'bg-amber-50 text-amber-900 border border-amber-200/60'
                        }`}
                      >
                        {narrative.status}
                      </span>

                      {!isApproved && (
                        <button
                          onClick={() => handleApproveNarrative(narrative.id)}
                          className="px-3.5 py-1.5 rounded-lg text-xs font-bold bg-[#1B3626] hover:bg-[#2D5A3D] text-white transition-colors cursor-pointer"
                        >
                          Sign &amp; Approve for Dossier
                        </button>
                      )}
                    </div>
                  </div>

                  {/* 7-Part Canonical Narrative Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-[#1B3626] uppercase block">
                        1. What Changed
                      </span>
                      <p className="text-stone-800 leading-relaxed">{narrative.whatChanged}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-[#1B3626] uppercase block">
                        2. Evidence Supporting the Change
                      </span>
                      <p className="text-stone-800 leading-relaxed">{narrative.evidenceSupport}</p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-[#1B3626] uppercase block">
                        3. Implementation Delivery
                      </span>
                      <p className="text-stone-800 leading-relaxed">
                        {narrative.implementationContext}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1">
                      <span className="text-[10px] font-bold text-[#1B3626] uppercase block">
                        4. Plausible Contribution Mechanism
                      </span>
                      <p className="text-stone-800 leading-relaxed">
                        {narrative.plausibleContribution}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase block">
                        5. Alternative Explanations &amp; Rival Hypotheses
                      </span>
                      <p className="text-amber-950 leading-relaxed">
                        {narrative.alternativeExplanations}
                      </p>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-200/60 space-y-1">
                      <span className="text-[10px] font-bold text-amber-900 uppercase block">
                        6. Measurement &amp; Sampling Limitations
                      </span>
                      <p className="text-amber-950 leading-relaxed">{narrative.limitations}</p>
                    </div>
                  </div>

                  {/* Step 7: Recommended Action & Approval Stamp */}
                  <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div>
                      <span className="text-[10px] font-bold text-emerald-950 uppercase block">
                        7. Recommended Next Steps
                      </span>
                      <p className="text-emerald-950 font-medium">{narrative.recommendedNextStep}</p>
                    </div>

                    {isApproved && (
                      <div className="text-right text-[11px] text-emerald-900 shrink-0">
                        <div className="font-bold">Signed: {narrative.approvedBy}</div>
                        <div className="text-emerald-700 text-[10px]">Date: {narrative.approvalDate}</div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PRIMARY EVIDENCE ARTIFACTS */}
      {activeTab === 'evidence_records' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.values(SWATARA_EVIDENCE_LINKS).map((ev) => (
            <div
              key={ev.id}
              className="bg-white rounded-2xl p-5 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                    {ev.sourceType.replace(/_/g, ' ')}
                  </span>
                  <span className="text-xs font-mono text-stone-400">{ev.dossierSectionId}</span>
                </div>
                <h3 className="font-bold text-stone-900 text-sm">{ev.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{ev.summary}</p>
              </div>

              <div className="pt-2 border-t border-stone-100 space-y-2 text-[11px]">
                <div className="flex justify-between text-stone-500">
                  <span>Sample: {ev.sampleSize}</span>
                  <span>Verified by: {ev.verifiedBy}</span>
                </div>
                <button
                  onClick={() => onSelectEvidence(ev)}
                  className="w-full py-1.5 rounded-lg text-xs font-semibold text-[#1B3626] bg-[#EAF0EB] hover:bg-[#d6e4d8] transition-colors cursor-pointer"
                >
                  Open Traceability Audit Drawer →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
