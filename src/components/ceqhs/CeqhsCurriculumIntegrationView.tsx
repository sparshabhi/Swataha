import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  Layers,
  CheckCircle2,
  Filter,
  ExternalLink,
  ChevronRight,
  Check,
  Info,
  X,
  FileText,
} from 'lucide-react';
import { SWATARA_CORE_SCHOOL } from '../../data/swataraDemoData';

interface CurriculumMappingItem {
  id: string;
  practiceName: string;
  curriculumAnchor: string;
  connectionType: 'Direct connection' | 'Related connection' | 'Implementation hook' | 'CEQHS extension';
  frameworkOutcome: string;
  sourceCitation: string;
  evidenceTier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  status: 'Approved for Pilot' | 'Needs Review' | 'Draft';
  rationale: string;
  indicators: string[];
  disconfirmingIndicators: string[];
  reviewedBy?: string;
}

export const CeqhsCurriculumIntegrationView: React.FC<{
  onOpenDraftModal?: () => void;
}> = ({ onOpenDraftModal }) => {
  const [selectedAnchor, setSelectedAnchor] = useState<
    'IB PYP' | 'Oxford International' | 'Cambridge International' | 'Nepal National (NCF 2076)' | 'Other/Custom'
  >('IB PYP');

  const [filterType, setFilterType] = useState<string>('All');
  const [selectedMapping, setSelectedMapping] = useState<CurriculumMappingItem | null>(null);

  // Mappings conforming strictly to the 14-field specification
  const mappings: Record<string, CurriculumMappingItem[]> = {
    'IB PYP': [
      {
        id: 'CEQHS-MAP-IB-001',
        practiceName: 'Classroom Mindful Micro-Pause',
        curriculumAnchor: 'International Baccalaureate (IB PYP)',
        connectionType: 'Direct connection',
        frameworkOutcome: 'Approaches to Learning (ATL) — Self-Management: Mindfulness and Managing State of Mind',
        sourceCitation: 'IB PYP Principles into Practice: The Learner (ATL Framework, 2018), p. 28',
        evidenceTier: 'Tier 2',
        status: 'Approved for Pilot',
        reviewedBy: 'Saugat Singh Saud (Founder & Lead Architect)',
        rationale: 'Directly aligns with the IB PYP Self-Management skill domain without importing external unapproved assessment metrics. Establishes somatic self-regulation routines.',
        indicators: [
          'Learners initiate a three-breath pause independently when transitioning between tasks.',
          'Teachers report smooth, regulated inquiry focus during unit shifts.',
        ],
        disconfirmingIndicators: [
          'Learners comply mechanically through teacher coercion without genuine calming.',
          'Pauses are skipped due to rushing or curriculum coverage pressure.',
        ],
      },
      {
        id: 'CEQHS-MAP-IB-002',
        practiceName: 'Daily Emotion Weather Check-In',
        curriculumAnchor: 'International Baccalaureate (IB PYP)',
        connectionType: 'Direct connection',
        frameworkOutcome: 'Approaches to Learning (ATL) — Self-Management: Affective Skills (Emotional Literacy)',
        sourceCitation: 'IB PYP Principles into Practice: The Learner, p. 29',
        evidenceTier: 'Tier 1',
        status: 'Approved for Pilot',
        reviewedBy: 'Saugat Singh Saud (Founder & Lead Architect)',
        rationale: 'Provides primary learners with meteorological metaphors to notice internal physiological state without emotional masking.',
        indicators: [
          'Students accurately place their token on the weather board without prompting.',
          'Students describe feelings using nuanced weather terms (e.g. cloudy, brisk, sunny).',
        ],
        disconfirmingIndicators: [
          'Children feel forced to report only "sunny" weather to please the teacher.',
        ],
      },
      {
        id: 'CEQHS-MAP-IB-003',
        practiceName: 'Perspective-Taking Circle',
        curriculumAnchor: 'International Baccalaureate (IB PYP)',
        connectionType: 'Related connection',
        frameworkOutcome: 'Approaches to Learning (ATL) — Social Skills: Interpersonal Relationships & Resolving Conflict',
        sourceCitation: 'IB PYP Principles into Practice: The Learner, p. 30',
        evidenceTier: 'Tier 2',
        status: 'Needs Review',
        rationale: 'Connects collaborative peer inquiry to perspective-taking exercises. Requires internal review to ensure zero overlap with official PYP assessment rubrics.',
        indicators: [
          'Students state another peer’s viewpoint in first person during disagreements.',
        ],
        disconfirmingIndicators: [
          'Students use circle time to vent personal grievances without empathetic listening.',
        ],
      },
    ],
    'Oxford International': [
      {
        id: 'CEQHS-MAP-OX-001',
        practiceName: 'Daily Emotion Weather Check-In',
        curriculumAnchor: 'Oxford International Curriculum',
        connectionType: 'Related connection',
        frameworkOutcome: 'Oxford Wellbeing: Managing Emotions & Physical Health / Self-Knowledge',
        sourceCitation: 'Oxford International Curriculum Wellbeing Framework (Grades 1–5), Scope & Sequence 2021',
        evidenceTier: 'Tier 2',
        status: 'Approved for Pilot',
        reviewedBy: 'Saugat Singh Saud',
        rationale: 'Reinforces timetabled Oxford Wellbeing modules through distributed daily morning advisory practice.',
        indicators: ['Students recognize body cues of emotional elevation.'],
        disconfirmingIndicators: ['Activity is treated as an isolated theoretical lecture.'],
      },
    ],
    'Cambridge International': [
      {
        id: 'CEQHS-MAP-CA-001',
        practiceName: 'Classroom Mindful Micro-Pause',
        curriculumAnchor: 'Cambridge International',
        connectionType: 'Implementation hook',
        frameworkOutcome: 'Cambridge Learner Attributes: Reflective & Engaged (Behavioral Focus)',
        sourceCitation: 'Developing the Cambridge Learner Attributes Guide, Cambridge Assessment International Education',
        evidenceTier: 'Tier 2',
        status: 'Approved for Pilot',
        reviewedBy: 'Saugat Singh Saud',
        rationale: 'Avoids contested EQ theory and grounds practice strictly in observable behavioral attention reset.',
        indicators: ['Learners demonstrate sustained on-task focus following the pause.'],
        disconfirmingIndicators: ['Disruptive transitions persist.'],
      },
    ],
    'Nepal National (NCF 2076)': [
      {
        id: 'CEQHS-MAP-NC-001',
        practiceName: 'Daily Emotion Weather Check-In',
        curriculumAnchor: 'Nepal National Curriculum (NCF 2076)',
        connectionType: 'Direct connection',
        frameworkOutcome: 'Integrated Curriculum Grades 1–3: Hamro Serofero (हाम्रो सेरोफेरो) / Human Values & Life Skills',
        sourceCitation: 'National Curriculum Framework 2076, Curriculum Development Centre, Sanothimi, Bhaktapur',
        evidenceTier: 'Tier 1',
        status: 'Approved for Pilot',
        reviewedBy: 'Saugat Singh Saud',
        rationale: 'Anchors life skills and character values within Hamro Serofero without importing Anglo-centric SEL terminology.',
        indicators: ['विद्यार्थीहरूले आफ्ना भावनाहरू सरल प्राकृतिक बिम्बहरूमा व्यक्त गर्छन्।'],
        disconfirmingIndicators: ['शिक्षकहरूले केवल सैद्धान्तिक ज्ञानमा सीमित राख्छन्।'],
      },
    ],
    'Other/Custom': [
      {
        id: 'CEQHS-MAP-CUST-001',
        practiceName: 'Classroom Mindful Micro-Pause',
        curriculumAnchor: 'Custom School Charter',
        connectionType: 'CEQHS extension',
        frameworkOutcome: 'School Foundational Character & Relational Presence',
        sourceCitation: 'School Operational Charter & Student Wellbeing Code 2026',
        evidenceTier: 'Tier 3',
        status: 'Approved for Pilot',
        reviewedBy: 'CEQHS Program Directorate',
        rationale: 'Tailored for independent institutions that operate a hybrid or indigenous curriculum.',
        indicators: ['Clear transition routines established across homerooms.'],
        disconfirmingIndicators: ['Lack of homeroom teacher adoption.'],
      },
    ],
  };

  const currentList = mappings[selectedAnchor] || [];
  const filteredList = currentList.filter((m) => {
    if (filterType === 'All') return true;
    return m.connectionType === filterType;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 4 &amp; 6.3 Translation Layer
              </span>
              <span className="text-xs text-stone-500 font-medium">
                Core-and-Adapter Architecture
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              CEQHS Curriculum Integration
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Maps universal emotional and human skills practices to curriculum entry points without altering the CEQHS core or creating duplicate assessment systems.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onOpenDraftModal && (
              <button
                onClick={onOpenDraftModal}
                className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Draft New Alignment with AI</span>
              </button>
            )}
          </div>
        </div>

        {/* -------------------------------------------------------------- */}
        {/* CRITICAL CURRICULUM WARNINGS (SECTION 4 & 7 SPECIFICATION)      */}
        {/* -------------------------------------------------------------- */}
        {selectedAnchor === 'Nepal National (NCF 2076)' && (
          <div className="mt-4 p-4 rounded-xl bg-amber-50/90 border border-amber-300/80 text-amber-950 text-xs flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-amber-900">
                CRITICAL NOTICE — CAS (Continuous Assessment System / निरन्तर विद्यार्थी मूल्याङ्कन)
              </strong>
              CAS in Nepal National Curriculum (NCF 2076) strictly means <strong>Continuous Assessment System</strong>. It is NOT Community and Service, nor the IB&apos;s Creativity/Activity/Service. The platform displays this explicit warning to avoid conflation.
            </div>
          </div>
        )}

        {selectedAnchor === 'IB PYP' && (
          <div className="mt-4 p-4 rounded-xl bg-blue-50/90 border border-blue-200 text-blue-950 text-xs flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-800 shrink-0 mt-0.5" />
            <div>
              <strong className="block font-bold text-blue-900">
                GOVERNANCE NOTICE — IB Approaches to Learning (ATL)
              </strong>
              Correct abbreviation is <strong>ATL</strong> (Approaches to Learning) — NEVER write ALT. CEQHS maps primarily to the self-management affective sub-skills cluster. CEQHS is not accredited by or affiliated with the IBO.
            </div>
          </div>
        )}

        {/* Anchor Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-5">
          {[
            'IB PYP',
            'Oxford International',
            'Cambridge International',
            'Nepal National (NCF 2076)',
            'Other/Custom',
          ].map((anchor) => (
            <button
              key={anchor}
              onClick={() => {
                setSelectedAnchor(anchor as any);
                setSelectedMapping(null);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                selectedAnchor === anchor
                  ? 'bg-[#1B3626] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {anchor}
            </button>
          ))}
        </div>
      </div>

      {/* Connection Type Filters */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-xs text-stone-500 font-medium">Connection Type:</span>
          {['All', 'Direct connection', 'Related connection', 'Implementation hook', 'CEQHS extension'].map((t) => (
            <button
              key={t}
              onClick={() => setFilterType(t)}
              className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                filterType === t
                  ? 'bg-stone-800 text-white'
                  : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-50'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Mappings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredList.map((m) => (
          <div
            key={m.id}
            onClick={() => setSelectedMapping(m)}
            className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
              selectedMapping?.id === m.id
                ? 'border-[#1B3626] bg-[#FDFBF7] ring-2 ring-[#1B3626]/20'
                : 'border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs'
            }`}
          >
            <div>
              <div className="flex items-center justify-between gap-2 mb-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500">
                  {m.id}
                </span>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    m.status === 'Approved for Pilot'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {m.status}
                </span>
              </div>

              <h3 className="text-sm font-bold text-stone-900 leading-snug">
                {m.practiceName}
              </h3>

              <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-[#EAF0EB] text-[#1B3626]">
                {m.connectionType}
              </div>

              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-2">
                {m.frameworkOutcome}
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span>{m.evidenceTier}</span>
              <span className="font-semibold text-[#1B3626] flex items-center gap-1">
                Inspect 14 Fields <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Mapping Detail Modal (14 Fields) */}
      {selectedMapping && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {selectedMapping.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-100 text-emerald-800">
                    {selectedMapping.status}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#EAF0EB] text-[#1B3626]">
                    {selectedMapping.evidenceTier}
                  </span>
                </div>
                <h2 className="text-xl font-bold text-stone-900">
                  {selectedMapping.practiceName}
                </h2>
                <div className="text-xs text-stone-500 mt-0.5">
                  Curriculum Anchor: {selectedMapping.curriculumAnchor}
                </div>
              </div>
              <button
                onClick={() => setSelectedMapping(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Verbatim Framework Outcome */}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Framework Outcome (Verbatim)
              </div>
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs font-medium text-stone-800">
                {selectedMapping.frameworkOutcome}
              </div>
            </div>

            {/* Source Citation */}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Source Citation
              </div>
              <div className="text-xs text-stone-600 italic">
                {selectedMapping.sourceCitation}
              </div>
            </div>

            {/* Rationale */}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Alignment Rationale
              </div>
              <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200/60">
                {selectedMapping.rationale}
              </p>
            </div>

            {/* Indicators & Disconfirming Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200/60 space-y-2">
                <div className="text-xs font-bold text-emerald-950 flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                  Indicators of Working
                </div>
                <ul className="text-xs text-emerald-900 space-y-1">
                  {selectedMapping.indicators.map((ind, i) => (
                    <li key={i}>• {ind}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/60 space-y-2">
                <div className="text-xs font-bold text-amber-950 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-amber-700" />
                  Disconfirming Indicators
                </div>
                <ul className="text-xs text-amber-900 space-y-1">
                  {selectedMapping.disconfirmingIndicators.map((dind, i) => (
                    <li key={i}>• {dind}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Governance Signature */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                Reviewed by: <strong className="text-stone-700">{selectedMapping.reviewedBy || 'Pending Review'}</strong>
              </div>
              <button
                onClick={() => setSelectedMapping(null)}
                className="px-4 py-2 bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
