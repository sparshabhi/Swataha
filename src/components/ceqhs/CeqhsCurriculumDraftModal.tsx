import React, { useState } from 'react';
import {
  Sparkles,
  X,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
  FileText,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  ArrowRight,
  Info,
} from 'lucide-react';
import {
  CurriculumAlignmentMapping,
  PrimaryCurriculumType,
} from '../../types/ceqhsGovernance';
import {
  OFFICIAL_CURRICULUM_FRAMEWORKS,
  OFFICIAL_PRACTICES,
} from '../../data/ceqhsCurriculumBaseline';
import {
  checkCrossAnchorRationaleSimilarity,
  evaluateThreeRationaleTests,
  verifyClaimLanguage,
  SimilarityCheckResult,
  ThreeTestsCheckResult,
  ClaimLanguageCheckResult,
} from '../../utils/curriculumAlignmentSimilarity';

interface CeqhsCurriculumDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  existingMappings: CurriculumAlignmentMapping[];
  onAddMapping: (mapping: CurriculumAlignmentMapping) => void;
  defaultFramework?: PrimaryCurriculumType;
}

export const CeqhsCurriculumDraftModal: React.FC<CeqhsCurriculumDraftModalProps> = ({
  isOpen,
  onClose,
  existingMappings,
  onAddMapping,
  defaultFramework = 'International Baccalaureate (IB)',
}) => {
  const [selectedPracticeName, setSelectedPracticeName] = useState(
    OFFICIAL_PRACTICES[0]?.name || 'Daily Emotion Weather Check-In'
  );
  const [selectedAnchor, setSelectedAnchor] = useState<PrimaryCurriculumType>(defaultFramework);
  const [gradeScope, setGradeScope] = useState<string>('Grades 1–3');
  const [phaseNumber, setPhaseNumber] = useState<number>(1);
  const [frameworkOutcome, setFrameworkOutcome] = useState<string>('');
  const [sourceCitation, setSourceCitation] = useState<string>('');
  const [founderNotes, setFounderNotes] = useState<string>('');

  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedDraftText, setGeneratedDraftText] = useState<string>('');
  const [parsedRecord, setParsedRecord] = useState<any | null>(null);
  const [similarityResult, setSimilarityResult] = useState<SimilarityCheckResult | null>(null);
  const [threeTestsResult, setThreeTestsResult] = useState<ThreeTestsCheckResult | null>(null);
  const [claimLanguageResult, setClaimLanguageResult] = useState<ClaimLanguageCheckResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg(null);
    setCopied(false);

    try {
      const response = await fetch('/api/curriculum/draft-mapping', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          practiceName: selectedPracticeName,
          curriculumAnchor: selectedAnchor,
          gradeScope,
          phaseNumber,
          frameworkOutcome: frameworkOutcome.trim() || undefined,
          sourceCitation: sourceCitation.trim() || undefined,
          notes: founderNotes.trim() || undefined,
          existingMappings: existingMappings.map((m) => ({
            id: m.id,
            frameworkName: m.frameworkName,
            ceqhsPracticeName: m.ceqhsPracticeName,
            alignmentExplanation: m.alignmentExplanation,
          })),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate curriculum alignment draft.');
      }

      setGeneratedDraftText(data.draftText);
      setParsedRecord(data.parsedRecord);

      // Automated Code Check 1: Cross-Anchor Overlap Similarity Check
      const rationaleText = data.parsedRecord?.alignmentExplanation || data.draftText;
      const simCheck = checkCrossAnchorRationaleSimilarity(
        rationaleText,
        selectedAnchor,
        existingMappings
      );
      setSimilarityResult(simCheck);

      // Automated Code Check 2: Three Rationale Tests
      const testsCheck = evaluateThreeRationaleTests(
        rationaleText,
        selectedAnchor,
        data.parsedRecord?.sourceReference || sourceCitation
      );
      setThreeTestsResult(testsCheck);

      // Automated Code Check 3: Claim Language Violations
      const claimsCheck = verifyClaimLanguage(rationaleText + ' ' + data.draftText);
      setClaimLanguageResult(claimsCheck);
    } catch (err: any) {
      console.error('Draft generation error:', err);
      setErrorMsg(err.message || 'Error communicating with Curriculum Alignment Assistant.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSaveDraft = () => {
    if (!parsedRecord) return;

    const newMapping: CurriculumAlignmentMapping = {
      id: parsedRecord.id || `ceqhs-map-${Date.now().toString().slice(-4)}`,
      frameworkName: selectedAnchor,
      jurisdiction:
        selectedAnchor === 'International Baccalaureate (IB)'
          ? 'IB PYP Global'
          : selectedAnchor === 'Oxford Curriculum'
          ? 'Oxford International Curriculum'
          : selectedAnchor === 'Cambridge Curriculum'
          ? 'Cambridge Primary'
          : 'NCF 2076 / CDC Nepal',
      gradeRange: gradeScope,
      outcomeDomainName:
        selectedAnchor === 'International Baccalaureate (IB)'
          ? 'Approaches to Learning (ATL) - Self-Management'
          : selectedAnchor === 'Oxford Curriculum'
          ? 'Oxford Wellbeing Scheme of Work'
          : selectedAnchor === 'Cambridge Curriculum'
          ? 'Cambridge Learner Attributes'
          : 'NCF 2076 Human Values & Holistic Development',
      outcomeReferenceCode: parsedRecord.displayId || 'DRAFT-ALIGN',
      outcomeTitle: parsedRecord.frameworkOutcomeVerbatim || 'Outcome Alignment Under Review',
      frameworkOutcomeVerbatim: parsedRecord.frameworkOutcomeVerbatim,
      ceqhsPracticeId: `practice-${selectedPracticeName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      ceqhsPracticeName: selectedPracticeName,
      ceqhsPhaseNumber: phaseNumber,
      ceqhsPhaseName: `Phase ${phaseNumber}`,
      alignmentExplanation: parsedRecord.alignmentExplanation || generatedDraftText,
      connectionTypeLabel:
        selectedAnchor === 'Oxford Curriculum'
          ? 'Oxford / Wellbeing contextual alignment'
          : `${selectedAnchor.split(' ')[0]} / Outcome alignment`,
      alignmentType: parsedRecord.alignmentType || 'Contributing',
      evidenceTier: parsedRecord.evidenceTier || 'Tier 2',
      evidenceTierLabel: parsedRecord.evidenceTierLabel,
      indicatorsOfWorking: parsedRecord.indicatorsOfWorking || [],
      disconfirmingIndicators: parsedRecord.disconfirmingIndicators || [],
      crossAnchorSimilarityScore: similarityResult?.maxSimilarityPercentage,
      crossAnchorWarning: similarityResult?.exceedsThreshold ? similarityResult.statusMessage : undefined,
      isInternalOnly: parsedRecord.isInternalOnly || parsedRecord.evidenceTier === 'Tier 3',
      confidenceStatus: parsedRecord.evidenceTier === 'Tier 3' ? 'Hypothesis under review' : 'High',
      mappingStatus: 'Draft', // All new mappings strictly start as Draft per governance rules
      sourceReference: parsedRecord.sourceReference || 'Primary Curriculum Framework Documentation',
      createdBy: 'Curriculum Alignment Assistant (Reviewed by Saugat Singh)',
      version: 1,
    };

    onAddMapping(newMapping);
    onClose();
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedDraftText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl border border-stone-200 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B3626] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-stone-900">
                  CEQHS Curriculum Alignment Assistant
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
                  System Prompt v1.0 Active
                </span>
              </div>
              <p className="text-xs text-stone-500 mt-0.5">
                Internal tool for Founder Saugat Singh Saud · Enforces Three Rationale Tests, Claim Language, and Automated Similarity Guardrails
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
          {/* Top Notice */}
          <div className="p-3.5 rounded-xl bg-[#EAF0EB]/70 border border-[#2D5A3D]/20 flex items-start gap-3">
            <Info className="w-4 h-4 text-[#1B3626] shrink-0 mt-0.5" />
            <div className="text-stone-700 leading-relaxed text-[11.5px]">
              <strong>Governance Rule:</strong> All mappings generated by this assistant start in <strong>Status: Draft</strong>. Only Founder Saugat Singh may promote an alignment to <em>Approved for pilot use</em>. All outputs strictly enforce anchor-specific vocabulary and automated similarity checks against other curriculum anchors.
            </div>
          </div>

          {/* Form Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-stone-50 p-4 rounded-xl border border-stone-200">
            {/* Practice Selection */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                CEQHS Practice (Sanskar Curriculum) *
              </label>
              <select
                value={selectedPracticeName}
                onChange={(e) => setSelectedPracticeName(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              >
                {OFFICIAL_PRACTICES.map((p) => (
                  <option key={p.id} value={p.name}>
                    {p.name} (Phase {p.phaseNumber})
                  </option>
                ))}
              </select>
            </div>

            {/* Anchor Selection */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Curriculum Anchor *
              </label>
              <select
                value={selectedAnchor}
                onChange={(e) => {
                  const newAnchor = e.target.value as PrimaryCurriculumType;
                  setSelectedAnchor(newAnchor);
                  if (newAnchor === 'National Curriculum' && gradeScope === 'Grades 1–5') {
                    setGradeScope('Grades 1–3');
                  }
                }}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              >
                {OFFICIAL_CURRICULUM_FRAMEWORKS.map((fw) => (
                  <option key={fw.id} value={fw.name}>
                    {fw.name} ({fw.shortCode})
                  </option>
                ))}
              </select>
            </div>

            {/* Grade Scope */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                Grade Scope *
              </label>
              <select
                value={gradeScope}
                onChange={(e) => setGradeScope(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              >
                {selectedAnchor === 'National Curriculum' ? (
                  <>
                    <option value="Grades 1–3">Grades 1–3 (Integrated Curriculum: Hamro Serofero)</option>
                    <option value="Grades 4–5">Grades 4–5 (Subject: Social Studies & Human Values)</option>
                  </>
                ) : (
                  <>
                    <option value="Grades 1–3">Grades 1–3 (Foundation / Developing)</option>
                    <option value="Grades 1–5">Grades 1–5 (Full Primary Pilot Scope)</option>
                    <option value="Grades 3–5">Grades 3–5 (Developing / Transition)</option>
                  </>
                )}
              </select>
            </div>

            {/* CEQHS Phase */}
            <div>
              <label className="block font-bold text-stone-700 mb-1">
                CEQHS Implementation Phase *
              </label>
              <select
                value={phaseNumber}
                onChange={(e) => setPhaseNumber(parseInt(e.target.value))}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              >
                <option value={1}>Phase 1: Emotional Awareness & Safe Climate</option>
                <option value={2}>Phase 2: Regulation & Responsive Choice</option>
                <option value={3}>Phase 3: Relational Skill & Peer Community</option>
                <option value={4}>Phase 4: Reflective Inquiry & Metacognition</option>
                <option value={5}>Phase 5: Whole-School Living Culture</option>
              </select>
            </div>

            {/* Source Outcome */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">
                Framework Outcome (Verbatim if already located, optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Managing state of mind: mindfulness, resilience, self-motivation..."
                value={frameworkOutcome}
                onChange={(e) => setFrameworkOutcome(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              />
            </div>

            {/* Source Citation */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">
                Source Document Citation (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. IB Primary Years Programme: The Learner · IBO · 2018 · Approaches to Learning"
                value={sourceCitation}
                onChange={(e) => setSourceCitation(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              />
            </div>

            {/* Founder Context / Notes */}
            <div className="sm:col-span-2">
              <label className="block font-bold text-stone-700 mb-1">
                Founder Review Notes / Classroom Context (Optional)
              </label>
              <textarea
                rows={2}
                placeholder="Any special nuance or classroom observations for Saugat Singh's review..."
                value={founderNotes}
                onChange={(e) => setFounderNotes(e.target.value)}
                className="w-full p-2.5 rounded-lg border border-stone-300 bg-white font-medium text-stone-900 focus:border-[#1B3626] focus:ring-1 focus:ring-[#1B3626]"
              />
            </div>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-between">
            <div className="text-[11px] text-stone-500">
              Calls Gemini via server API with the exact CEQHS Curriculum Alignment System Prompt
            </div>
            <button
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-5 py-2.5 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white font-bold flex items-center gap-2 transition-all shadow-xs disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Drafting Alignment Record...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-emerald-300" />
                  <span>Draft Alignment Mapping</span>
                </>
              )}
            </button>
          </div>

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-800 flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Result Section */}
          {generatedDraftText && (
            <div className="space-y-4 pt-4 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-[#1B3626]" />
                  <span>Generated CEQHS Mapping Draft</span>
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={copyToClipboard}
                    className="px-3 py-1.5 rounded-lg border border-stone-300 hover:bg-stone-100 text-stone-700 font-semibold flex items-center gap-1.5 transition-colors"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Draft</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={handleSaveDraft}
                    className="px-4 py-1.5 rounded-lg bg-[#1B3626] hover:bg-[#2D5A3D] text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                    <span>Save to Mappings (Draft)</span>
                  </button>
                </div>
              </div>

              {/* Automated Quality & Similarity Guardrail Results */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {/* 1. Cross-Anchor Similarity Check */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    similarityResult?.exceedsThreshold
                      ? 'bg-amber-50 border-amber-300 text-amber-900'
                      : 'bg-emerald-50 border-emerald-300 text-emerald-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-bold">
                    <span>Post-Generation Similarity Check</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] ${
                        similarityResult?.exceedsThreshold
                          ? 'bg-amber-200 text-amber-900'
                          : 'bg-emerald-200 text-emerald-900'
                      }`}
                    >
                      {similarityResult?.maxSimilarityPercentage}% Overlap
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed">
                    {similarityResult?.statusMessage}
                  </p>
                  {similarityResult?.overlappingKeywords && similarityResult.overlappingKeywords.length > 0 && (
                    <div className="mt-2 text-[10px] text-stone-600">
                      Shared tokens: {similarityResult.overlappingKeywords.join(', ')}
                    </div>
                  )}
                </div>

                {/* 2. The Three Rationale Tests */}
                <div className="p-3.5 rounded-xl border bg-stone-50 border-stone-200 text-stone-900">
                  <span className="font-bold block mb-1.5">Three Rationale Tests</span>
                  <div className="space-y-1 text-[11px]">
                    <div className="flex items-center gap-1.5">
                      {threeTestsResult?.substitutionTestPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>Substitution Test (Anchor-specific)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {threeTestsResult?.sourceTestPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>Source Test (Verifiable citation)</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      {threeTestsResult?.coordinatorTestPassed ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      )}
                      <span>Coordinator Test (Accurate framing)</span>
                    </div>
                  </div>
                </div>

                {/* 3. Claim Language & Governance */}
                <div
                  className={`p-3.5 rounded-xl border ${
                    claimLanguageResult?.hasForbiddenClaims
                      ? 'bg-red-50 border-red-300 text-red-900'
                      : 'bg-[#EAF0EB] border-[#2D5A3D]/20 text-[#1B3626]'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5 font-bold">
                    <span>Claim Language Guardrails</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-white/80 border border-stone-200">
                      Bounded Language
                    </span>
                  </div>
                  {claimLanguageResult?.hasForbiddenClaims ? (
                    <div className="space-y-1 text-[11px]">
                      <span className="font-semibold block">⚠️ Forbidden claims detected:</span>
                      {claimLanguageResult.violations.map((v, i) => (
                        <p key={i}>• {v}</p>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[11px] leading-relaxed">
                      ✓ Passes claim language checks: No prohibited endorsement phrases, unsupported claims, or ungrounded certainty verbs.
                    </p>
                  )}
                </div>
              </div>

              {/* Exact Formatted Draft Output */}
              <div className="bg-stone-900 text-stone-100 p-5 rounded-xl font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed border border-stone-800 shadow-inner">
                {generatedDraftText}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          <span className="text-[11px] text-stone-500">
            CEQHS Living Journal · Curriculum Alignment Module · Swataha Growth Ventures Pvt. Ltd.
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg border border-stone-300 hover:bg-stone-200 text-stone-700 font-semibold transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
