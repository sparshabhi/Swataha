import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Download,
  CheckCircle2,
  ArrowLeft,
  ArrowRight,
  Shield,
  Layers,
  FileText,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Quote,
} from 'lucide-react';
import { DossierModel } from '../../types/ceqhsDossier';
import { generatePrintableDossierPDF } from '../../lib/ceqhsDossierPdfEngine';

interface CeqhsDossierViewerProps {
  dossier: DossierModel;
  onBackToStudio?: () => void;
}

export const CeqhsDossierViewer: React.FC<CeqhsDossierViewerProps> = ({
  dossier,
  onBackToStudio,
}) => {
  const [activeSectionIndex, setActiveSectionIndex] = useState<number>(0);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState<boolean>(false);
  const [showEvidenceIndexModal, setShowEvidenceIndexModal] = useState<boolean>(false);

  const activeSections = dossier.targetSections.filter((s) => s.isIncluded);
  const currentSection = activeSections[activeSectionIndex] || activeSections[0];

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

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Reading Navigation Bar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
        <div className="flex items-center gap-3">
          {onBackToStudio && (
            <button
              type="button"
              onClick={onBackToStudio}
              className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-600 transition-all"
              title="Return to Studio Editor"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#2E523A]">
                Digital Implementation Dossier
              </span>
              <span className="px-2 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-mono font-bold">
                {dossier.activeVersionNumber}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif text-stone-900 mt-0.5">
              {dossier.schoolName}
            </h1>
          </div>
        </div>

        {/* Global Reader Actions */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setShowEvidenceIndexModal(true)}
            className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5 text-stone-500" />
            Evidence Index
          </button>

          <button
            type="button"
            onClick={handlePrint}
            className="px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-stone-50 text-xs font-medium text-stone-700 flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            Browser Print
          </button>

          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isGeneratingPdf}
            className="px-4 py-1.5 rounded-lg bg-[#2E523A] hover:bg-[#24412e] text-white text-xs font-medium shadow-xs flex items-center gap-1.5 transition-all"
          >
            <Download className="w-3.5 h-3.5 text-amber-300" />
            {isGeneratingPdf ? 'Generating PDF...' : 'Download A4 PDF'}
          </button>
        </div>
      </div>

      {/* Reader Stepper / Pagination Bar */}
      <div className="bg-stone-100/70 rounded-xl p-2 flex items-center justify-between no-print text-xs">
        <button
          type="button"
          disabled={activeSectionIndex === 0}
          onClick={() => setActiveSectionIndex(activeSectionIndex - 1)}
          className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-40 flex items-center gap-1 font-medium hover:bg-stone-50"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          Previous Section
        </button>

        <div className="flex items-center gap-2">
          <span className="font-semibold text-stone-900">
            Section {currentSection.sectionNumber}: {currentSection.title}
          </span>
          <span className="text-stone-400">·</span>
          <span className="text-stone-500">
            Page {activeSectionIndex + 1} of {activeSections.length}
          </span>
        </div>

        <button
          type="button"
          disabled={activeSectionIndex === activeSections.length - 1}
          onClick={() => setActiveSectionIndex(activeSectionIndex + 1)}
          className="px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-stone-700 disabled:opacity-40 flex items-center gap-1 font-medium hover:bg-stone-50"
        >
          Next Section
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* PUBLICATION-GRADE SECTION CONTENT SHEET */}
      <div className="bg-white rounded-2xl border border-stone-200 shadow-md p-8 sm:p-12 min-h-[750px] relative">
        {/* Running Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-200 text-xs text-stone-500 mb-8">
          <div>
            CEQHS Living Implementation Dossier · {dossier.schoolName} ({dossier.primaryCurriculum})
          </div>
          <div className="font-mono">
            Grades 1–5 · Section {currentSection.sectionNumber.toString().padStart(2, '0')}
          </div>
        </div>

        {/* SECTION 1: COVER */}
        {currentSection.key === 'cover' && (
          <div className="space-y-8 py-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[#2E523A] text-white flex items-center justify-center font-bold text-lg">
                CEQHS
              </div>
              <div>
                <div className="text-xs uppercase font-bold tracking-widest text-[#2E523A]">
                  Center for Emotional Intelligence & Human Skills
                </div>
                <div className="text-xs text-stone-500">
                  Evidence & Quality Assurance Framework · Primary School Pilot
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-100 space-y-2">
              <span className="text-xs uppercase tracking-wider font-semibold text-amber-700">
                Official Verified Implementation Portfolio
              </span>
              <h1 className="text-4xl sm:text-5xl font-serif text-stone-900 tracking-tight leading-tight">
                School Implementation Dossier
              </h1>
              <div className="text-lg text-[#2E523A] font-serif">
                Emotional Intelligence and Human Skills in Practice
              </div>
            </div>

            {/* School Context Card */}
            <div className="p-6 rounded-xl bg-stone-50 border border-stone-200 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <span className="text-xs uppercase text-stone-500">Partner School</span>
                <div className="text-lg font-bold text-stone-900 mt-0.5">{dossier.schoolName}</div>
                <div className="text-xs text-stone-600">{dossier.schoolLocation}</div>
              </div>
              <div>
                <span className="text-xs uppercase text-stone-500">Curriculum & Scope</span>
                <div className="text-sm font-semibold text-stone-900 mt-0.5">
                  {dossier.primaryCurriculum} ({dossier.curriculumJurisdiction})
                </div>
                <div className="text-xs text-stone-600 font-mono mt-0.5">
                  Participating: {dossier.participatingGrades.join(', ')}
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="space-y-3">
              <div className="relative rounded-2xl overflow-hidden border border-stone-200 bg-stone-100 shadow-xs">
                <img
                  src={dossier.heroPhotoUrl}
                  alt="Hero Classroom Demonstration"
                  className="w-full h-80 sm:h-96 object-cover"
                />
                <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-xs text-white px-3 py-1 rounded-full text-xs font-semibold">
                  ✓ Verified External Consent
                </div>
              </div>
              <p className="text-xs text-stone-600 text-center italic max-w-2xl mx-auto">
                "{dossier.heroPhotoCaption}"
              </p>
            </div>

            {/* Cover Governance Footer */}
            <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-stone-500 gap-2">
              <div>
                Founder & Chief Program Architect: <span className="font-semibold text-stone-800">Saugat Singh</span>
              </div>
              <div>{dossier.coverFooter}</div>
            </div>
          </div>
        )}

        {/* SECTION 2: ABOUT THIS DOSSIER */}
        {currentSection.key === 'about' && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section 02 · Editorial Overview
              </span>
              <h2 className="text-3xl font-serif text-stone-900">About this Implementation Dossier</h2>
            </div>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              The CEQHS School Implementation Dossier is a curated record of educator learning, classroom practice,
              reflection, adaptation, school-level implementation, and verified evidence across a defined Grade 1–5
              implementation cycle. It represents authentic field inquiry, distinguishing strictly between self-reported
              perceptions, uploaded classroom records, and third-party corroborated observations.
            </p>

            {/* Visual Movement Diagram */}
            <div className="p-8 rounded-2xl bg-[#2E523A]/5 border border-[#2E523A]/20 space-y-6">
              <div className="text-xs font-bold uppercase tracking-wider text-[#2E523A] text-center">
                The CEQHS Developmental Trajectory
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                {[
                  { title: 'Understanding', desc: 'Inquiry into emotional biology & adult self-regulation' },
                  { title: 'Practice', desc: 'Daily classroom micro-habits and transitional anchors' },
                  { title: 'Reflection', desc: 'Living Journal structured educator self-inquiry' },
                  { title: 'Adaptation', desc: 'Pedagogical adjustments based on student responses' },
                  { title: 'Embedding', desc: 'Whole-campus restorative circles & quiet spaces' },
                ].map((step, idx) => (
                  <div key={step.title} className="p-4 rounded-xl bg-white border border-stone-200 space-y-1">
                    <div className="text-xs font-mono font-bold text-amber-700">0{idx + 1}</div>
                    <div className="font-semibold text-stone-900 text-sm">{step.title}</div>
                    <div className="text-xs text-stone-500">{step.desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Strict Evidentiary Distinction Rule */}
            <div className="p-6 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-amber-900">
                <Shield className="w-4 h-4 text-amber-700" />
                Evidentiary Distinction Rule
              </div>
              <div className="text-xs text-amber-900 leading-relaxed">
                This dossier maintains an unyielding distinction between <span className="font-semibold">Documented</span> (artefacts or photos present), <span className="font-semibold">Reported</span> (educator self-perceptions), and <span className="font-semibold">Verified</span> (examined by authorized CEQHS reviewers). A claim is never represented as verified simply because it appears in a school report.
              </div>
            </div>
          </div>
        )}

        {/* SECTION 3: SCHOOL CONTEXT */}
        {currentSection.key === 'school-context' && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section 03 · Campus Profile
              </span>
              <h2 className="text-3xl font-serif text-stone-900">Campus Context & Curriculum Alignment</h2>
            </div>

            {/* Starting Point → Focus → Embedding */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700">1. Starting Point</span>
                <p className="text-xs text-stone-700 leading-relaxed">{dossier.startingPointSummary}</p>
              </div>
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-[#2E523A]">2. Focus Area</span>
                <p className="text-xs text-stone-700 leading-relaxed">{dossier.focusSummary}</p>
              </div>
              <div className="p-5 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-700">3. Sustainable Embedding</span>
                <p className="text-xs text-stone-700 leading-relaxed">{dossier.embeddingSummary}</p>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-stone-900">Institutional Implementation Narrative</h3>
              <p className="text-stone-700 leading-relaxed text-sm sm:text-base">{dossier.schoolNarrative}</p>
            </div>
          </div>
        )}

        {/* SECTION 4: THE CEQHS APPROACH */}
        {currentSection.key === 'approach' && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section 04 · Methodology
              </span>
              <h2 className="text-3xl font-serif text-stone-900">The CEQHS Living Journal Approach</h2>
            </div>

            <p className="text-stone-700 leading-relaxed text-sm sm:text-base">
              The CEQHS approach shifts the locus of social-emotional development from student-targeted behavioral
              instruction to educator self-observation and relational presence. Through daily micro-habits, teachers
              learn to track their own nervous system cues during difficult classroom moments.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-6 rounded-2xl bg-[#2E523A]/5 border border-[#2E523A]/20 space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-[#2E523A]">
                  The "ACT" Transition Protocol
                </div>
                <div className="space-y-2 text-xs text-stone-700">
                  <div>
                    <span className="font-semibold text-stone-900">Aware: </span>
                    Notice physical muscle tightening or auditory strain before speaking.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Calm: </span>
                    Engage the 3-breath biological anchor to decelerate fight-or-flight arousal.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Transition: </span>
                    Re-enter the student space from emotional groundedness.
                  </div>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="text-sm font-bold uppercase tracking-wider text-amber-800">
                  The "EAR" Restorative Dialogue
                </div>
                <div className="space-y-2 text-xs text-stone-700">
                  <div>
                    <span className="font-semibold text-stone-900">Empathy: </span>
                    Acknowledge the child's somatic state before asking cognitive questions.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Acknowledgment: </span>
                    Name the disruption without attributing character flaws or blame.
                  </div>
                  <div>
                    <span className="font-semibold text-stone-900">Restitution: </span>
                    Facilitate peer-to-peer co-design of relational repair.
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 9 & 11: PRACTICE IN ACTION */}
        {(currentSection.key === 'practice-in-action' || currentSection.key === 'practice-stories') && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section {currentSection.sectionNumber} · Classroom Evidence
              </span>
              <h2 className="text-3xl font-serif text-stone-900">Practice in Action: 5-Stage Curated Stories</h2>
            </div>

            {dossier.practiceStories.map((story) => (
              <div
                key={story.id}
                className="p-8 rounded-2xl bg-stone-50 border border-stone-200 space-y-6"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-stone-200">
                  <div>
                    <h3 className="text-xl font-serif font-bold text-stone-900">{story.title}</h3>
                    <div className="text-xs text-stone-500 mt-1">
                      {story.gradeContext} · {story.phase} · {story.curriculumConnection}
                    </div>
                  </div>
                  <span className="px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold shrink-0">
                    ✓ CEQHS {story.verificationStatus}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                    <span className="font-bold text-red-700 block uppercase tracking-wider">Before CEQHS</span>
                    <p className="text-stone-700 leading-relaxed">{story.beforePractice}</p>
                  </div>
                  <div className="p-4 bg-white rounded-xl border border-stone-200 text-xs space-y-1">
                    <span className="font-bold text-[#2E523A] block uppercase tracking-wider">After Pedagogical Shift</span>
                    <p className="text-stone-700 leading-relaxed">{story.afterPractice}</p>
                  </div>
                </div>

                <div className="space-y-3 text-xs sm:text-sm text-stone-700">
                  <div>
                    <span className="font-bold text-stone-900">1. Context: </span>
                    {story.context}
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">2. Practice Applied: </span>
                    {story.practice}
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">3. Corroborated Evidence: </span>
                    {story.evidence}
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">4. Educator Reflection: </span>
                    {story.reflection}
                  </div>
                  <div>
                    <span className="font-bold text-stone-900">5. Pedagogical Adaptation: </span>
                    {story.adaptation}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SECTION 10: VISUAL EVIDENCE */}
        {currentSection.key === 'visual-evidence' && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section 10 · Photographic Documentation
              </span>
              <h2 className="text-3xl font-serif text-stone-900">Visual Evidence & Demonstrative Captions</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {dossier.visualEvidence.map((img) => (
                <div
                  key={img.id}
                  className="rounded-2xl border border-stone-200 overflow-hidden bg-stone-50 space-y-3 p-4 shadow-2xs"
                >
                  <img
                    src={img.imageUrl}
                    alt={img.altText}
                    className="w-full h-56 object-cover rounded-xl border border-stone-200"
                  />
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-900">{img.activity}</span>
                    <span className="font-mono text-stone-500">{img.grade}</span>
                  </div>
                  <div className="p-3 bg-white rounded-xl border border-stone-200 text-xs text-stone-700">
                    <span className="font-semibold text-[#2E523A] block mb-1">Demonstrates:</span>
                    {img.caption}
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                    <span>Captured: {img.dateCaptured}</span>
                    <span className="text-emerald-700 font-medium">✓ {img.consentStatus}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* SECTION 20: OFFICIAL VERIFICATION */}
        {currentSection.key === 'ceqhs-verification' && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section 20 · Assurance
              </span>
              <h2 className="text-3xl font-serif text-stone-900">CEQHS Quality Assurance & Verification</h2>
            </div>

            <div className="p-8 rounded-2xl bg-stone-50 border-2 border-[#2E523A] space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-bold tracking-widest text-[#2E523A]">
                  Official CEQHS Assurance Statement
                </span>
                <span className="px-3 py-1 rounded-full bg-[#2E523A] text-white text-xs font-bold">
                  VERIFIED ACCREDITATION
                </span>
              </div>

              <p className="text-stone-800 text-sm sm:text-base leading-relaxed italic">
                "{dossier.verificationStatement}"
              </p>

              <div className="pt-6 border-t border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="font-serif font-bold text-lg text-stone-900">Saugat Singh</div>
                  <div className="text-xs text-[#2E523A] font-medium">
                    Founder and Chief Program Architect · CEQHS / Swataha
                  </div>
                  <div className="text-xs text-stone-500">
                    Reviewed & Authorized on {dossier.founderApprovalTimestamp?.slice(0, 10) || '2026-11-28'}
                  </div>
                </div>

                <div className="w-24 h-24 rounded-full border-2 border-[#2E523A] flex flex-col items-center justify-center text-center p-2 bg-emerald-50 text-[#2E523A]">
                  <div className="text-[10px] font-bold uppercase">CEQHS</div>
                  <div className="text-[9px] uppercase font-semibold">Verified</div>
                  <div className="text-[8px] text-stone-500">2026–2027</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SECTION 22: THE STORY OF THE JOURNEY */}
        {currentSection.key === 'journey-story' && (
          <div className="space-y-8 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-amber-700">
                Section 22 · Editorial Synthesis
              </span>
              <h2 className="text-3xl font-serif text-stone-900">The Story of the Journey</h2>
              <div className="text-xs text-stone-500">From Learning to Living (Grades 1–5)</div>
            </div>

            <div className="space-y-4 text-stone-800 text-sm sm:text-base leading-relaxed">
              {dossier.narrativeJourneyDraft.split('\n\n').map((para, idx) => (
                <p key={idx}>{para}</p>
              ))}
            </div>

            <div className="pt-4 border-t border-stone-200 text-xs text-stone-500">
              Corroborated Source Citations: {dossier.narrativeSourceCitations.join(', ')}
            </div>
          </div>
        )}

        {/* FALLBACK FOR OTHER SECTIONS */}
        {!['cover', 'about', 'school-context', 'approach', 'practice-in-action', 'practice-stories', 'visual-evidence', 'ceqhs-verification', 'journey-story'].includes(
          currentSection.key
        ) && (
          <div className="space-y-6 py-4">
            <div className="space-y-2">
              <span className="text-xs uppercase font-bold tracking-wider text-[#2E523A]">
                Section {currentSection.sectionNumber.toString().padStart(2, '0')}
              </span>
              <h2 className="text-3xl font-serif text-stone-900">{currentSection.title}</h2>
              <p className="text-stone-500 text-xs sm:text-sm">{currentSection.description}</p>
            </div>

            <div className="p-8 rounded-2xl bg-stone-50 border border-stone-200 text-center space-y-4">
              <FileText className="w-8 h-8 text-[#2E523A] mx-auto" />
              <div className="text-sm font-semibold text-stone-800">
                Automated Implementation Data Assembled
              </div>
              <p className="text-xs text-stone-600 max-w-lg mx-auto">
                Content for this section has been compiled from Living Journal entries, peer observation records, and school coordinator reviews.
              </p>
            </div>
          </div>
        )}

        {/* Running Footer */}
        <div className="pt-8 mt-12 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <div>Prepared through the CEQHS Practice & Evidence Platform · CEQHS / Swataha</div>
          <div className="font-mono">
            Page {activeSectionIndex + 1} of {activeSections.length}
          </div>
        </div>
      </div>

      {/* EVIDENCE INDEX MODAL */}
      {showEvidenceIndexModal && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 space-y-4 shadow-xl border border-stone-200 max-h-[80vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-lg font-serif font-bold text-stone-900">Dossier Evidence Index</h3>
                <div className="text-xs text-stone-500">
                  Traceable audit trail for all claims, stories, and photographs
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowEvidenceIndexModal(false)}
                className="px-2.5 py-1 text-xs rounded-lg hover:bg-stone-100 text-stone-600 font-medium"
              >
                Close
              </button>
            </div>

            <div className="space-y-2 overflow-y-auto flex-1 pr-1 text-xs">
              {dossier.claims.map((claim) => (
                <div
                  key={claim.id}
                  className="p-3 rounded-xl border border-stone-200 bg-stone-50 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="font-medium text-stone-900">{claim.claimText}</div>
                    <div className="text-stone-500 mt-1">
                      Sources: {claim.sourceRecordIds.join(', ')} · Verified by: {claim.verifiedBy || 'Pending'}
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-bold shrink-0">
                    {claim.evidenceStatus}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
