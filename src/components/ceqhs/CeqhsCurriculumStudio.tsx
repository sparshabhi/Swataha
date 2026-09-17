import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Layers,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Plus,
  Edit3,
  ExternalLink,
  ChevronRight,
  Info,
  AlertTriangle,
  Eye,
  FileCheck,
} from 'lucide-react';
import {
  CurriculumAlignmentMapping,
  PrimaryCurriculumType,
  MappingStatus,
  CEQHSPracticeDefinition,
} from '../../types/ceqhsGovernance';
import {
  OFFICIAL_CURRICULUM_FRAMEWORKS,
  OFFICIAL_PHASES,
  OFFICIAL_PRACTICES,
} from '../../data/ceqhsCurriculumBaseline';
import { CeqhsCurriculumDraftModal } from './CeqhsCurriculumDraftModal';

interface CeqhsCurriculumStudioProps {
  mappings: CurriculumAlignmentMapping[];
  onUpdateMappingStatus: (mappingId: string, newStatus: MappingStatus) => void;
  onAddMapping: (mapping: CurriculumAlignmentMapping) => void;
}

export const CeqhsCurriculumStudio: React.FC<CeqhsCurriculumStudioProps> = ({
  mappings,
  onUpdateMappingStatus,
  onAddMapping,
}) => {
  const [selectedFramework, setSelectedFramework] = useState<PrimaryCurriculumType>(
    'International Baccalaureate (IB)'
  );
  const [activeTab, setActiveTab] = useState<'mappings' | 'practices' | 'frameworks'>('mappings');
  const [isDraftModalOpen, setIsDraftModalOpen] = useState<boolean>(false);

  const filteredMappings = mappings.filter(
    (m) => m.frameworkName === selectedFramework
  );

  const [selectedMappingId, setSelectedMappingId] = useState<string | null>(
    filteredMappings[0]?.id || mappings[0]?.id || null
  );

  // Switch framework and immediately reset selectedMappingId to the first mapping of the selected framework
  const handleSelectFramework = (frameworkName: PrimaryCurriculumType) => {
    setSelectedFramework(frameworkName);
    const newFiltered = mappings.filter((m) => m.frameworkName === frameworkName);
    setSelectedMappingId(newFiltered[0]?.id || null);
  };

  // Ensure selectedMapping is ALWAYS bound to a mapping in the currently active framework
  const selectedMapping =
    filteredMappings.find((m) => m.id === selectedMappingId) || filteredMappings[0] || null;

  // Auto-sync selectedMappingId whenever the framework or filtered mappings change
  useEffect(() => {
    if (filteredMappings.length > 0 && !filteredMappings.some((m) => m.id === selectedMappingId)) {
      setSelectedMappingId(filteredMappings[0].id);
    } else if (filteredMappings.length === 0) {
      setSelectedMappingId(null);
    }
  }, [selectedFramework, filteredMappings, selectedMappingId]);

  const currentFrameworkObj = OFFICIAL_CURRICULUM_FRAMEWORKS.find(
    (f) => f.name === selectedFramework
  );

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-xl border border-stone-200/80 p-5 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-[#EAF0EB] flex items-center justify-center text-[#1B3626] shrink-0 border border-[#2D5A3D]/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-stone-900">
                  Curriculum Alignment Framework (Grades 1–5)
                </h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-[#1B3626] text-white">
                  Versioned Mapping Layer
                </span>
              </div>
              <p className="text-xs text-stone-600 mt-1">
                Configure, validate, and govern practice-to-outcome mappings across IB, Oxford, Cambridge, and Nepal National Curriculum. Only Founder Saugat Singh can approve official alignments for pilot schools.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => setIsDraftModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
            >
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Draft Alignment (Assistant)</span>
            </button>
            <div className="text-xs px-3 py-2 rounded-xl bg-stone-100 font-medium text-stone-700">
              {mappings.length} Active Mappings
            </div>
          </div>
        </div>

        {/* Primary Curriculum Framework Filter */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 mt-4 border-t border-stone-100 text-xs">
          {OFFICIAL_CURRICULUM_FRAMEWORKS.map((fw) => {
            const isSelected = selectedFramework === fw.name;
            return (
              <button
                key={fw.id}
                onClick={() => handleSelectFramework(fw.name)}
                className={`p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-[#1B3626] text-white border-[#1B3626] shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                }`}
              >
                <div className="flex items-center justify-between font-bold text-xs">
                  <span>{fw.shortCode}</span>
                  <span className={`text-[10px] ${isSelected ? 'text-stone-300' : 'text-stone-400'}`}>
                    Grades 1–5
                  </span>
                </div>
                <div className="font-semibold text-xs mt-0.5 truncate">{fw.name}</div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Tabs: Mappings vs Practice Definitions */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('mappings')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'mappings'
              ? 'bg-[#1B3626] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Outcome Alignments ({filteredMappings.length})
        </button>
        <button
          onClick={() => setActiveTab('practices')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'practices'
              ? 'bg-[#1B3626] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Grade 1–5 Practices & Adaptations ({OFFICIAL_PRACTICES.length})
        </button>
        <button
          onClick={() => setActiveTab('frameworks')}
          className={`px-3 py-1.5 rounded-lg transition-colors ${
            activeTab === 'frameworks'
              ? 'bg-[#1B3626] text-white'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          Framework Disclaimer & Terms
        </button>
      </div>

      {/* TAB 1: Outcome Alignments */}
      {activeTab === 'mappings' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Mappings List */}
          <div className="lg:col-span-5 space-y-3">
            <div className="text-xs font-semibold text-stone-500 uppercase tracking-wider px-1">
              Mappings for {selectedFramework} ({filteredMappings.length})
            </div>

            {filteredMappings.length === 0 ? (
              <div className="p-8 text-center bg-white rounded-xl border border-stone-200 text-stone-500 text-xs">
                No mappings registered yet for {selectedFramework}.
              </div>
            ) : (
              filteredMappings.map((map) => {
                const isSelected = selectedMapping?.id === map.id;
                return (
                  <div
                    key={map.id}
                    onClick={() => setSelectedMappingId(map.id)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-white border-[#2D5A3D] ring-1 ring-[#2D5A3D]/40 shadow-xs'
                        : 'bg-white/80 border-stone-200/80 hover:bg-white hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {map.connectionTypeLabel}
                      </span>
                      <span
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                          map.mappingStatus === 'Approved for pilot use'
                            ? 'bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20'
                            : 'bg-stone-100 text-stone-700'
                        }`}
                      >
                        {map.mappingStatus}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-stone-900 mt-2">
                      {map.ceqhsPracticeName}
                    </h4>
                    <p className="text-[11px] text-stone-600 mt-0.5">
                      ↔ {map.outcomeReferenceCode}: {map.outcomeTitle}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 text-[10px] text-stone-500 font-mono">
                      <span>Scope: {map.gradeRange}</span>
                      <span>Phase {map.ceqhsPhaseNumber}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Right Column: Mapping Detail Inspector & Actions */}
          <div className="lg:col-span-7">
            {selectedMapping ? (
              <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-5 shadow-xs text-xs">
                <div className="flex items-start justify-between gap-3 border-b border-stone-200 pb-4">
                  <div>
                    <span className="text-[10px] font-mono text-stone-500 uppercase tracking-wide">
                      Mapping ID: {selectedMapping.id} · v{selectedMapping.version}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-0.5">
                      {selectedMapping.ceqhsPracticeName} ↔ {selectedMapping.outcomeTitle}
                    </h3>
                    <div className="text-xs font-semibold text-[#1B3626] mt-0.5">
                      {selectedMapping.frameworkName} · {selectedMapping.connectionTypeLabel}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {selectedMapping.evidenceTierLabel && (
                      <span
                        className={`px-2.5 py-1 rounded text-[11px] font-bold ${
                          selectedMapping.evidenceTier === 'Tier 1'
                            ? 'bg-blue-50 text-blue-800 border border-blue-200'
                            : selectedMapping.evidenceTier === 'Tier 2'
                            ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                            : selectedMapping.evidenceTier === 'Tier 3'
                            ? 'bg-amber-100 text-amber-900 border border-amber-300'
                            : 'bg-purple-50 text-purple-800 border border-purple-200'
                        }`}
                      >
                        {selectedMapping.evidenceTierLabel}
                      </span>
                    )}
                    {selectedMapping.alignmentType && (
                      <span className="px-2 py-1 rounded text-[11px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                        {selectedMapping.alignmentType}
                      </span>
                    )}
                    <span className="px-2.5 py-1 rounded text-xs font-semibold bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
                      {selectedMapping.mappingStatus}
                    </span>
                  </div>
                </div>

                {/* Internal Only Warning for Tier 3 */}
                {(selectedMapping.evidenceTier === 'Tier 3' || selectedMapping.isInternalOnly) && (
                  <div className="p-3 rounded-lg bg-amber-100/90 border border-amber-300 text-amber-900 font-bold text-xs flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
                    <span>⚠️ INTERNAL ONLY — Do not display in school-facing views.</span>
                  </div>
                )}

                {/* Alignment Explanation */}
                <div className="bg-stone-50 rounded-xl p-4 border border-stone-200/80 space-y-2">
                  <div className="font-bold text-stone-900 flex items-center justify-between">
                    <div className="flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-700" />
                      Pedagogical Rationale & Hypothesised Connection
                    </div>
                    <span className="text-[10px] font-normal text-stone-500">
                      {selectedMapping.alignmentExplanation.split(/\s+/).filter(Boolean).length} words
                    </span>
                  </div>
                  <p className="text-stone-700 text-xs leading-relaxed">
                    {selectedMapping.alignmentExplanation}
                  </p>
                </div>

                {/* Verbatim Framework Outcome if available */}
                {selectedMapping.frameworkOutcomeVerbatim && (
                  <div className="p-3 rounded-lg bg-stone-50 border border-stone-200 text-stone-800">
                    <span className="text-[10px] uppercase font-bold text-stone-500 block mb-1">
                      Verbatim Framework Outcome
                    </span>
                    <p className="italic font-serif text-xs text-stone-900">
                      "{selectedMapping.frameworkOutcomeVerbatim}"
                    </p>
                  </div>
                )}

                {/* Indicators of Working & Disconfirming Indicators */}
                {((selectedMapping.indicatorsOfWorking && selectedMapping.indicatorsOfWorking.length > 0) ||
                  (selectedMapping.disconfirmingIndicators && selectedMapping.disconfirmingIndicators.length > 0)) && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {selectedMapping.indicatorsOfWorking && selectedMapping.indicatorsOfWorking.length > 0 && (
                      <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200 text-emerald-900">
                        <span className="text-[10px] uppercase font-bold block mb-1.5 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                          Indicators of Working (Classroom)
                        </span>
                        <ul className="space-y-1 text-[11px] list-disc list-inside">
                          {selectedMapping.indicatorsOfWorking.map((ind, i) => (
                            <li key={i}>{ind}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {selectedMapping.disconfirmingIndicators && selectedMapping.disconfirmingIndicators.length > 0 && (
                      <div className="p-3 rounded-lg bg-red-50/70 border border-red-200 text-red-900">
                        <span className="text-[10px] uppercase font-bold block mb-1.5 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5 text-red-700" />
                          Disconfirming Indicators
                        </span>
                        <ul className="space-y-1 text-[11px] list-disc list-inside">
                          {selectedMapping.disconfirmingIndicators.map((ind, i) => (
                            <li key={i}>{ind}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}

                {/* Cross-Anchor Overlap Check if available */}
                {selectedMapping.crossAnchorSimilarityScore !== undefined && (
                  <div
                    className={`p-3 rounded-lg border text-[11px] flex items-center justify-between ${
                      selectedMapping.crossAnchorSimilarityScore > 40
                        ? 'bg-amber-50 border-amber-300 text-amber-900'
                        : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <FileCheck className="w-4 h-4 shrink-0" />
                      <span>
                        Cross-Anchor Vocabulary Overlap:{' '}
                        <strong>{selectedMapping.crossAnchorSimilarityScore}%</strong>{' '}
                        {selectedMapping.crossAnchorSimilarityScore > 40
                          ? '(Above 40% Threshold — Review for Substitution Test)'
                          : '(Anchor-Specific Language Confirmed)'}
                      </span>
                    </div>
                  </div>
                )}

                {/* Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div className="p-3 rounded-lg border border-stone-200 bg-white">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">
                      Outcome Domain
                    </span>
                    <span className="font-semibold text-stone-900">
                      {selectedMapping.outcomeDomainName}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 bg-white">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">
                      Outcome Reference Code
                    </span>
                    <span className="font-mono font-bold text-[#1B3626]">
                      {selectedMapping.outcomeReferenceCode}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 bg-white">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">
                      Grade Scope
                    </span>
                    <span className="font-semibold text-stone-900">{selectedMapping.gradeRange}</span>
                  </div>

                  <div className="p-3 rounded-lg border border-stone-200 bg-white">
                    <span className="text-stone-500 block text-[10px] uppercase font-bold">
                      CEQHS Phase
                    </span>
                    <span className="font-semibold text-stone-900">
                      Phase {selectedMapping.ceqhsPhaseNumber}: {selectedMapping.ceqhsPhaseName}
                    </span>
                  </div>
                </div>

                {/* Source Reference Note */}
                <div className="p-3 rounded-lg bg-amber-50/60 border border-amber-200 text-amber-900 text-[11px]">
                  <span className="font-bold block">Documented Source Reference:</span>
                  <span className="font-mono">{selectedMapping.sourceReference}</span>
                </div>

                {/* Super Admin Approval Actions */}
                <div className="border-t border-stone-200 pt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="text-[11px] text-stone-500">
                    Approved by: <strong>{selectedMapping.approvedBy || 'Pending Founder Review'}</strong>
                  </div>

                  <div className="flex items-center gap-2">
                    {selectedMapping.mappingStatus !== 'Approved for pilot use' && (
                      <button
                        onClick={() =>
                          onUpdateMappingStatus(selectedMapping.id, 'Approved for pilot use')
                        }
                        className="px-3.5 py-1.5 rounded-lg bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-bold transition-colors shadow-xs"
                      >
                        Approve for Pilot Use
                      </button>
                    )}
                    {selectedMapping.mappingStatus !== 'Needs revision' && (
                      <button
                        onClick={() =>
                          onUpdateMappingStatus(selectedMapping.id, 'Needs revision')
                        }
                        className="px-3 py-1.5 rounded-lg bg-amber-100 hover:bg-amber-200 text-amber-900 text-xs font-semibold transition-colors"
                      >
                        Mark Needs Revision
                      </button>
                    )}
                    {selectedMapping.mappingStatus !== 'Retired' && (
                      <button
                        onClick={() => onUpdateMappingStatus(selectedMapping.id, 'Retired')}
                        className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-semibold transition-colors"
                      >
                        Retire Mapping
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-stone-200 p-8 text-center text-stone-500 text-xs">
                Select a mapping from the list to inspect details.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Practices & Adaptations */}
      {activeTab === 'practices' && (
        <div className="space-y-4">
          <div className="p-4 rounded-xl bg-[#EAF0EB]/50 border border-[#2D5A3D]/20 text-stone-700 text-xs">
            <span className="font-bold text-[#1B3626] block">
              Developmentally Appropriate Practice Design (Grades 1–5)
            </span>
            Every practice includes explicit, developmentally grounded adaptations for Foundation (Grade 1–2), Developing (Grade 3–4), and Transition (Grade 5).
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {OFFICIAL_PRACTICES.map((practice) => (
              <div
                key={practice.id}
                className="bg-white rounded-xl border border-stone-200/80 p-5 space-y-3.5 shadow-xs text-xs"
              >
                <div className="flex items-start justify-between gap-2 border-b border-stone-100 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-stone-500 uppercase tracking-wide">
                      {practice.phaseName}
                    </span>
                    <h3 className="text-sm font-bold text-stone-900 mt-0.5">
                      {practice.name}
                    </h3>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
                    Phase {practice.phaseNumber}
                  </span>
                </div>

                <p className="text-stone-700 text-xs leading-relaxed">
                  {practice.purpose}
                </p>

                {/* 3 Developmental Adaptations */}
                <div className="space-y-2 pt-1">
                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-800 text-[11px] block">
                      Foundation Band (Grade 1–2):
                    </span>
                    <span className="text-stone-600 text-[11px]">{practice.adaptationsFoundation}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-800 text-[11px] block">
                      Developing Band (Grade 3–4):
                    </span>
                    <span className="text-stone-600 text-[11px]">{practice.adaptationsDeveloping}</span>
                  </div>

                  <div className="p-2.5 rounded-lg bg-stone-50 border border-stone-200">
                    <span className="font-bold text-stone-800 text-[11px] block">
                      Transition Band (Grade 5):
                    </span>
                    <span className="text-stone-600 text-[11px]">{practice.adaptationsTransition}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span>Duration: {practice.suggestedDuration}</span>
                  <span className="font-mono">Approved v{practice.version}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: Framework Disclaimer & Standards Terms */}
      {activeTab === 'frameworks' && currentFrameworkObj && (
        <div className="bg-white rounded-xl border border-stone-200/80 p-6 space-y-4 text-xs">
          <div className="flex items-center gap-2 font-bold text-stone-900 text-sm">
            <Info className="w-4 h-4 text-[#2D5A3D]" />
            <span>{currentFrameworkObj.name} Framework Charter & Boundary Notice</span>
          </div>

          <p className="text-stone-700 leading-relaxed">
            {currentFrameworkObj.description}
          </p>

          <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 space-y-2">
            <span className="font-bold block">Official Disclaimer & Hypotheses Rule</span>
            <p className="leading-relaxed">
              {currentFrameworkObj.disclaimer}
            </p>
          </div>

          <div className="pt-2">
            <h4 className="font-bold text-stone-800 mb-2">Configured Outcome Domains</h4>
            <div className="space-y-2">
              {currentFrameworkObj.outcomeDomains.map((dom) => (
                <div key={dom.id} className="p-3 rounded-lg border border-stone-200 bg-stone-50">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-stone-900">{dom.name}</span>
                    <span className="font-mono text-stone-500 text-[11px]">{dom.code}</span>
                  </div>
                  <p className="text-stone-600 mt-1">{dom.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Curriculum Alignment Assistant Modal */}
      <CeqhsCurriculumDraftModal
        isOpen={isDraftModalOpen}
        onClose={() => setIsDraftModalOpen(false)}
        existingMappings={mappings}
        onAddMapping={onAddMapping}
        defaultFramework={selectedFramework}
      />
    </div>
  );
};
