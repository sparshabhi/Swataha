// ============================================================================
// CEQHS AUTOMATIC PRINTABLE DOSSIER DATA MODEL & WORKFLOW ARCHITECTURE
// Aligned with Grade 1–5 Implementation, Curriculum Alignment & Founder Authority
// ============================================================================

export type DossierStatus =
  | 'Draft'
  | 'Collecting evidence'
  | 'School curation in progress'
  | 'Awaiting school review'
  | 'Submitted to CEQHS'
  | 'CEQHS review in progress'
  | 'Revision requested'
  | 'Verified for publication'
  | 'Published'
  | 'Superseded'
  | 'Archived';

export type EvidenceVerificationStatus = 'Documented' | 'Reported' | 'Verified';

export type PhotoConsentStatus =
  | 'Not reviewed'
  | 'Consent confirmed for school use'
  | 'Consent confirmed for CEQHS review'
  | 'Consent confirmed for external publication'
  | 'Restricted to internal review'
  | 'Do not publish';

export type PhotoLayoutType = 'Hero Evidence' | 'Evidence Pair' | 'Evidence Mosaic';

export type RecordSensitivity =
  | 'Teacher-private'
  | 'School-visible'
  | 'CEQHS-internal'
  | 'Dossier-approved';

export type PrimaryCurriculumFramework =
  | 'National Curriculum'
  | 'International Baccalaureate (IB)'
  | 'Cambridge Curriculum'
  | 'Oxford Curriculum';

export type GradeLevel = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';

export interface VisualEvidenceItem {
  id: string;
  schoolTenantId: string;
  dossierId?: string;
  cycleId: string;
  uploadedBy: string;
  uploaderRole: string;
  dateCaptured: string;
  grade: GradeLevel;
  classOrGroup: string;
  phase: number; // 0 to 5
  phaseName: string;
  practiceArea: string;
  activity: string;
  imageUrl: string;
  caption: string;
  suggestedCaption?: string;
  isCaptionApproved: boolean;
  consentStatus: PhotoConsentStatus;
  studentIdentifyingContentStatus: 'None' | 'De-identified' | 'Has identifying faces/names';
  sensitivityStatus: RecordSensitivity;
  schoolVisibilityStatus: boolean;
  ceqhsSubmissionStatus: boolean;
  verificationStatus: EvidenceVerificationStatus;
  verifiedBy?: string;
  verificationDate?: string;
  selectedForDossier: boolean;
  layoutRecommendation: PhotoLayoutType;
  altText: string;
  credit?: string;
  versionHistory: {
    timestamp: string;
    changedBy: string;
    changeNote: string;
  }[];
}

export interface PracticeStoryItem {
  id: string;
  dossierId: string;
  title: string;
  gradeContext: string;
  phase: string;
  curriculumConnection: string;
  // 5-Stage Practice Architecture
  context: string;
  practice: string;
  evidence: string;
  reflection: string;
  adaptation: string;
  // Before & After contrast
  beforePractice: string;
  afterPractice: string;
  educatorNotice: string;
  whatChangedAfterwards: string;
  verificationStatus: EvidenceVerificationStatus;
  verifiedBy?: string;
  verificationNotes?: string;
  linkedEvidenceIds: string[];
  isCurated: boolean;
  photoLayout: PhotoLayoutType;
  photoUrls: string[];
  curatorNotes?: string;
}

export interface DossierSectionConfig {
  id: string;
  sectionNumber: number; // 1 to 23
  key: string;
  title: string;
  subtitle?: string;
  description: string;
  isIncluded: boolean;
  status: 'complete' | 'in_progress' | 'awaiting_evidence' | 'blocked';
  blockers: string[];
  curatorNotes?: string;
}

export interface DossierClaim {
  id: string;
  claimText: string;
  category: string;
  evidenceStatus: EvidenceVerificationStatus;
  sourceRecordIds: string[];
  verifiedBy?: string;
  verificationDate?: string;
  notes?: string;
}

export interface DossierVersionRecord {
  versionId: string;
  dossierId: string;
  versionNumber: string; // e.g. "v1.0", "v1.1"
  status: DossierStatus;
  generatedAt: string;
  generatedBy: string;
  reviewedBy?: string;
  approvedBy?: string;
  paperSize: 'A4' | 'Letter';
  changelogReason: string;
  isLocked: boolean;
  integrityHash: string;
  pdfUrl?: string;
}

export interface DossierGenerationJob {
  id: string;
  dossierId: string;
  schoolName: string;
  format: 'A4' | 'Letter';
  status: 'queued' | 'processing' | 'completed' | 'failed';
  progressPercent: number;
  startedAt: string;
  completedAt?: string;
  filename: string;
  fileSizeBytes?: number;
  pdfBlobUrl?: string;
  warnings?: string[];
}

export interface DossierPeerObservation {
  id: string;
  observerGrade: string;
  observedGrade: string;
  focusArea: string;
  whatPeersNoticed: string;
  whatEducatorsLearned: string;
  whatChanged: string;
  anonymisedQuote: string;
  verificationStatus: EvidenceVerificationStatus;
}

export interface DossierBaselineComparison {
  indicatorArea: string;
  startingPoint: string;
  currentPractice: string;
  reportedChange: string;
  dataSource: string;
  sampleSize: string;
  collectionDate: string;
  isSelfReported: boolean;
  interpretationNote: string;
}

export interface DossierModel {
  id: string;
  schoolTenantId: string;
  schoolName: string;
  schoolLocation: string;
  schoolType: string;
  cycleId: string;
  cycleName: string;
  implementationPeriod: string;
  academicYear: string;
  programmeVersionId: string;
  programmeVersionName: string;
  primaryCurriculum: PrimaryCurriculumFramework;
  curriculumJurisdiction: string;
  participatingGrades: GradeLevel[];
  status: DossierStatus;
  leadCoordinator: {
    name: string;
    email: string;
    role: string;
  };
  ceqhsLeadReviewer: {
    name: string;
    email: string;
    role: string;
  };
  targetSections: DossierSectionConfig[];
  
  // Section 3: School Context Narrative
  schoolNarrative: string;
  startingPointSummary: string;
  focusSummary: string;
  embeddingSummary: string;
  
  // Section 22: Narrative Journey
  narrativeJourneyDraft: string;
  isNarrativeApproved: boolean;
  narrativeSourceCitations: string[];
  
  // Visual Cover
  heroPhotoUrl: string;
  heroPhotoCaption: string;
  coverFooter: string;
  
  // Section 20: Official Verification Statement
  verificationStatement: string;
  verifiedByFounder: boolean;
  founderApprovalTimestamp?: string;
  founderApprovalNotes?: string;
  
  // Curated Content Collections
  claims: DossierClaim[];
  practiceStories: PracticeStoryItem[];
  visualEvidence: VisualEvidenceItem[];
  peerObservations: DossierPeerObservation[];
  baselineComparisons: DossierBaselineComparison[];
  qualitativeFindings: string[];
  
  // Versioning
  activeVersionNumber: string;
  versionHistory: DossierVersionRecord[];
  
  createdAt: string;
  updatedAt: string;
}

export interface DossierCompletenessReport {
  canPublish: boolean;
  canGenerateDraft: boolean;
  blockers: string[];
  warnings: string[];
  missingRequiredSections: string[];
  unverifiedClaimsCount: number;
  missingCaptionsCount: number;
  consentBlockedCount: number;
  privateLeaksCount: number;
  verifiedItemsCount: number;
  totalClaimsCount: number;
}
