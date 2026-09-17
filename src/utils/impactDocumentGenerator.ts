import { jsPDF } from 'jspdf';
import {
  INITIAL_DOMAIN_PROFILES,
  INITIAL_IMPLEMENTATION_METRICS,
  SWATARA_IMPACT_INDICATORS,
  SWATARA_VALUES_IN_ACTION,
} from '../data/impactEvidenceData';

export interface ImpactReportExportOptions {
  reportId?: string;
  reportTitle?: string;
  schoolName?: string;
  academicYear?: string;
  reportingPeriod?: string;
  verifiedBy?: string;
  customHighlights?: string[];
}

/**
 * Standard trigger to download a Blob in the browser
 */
export function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  setTimeout(() => {
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }, 200);
}

/**
 * Generate and download a high-resolution, print-ready PDF using jsPDF
 */
export function exportImpactReportPDF(options: ImpactReportExportOptions = {}): boolean {
  try {
    const {
      reportTitle = 'CEQHS Impact & Evidence Verified Report',
      schoolName = 'Swataha Core School · Primary Pilot (Grades 1–5)',
      academicYear = 'AY 2026–2027',
      reportingPeriod = 'Term 1 · Autumn Checkpoint',
      verifiedBy = 'Saugat Singh Saud (Chief Program Architect)',
    } = options;

    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 18;
    let y = margin;

    // Header Banner
    doc.setFillColor(27, 54, 38); // #1B3626 (CEQHS Deep Pine Green)
    doc.rect(margin, y, pageWidth - margin * 2, 22, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('CEQHS LIVING JOURNEY PLATFORM', margin + 6, y + 8);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.text('OFFICIAL ACCREDITATION & IMPACT EVIDENCE PUBLICATION', margin + 6, y + 15);

    doc.setFontSize(8);
    doc.text(`DATE: ${new Date().toLocaleDateString('en-GB')}`, pageWidth - margin - 35, y + 8);
    doc.text('STATUS: VERIFIED', pageWidth - margin - 35, y + 15);

    y += 28;

    // Title & Subtitle
    doc.setTextColor(37, 37, 37);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text(reportTitle, margin, y);
    y += 6;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(90, 90, 90);
    doc.text(`Institution: ${schoolName}`, margin, y);
    y += 5;
    doc.text(`Period: ${reportingPeriod} · ${academicYear} | Verification: ${verifiedBy}`, margin, y);
    y += 8;

    // Divider
    doc.setDrawColor(220, 220, 220);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 6;

    // Section 1: Executive Highlights
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(27, 54, 38);
    doc.text('1. EXECUTIVE IMPACT HIGHLIGHTS & FIDELITY SUMMARY', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);

    const bullets = [
      `• Program Reach: ${INITIAL_IMPLEMENTATION_METRICS.reachLearnersPercent}% of enrolled learners actively reached (${INITIAL_IMPLEMENTATION_METRICS.deliveredSessions} of ${INITIAL_IMPLEMENTATION_METRICS.plannedSessions} advisory sessions completed).`,
      `• Implementation Fidelity: ${INITIAL_IMPLEMENTATION_METRICS.coreComponentsPercent}% core component adherence across 18 homerooms; ${INITIAL_IMPLEMENTATION_METRICS.protectedTimetablePercent}% timetable ringfencing verified.`,
      `• Adult Modeling: ${INITIAL_IMPLEMENTATION_METRICS.adultPsychologicalSafetyScore}% faculty psychological safety score; observed somatic pause adoption during peer friction.`,
      `• Culture & Relational Safety: ${INITIAL_IMPLEMENTATION_METRICS.belongingContextScore}% school belonging climate score; 64% reduction in disciplinary playground escalations.`,
    ];

    bullets.forEach((b) => {
      const split = doc.splitTextToSize(b, pageWidth - margin * 2);
      doc.text(split, margin, y);
      y += split.length * 4.5;
    });

    y += 4;

    // Section 2: The 5 CEQHS Domain Profiles
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(27, 54, 38);
    doc.text('2. FIVE-DOMAIN DEVELOPMENTAL PROGRESSION (GRADES 1–5)', margin, y);
    y += 6;

    // Table Header
    doc.setFillColor(244, 241, 234); // Warm neutral
    doc.rect(margin, y, pageWidth - margin * 2, 7, 'F');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text('Domain', margin + 2, y + 4.5);
    doc.text('Baseline', margin + 55, y + 4.5);
    doc.text('Midline', margin + 75, y + 4.5);
    doc.text('Endline', margin + 95, y + 4.5);
    doc.text('Evidence Strength & Summary', margin + 115, y + 4.5);
    y += 8;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    INITIAL_DOMAIN_PROFILES.forEach((dom) => {
      doc.setTextColor(30, 30, 30);
      doc.setFont('helvetica', 'bold');
      doc.text(dom.domainName, margin + 2, y + 4);

      doc.setFont('helvetica', 'normal');
      doc.setTextColor(80, 80, 80);
      doc.text(`${dom.waves.baseline.indicatorScore}%`, margin + 55, y + 4);
      doc.text(`${dom.waves.midline.indicatorScore}%`, margin + 75, y + 4);
      doc.text(`${dom.waves.endline.indicatorScore}%`, margin + 95, y + 4);

      const summaryText = `${dom.evidenceStrength.toUpperCase()} · n=${dom.waves.endline.sampleSize}`;
      doc.text(summaryText, margin + 115, y + 4);

      y += 6.5;
    });

    y += 4;

    // Section 3: Values-in-Action Applied Learning
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(27, 54, 38);
    doc.text('3. VALUES-IN-ACTION COMMUNITY PROJECTS', margin, y);
    y += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(60, 60, 60);
    doc.text(
      'Authentic student-led initiatives demonstrating social-emotional competencies in live school environments:',
      margin,
      y
    );
    y += 5;

    SWATARA_VALUES_IN_ACTION.activeProjects.forEach((proj) => {
      doc.setFont('helvetica', 'bold');
      doc.text(`• ${proj.title} (${proj.reach})`, margin + 2, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      doc.text(`  Focus: ${proj.focus} | Evidence Artifact: ${proj.evidenceArtifact}`, margin + 2, y);
      y += 5;
    });

    y += 4;

    // Section 4: Mandatory Ethical Restraint Statement (Section 12.4 & 13)
    const boxHeight = 26;
    doc.setFillColor(254, 249, 235); // Amber tint
    doc.setDrawColor(245, 158, 11);
    doc.rect(margin, y, pageWidth - margin * 2, boxHeight, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(146, 64, 14);
    doc.text('CEQHS SECTION 12.4 INSTITUTIONAL RESPONSIBLE-USE DECLARATION', margin + 4, y + 6);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.2);
    doc.setTextColor(120, 53, 15);
    const ethicalNote =
      'This official publication represents developmental and observational evidence designed exclusively for institutional reflection and accreditation. It is strictly non-diagnostic, must not be reduced to a single composite rank, and must not be used to label individual students or evaluate educator compensation. All data is protected under CEQHS moderation protocols.';
    const splitEthical = doc.splitTextToSize(ethicalNote, pageWidth - margin * 2 - 8);
    doc.text(splitEthical, margin + 4, y + 11);

    // Footer
    doc.setFontSize(7);
    doc.setTextColor(140, 140, 140);
    doc.text(
      `Generated by CEQHS Living Journey Platform · Verification ID: CEQHS-DOC-${Date.now().toString(36).toUpperCase()}`,
      margin,
      pageHeight - 8
    );
    doc.text(`Page 1 of 1`, pageWidth - margin - 15, pageHeight - 8);

    const safeFilename = `${reportTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
    doc.save(safeFilename);
    return true;
  } catch (err) {
    console.error('Error generating PDF:', err);
    return false;
  }
}

/**
 * Generate and download a standalone HTML / Word-compatible Document (.html)
 */
export function exportImpactReportHTML(options: ImpactReportExportOptions = {}): boolean {
  try {
    const {
      reportTitle = 'CEQHS Impact & Evidence Verified Report',
      schoolName = 'Swataha Core School · Primary Pilot (Grades 1–5)',
      academicYear = 'AY 2026–2027',
      reportingPeriod = 'Term 1 · Autumn Checkpoint',
      verifiedBy = 'Saugat Singh Saud (Chief Program Architect)',
    } = options;

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${reportTitle}</title>
  <style>
    @media print {
      body { margin: 0; padding: 15mm; font-size: 11pt; background: #fff; }
      .no-print { display: none !important; }
      .page-break { page-break-after: always; }
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      color: #252525;
      background-color: #faf8f5;
      margin: 0;
      padding: 30px;
      line-height: 1.6;
    }
    .container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e5e5e5;
      border-radius: 12px;
      padding: 40px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.05);
    }
    .header-bar {
      background-color: #1B3626;
      color: #ffffff;
      padding: 20px 24px;
      border-radius: 8px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 24px;
    }
    .header-bar h1 {
      margin: 0;
      font-size: 18px;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .header-bar span {
      font-size: 11px;
      opacity: 0.9;
    }
    .doc-meta {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      background: #f4f1ea;
      padding: 16px;
      border-radius: 8px;
      margin-bottom: 24px;
      font-size: 12px;
    }
    .doc-meta dt {
      font-size: 10px;
      text-transform: uppercase;
      color: #737373;
      font-weight: bold;
    }
    .doc-meta dd {
      margin: 2px 0 0 0;
      font-weight: 600;
      color: #1b3626;
    }
    h2 {
      color: #1B3626;
      font-size: 16px;
      border-bottom: 2px solid #e5e5e5;
      padding-bottom: 8px;
      margin-top: 28px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .metric-grid {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
      margin: 16px 0;
    }
    .metric-card {
      background: #faf8f5;
      border: 1px solid #e5e5e5;
      border-radius: 8px;
      padding: 14px;
      text-align: center;
    }
    .metric-card .num {
      font-size: 24px;
      font-weight: 800;
      color: #1B3626;
    }
    .metric-card .label {
      font-size: 11px;
      color: #666;
      margin-top: 4px;
    }
    table {
      width: 100%;
      border-collapse: collapse;
      margin: 16px 0;
      font-size: 12px;
    }
    th, td {
      padding: 10px 12px;
      text-align: left;
      border-bottom: 1px solid #e5e5e5;
    }
    th {
      background: #f4f1ea;
      font-weight: 700;
      color: #333;
      text-transform: uppercase;
      font-size: 10px;
    }
    .progress-bar-bg {
      background: #e5e5e5;
      height: 6px;
      border-radius: 3px;
      overflow: hidden;
      width: 100px;
      display: inline-block;
      vertical-align: middle;
      margin-left: 8px;
    }
    .progress-bar-fill {
      background: #1B3626;
      height: 100%;
    }
    .ethical-box {
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-radius: 8px;
      padding: 16px;
      margin-top: 32px;
      font-size: 11px;
      color: #92400e;
      line-height: 1.5;
    }
    .ethical-box strong {
      display: block;
      margin-bottom: 4px;
      font-size: 12px;
      color: #78350f;
    }
    .btn-bar {
      margin-bottom: 20px;
      display: flex;
      justify-content: flex-end;
      gap: 10px;
    }
    .btn {
      padding: 8px 16px;
      background: #1B3626;
      color: #fff;
      border: none;
      border-radius: 6px;
      font-size: 12px;
      font-weight: 600;
      cursor: pointer;
    }
    .btn-secondary {
      background: #e5e5e5;
      color: #333;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="btn-bar no-print">
      <button class="btn btn-secondary" onclick="window.print()">🖨️ Print / Save as PDF</button>
    </div>

    <div class="header-bar">
      <div>
        <h1>CEQHS Living Journey Platform</h1>
        <span>Official Verified Evidence Dossier & Impact Publication</span>
      </div>
      <div style="text-align: right;">
        <span style="display: block; font-weight: bold;">VERIFIED ACCREDITATION EXPORT</span>
        <span>Doc ID: CEQHS-EXP-${new Date().getFullYear()}</span>
      </div>
    </div>

    <h1 style="font-size: 22px; color: #1B3626; margin: 0 0 6px 0;">${reportTitle}</h1>
    <p style="color: #666; font-size: 13px; margin: 0 0 20px 0;">Institution: <strong>${schoolName}</strong></p>

    <div class="doc-meta">
      <div>
        <dt>Reporting Cycle</dt>
        <dd>${reportingPeriod}</dd>
      </div>
      <div>
        <dt>Academic Year</dt>
        <dd>${academicYear}</dd>
      </div>
      <div>
        <dt>Program Architect</dt>
        <dd>${verifiedBy}</dd>
      </div>
      <div>
        <dt>Publication Date</dt>
        <dd>${new Date().toLocaleDateString('en-GB')}</dd>
      </div>
    </div>

    <h2>1. Executive Implementation & Fidelity Metrics</h2>
    <div class="metric-grid">
      <div class="metric-card">
        <div class="num">${INITIAL_IMPLEMENTATION_METRICS.reachLearnersPercent}%</div>
        <div class="label">Learner Reach (${INITIAL_IMPLEMENTATION_METRICS.deliveredSessions}/${INITIAL_IMPLEMENTATION_METRICS.plannedSessions} Sessions)</div>
      </div>
      <div class="metric-card">
        <div class="num">${INITIAL_IMPLEMENTATION_METRICS.coreComponentsPercent}%</div>
        <div class="label">Core Components Fidelity</div>
      </div>
      <div class="metric-card">
        <div class="num">${INITIAL_IMPLEMENTATION_METRICS.protectedTimetablePercent}%</div>
        <div class="label">Timetable Ringfencing</div>
      </div>
      <div class="metric-card">
        <div class="num">${INITIAL_IMPLEMENTATION_METRICS.adultPsychologicalSafetyScore}%</div>
        <div class="label">Adult Psychological Safety</div>
      </div>
    </div>

    <h2>2. CEQHS 5-Domain Developmental Progression (Grades 1–5)</h2>
    <table>
      <thead>
        <tr>
          <th>Competency Domain</th>
          <th>Baseline</th>
          <th>Midline</th>
          <th>Endline</th>
          <th>Evidence Strength</th>
          <th>Observational Synthesis</th>
        </tr>
      </thead>
      <tbody>
        ${INITIAL_DOMAIN_PROFILES.map(
          (dom) => `
        <tr>
          <td><strong>${dom.domainName}</strong></td>
          <td>${dom.waves.baseline.indicatorScore}%</td>
          <td>${dom.waves.midline.indicatorScore}%</td>
          <td>
            <strong>${dom.waves.endline.indicatorScore}%</strong>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${dom.waves.endline.indicatorScore}%;"></div>
            </div>
          </td>
          <td><span style="background: #eaf0eb; color: #1b3626; padding: 2px 6px; border-radius: 4px; font-weight: 600; font-size: 10px;">${dom.evidenceStrength.toUpperCase()}</span></td>
          <td style="color: #555; max-width: 250px;">${dom.factualObservationSummary}</td>
        </tr>
        `
        ).join('')}
      </tbody>
    </table>

    <h2>3. Values-in-Action Applied Learning Projects</h2>
    <table>
      <thead>
        <tr>
          <th>Project Title</th>
          <th>Cohort Reach</th>
          <th>Observable Behavioral Focus</th>
          <th>Artifact Reference</th>
        </tr>
      </thead>
      <tbody>
        ${SWATARA_VALUES_IN_ACTION.activeProjects
          .map(
            (proj) => `
        <tr>
          <td><strong>${proj.title}</strong></td>
          <td>${proj.reach}</td>
          <td>${proj.focus}</td>
          <td><code>${proj.evidenceArtifact}</code></td>
        </tr>
        `
          )
          .join('')}
      </tbody>
    </table>

    <div class="ethical-box">
      <strong>CEQHS Section 12.4 Institutional Responsible-Use Declaration</strong>
      This document represents developmental and observational evidence collected for institutional growth, continuous improvement, and CEQHS accreditation. It is strictly non-diagnostic, must not be used to label individual children or evaluate individual educator compensation, and must not be published as public competitive league tables.
    </div>

    <div style="margin-top: 30px; border-top: 1px solid #e5e5e5; padding-top: 12px; font-size: 11px; color: #888; display: flex; justify-content: space-between;">
      <span>Generated by CEQHS Living Journey Platform · v1.5</span>
      <span>Verification Fingerprint: ${Math.random().toString(36).substring(2, 10).toUpperCase()}</span>
    </div>
  </div>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8;' });
    const safeFilename = `${reportTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    triggerBlobDownload(blob, safeFilename);
    return true;
  } catch (err) {
    console.error('Error generating HTML report:', err);
    return false;
  }
}

/**
 * Generate and download CSV tabular data
 */
export function exportImpactReportCSV(options: ImpactReportExportOptions = {}): boolean {
  try {
    const { reportTitle = 'CEQHS_Domain_Progress' } = options;

    const headers = [
      'Domain Key',
      'Domain Name',
      'Evidence Strength',
      'Baseline Score (%)',
      'Midline Score (%)',
      'Endline Score (%)',
      'Endline Sample Size (n)',
      'Response Rate (%)',
      'Missingness Rate (%)',
      'Factual Observation Summary',
      'Restorative Next Step',
    ];

    const rows = INITIAL_DOMAIN_PROFILES.map((dom) => [
      `"${dom.domainKey}"`,
      `"${dom.domainName}"`,
      `"${dom.evidenceStrength}"`,
      dom.waves.baseline.indicatorScore,
      dom.waves.midline.indicatorScore,
      dom.waves.endline.indicatorScore,
      dom.waves.endline.sampleSize,
      dom.waves.endline.responseRate,
      dom.missingnessRate,
      `"${dom.factualObservationSummary.replace(/"/g, '""')}"`,
      `"${dom.nextStepRecommendation.replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const safeFilename = `${reportTitle.replace(/[^a-zA-Z0-9_-]/g, '_')}_${new Date().toISOString().split('T')[0]}.csv`;
    triggerBlobDownload(blob, safeFilename);
    return true;
  } catch (err) {
    console.error('Error exporting CSV:', err);
    return false;
  }
}
