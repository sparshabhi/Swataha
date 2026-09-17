import React, { useState } from 'react';
import {
  FileText,
  Download,
  Printer,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Calendar,
  FileSpreadsheet,
  Check,
} from 'lucide-react';
import {
  exportImpactReportPDF,
  exportImpactReportHTML,
  exportImpactReportCSV,
} from '../../../utils/impactDocumentGenerator';

export const ReportsAndExportsPage: React.FC = () => {
  const [selectedReport, setSelectedReport] = useState<string>('mgmt-summary');
  const [isExporting, setIsExporting] = useState<boolean>(false);
  const [downloadSuccessMsg, setDownloadSuccessMsg] = useState<string | null>(null);

  const reportsList = [
    {
      id: 'mgmt-summary',
      title: 'School Management Impact Summary',
      desc: 'High-level, visual non-technical overview of school shifts, evidence strength, and upcoming priorities.',
      target: 'School Board, Principal, Leadership Team',
    },
    {
      id: 'annual-review',
      title: 'Annual Impact Review (5-Step Portfolio)',
      desc: 'Complete synthesis of what was planned, delivered, observed, and recommended for next term.',
      target: 'Annual Accreditation Portfolio',
    },
    {
      id: 'dossier-section',
      title: 'CEQHS Living Dossier Impact Section',
      desc: 'Detailed evidentiary appendix linking every metric to primary classroom observation and audit logs.',
      target: 'CEQHS Moderation Board Reviewers',
    },
    {
      id: 'three-year-journey',
      title: 'Three-Year Impact Journey & Maturation Report',
      desc: 'Longitudinal growth profile tracking progression through Foundation, Integration, and Leadership.',
      target: 'Accreditation Board & Evaluators',
    },
    {
      id: 'recognition-summary',
      title: 'Recognition Review Evidence Summary',
      desc: 'Criterion-by-criterion verification checklist signed by Chief Program Architect Saugat Singh Saud.',
      target: 'Official Stage 1 Recognition Issuance',
    },
  ];

  const currentReport = reportsList.find((r) => r.id === selectedReport) || reportsList[0];

  const triggerFeedback = (msg: string) => {
    setDownloadSuccessMsg(msg);
    setTimeout(() => {
      setDownloadSuccessMsg(null);
    }, 4000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      const ok = exportImpactReportPDF({
        reportTitle: currentReport.title,
        schoolName: 'Swataha Core School · Primary Years Pilot (Grades 1–5)',
        reportingPeriod: 'AY 2026–2027 · Term 1',
        verifiedBy: 'Saugat Singh Saud (Chief Program Architect)',
      });
      setIsExporting(false);
      if (ok) {
        triggerFeedback(`Downloaded official PDF: "${currentReport.title}.pdf"`);
      } else {
        // Fallback to HTML if PDF generation runs into an environment issue
        exportImpactReportHTML({ reportTitle: currentReport.title });
        triggerFeedback(`Generated printable document: "${currentReport.title}.html"`);
      }
    }, 400);
  };

  const handleDownloadHTML = () => {
    exportImpactReportHTML({
      reportTitle: currentReport.title,
      schoolName: 'Swataha Core School · Primary Years Pilot (Grades 1–5)',
      reportingPeriod: 'AY 2026–2027 · Term 1',
      verifiedBy: 'Saugat Singh Saud (Chief Program Architect)',
    });
    triggerFeedback(`Downloaded standalone publication: "${currentReport.title}.html"`);
  };

  const handleDownloadCSV = () => {
    exportImpactReportCSV({
      reportTitle: `${currentReport.title.replace(/[^a-zA-Z0-9]/g, '_')}_Data`,
    });
    triggerFeedback(`Exported CSV spreadsheet: "${currentReport.title}_Data.csv"`);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-150">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#1B3626]">
            Official Accreditation Publications
          </span>
          <span className="text-xs text-stone-500 font-medium">Verified Dossier Exports</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-stone-900">
          Impact Reports &amp; Verified Dossier Exports
        </h1>
        <p className="text-xs text-stone-600 max-w-3xl mt-1">
          Generate print-optimized and archival documentation. All exports automatically embed provenance metadata, reporting periods, sample definitions, measurement limitations, and institutional responsible-use statements.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Report Selector List */}
        <div className="space-y-3">
          <h2 className="text-xs font-bold text-stone-900 uppercase tracking-wider">
            Select Publication Format
          </h2>
          {reportsList.map((rep) => (
            <button
              key={rep.id}
              onClick={() => setSelectedReport(rep.id)}
              className={`w-full p-4 rounded-xl text-left border transition-all cursor-pointer flex flex-col justify-between space-y-1 ${
                selectedReport === rep.id
                  ? 'bg-[#1B3626] text-white border-[#1B3626] shadow-xs'
                  : 'bg-white text-stone-700 border-stone-200/80 hover:bg-stone-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-xs">{rep.title}</h3>
                <FileText className="w-3.5 h-3.5 shrink-0 opacity-80" />
              </div>
              <p
                className={`text-[11px] leading-snug ${
                  selectedReport === rep.id ? 'text-emerald-100/80' : 'text-stone-500'
                }`}
              >
                {rep.desc}
              </p>
              <div
                className={`text-[10px] pt-1 ${
                  selectedReport === rep.id ? 'text-emerald-200' : 'text-stone-400'
                }`}
              >
                Audience: {rep.target}
              </div>
            </button>
          ))}
        </div>

        {/* Live Document Preview Container */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-stone-200/80 shadow-xs space-y-6 flex flex-col justify-between">
          <div className="space-y-5">
            {/* Header of the generated publication */}
            <div className="p-6 rounded-xl bg-[#FAF8F5] border border-stone-200/80 space-y-3">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#1B3626] block">
                    CEQHS Living Journey Platform · Official Publication
                  </span>
                  <h2 className="text-lg font-bold text-stone-900 mt-1">
                    {currentReport.title}
                  </h2>
                  <span className="text-xs text-stone-600 font-medium">
                    Swataha Core School · Primary Years Pilot (Grades 1–5)
                  </span>
                </div>
                <div className="text-right text-[10px] text-stone-400 font-mono">
                  <div>Date: 17 Sep 2026</div>
                  <div>Doc ID: CEQHS-EXP-2026-09</div>
                </div>
              </div>

              {/* Section 13 Mandatory Metadata Header */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-stone-200/60 text-[10px] text-stone-600">
                <div>
                  <span className="text-stone-400 block uppercase">Reporting Period</span>
                  <strong>AY 2026–2027 · Term 1</strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase">Curriculum Anchor</span>
                  <strong>IB Primary Years (PYP)</strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase">Data Status</span>
                  <strong className="text-emerald-800">Verified &amp; Moderated</strong>
                </div>
                <div>
                  <span className="text-stone-400 block uppercase">Architect Sign-off</span>
                  <strong>Saugat Singh Saud</strong>
                </div>
              </div>
            </div>

            {/* Document Core Highlights */}
            <div className="space-y-3 text-xs text-stone-700">
              <h3 className="font-bold text-stone-900 uppercase text-[11px]">
                Executive Impact Highlights &amp; Evidence Baseline
              </h3>
              <ul className="space-y-2 text-[11px] text-stone-600 list-disc list-inside leading-relaxed bg-[#FAF8F5] p-4 rounded-xl border border-stone-200/60">
                <li>
                  <strong>Reach &amp; Exposure:</strong> 342 of 360 primary students (95.0%) actively receiving daily 15-minute emotional check-in routines.
                </li>
                <li>
                  <strong>Classroom Fidelity:</strong> 18 of 20 homerooms active daily with 88.4% facilitation fidelity verified across 12 coaching walkthrough audits.
                </li>
                <li>
                  <strong>Observed Somatic Shift:</strong> Post-recess transition quiet intervals reduced from 8.5 minutes to 3.4 minutes following acoustic chime micro-pauses.
                </li>
                <li>
                  <strong>Adult Modeling:</strong> 76% of educators observed engaging a 3-breath mindful pause prior to disciplining, up from 24% baseline.
                </li>
                <li>
                  <strong>Relational Climate:</strong> Playground administrative escalations fell by 64% as peer restorative bench mediation expanded.
                </li>
              </ul>
            </div>

            {/* Responsible-Use Statement (Mandatory Section 13) */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-[10px] space-y-1">
              <div className="font-bold flex items-center gap-1 text-amber-900">
                <AlertTriangle className="w-3.5 h-3.5" />
                CEQHS Institutional Responsible-Use Statement
              </div>
              <p className="leading-relaxed">
                This document represents developmental and observational evidence collected for institutional growth and accreditation. It is strictly non-diagnostic, must not be used to label individual children or evaluate educator compensation, and must not be published as public league tables or rankings.
              </p>
            </div>
            {/* Feedback notification toast */}
            {downloadSuccessMsg && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs flex items-center gap-2 animate-in fade-in">
                <Check className="w-4 h-4 text-emerald-700 shrink-0" />
                <span className="font-semibold">{downloadSuccessMsg}</span>
              </div>
            )}
          </div>

          {/* Action Bar */}
          <div className="pt-4 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
            <span className="text-[11px] text-stone-400">
              Generated by CEQHS Living Journey Engine · v1.5
            </span>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handlePrint}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Print preview or save as PDF via system dialog"
              >
                <Printer className="w-3.5 h-3.5" />
                <span>Print</span>
              </button>

              <button
                onClick={handleDownloadCSV}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download CSV spreadsheet for data analysis"
              >
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-700" />
                <span>Export CSV</span>
              </button>

              <button
                onClick={handleDownloadHTML}
                className="px-3 py-2 rounded-xl text-xs font-semibold bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors flex items-center gap-1.5 cursor-pointer"
                title="Download standalone HTML document for offline viewing or Microsoft Word"
              >
                <FileText className="w-3.5 h-3.5 text-stone-600" />
                <span>Download HTML</span>
              </button>

              <button
                onClick={handleDownloadPDF}
                disabled={isExporting}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#1B3626] hover:bg-[#2D5A3D] text-white transition-colors flex items-center gap-1.5 shadow-xs cursor-pointer disabled:opacity-50"
              >
                <Download className="w-3.5 h-3.5" />
                <span>{isExporting ? 'Generating PDF...' : 'Download Verified PDF'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
