import React, { useState } from 'react';
import {
  Users,
  CheckCircle2,
  FileCheck2,
  Sparkles,
  HeartHandshake,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  Info,
  Calendar,
  Layers,
  Sprout,
  Activity,
  AlertCircle,
  Clock,
  Compass,
} from 'lucide-react';
import {
  SWATARA_IMPACT_INDICATORS,
  SWATARA_DOMAIN_WHEEL,
  SWATARA_VALUES_IN_ACTION,
  SWATARA_EVIDENCE_LINKS,
} from '../../../data/impactEvidenceData';
import { ImpactIndicator, EvidenceLink } from '../../../types/impactEvidence';

interface ImpactOverviewPageProps {
  onSelectIndicator: (indicator: ImpactIndicator) => void;
  onSelectEvidence: (link: EvidenceLink) => void;
  onNavigateSubpage: (pageId: string) => void;
  userRole: 'school_management' | 'admin_reviewer';
}

export const ImpactOverviewPage: React.FC<ImpactOverviewPageProps> = ({
  onSelectIndicator,
  onSelectEvidence,
  onNavigateSubpage,
  userRole,
}) => {
  const [selectedTerm, setSelectedTerm] = useState<'All Terms' | 'Term 1' | 'Term 2'>('Term 1');
  const [selectedDomain, setSelectedDomain] = useState<string>('All Domains');
  const [selectedGradeCohort, setSelectedGradeCohort] = useState<string>('All Grades (1–5)');

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* 1. Header & Filters */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1.5">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
                Primary Pilot · Year 1 Foundation Stage
              </span>
              <span className="text-xs text-stone-500 font-medium">
                IB PYP Curriculum Anchor · Swataha Core School
              </span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-stone-900">
              CEQHS Impact Overview
            </h1>
            <p className="text-xs text-stone-600 max-w-2xl mt-0.5">
              A visual summary of development, implementation, evidence, and next steps for{' '}
              <strong className="text-stone-800">Swataha Core School</strong>. Every metric traces directly to approved records in the Living Dossier.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => onNavigateSubpage('annual-review')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#FAF8F5] hover:bg-stone-100 text-stone-700 border border-stone-200/80 transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-stone-500" />
              <span>Annual Review (5 Steps)</span>
            </button>
            <button
              onClick={() => onNavigateSubpage('reports-exports')}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-[#1B3626] hover:bg-[#2D5A3D] text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Generate Impact Report</span>
            </button>
          </div>
        </div>

        {/* Global Filter Bar */}
        <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400">
            Filters:
          </span>

          <select
            value={selectedTerm}
            onChange={(e) => setSelectedTerm(e.target.value as any)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-700 text-xs font-medium cursor-pointer"
          >
            <option value="All Terms">All Terms (Academic Year 2026–2027)</option>
            <option value="Term 1">Term 1: Grounding &amp; Somatic Routines</option>
            <option value="Term 2">Term 2: Empathy &amp; Perspective Circles</option>
          </select>

          <select
            value={selectedGradeCohort}
            onChange={(e) => setSelectedGradeCohort(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-700 text-xs font-medium cursor-pointer"
          >
            <option value="All Grades (1–5)">All Grades (Grades 1–5 Pilot)</option>
            <option value="Early Primary">Early Primary (Grades 1–2)</option>
            <option value="Upper Primary">Upper Primary (Grades 3–5)</option>
          </select>

          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-[#FAF8F5] text-stone-700 text-xs font-medium cursor-pointer"
          >
            <option value="All Domains">All 5 CEQHS Domains</option>
            <option value="Self-Awareness">Self-Awareness</option>
            <option value="Self-Management">Self-Management &amp; Regulation</option>
            <option value="Social Awareness">Social Awareness</option>
            <option value="Relationship Skills">Relationship Skills</option>
            <option value="Responsible Decision">Responsible Decision-Making</option>
          </select>

          <div className="ml-auto text-[11px] text-stone-500 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
            <span>Last audit wave: <strong>16 Sep 2026</strong></span>
          </div>
        </div>
      </div>

      {/* 2. SUMMARY CARDS (All 8 Specific Categories - Section 4) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
            Key Impact &amp; Implementation Indicators
          </h2>
          <span className="text-xs text-stone-500 italic">
            *No arbitrary "Overall Score" — each dimension preserves independent evidence validity.
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Reach */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  1. Reach
                </span>
                <Users className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">95.0%</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                342 of 360 scheduled primary learners actively participating.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-medium">Starting point: 0%</span>
              <button
                onClick={() => onSelectEvidence(SWATARA_EVIDENCE_LINKS['ev-reach-01'])}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View evidence →
              </button>
            </div>
          </div>

          {/* Card 2: Implementation Quality */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  2. Implementation
                </span>
                <CheckCircle2 className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">90.0%</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                18 of 20 homerooms delivering daily 15-min advisory and pauses.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-medium">88% Facilitation Fidelity</span>
              <button
                onClick={() => onSelectEvidence(SWATARA_EVIDENCE_LINKS['ev-fid-02'])}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View evidence →
              </button>
            </div>
          </div>

          {/* Card 3: Evidence Completeness */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  3. Evidence Completeness
                </span>
                <FileCheck2 className="w-4 h-4 text-blue-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">84.0%</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                21 of 25 required Year 1 Foundation artifacts submitted &amp; approved.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">4 items pending</span>
              <button
                onClick={() => onNavigateSubpage('dossier-evidence')}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                Open Dossier →
              </button>
            </div>
          </div>

          {/* Card 4: Learner Development */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  4. Learner Development
                </span>
                <Sprout className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">+43%</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Growth in somatic emotion vocabulary recognition (41% → 84%).
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-medium">Change observed</span>
              <button
                onClick={() => onSelectIndicator(SWATARA_IMPACT_INDICATORS[0])}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View metrics →
              </button>
            </div>
          </div>

          {/* Card 5: Adult Professional Practice */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  5. Adult Practice
                </span>
                <HeartHandshake className="w-4 h-4 text-purple-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">76.0%</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Faculty observed modeling non-reactive 3-breath pauses during friction.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-medium">Up from 24% baseline</span>
              <button
                onClick={() => onSelectIndicator(SWATARA_IMPACT_INDICATORS[2])}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View coaching logs →
              </button>
            </div>
          </div>

          {/* Card 6: School Culture & Safety */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  6. School Culture
                </span>
                <ShieldCheck className="w-4 h-4 text-amber-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">4.3 / 5</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Student perceived emotional safety &amp; belonging (n = 318 surveyed).
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-emerald-800 font-medium">Was 2.8 at baseline</span>
              <button
                onClick={() => onSelectIndicator(SWATARA_IMPACT_INDICATORS[4])}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View culture map →
              </button>
            </div>
          </div>

          {/* Card 7: Sustainability Readiness */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  7. Sustainability
                </span>
                <Compass className="w-4 h-4 text-teal-800" />
              </div>
              <div className="text-2xl font-bold text-stone-900">8 / 10</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Dimensions established or developing; protected timetable locked.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-amber-800 font-medium">Action: Year 2 Budget</span>
              <button
                onClick={() => onNavigateSubpage('sustainability')}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View readiness →
              </button>
            </div>
          </div>

          {/* Card 8: Recognition Progress */}
          <div className="bg-white rounded-xl p-4 border border-stone-200/80 shadow-xs hover:border-emerald-700/40 transition-all flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between text-stone-400 text-xs mb-2">
                <span className="font-semibold text-stone-600 uppercase text-[10px] tracking-wider">
                  8. Recognition Progress
                </span>
                <Activity className="w-4 h-4 text-emerald-800" />
              </div>
              <div className="text-2xl font-bold text-[#1B3626]">Stage 1</div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Foundation Stage: 4 of 5 formal milestones signed off by Architect.
              </p>
            </div>
            <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px]">
              <span className="text-stone-500">1 audit remaining</span>
              <button
                onClick={() => onNavigateSubpage('three-year-journey')}
                className="text-[#1B3626] font-semibold hover:underline cursor-pointer"
              >
                View 3-Year Path →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. INFOGRAPHIC: CEQHS IMPACT PATHWAY (Section 5.1) */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-stone-900">
              CEQHS Impact Pathway Infographic
            </h2>
            <p className="text-xs text-stone-500">
              A theory-of-change flow tracking how school readiness translates into sustainable wellbeing and culture.
            </p>
          </div>
          <span className="text-[11px] text-stone-400">Click any stage to open dossier records</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            {
              stage: '1. School Readiness',
              status: 'Completed',
              evidenceCount: 4,
              indicator: 'Governance charter & protected 15-min timetable locked',
              strength: 'Strong school-level',
              nextAction: 'Maintain timetable ringfence',
              dossierRef: 'SEC-1.0-BASELINE',
            },
            {
              stage: '2. Adult Learning',
              status: 'Active',
              evidenceCount: 12,
              indicator: '76% faculty somatic pause modeling under friction',
              strength: 'Strong school-level',
              nextAction: 'Peer coaching walkthroughs',
              dossierRef: 'SEC-4.0-ADULT',
            },
            {
              stage: '3. Classroom Practice',
              status: 'Delivering',
              evidenceCount: 18,
              indicator: '18 of 20 homerooms active; 88% facilitation fidelity',
              strength: 'Reviewed impact evidence',
              nextAction: 'Grade 4 transition focus',
              dossierRef: 'SEC-2.0-ROUTINES',
            },
            {
              stage: '4. Learner Practice',
              status: 'Observed',
              evidenceCount: 42,
              indicator: '84% learners using nuanced weather emotion vocabulary',
              strength: 'Strong school-level',
              nextAction: 'Peer circle mediation',
              dossierRef: 'SEC-3.0-LEARNER',
            },
            {
              stage: '5. Relationships & Culture',
              status: 'Developing',
              evidenceCount: 31,
              indicator: 'High-escalation playground disputes down 64%',
              strength: 'Developing evidence',
              nextAction: 'Staff yard duty calibration',
              dossierRef: 'SEC-5.0-CULTURE',
            },
            {
              stage: '6. Sustainable Change',
              status: 'Institutionalizing',
              evidenceCount: 8,
              indicator: '8/10 sustainability dimensions verified',
              strength: 'Developing evidence',
              nextAction: 'Board budget sign-off',
              dossierRef: 'SEC-6.0-SUSTAINABILITY',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              onClick={() => onNavigateSubpage('dossier-evidence')}
              className="p-4 rounded-xl border border-stone-200/80 bg-[#FAF8F5] hover:bg-stone-50 hover:border-emerald-700/40 transition-all cursor-pointer flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#1B3626] mb-1">
                  <span>{item.stage}</span>
                  <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                    {item.status}
                  </span>
                </div>
                <div className="text-xs font-semibold text-stone-900 leading-snug">
                  {item.indicator}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-200/60 text-[10px] space-y-1">
                <div className="text-stone-500">
                  Strength: <strong>{item.strength}</strong>
                </div>
                <div className="text-emerald-900 font-medium">
                  Next: {item.nextAction}
                </div>
                <div className="text-stone-400 font-mono">
                  {item.evidenceCount} verified records
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. CEQHS 5-DOMAIN DEVELOPMENT WHEEL & VALUES-IN-ACTION STRAND (Section 5.2) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Domain Wheel & Profiles */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  CEQHS Domain Development Wheel
                </h2>
                <span className="px-2 py-0.5 rounded text-[9px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900">
                  Development Profile · Non-Diagnostic
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Multi-level developmental profile across the 5 core domains. Domains are interrelated competencies, not isolated clinical traits.
              </p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            {SWATARA_DOMAIN_WHEEL.map((dom) => (
              <div
                key={dom.domain}
                className="p-4 rounded-xl border border-stone-200/80 bg-[#FAF8F5] space-y-2 hover:bg-white hover:border-emerald-700/40 transition-all"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-stone-900 text-xs">{dom.domain}</h3>
                    <span className="text-[10px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                      {dom.evidenceStrength}
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-600 font-medium">
                    Baseline: <span className="font-bold text-stone-500">{dom.baseline} / 5.0</span> → Midline:{' '}
                    <span className="font-bold text-emerald-800">{dom.current} / 5.0</span>
                  </div>
                </div>

                {/* Visual Progress Meter (Baseline vs Current) */}
                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden relative">
                  <div
                    className="bg-stone-400 h-full absolute left-0 top-0 opacity-40"
                    style={{ width: `${(dom.baseline / 5) * 100}%` }}
                    title={`Baseline: ${dom.baseline}/5`}
                  />
                  <div
                    className="bg-[#1B3626] h-full rounded-full transition-all"
                    style={{ width: `${(dom.current / 5) * 100}%` }}
                    title={`Current: ${dom.current}/5`}
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-[11px] text-stone-600 gap-2 pt-1">
                  <div className="text-stone-700 font-medium">
                    {dom.indicatorHighlight}
                  </div>
                  <div className="text-stone-400 font-mono text-[10px] shrink-0">
                    {dom.evidenceCount} verified artifacts
                  </div>
                </div>

                <div className="text-[10px] text-stone-500 italic bg-white p-2 rounded-lg border border-stone-200/60">
                  <strong>Restraint Note:</strong> {dom.cautionaryNote}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Values-in-Action Cross-Cutting Application Strand */}
        <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-purple-100 text-purple-900">
                Application Strand
              </span>
              <span className="text-xs text-stone-500 font-medium">Real Community Proving Ground</span>
            </div>

            <h2 className="text-base font-bold text-stone-900 leading-snug">
              {SWATARA_VALUES_IN_ACTION.strandTitle}
            </h2>

            <p className="text-xs text-stone-600 leading-relaxed">
              {SWATARA_VALUES_IN_ACTION.description}
            </p>

            <div className="space-y-3 pt-2">
              {SWATARA_VALUES_IN_ACTION.activeProjects.map((proj, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-xl bg-[#FAF8F5] border border-stone-200/70 space-y-1.5"
                >
                  <div className="flex items-center justify-between">
                    <h3 className="text-xs font-bold text-stone-900">{proj.title}</h3>
                    <span className="text-[10px] font-semibold text-purple-900 bg-purple-50 px-2 py-0.5 rounded">
                      {proj.reach}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600">{proj.focus}</p>
                  <div className="text-[10px] text-stone-400 font-mono pt-1">
                    Artifact: {proj.evidenceArtifact}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100">
            <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-[11px] leading-relaxed">
              <strong>CEQHS Core Principle:</strong> Values-in-Action is never merged into a single mathematical score. It serves as authentic portfolio evidence for Stage 1 accreditation.
            </div>
          </div>
        </div>
      </div>

      {/* 5. RECOMMENDED NEXT ACTIONS FOR SCHOOL MANAGEMENT (Section 3.1 & 7) */}
      <div className="bg-[#FAF8F5] rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-3">
        <h2 className="text-sm font-bold text-stone-900 uppercase tracking-wider">
          Recommended Next Actions for School Management
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-500" />
              1. Grade 4 Homework Friction Coaching
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Post-recess transitions in 2 classrooms show higher latency due to assignment handover. Schedule a 15-minute coaching huddle with the lead teacher.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-blue-500" />
              2. Yard Duty Restorative Calibration
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              2 of 5 duty monitors need a quick 10-minute briefing on guiding students through the 4-part Restorative Bench script rather than issuing arbitrary timeouts.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-1.5">
            <div className="font-bold text-stone-900 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              3. Year 2 Sustainability Covenant
            </div>
            <p className="text-stone-600 text-[11px] leading-relaxed">
              Present the approved Term 1 Evidence Summary to the Board of Directors to finalize ringfenced funding for acoustic chime refreshes and facilitator release time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
