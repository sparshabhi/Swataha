import React, { useState } from 'react';
import {
  BookOpen,
  Printer,
  Sparkles,
  CheckCircle2,
  Clock,
  Layers,
  Quote,
  Eye,
  ArrowRight,
  Download,
  FileText,
  Check,
} from 'lucide-react';
import {
  DossierChapter,
  JourneyEntry,
  BeforeNowShift,
  SchoolSignal,
  User,
} from '../types';
import { generateDossierPDF } from '../lib/pdfGenerator';

interface DossierViewProps {
  chapters: DossierChapter[];
  entries: JourneyEntry[];
  beforeNowShifts: BeforeNowShift[];
  signals: SchoolSignal[];
  currentUser: User;
}

export const DossierView: React.FC<DossierViewProps> = ({
  chapters,
  entries,
  beforeNowShifts,
  signals,
  currentUser,
}) => {
  const [viewMode, setViewMode] = useState<'book' | 'curator'>('book');
  const [selectedChapterNumber, setSelectedChapterNumber] = useState<string>('01');
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [pdfDownloaded, setPdfDownloaded] = useState(false);

  // Filter entries included in dossier
  const dossierMoments = entries.filter((e) => e.type === 'moment' && e.includedInDossier);
  const studentVoices = entries.filter((e) => e.type === 'student_voice');
  const photoEvidence = entries.filter((e) => e.type === 'evidence' && e.photoUrl);

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPdfSummary = () => {
    setIsGeneratingPdf(true);
    setPdfDownloaded(false);

    try {
      generateDossierPDF({
        currentUser,
        chapters,
        entries,
        beforeNowShifts,
        signals,
      });

      setPdfDownloaded(true);
      setTimeout(() => {
        setPdfDownloaded(false);
      }, 3500);
    } catch (err) {
      console.error('Failed to generate PDF summary:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      {/* Top Banner / Mode Switcher */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs no-print">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Living Annual Dossier
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
              CEQHS School Journey
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              {currentUser.schoolName} · Academic Year {currentUser.academicYear}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex p-1 bg-[#FAF9F5] border border-stone-300 rounded-xl">
              <button
                onClick={() => setViewMode('book')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'book'
                    ? 'bg-[#252525] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Editorial Book View
              </button>
              <button
                onClick={() => setViewMode('curator')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  viewMode === 'curator'
                    ? 'bg-[#252525] text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Chapter Manager
              </button>
            </div>

            <button
              onClick={handleDownloadPdfSummary}
              disabled={isGeneratingPdf}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 shadow-xs ${
                pdfDownloaded
                  ? 'bg-emerald-700 text-white'
                  : 'bg-[#4A6B53] text-white hover:bg-[#3d5945]'
              }`}
              title="Generate a formatted PDF summary report using jsPDF"
            >
              {pdfDownloaded ? (
                <>
                  <Check className="w-4 h-4 text-emerald-200" />
                  <span>Summary Downloaded</span>
                </>
              ) : (
                <>
                  <Download className={`w-4 h-4 ${isGeneratingPdf ? 'animate-bounce' : ''}`} />
                  <span>{isGeneratingPdf ? 'Generating PDF...' : 'Download PDF Summary'}</span>
                </>
              )}
            </button>

            <button
              onClick={handlePrint}
              className="px-3 py-2 rounded-xl bg-[#FAF9F5] border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition-colors flex items-center gap-1.5 shadow-2xs"
              title="Print full editorial book"
            >
              <Printer className="w-4 h-4 text-stone-500" />
              <span className="hidden sm:inline">Print View</span>
            </button>
          </div>
        </div>

        <p className="text-xs text-stone-500 mt-4 italic">
          "Schools should not have to create a dossier at the end of the year. The dossier grows naturally throughout the year as educators practise, reflect, document, and learn."
        </p>
      </div>

      {/* VIEW MODE 1: CURATOR / CHAPTER PROGRESS MANAGER */}
      {viewMode === 'curator' && (
        <div className="space-y-6 no-print">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chapters.map((ch) => (
              <div
                key={ch.number}
                className="p-5 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-400">
                    CHAPTER {ch.number}
                  </span>
                  <span
                    className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                      ch.status === 'Verified'
                        ? 'bg-blue-100 text-blue-800'
                        : ch.status === 'Curated'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ch.status === 'Building' && '● Building Naturally'}
                    {ch.status === 'Curated' && '✓ Curated for Publication'}
                    {ch.status === 'Verified' && '★ CEQHS Verified'}
                  </span>
                </div>

                <h3 className="font-editorial text-2xl text-stone-900 font-normal">
                  {ch.title}
                </h3>
                <p className="text-xs text-stone-600 italic">{ch.subtitle}</p>

                <p className="text-xs text-stone-700 leading-relaxed line-clamp-2">
                  {ch.summary}
                </p>

                <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs">
                  <span className="text-stone-500">
                    {ch.keyInsights.length} documented insights
                  </span>
                  <button
                    onClick={() => {
                      setSelectedChapterNumber(ch.number);
                      setViewMode('book');
                    }}
                    className="text-[#4A6B53] font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>Read Chapter</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW MODE 2: EDITORIAL ANNUAL BOOK (BEAUTIFUL DIGITAL PUBLICATION) */}
      {viewMode === 'book' && (
        <div className="bg-[#FAF9F5] border border-stone-300 rounded-2xl p-6 sm:p-12 shadow-sm space-y-16 print:border-none print:shadow-none print:p-0 print:bg-white">
          {/* Book Cover Page */}
          <div className="text-center py-16 sm:py-24 border-b-2 border-stone-300 space-y-6">
            <div className="w-16 h-16 rounded-2xl bg-[#4A6B53] text-white flex items-center justify-center font-editorial text-3xl font-bold mx-auto shadow-md">
              C
            </div>

            <div className="space-y-2 max-w-2xl mx-auto">
              <span className="text-xs uppercase tracking-widest font-semibold text-[#4A6B53]">
                Center for Emotional Intelligence & Human Skills
              </span>
              <h1 className="font-editorial text-4xl sm:text-6xl text-[#252525] font-normal tracking-tight">
                CEQHS School Journey
              </h1>
              <p className="font-editorial italic text-stone-600 text-xl sm:text-2xl">
                A Living Record of Human Development in a School
              </p>
            </div>

            <div className="pt-8 text-sm text-stone-700 space-y-1">
              <p className="font-bold text-lg text-stone-900">{currentUser.schoolName}</p>
              <p className="text-stone-500">Academic Year {currentUser.academicYear}</p>
              <p className="text-xs text-[#4A6B53] font-medium pt-2">
                Verified CEQHS Learning Center Candidate
              </p>
            </div>
          </div>

          {/* Table of Contents */}
          <div className="max-w-xl mx-auto py-8 border-b border-stone-300 space-y-4">
            <h2 className="font-editorial text-2xl text-stone-900 font-normal text-center">
              The Journey Arc
            </h2>
            <div className="space-y-2">
              {chapters.map((ch) => (
                <div
                  key={ch.number}
                  className="flex items-baseline justify-between text-sm py-1 border-b border-stone-200/60"
                >
                  <span className="text-xs font-mono font-bold text-stone-400 mr-3">
                    {ch.number}
                  </span>
                  <span className="font-editorial text-stone-800 flex-1">{ch.title}</span>
                  <span className="text-xs text-stone-400 capitalize">{ch.status}</span>
                </div>
              ))}
            </div>
          </div>

          {/* CHAPTER 01: Our Starting Point */}
          <section className="space-y-6 pt-6">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A6B53]">
                Chapter 01
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal">
                Our Starting Point
              </h2>
              <p className="font-editorial italic text-stone-600 text-lg">
                Where St. Jude Academy began its journey of human connection
              </p>
            </div>

            <p className="text-base text-stone-800 leading-relaxed font-normal">
              {chapters[0]?.summary}
            </p>

            <div className="p-6 rounded-2xl bg-white border border-stone-200 space-y-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                Opening Baseline Insights
              </span>
              <ul className="space-y-2 text-sm text-stone-700 list-disc list-inside">
                {chapters[0]?.keyInsights.map((insight, idx) => (
                  <li key={idx}>{insight}</li>
                ))}
              </ul>
            </div>
          </section>

          {/* CHAPTER 04: Practice in Action */}
          <section className="space-y-6 pt-10 border-t border-stone-200">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A6B53]">
                Chapter 04
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal">
                Practice in Action
              </h2>
              <p className="font-editorial italic text-stone-600 text-lg">
                Classroom experiments, transitional rituals, and the Curious Pause
              </p>
            </div>

            <p className="text-base text-stone-800 leading-relaxed font-normal">
              {chapters[3]?.summary}
            </p>

            {/* Photo artifact with meaningful explanation */}
            {photoEvidence[0] && (
              <div className="my-6 rounded-2xl overflow-hidden border border-stone-300 bg-white shadow-xs">
                <img
                  src={photoEvidence[0].photoUrl}
                  alt={photoEvidence[0].title}
                  referrerPolicy="no-referrer"
                  className="w-full h-80 object-cover"
                />
                <div className="p-5 bg-white space-y-1">
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold text-stone-800">{photoEvidence[0].title}</span>
                    <span>Documented by {photoEvidence[0].authorName}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-stone-700 italic">
                    "{photoEvidence[0].whyDoesThisMatter}"
                  </p>
                </div>
              </div>
            )}
          </section>

          {/* CHAPTER 05: Moments That Mattered (Signature Editorial Section) */}
          <section className="space-y-6 pt-10 border-t border-stone-200">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C45D3E]">
                Chapter 05
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal">
                Moments That Mattered
              </h2>
              <p className="font-editorial italic text-stone-600 text-lg">
                Selected human moments captured throughout the academic year
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {dossierMoments.slice(0, 4).map((moment) => (
                <div
                  key={moment.id}
                  className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3"
                >
                  <div className="flex items-center justify-between text-xs text-stone-500">
                    <span className="font-bold text-[#C45D3E]">{moment.momentCategory}</span>
                    <span>{moment.date}</span>
                  </div>

                  <h3 className="font-editorial text-2xl text-stone-900 font-normal leading-snug">
                    {moment.title}
                  </h3>

                  <p className="text-sm text-stone-700 leading-relaxed font-normal">
                    "{moment.description}"
                  </p>

                  <div className="p-3.5 rounded-xl bg-[#FAF9F5] border-l-3 border-[#C88A2E] text-xs text-stone-800 italic">
                    <span className="font-bold not-italic text-[10px] text-[#C88A2E] block mb-0.5">
                      Why does this matter?
                    </span>
                    "{moment.whyDoesThisMatter}"
                  </div>

                  <div className="text-[11px] text-stone-500 pt-2 border-t border-stone-100">
                    Captured by {moment.authorName} · {moment.authorRole}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CHAPTER 06: Voices From Our Community */}
          <section className="space-y-6 pt-10 border-t border-stone-200">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A6B53]">
                Chapter 06
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal">
                Voices From Our Community
              </h2>
              <p className="font-editorial italic text-stone-600 text-lg">
                What students, educators, and leaders experienced
              </p>
            </div>

            {/* Pull Quote Spotlight */}
            <div className="p-8 rounded-2xl bg-[#FAF3E7] border border-[#C88A2E]/30 text-center space-y-4 max-w-3xl mx-auto">
              <Quote className="w-8 h-8 text-[#C88A2E] mx-auto opacity-70" />
              <blockquote className="font-editorial italic text-xl sm:text-2xl text-stone-900 leading-relaxed">
                "In other classes, if you get it wrong, people giggle. Here, our teacher asks how our brain got there. It makes getting it wrong feel like solving a puzzle instead of dying."
              </blockquote>
              <div className="text-xs uppercase tracking-wider font-semibold text-stone-600">
                — Grade 7 Student Exit Reflection · St. Jude Academy
              </div>
            </div>
          </section>

          {/* CHAPTER 08: What We Are Embedding (Before & Now Shifts) */}
          <section className="space-y-6 pt-10 border-t border-stone-200">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#4A6B53]">
                Chapter 08
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal">
                What We Are Embedding
              </h2>
              <p className="font-editorial italic text-stone-600 text-lg">
                Practices becoming routines, shared language, and cultural shifts
              </p>
            </div>

            <p className="text-base text-stone-800 leading-relaxed font-normal">
              {chapters[7]?.summary}
            </p>

            <div className="space-y-4 pt-2">
              {beforeNowShifts.map((shift) => (
                <div
                  key={shift.id}
                  className="p-6 rounded-2xl bg-white border border-stone-200 space-y-4 shadow-2xs"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-stone-400 block">
                        Before
                      </span>
                      <p className="text-sm text-stone-600 italic">"{shift.before}"</p>
                    </div>

                    <div className="space-y-1 border-t md:border-t-0 md:border-l border-stone-200 pt-3 md:pt-0 md:pl-6">
                      <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block">
                        Now (Embedded Practice)
                      </span>
                      <p className="text-sm text-stone-900 font-medium leading-relaxed">
                        "{shift.now}"
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center gap-2 text-xs">
                    <span className="text-stone-500">What helped us get there:</span>
                    {shift.catalysts.map((c, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-0.5 rounded-sm bg-[#EAF0EB] text-[#4A6B53] font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* CHAPTER 10: Our Next Chapter (Ending with continuity, not completion) */}
          <section className="space-y-6 pt-10 border-t-2 border-stone-300">
            <div className="space-y-1">
              <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#C88A2E]">
                Chapter 10
              </span>
              <h2 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal">
                What Continues?
              </h2>
              <p className="font-editorial italic text-stone-600 text-lg">
                End with continuity, not completion
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-white border border-stone-200 space-y-6">
              <p className="text-base text-stone-800 leading-relaxed font-normal">
                We do not close this year by declaring that emotional intelligence has been "completed." Human development is living and ongoing. The practices seeded this year now form the baseline for our next chapter.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#4A6B53] block">
                    What practices will remain?
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    The Curious Pause before correcting, weekly check-in pauses in staff meetings, and classroom regulation corners.
                  </p>
                </div>

                <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-1">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#C88A2E] block">
                    What still needs attention?
                  </span>
                  <p className="text-xs text-stone-700 leading-relaxed">
                    Midday loud cafeteria-to-study transitions, and deepening peer restorative mediation in upper grades.
                  </p>
                </div>
              </div>
            </div>

            {/* CEQHS Verification Badge in Publication */}
            <div className="pt-8 text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EAF0EB] text-[#4A6B53] text-xs font-bold border border-[#4A6B53]/30">
                <CheckCircle2 className="w-4 h-4" />
                <span>CEQHS Learning Center Verified · 2026–27</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Anchored and verified by the Center for Emotional Intelligence & Human Skills
              </p>
            </div>
          </section>
        </div>
      )}
    </div>
  );
};
