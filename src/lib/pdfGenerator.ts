import { jsPDF } from 'jspdf';
import {
  JourneyEntry,
  BeforeNowShift,
  SchoolSignal,
  DossierChapter,
  User,
} from '../types';

interface PDFSummaryData {
  currentUser: User;
  chapters: DossierChapter[];
  entries: JourneyEntry[];
  beforeNowShifts: BeforeNowShift[];
  signals: SchoolSignal[];
}

/**
 * Generates a clean, formatted CEQHS Living Journey Dossier Summary report using jsPDF
 */
export function generateDossierPDF({
  currentUser,
  chapters,
  entries,
  beforeNowShifts,
  signals,
}: PDFSummaryData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;
  const margin = 18;
  const contentWidth = pageWidth - margin * 2;
  let y = margin;

  // Color palette
  const primaryGreen: [number, number, number] = [74, 107, 83];
  const charcoal: [number, number, number] = [37, 37, 37];
  const mutedStone: [number, number, number] = [105, 105, 100];
  const warmOchre: [number, number, number] = [200, 138, 46];
  const lineGrey: [number, number, number] = [225, 222, 214];

  // Helper to ensure page break if needed
  const checkPageBreak = (neededHeight: number) => {
    if (y + neededHeight > pageHeight - margin - 12) {
      doc.addPage();
      y = margin;
      drawRunningHeader();
    }
  };

  // Running header for subsequent pages
  const drawRunningHeader = () => {
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(...mutedStone);
    doc.text(
      `CEQHS Living Journey Dossier · ${currentUser.schoolName} (${currentUser.academicYear})`,
      margin,
      y
    );
    doc.setDrawColor(...lineGrey);
    doc.setLineWidth(0.3);
    doc.line(margin, y + 2, pageWidth - margin, y + 2);
    y += 8;
  };

  // -------------------------------------------------------------
  // 1. COVER / HEADER BANNER
  // -------------------------------------------------------------
  // Decorative top emblem block
  doc.setFillColor(...primaryGreen);
  doc.roundedRect(margin, y, 14, 14, 2, 2, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text('C', margin + 4.5, y + 9.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...primaryGreen);
  doc.text(
    'CENTER FOR EMOTIONAL INTELLIGENCE & HUMAN SKILLS',
    margin + 18,
    y + 5
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedStone);
  doc.text('LIVING ANNUAL JOURNEY DOSSIER SUMMARY', margin + 18, y + 10);

  y += 20;

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(...charcoal);
  doc.text('CEQHS School Journey Dossier', margin, y);
  y += 7;

  doc.setFont('helvetica', 'italic');
  doc.setFontSize(11);
  doc.setTextColor(...mutedStone);
  doc.text(
    'A Living Record of Human Connection, Deliberate Practice & Cultural Growth',
    margin,
    y
  );
  y += 10;

  // Meta details box
  doc.setFillColor(250, 249, 245);
  doc.setDrawColor(...lineGrey);
  doc.setLineWidth(0.4);
  doc.roundedRect(margin, y, contentWidth, 22, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(...charcoal);
  doc.text(`School: ${currentUser.schoolName}`, margin + 4, y + 6);
  doc.text(`Educator: ${currentUser.name} (${currentUser.title})`, margin + 4, y + 12);
  doc.text(
    `Academic Year: ${currentUser.academicYear}   |   Verified Learning Center Candidate`,
    margin + 4,
    y + 18
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...mutedStone);
  const exportDate = new Date().toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  doc.text(`Generated: ${exportDate}`, pageWidth - margin - 45, y + 6);
  y += 28;

  // -------------------------------------------------------------
  // 2. OPENING INTENTION & FOUNDATION
  // -------------------------------------------------------------
  if (currentUser.intention) {
    checkPageBreak(25);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...primaryGreen);
    doc.text('1. OPENING INTENTION & ORIENTATION', margin, y);
    y += 5;

    doc.setDrawColor(...primaryGreen);
    doc.setLineWidth(0.8);
    doc.line(margin, y, margin + 40, y);
    y += 5;

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(9.5);
    doc.setTextColor(...charcoal);
    const splitIntention = doc.splitTextToSize(
      `"${currentUser.intention}"`,
      contentWidth - 8
    );
    doc.text(splitIntention, margin + 4, y);
    y += splitIntention.length * 5 + 4;
  }

  // -------------------------------------------------------------
  // 3. KEY MILESTONES & EMBEDDED PRACTICE SHIFTS (Before & Now)
  // -------------------------------------------------------------
  checkPageBreak(30);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('2. KEY MILESTONES & EMBEDDED CULTURAL SHIFTS', margin, y);
  y += 5;
  doc.setDrawColor(...primaryGreen);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 50, y);
  y += 6;

  beforeNowShifts.forEach((shift, index) => {
    checkPageBreak(24);

    // Number tag
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.5);
    doc.setTextColor(...warmOchre);
    doc.text(`Shift 0${index + 1}: ${shift.theme.toUpperCase()}`, margin, y);
    y += 4.5;

    // Before
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...mutedStone);
    doc.text('Before: ', margin + 2, y);

    doc.setFont('helvetica', 'italic');
    doc.setTextColor(90, 90, 90);
    const beforeLines = doc.splitTextToSize(`"${shift.before}"`, contentWidth - 20);
    doc.text(beforeLines, margin + 16, y);
    y += beforeLines.length * 4 + 2;

    // Now
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(...primaryGreen);
    doc.text('Now: ', margin + 2, y);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...charcoal);
    const nowLines = doc.splitTextToSize(`"${shift.now}"`, contentWidth - 20);
    doc.text(nowLines, margin + 16, y);
    y += nowLines.length * 4 + 2;

    // Catalysts
    if (shift.catalysts && shift.catalysts.length > 0) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(...mutedStone);
      doc.text(`Catalysts: ${shift.catalysts.join(' · ')}`, margin + 16, y);
      y += 4;
    }

    y += 3;
  });

  // -------------------------------------------------------------
  // 4. CURATED JOURNEY ENTRIES & MOMENTS THAT MATTERED
  // -------------------------------------------------------------
  checkPageBreak(30);
  y += 3;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('3. CURATED JOURNEY ENTRIES & EVIDENCE RECORD', margin, y);
  y += 5;
  doc.setDrawColor(...primaryGreen);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 50, y);
  y += 6;

  // Prioritize entries marked for dossier or prominent moments/practices
  const exportEntries = entries
    .filter((e) => e.includedInDossier || e.type === 'moment' || e.type === 'practice')
    .slice(0, 8);

  exportEntries.forEach((entry, idx) => {
    checkPageBreak(28);

    // Entry header
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(9);
    doc.setTextColor(...charcoal);
    doc.text(`${idx + 1}. ${entry.title}`, margin, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedStone);
    doc.text(`${entry.date} · ${entry.type.toUpperCase()}`, pageWidth - margin - 35, y);
    y += 4.5;

    // Description / quote
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(50, 50, 50);
    const desc = entry.whatHappened || entry.description;
    const splitDesc = doc.splitTextToSize(desc, contentWidth - 6);
    doc.text(splitDesc, margin + 3, y);
    y += splitDesc.length * 4 + 1.5;

    // Notice or why this matters
    const reflectionText = entry.whatDidINotice || entry.whyDoesThisMatter;
    if (reflectionText) {
      checkPageBreak(12);
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(8);
      doc.setTextColor(...primaryGreen);
      const splitReflect = doc.splitTextToSize(
        `Pedagogical Impact: "${reflectionText}"`,
        contentWidth - 8
      );
      doc.text(splitReflect, margin + 3, y);
      y += splitReflect.length * 3.8 + 2;
    }

    // Divider line
    doc.setDrawColor(...lineGrey);
    doc.setLineWidth(0.2);
    doc.line(margin, y, pageWidth - margin, y);
    y += 4;
  });

  // -------------------------------------------------------------
  // 5. SIGNALS & WHAT CONTINUES
  // -------------------------------------------------------------
  checkPageBreak(35);
  y += 2;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(...primaryGreen);
  doc.text('4. WHAT CONTINUES (End With Continuity, Not Completion)', margin, y);
  y += 5;
  doc.setDrawColor(...primaryGreen);
  doc.setLineWidth(0.8);
  doc.line(margin, y, margin + 55, y);
  y += 6;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(...charcoal);
  const closingReflection =
    'We do not close this year by declaring that emotional intelligence has been "completed." Human development is living and ongoing. The practices seeded this year—such as the Curious Pause before correcting and weekly regulation circles—form the baseline for our next developmental chapter.';
  const splitClosing = doc.splitTextToSize(closingReflection, contentWidth);
  doc.text(splitClosing, margin, y);
  y += splitClosing.length * 4.2 + 8;

  // Verification seal
  checkPageBreak(20);
  doc.setFillColor(234, 240, 235);
  doc.setDrawColor(...primaryGreen);
  doc.setLineWidth(0.5);
  doc.roundedRect(margin, y, contentWidth, 14, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(...primaryGreen);
  doc.text('VERIFIED CEQHS LEARNING CENTER CANDIDATE', margin + 4, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(...charcoal);
  doc.text(
    'Anchored & verified by the Center for Emotional Intelligence & Human Skills',
    margin + 4,
    y + 10.5
  );

  // Add page numbers to all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.5);
    doc.setTextColor(...mutedStone);
    doc.text(
      `Page ${i} of ${totalPages} · CEQHS Living Journey Dossier`,
      pageWidth / 2 - 20,
      pageHeight - 8
    );
  }

  // Sanitize filename
  const cleanSchool = currentUser.schoolName.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`CEQHS_Dossier_Summary_${cleanSchool}.pdf`);
}
