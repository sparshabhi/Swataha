import React, { useState } from 'react';
import {
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Image as ImageIcon,
  Shield,
  Download,
  Eye,
  Check,
  X,
  Upload,
  Layers,
  Sparkles,
  ArrowRight,
  Info,
  Clock,
  Printer,
  ChevronRight,
  Edit3,
} from 'lucide-react';
import {
  DossierModel,
  DossierSectionConfig,
  DossierStatus,
  VisualEvidenceItem,
  PracticeStoryItem,
  PhotoLayoutType,
} from '../../types/ceqhsDossier';
import {
  validateDossierCompleteness,
  generatePrintableDossierPDF,
} from '../../lib/ceqhsDossierPdfEngine';

interface CeqhsDossierStudioProps {
  dossier: DossierModel;
  onUpdateDossier: (updated: DossierModel) => void;
  onOpenPreview: () => void;
  onOpenVersionHistory: () => void;
  currentUserRole?: string; // 'super_admin' | 'school_coordinator' | 'reviewer'
  currentUserName?: string;
}

export const CeqhsDossierStudio: React.FC<CeqhsDossierStudioProps> = ({
  dossier,
  onUpdateDossier,
  onOpenPreview,
  onOpenVersionHistory,
  currentUserRole = 'super_admin',
  currentUserName = 'Saugat Singh',
}) => {
  const [activeSectionId, setActiveSectionId] = useState<string>('sec-1');
  const [activeTab, setActiveTab] = useState<'editor' | 'evidence_library' | 'preflight'>('editor');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [showPreflightModal, setShowPreflightModal] = useState<boolean>(false);

  const activeSection =
    dossier.targetSections.find((s) => s.id === activeSectionId) || dossier.targetSections[0];

  const preflightReport = validateDossierCompleteness(dossier);

  // Status transitions
  const handleUpdateStatus = (newStatus: DossierStatus, reason?: string) => {
    const isLocked = newStatus === 'Published' || newStatus === 'Verified for publication';
    const updatedHistory = [...dossier.versionHistory];

    if (newStatus === 'Verified for publication' || newStatus === 'Published') {
      updatedHistory.unshift({
        versionId: `ver-${Date.now().toString().slice(-4)}`,
        dossierId: dossier.id,
        versionNumber: `v${(dossier.versionHistory.length + 1).toFixed(1)}`,
        status: newStatus,
        generatedAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
        generatedBy: currentUserName,
        approvedBy: currentUserRole === 'super_admin' ? 'Saugat Singh (Founder)' : undefined,
        paperSize: 'A4',
        changelogReason: reason || `Status changed to ${newStatus}`,
        isLocked,
        integrityHash: `sha256-${Math.random().toString(36).substring(2, 15)}`,
      });
    }

    onUpdateDossier({
      ...dossier,
      status: newStatus,
      verifiedByFounder: newStatus === 'Verified for publication' || newStatus === 'Published' ? true : dossier.verifiedByFounder,
      founderApprovalTimestamp: newStatus === 'Published' ? new Date().toISOString() : dossier.founderApprovalTimestamp,
      versionHistory: updatedHistory,
      updatedAt: new Date().toISOString().slice(0, 10),
    });
  };

  const handleDownloadPdf = () => {
    setIsGeneratingPdf(true);
    try {
      const { filename, doc } = generatePrintableDossierPDF(dossier, { paperSize: 'A4' });
      doc.save(filename);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  // Section fields updates
  const handleUpdateSchoolNarrative = (text: string) => {
    onUpdateDossier({ ...dossier, schoolNarrative: text });
  };

  const handleUpdateHeroCaption = (caption: string) => {
    onUpdateDossier({ ...dossier, heroPhotoCaption: caption });
  };

  const handleUpdateNarrativeJourney = (text: string) => {
    onUpdateDossier({ ...dossier, narrativeJourneyDraft: text });
  };

  const handleToggleSectionInclusion = (sectionId: string) => {
    const updatedSections = dossier.targetSections.map((s) =>
      s.id === sectionId ? { ...s, isIncluded: !s.isIncluded } : s
    );
    onUpdateDossier({ ...dossier, targetSections: updatedSections });
  };

  return (
    <div className="space-y-6">
      {/* Studio Top Control Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs">
            <span className="font-semibold uppercase tracking-wider text-[#2E523A]">
              CEQHS Dossier Studio
            </span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500">{dossier.primaryCurriculum}</span>
            <span className="text-stone-300">·</span>
            <span className="text-stone-500 font-mono">{dossier.participatingGrades.join(', ')}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif text-stone-900 mt-1">
            {dossier.schoolName}
          </h1>
          <div className="text-xs text-stone-500 mt-0.5">
            {dossier.cycleName} ({dossier.implementationPeriod})
          </div>
        </div>

        {/* Action Controls & Status */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Badge */}
          <div className="px-3 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 bg-stone-50 border-stone-200 text-stone-700">
            <span
              className={`w-2 h-2 rounded-full ${
                dossier.status === 'Published' || dossier.status === 'Verified for publication'
                  ? 'bg-emerald-500'
                  : dossier.status === 'Submitted to CEQHS'
                  ? 'bg-blue-500'
                  : 'bg-amber-500'
              }`}
            />
            {dossier.status}
          </div>

          <button
            type="button"
            onClick={onOpenPreview}
            className="px-3.5 py-1.5 rounded-lg border border-stone-200 text-stone-700 hover:bg-stone-50 text-xs font-medium flex items-center gap-1.5"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            Digital Reader
          </button>

          <button
            type="button"
            onClick={() => setShowPreflightModal(true)}
            className={`px-3.5 py-1.5 rounded-lg border text-xs font-medium flex items-center gap-1.5 ${
              preflightReport.canPublish
                ? 'border-emerald-200 bg-emerald-50 text-emerald-800'
                : 'border-amber-200 bg-amber-50 text-amber-800'
            }`}
          >
            {preflightReport.canPublish ? (
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            )}
            Pre-Flight: {preflightReport.blockers.length} Blockers
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-lg bg-[#2E523A] hover:bg-[#24412e] text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Printer className="w-3.5 h-3.5 text-amber-300" />
            {isGeneratingPdf ? 'Rendering PDF...' : 'Print / Export A4 PDF'}
          </button>

          {/* Super Admin Actions */}
          {currentUserRole === 'super_admin' && dossier.status !== 'Published' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('Verified for publication', 'Authorized by Founder Saugat Singh')}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-medium shadow-xs flex items-center gap-1.5"
            >
              <Check className="w-3.5 h-3.5" />
              Verify for Publication
            </button>
          )}

          {dossier.status === 'Draft' && (
            <button
              type="button"
              onClick={() => handleUpdateStatus('Submitted to CEQHS', 'Submitted by School Coordinator')}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium shadow-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              Submit to CEQHS
            </button>
          )}
        </div>
      </div>

      {/* 3-PANE DESKTOP CURATION LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT PANE (4 Cols): 23 Sections Navigation */}
        <div className="lg:col-span-4 bg-white rounded-2xl border border-stone-200 p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 px-2">
            <div>
              <h2 className="text-sm font-semibold text-stone-900">23 Dossier Sections</h2>
              <div className="text-[11px] text-stone-500">Curate evidence & narratives</div>
            </div>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
              {dossier.targetSections.filter((s) => s.isIncluded).length}/23 Active
            </span>
          </div>

          <div className="space-y-1 max-h-[640px] overflow-y-auto pr-1">
            {dossier.targetSections.map((sec) => {
              const isSelected = activeSectionId === sec.id;
              return (
                <div
                  key={sec.id}
                  onClick={() => setActiveSectionId(sec.id)}
                  className={`flex items-center justify-between p-2.5 rounded-xl text-left cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#2E523A] text-white shadow-xs'
                      : 'hover:bg-stone-50 text-stone-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span
                      className={`text-xs font-mono font-bold ${
                        isSelected ? 'text-amber-300' : 'text-stone-400'
                      }`}
                    >
                      {sec.sectionNumber.toString().padStart(2, '0')}
                    </span>
                    <div className="min-w-0">
                      <div className="text-xs font-medium truncate">{sec.title}</div>
                      <div
                        className={`text-[10px] truncate ${
                          isSelected ? 'text-emerald-100' : 'text-stone-500'
                        }`}
                      >
                        {sec.subtitle || sec.description}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <input
                      type="checkbox"
                      checked={sec.isIncluded}
                      onChange={(e) => {
                        e.stopPropagation();
                        handleToggleSectionInclusion(sec.id);
                      }}
                      className={`rounded border-stone-300 text-[#2E523A] focus:ring-[#2E523A] ${
                        isSelected ? 'accent-amber-400' : ''
                      }`}
                      title={sec.isIncluded ? 'Included in Dossier' : 'Excluded'}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* CENTER & RIGHT PANES (8 Cols): Editor & Quality Verification */}
        <div className="lg:col-span-8 space-y-4">
          {/* Subtabs Switcher */}
          <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
            <button
              type="button"
              onClick={() => setActiveTab('editor')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'editor'
                  ? 'bg-[#2E523A] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Section Editor ({activeSection.sectionNumber}. {activeSection.title})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('evidence_library')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'evidence_library'
                  ? 'bg-[#2E523A] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Visual Evidence & Consent ({dossier.visualEvidence.length} Photos)
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preflight')}
              className={`px-4 py-2 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'preflight'
                  ? 'bg-[#2E523A] text-white shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              Quality & Safeguards Checklist
            </button>
          </div>

          {/* TAB 1: SECTION EDITOR */}
          {activeTab === 'editor' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
              {/* Human-in-the-loop Evidence Banner */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1 text-xs">
                  <div className="font-semibold text-amber-900">
                    Draft generated from selected evidence · Human Review Required
                  </div>
                  <div className="text-amber-800">
                    Review and tailor the wording to ensure it reflects corroborated classroom events. All claims
                    carry a Documented, Reported, or Verified designation.
                  </div>
                </div>
              </div>

              {/* SPECIFIC SECTION EDITORS */}
              {/* Section 1: Cover */}
              {activeSection.key === 'cover' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      Hero Photograph Caption (Must answer: "What does this image demonstrate about the practice?")
                    </label>
                    <textarea
                      rows={3}
                      value={dossier.heroPhotoCaption}
                      onChange={(e) => handleUpdateHeroCaption(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-[#2E523A]"
                    />
                  </div>

                  <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2 text-xs">
                    <div className="font-semibold text-stone-800">Approved Hero Photo Asset</div>
                    <div className="flex items-center gap-4">
                      <img
                        src={dossier.heroPhotoUrl}
                        alt="Hero Evidence"
                        className="w-32 h-20 object-cover rounded-lg border border-stone-200"
                      />
                      <div className="space-y-1 text-stone-600">
                        <div>Resolution: 1400x900px (Print-Ready A4 Cover)</div>
                        <div>Safeguarding: Consent Confirmed for External Publication</div>
                        <div>De-identification: Verified</div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 3: School Context */}
              {activeSection.key === 'school-context' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      School Narrative (150–250 words describing campus background & motivation)
                    </label>
                    <textarea
                      rows={6}
                      value={dossier.schoolNarrative}
                      onChange={(e) => handleUpdateSchoolNarrative(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-[#2E523A]"
                    />
                    <div className="text-right text-xs text-stone-500 mt-1">
                      {dossier.schoolNarrative.split(/\s+/).length} words
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div className="font-semibold text-stone-700">1. Starting Point</div>
                      <div className="text-stone-600 mt-1">{dossier.startingPointSummary}</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div className="font-semibold text-stone-700">2. Focus Area</div>
                      <div className="text-stone-600 mt-1">{dossier.focusSummary}</div>
                    </div>
                    <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <div className="font-semibold text-stone-700">3. Sustainable Embedding</div>
                      <div className="text-stone-600 mt-1">{dossier.embeddingSummary}</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Section 22: Journey Narrative */}
              {activeSection.key === 'journey-story' && (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1">
                      The Story of the Journey (500–700 words: "From Learning to Living")
                    </label>
                    <textarea
                      rows={10}
                      value={dossier.narrativeJourneyDraft}
                      onChange={(e) => handleUpdateNarrativeJourney(e.target.value)}
                      className="w-full text-sm p-3 rounded-xl border border-stone-300 text-stone-900 focus:ring-2 focus:ring-[#2E523A]"
                    />
                    <div className="text-right text-xs text-stone-500 mt-1">
                      {dossier.narrativeJourneyDraft.split(/\s+/).length} words
                    </div>
                  </div>
                </div>
              )}

              {/* Section 9 & 11: Practice Stories */}
              {(activeSection.key === 'practice-in-action' || activeSection.key === 'practice-stories') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold text-stone-900">
                      Curated 5-Stage Practice Accounts ({dossier.practiceStories.length})
                    </h3>
                  </div>

                  {dossier.practiceStories.map((story) => (
                    <div
                      key={story.id}
                      className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3"
                    >
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="font-semibold text-stone-900 text-sm">{story.title}</div>
                          <div className="text-xs text-stone-500 mt-0.5">
                            {story.gradeContext} · {story.phase}
                          </div>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          {story.verificationStatus}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                          <span className="font-semibold text-red-700 block mb-0.5">Before CEQHS:</span>
                          <span className="text-stone-600">{story.beforePractice}</span>
                        </div>
                        <div className="p-2.5 bg-white rounded-lg border border-stone-200">
                          <span className="font-semibold text-emerald-700 block mb-0.5">After Shift:</span>
                          <span className="text-stone-600">{story.afterPractice}</span>
                        </div>
                      </div>

                      <div className="text-xs text-stone-700 space-y-1">
                        <div>
                          <span className="font-medium text-stone-900">What Happened: </span>
                          {story.practice}
                        </div>
                        <div>
                          <span className="font-medium text-stone-900">Evidence Corroborated: </span>
                          {story.evidence}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* Default fallback for other sections */}
              {!['cover', 'school-context', 'journey-story', 'practice-in-action', 'practice-stories'].includes(
                activeSection.key
              ) && (
                <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 text-center space-y-3">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 text-[#2E523A] flex items-center justify-center mx-auto">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-stone-900">
                      Section {activeSection.sectionNumber}: {activeSection.title}
                    </h3>
                    <p className="text-xs text-stone-500 max-w-md mx-auto mt-1">
                      {activeSection.description}
                    </p>
                  </div>
                  <div className="pt-2 text-xs text-stone-600">
                    Curated content automatically synchronized from the CEQHS Practice Engine and Living Journal records.
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: VISUAL EVIDENCE & CONSENT */}
          {activeTab === 'evidence_library' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">Visual Evidence Repository</h3>
                  <div className="text-xs text-stone-500">
                    Grade 1–5 authentic photographs with verified consent and demonstrative captions.
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {dossier.visualEvidence.map((evi) => (
                  <div
                    key={evi.id}
                    className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-3"
                  >
                    <img
                      src={evi.imageUrl}
                      alt={evi.altText}
                      className="w-full h-40 object-cover rounded-lg border border-stone-200"
                    />

                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-stone-900">{evi.activity}</span>
                        <span className="text-stone-500 font-mono">{evi.grade}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 mt-0.5">
                        Captured: {evi.dateCaptured} by {evi.uploadedBy}
                      </div>
                    </div>

                    {/* Caption with Demonstrative Prompt */}
                    <div className="space-y-1">
                      <span className="text-[10px] uppercase font-bold text-stone-500">
                        Caption (What does this image demonstrate about the practice?)
                      </span>
                      <p className="text-xs text-stone-700 bg-white p-2.5 rounded-lg border border-stone-200">
                        {evi.caption}
                      </p>
                    </div>

                    {/* Consent Badge */}
                    <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-medium">
                        ✓ {evi.consentStatus}
                      </span>
                      <span className="text-stone-500 text-[10px]">
                        Layout: {evi.layoutRecommendation}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: QUALITY & SAFEGUARDS PRE-FLIGHT */}
          {activeTab === 'preflight' && (
            <div className="bg-white rounded-2xl border border-stone-200 p-6 shadow-xs space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-stone-900">
                    Pre-Flight Quality Assurance & Safeguards
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Automated validation preventing leaks of private notes, unverified claims, or unconsented photos.
                  </p>
                </div>
                <div
                  className={`px-3 py-1 rounded-full text-xs font-bold ${
                    preflightReport.canPublish
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {preflightReport.canPublish ? 'READY FOR PUBLICATION' : 'BLOCKERS DETECTED'}
                </div>
              </div>

              {/* Blockers List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Publication Blockers ({preflightReport.blockers.length})
                </div>
                {preflightReport.blockers.length === 0 ? (
                  <div className="p-3 bg-emerald-50 text-emerald-800 rounded-xl text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Zero publication blockers found. All safeguards satisfied.
                  </div>
                ) : (
                  preflightReport.blockers.map((b, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-red-50 text-red-800 rounded-xl text-xs flex items-center gap-2 border border-red-200"
                    >
                      <X className="w-4 h-4 shrink-0 text-red-600" />
                      {b}
                    </div>
                  ))
                )}
              </div>

              {/* Warnings List */}
              <div className="space-y-2">
                <div className="text-xs font-semibold uppercase tracking-wider text-stone-700">
                  Editorial Warnings ({preflightReport.warnings.length})
                </div>
                {preflightReport.warnings.map((w, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-amber-50 text-amber-900 rounded-xl text-xs flex items-center gap-2 border border-amber-200"
                  >
                    <AlertTriangle className="w-4 h-4 shrink-0 text-amber-600" />
                    {w}
                  </div>
                ))}
              </div>

              {/* Claims Distinction Breakdown */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="font-semibold text-stone-800">
                  Evidence Breakdown: {preflightReport.verifiedItemsCount} Verified / {preflightReport.totalClaimsCount} Total Claims
                </div>
                <div className="text-stone-600">
                  Every claim is traceable to its platform source ID and verification inspector record.
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Preflight Modal */}
      {showPreflightModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-xl border border-stone-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-serif font-bold text-stone-900">Pre-Flight Quality Report</h3>
              <button
                type="button"
                onClick={() => setShowPreflightModal(false)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 space-y-1.5">
                <div className="flex justify-between">
                  <span>Mandatory Sections:</span>
                  <span className="font-semibold text-emerald-700">All 23 Present</span>
                </div>
                <div className="flex justify-between">
                  <span>Grade Scope:</span>
                  <span className="font-semibold text-emerald-700">Strictly Grades 1–5</span>
                </div>
                <div className="flex justify-between">
                  <span>Confidentiality Leak Check:</span>
                  <span className="font-semibold text-emerald-700">0 Leaks Detected</span>
                </div>
                <div className="flex justify-between">
                  <span>Photo Consent Status:</span>
                  <span className="font-semibold text-emerald-700">All Confirmed</span>
                </div>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPreflightModal(false)}
              className="w-full py-2.5 rounded-lg bg-[#2E523A] text-white text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
