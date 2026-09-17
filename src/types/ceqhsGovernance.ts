// ============================================================================
// CEQHS GOVERNANCE, CURRICULUM ALIGNMENT & GRADES 1–5 DOMAIN MODEL
// Sole Super Admin: Saugat Singh (Founder and Chief Program Architect)
// ============================================================================

export type ApprovalState =
  | 'Draft'
  | 'Invitation sent'
  | 'Pending approval'
  | 'Approved'
  | 'Active'
  | 'Suspended'
  | 'Rejected'
  | 'Archived';

export type PrimaryCurriculumType =
  | 'National Curriculum'
  | 'International Baccalaureate (IB)'
  | 'Cambridge Curriculum'
  | 'Oxford Curriculum';

export type GradeLevel = 'Grade 1' | 'Grade 2' | 'Grade 3' | 'Grade 4' | 'Grade 5';

export type DevelopmentalBand =
  | 'Foundation (Grade 1–2)'
  | 'Developing (Grade 3–4)'
  | 'Transition (Grade 5)';

export interface SuperAdminProfile {
  id: string;
  name: 'Saugat Singh';
  title: 'Founder and Chief Program Architect';
  organisation: 'CEQHS / Swataha';
  role: 'super_admin';
  scope: 'Entire platform and all partner schools';
  email: string;
  avatarInitials: 'SS';
}

export interface ApprovalRequest {
  id: string;
  targetType:
    | 'ceqhs_member'
    | 'school'
    | 'school_admin'
    | 'teacher'
    | 'curriculum_mapping'
    | 'programme_version'
    | 'phase_change';
  targetId: string;
  targetName: string;
  submittedBy: string;
  submittedAt: string;
  proposedRoleOrPhase?: string;
  schoolId?: string;
  schoolName?: string;
  status: ApprovalState;
  details: Record<string, any>;
  decisionHistory: ApprovalDecision[];
}

export interface ApprovalDecision {
  id: string;
  decision: 'Approved' | 'Rejected' | 'Request Clarification' | 'Activated' | 'Suspended';
  decisionMaker: 'Saugat Singh';
  decisionMakerRole: 'Founder and Chief Program Architect';
  timestamp: string;
  previousState: ApprovalState;
  newState: ApprovalState;
  notes: string;
  auditEventId: string;
}

export interface CurriculumFramework {
  id: string;
  name: PrimaryCurriculumType;
  shortCode: 'NC' | 'IB' | 'CA' | 'OX';
  defaultLabel: string;
  description: string;
  jurisdictionNote: string;
  disclaimer: string;
  outcomeDomains: CurriculumOutcomeDomain[];
}

export interface CurriculumOutcomeDomain {
  id: string;
  frameworkId: string;
  code: string;
  name: string;
  description: string;
  gradeBands: string[];
  outcomes: CurriculumOutcome[];
}

export interface CurriculumOutcome {
  id: string;
  domainId: string;
  frameworkCode: string;
  referenceCode: string;
  title: string;
  description: string;
  gradeRange: string;
  altConnectionNote?: string;
}

export type MappingStatus =
  | 'Draft'
  | 'Under review'
  | 'Approved for pilot use'
  | 'Needs revision'
  | 'Retired';

export interface CurriculumAlignmentMapping {
  id: string;
  frameworkName: PrimaryCurriculumType;
  jurisdiction: string;
  gradeRange: string;
  outcomeDomainName: string;
  outcomeReferenceCode: string;
  outcomeTitle: string;
  frameworkOutcomeVerbatim?: string;
  ceqhsPracticeId: string;
  ceqhsPracticeName: string;
  ceqhsPhaseNumber: number;
  ceqhsPhaseName: string;
  alignmentExplanation: string;
  connectionTypeLabel: string; // e.g., "IB / ATL-related learning outcome connection", "Oxford / Wellbeing connection"
  alignmentType?: 'Direct' | 'Contributing' | 'Contextual';
  evidenceTier?: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4';
  evidenceTierLabel?: string;
  indicatorsOfWorking?: string[];
  disconfirmingIndicators?: string[];
  crossAnchorSimilarityScore?: number;
  crossAnchorWarning?: string;
  isInternalOnly?: boolean;
  confidenceStatus: 'High' | 'Hypothesis under review' | 'School validated';
  mappingStatus: MappingStatus;
  sourceReference: string;
  createdBy: string;
  approvedBy?: 'Saugat Singh';
  approvedAt?: string;
  version: number;
  schoolSpecificNotes?: {
    schoolId: string;
    schoolName: string;
    note: string;
    submittedBy: string;
    date: string;
  }[];
}

export interface CEQHSPhaseDefinition {
  phaseNumber: 0 | 1 | 2 | 3 | 4 | 5;
  phaseId: string;
  code: string;
  name: string;
  workingLabel: string;
  purpose: string;
  studentExperience: string;
  teacherPracticesSummary: string;
  evidenceExpectations: string;
  readinessCriteria: string;
  recommendedGradeBands: string[];
  reviewMethod: string;
  practiceFamilyNames: string[];
  version: number;
}

export interface CEQHSPracticeDefinition {
  id: string;
  name: string;
  purpose: string;
  phaseNumber: number;
  phaseName: string;
  recommendedGrades: GradeLevel[];
  developmentalRationale: string;
  suggestedDuration: string;
  materialsNeeded: string;
  teacherGuidance: string;
  studentFacingObjective: string;
  studentFacingLanguage: string;
  // Age-Appropriate Adaptations
  adaptationsFoundation: string; // Grade 1–2
  adaptationsDeveloping: string; // Grade 3–4
  adaptationsTransition: string; // Grade 5
  suggestedEvidencePrompts: string[];
  safeguardingNotes: string;
  curriculumMappingReferences: string[];
  version: number;
  approvalStatus: 'Approved for pilot use' | 'Draft';
}

export interface SchoolCurriculumSelection {
  primaryCurriculum: PrimaryCurriculumType;
  curriculumVersionOrCountry: string;
  participatingGrades: GradeLevel[];
  developmentalGroupingPreference: DevelopmentalBand[];
  existingWellbeingOrSELFramework: string;
  curriculumCoordinatorName: string;
  curriculumCoordinatorEmail: string;
  curriculumDocumentationName?: string;
  alignmentAcknowledgementAccepted: boolean;
  acknowledgedAt: string;
}

export interface PilotSchoolTenant {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  location: string;
  country: string;
  region: string;
  schoolType: 'Independent' | 'Public / State' | 'International' | 'Charter / Trust';
  primaryContactName: string;
  primaryContactEmail: string;
  primaryContactRole: string;
  website?: string;
  timeZone: string;
  curriculum: SchoolCurriculumSelection;
  currentPhase: CEQHSPhaseDefinition;
  approvalStatus: ApprovalState;
  approvedBy?: 'Saugat Singh';
  approvedAt?: string;
  onboardedAt: string;
  partnershipStartDate: string;
  leadTeacherName?: string;
  enrolledTeachersCount: number;
  participatingGrades: GradeLevel[];
  implementationCycle: string;
  dossierSubmissionCount: number;
  evidenceCount: number;
  safeguardingAcknowledged: boolean;
  dataMinimisationAcknowledged: boolean;
}

export interface EnvironmentResetRecord {
  id: string;
  timestamp: string;
  operator: 'Saugat Singh';
  operatorRole: 'Founder and Chief Program Architect';
  environmentName: 'Development Pilot Environment';
  deploymentId: string;
  confirmationPhraseUsed: 'RESET CEQHS PILOT DATA';
  recordsRemovedCount: number;
  recordsRetainedCount: number;
  categoriesPurged: string[];
  resetVersion: string;
  notes: string;
}
