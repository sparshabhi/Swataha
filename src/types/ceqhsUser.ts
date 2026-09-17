// ============================================================================
// CEQHS USER DASHBOARD — DOMAIN TYPES & INTERFACES
// Cross-institutional control centre for CEQHS and Swataha programme staff
// ============================================================================

export type CEQHSRoleType =
  | 'platform_admin'   // Full control
  | 'programme_lead'   // Assigned schools, implementation, evidence review
  | 'reviewer'         // Assigned evidence, review comments, verify evidence
  | 'observer';        // Read-only access to permitted schools

export type CEQHSUserRole = CEQHSRoleType;

export type PermissionScope = 'global' | 'assigned' | 'tenant_specific' | 'self';

export interface RolePermissions {
  tenants: { view: boolean; add: boolean; edit: boolean; archive: boolean; delete: boolean; scope: PermissionScope };
  users: { view: boolean; add: boolean; edit: boolean; deactivate: boolean; delete: boolean; changeRole: boolean; scope: PermissionScope };
  programmes: { view: boolean; add: boolean; edit: boolean; archive: boolean; scope: PermissionScope };
  content: { view: boolean; add: boolean; edit: boolean; delete: boolean; publish: boolean; scope: PermissionScope };
  practice: { view: boolean; add: boolean; edit: boolean; delete: boolean; scope: PermissionScope };
  evidence: { view: boolean; add: boolean; edit: boolean; delete: boolean; review: boolean; verify: boolean; requestRevision: boolean; scope: PermissionScope };
  surveys: { view: boolean; create: boolean; edit: boolean; publish: boolean; close: boolean; reviewResults: boolean; export: boolean; scope: PermissionScope };
  milestones: { view: boolean; add: boolean; edit: boolean; verify: boolean; scope: PermissionScope };
  dossiers: { view: boolean; create: boolean; edit: boolean; review: boolean; approve: boolean; export: boolean; publish: boolean; scope: PermissionScope };
  reports: { view: boolean; generate: boolean; export: boolean; scope: PermissionScope };
  team: { view: boolean; add: boolean; edit: boolean; deactivate: boolean; scope: PermissionScope };
  audit: { view: boolean; scope: PermissionScope };
  settings: { view: boolean; edit: boolean; scope: PermissionScope };
}

export interface CEQHSStaffUser {
  id: string;
  name: string;
  email: string;
  role: CEQHSRoleType;
  title: string;
  assignedSchoolIds: string[];
  assignedCount: number;
  avatarInitials: string;
  lastSignIn: string;
  isActive: boolean;
  phone?: string;
  joinedDate: string;
  customPermissions?: Partial<RolePermissions>;
}

export type SchoolHealthState = 'Healthy' | 'Watch' | 'Needs intervention' | 'Needs Support';

export type ImplementationPhase =
  | 'ORIENTATION'
  | 'EXPLORE'
  | 'FOCUS'
  | 'PRACTISE'
  | 'REFLECT'
  | 'ADAPT'
  | 'EMBED'
  | 'ENDLINE';

export type SchoolPartnershipStatus =
  | 'Prospect'
  | 'Invited'
  | 'Onboarding'
  | 'Active'
  | 'Needs support'
  | 'Paused'
  | 'Completed / alumni'
  | 'Archived';

export interface CEQHSPartnerSchool {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  shortCode?: string;
  location: string;
  region: string;
  country?: string;
  timezone?: string;
  status: SchoolPartnershipStatus;
  healthState: SchoolHealthState;
  currentPhase: ImplementationPhase;
  phase?: number;
  phaseName?: string;
  implementationCycle: string;
  programme: string;
  cohort: string;
  academicYear: string;
  schoolAdminName: string;
  schoolAdminEmail: string;
  leadCoordinatorName?: string;
  leadCoordinatorEmail?: string;
  assignedOwnerId: string;
  assignedOwnerName: string;
  assignedCeqhsStaffId?: string;
  assignedCeqhsStaffName?: string;
  activeTeachersCount: number;
  enrolledStudentsCount: number;
  teacherCount?: number;
  studentCount?: number;
  primaryCurriculum?: string;
  curriculumJurisdiction?: string;
  participatingGrades?: string[];
  safeguardingAcknowledged?: boolean;
  onboardingCompletedDate?: string;
  approvedPracticesCount?: number;
  trainingProgressPercent: number;
  dossierProgressPercent: number;
  milestonesReachedCount: number;
  totalMilestonesCount: number;
  evidenceCount: number;
  reflectionsCount: number;
  peerObservationsCount: number;
  classroomAdaptationsCount: number;
  lastActivityDate: string;
  riskStatus: 'normal' | 'attention_needed' | 'at_risk';
  attentionReason?: string;
  onboardingDate: string;
  motto?: string;
}

export interface CEQHSEducator {
  id: string;
  schoolId: string;
  schoolName: string;
  name: string;
  email: string;
  role: 'Teacher' | 'Subject Lead' | 'Year Head' | 'SENCO' | 'Assistant Head';
  status: 'Active' | 'Onboarding' | 'Inactive';
  practiceCount: number;
  lastActive: string;
  baselineCompleted: boolean;
  endlineCompleted: boolean;
  currentFocus: string;
  avatarInitials: string;
  reflectionsCount: number;
  evidenceCount: number;
  peerObservationsCount: number;
  classroomAdaptationsCount: number;
  journeyStages: {
    stage: 'Baseline' | 'Explore' | 'Focus' | 'Practise' | 'Reflect' | 'Adapt' | 'Embed' | 'Endline';
    completed: boolean;
    date?: string;
    evidenceId?: string;
  }[];
}

export interface SurveyComparisonMetric {
  id: string;
  domain: string;
  measure: string;
  baselineScore: number;
  endlineScore: number;
  qualitativeSummary: string;
  relatedEvidenceCount: number;
  observedPracticeNotes: string;
}

export interface DossierReadinessMetrics {
  evidenceCoverage: number;       // e.g. 87%
  practiceCoverage: number;       // e.g. 91%
  reflectionCoverage: number;     // e.g. 76%
  peerVerification: number;       // e.g. 64%
  baselineStatus: 'Complete' | 'In Progress' | 'Not Started';
  endlineStatus: 'Complete' | 'In Progress' | 'Not Started';
  studentVoiceStatus: 'Collected' | 'In Progress' | 'Not collected';
}

export type DossierReviewStatus =
  | 'Awaiting review'
  | 'In review'
  | 'Approved'
  | 'Revision requested'
  | 'Flagged for follow-up'
  | 'Archived';

export interface DossierVersionHistory {
  version: number;
  submittedDate: string;
  submittedBy: string;
  summary: string;
  evidenceUrl?: string;
  revisionReason?: string;
  reviewerNotes?: string;
}

export interface DossierItemEvidence {
  id: string;
  schoolId: string;
  schoolName: string;
  tenantId: string;
  sectionDomain:
    | 'School context'
    | 'Leadership commitment'
    | 'Teacher readiness'
    | 'EQ learning and development'
    | 'Classroom implementation'
    | 'Student voice and reflection'
    | 'Community and relational practice'
    | 'Evidence and next steps';
  title: string;
  submittedBy: string;
  submittedByRole: string;
  submittedDate: string;
  lastUpdatedDate: string;
  evidenceType: 'Classroom Observation' | 'Restorative Circle Record' | 'Student Reflection Voice' | 'Teacher Micro-Pause Log' | 'Leadership Charter' | 'Survey Aggregate';
  reviewStatus: DossierReviewStatus;
  assignedReviewerId: string;
  assignedReviewerName: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  evidenceSummary: string;
  studentVoiceExcerpt?: string;
  teacherReflectionExcerpt?: string;
  schoolVisibleFeedback?: string;
  ceqhsInternalNotes?: string;
  containsStudentInfo: boolean;
  isSensitiveContent: boolean;
  version: number;
  versionHistory: DossierVersionHistory[];
  tags: string[];
}

export type MilestoneVerificationStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Evidence Submitted'
  | 'Verified'
  | 'Revision Requested';

export interface MilestoneItem {
  id: string;
  key: string;
  name: string;
  phase: 'Phase 1: Orientation' | 'Phase 2: Teacher EQ Training' | 'Phase 3: Classroom Implementation' | 'Phase 4: Synthesis & Dossier';
  criteria: string;
  evidenceRequirements: string;
  status: MilestoneVerificationStatus;
  schoolId: string;
  schoolName: string;
  verifiedBy?: string;
  verifiedDate?: string;
  verificationNotes?: string;
  reopenReason?: string;
  completionPercent: number;
}

export interface TrainingCohort {
  id: string;
  programmeName: string;
  cohortCode: string;
  schoolId: string;
  schoolName: string;
  startDate: string;
  endDate: string;
  enrolledTeachersCount: number;
  completedTeachersCount: number;
  stalledTeachersCount: number;
  averageProgressPercent: number;
  leadFacilitator: string;
  status: 'Upcoming' | 'In Progress' | 'Completed' | 'Delayed';
}

export type SupportCaseCategory =
  | 'Onboarding'
  | 'Training'
  | 'Implementation'
  | 'Curriculum Alignment'
  | 'Dossier clarification'
  | 'Technical issue'
  | 'Safeguarding / sensitivity concern'
  | 'Leadership support'
  | 'Other';

export interface SupportCaseItem {
  id: string;
  caseNumber: string;
  schoolId: string;
  schoolName: string;
  relatedPersonName?: string;
  relatedPersonRole?: string;
  category: SupportCaseCategory;
  description: string;
  ownerId: string;
  ownerName: string;
  priority: 'Low' | 'Medium' | 'High' | 'Urgent';
  dueDate: string;
  status: 'Open' | 'In Progress' | 'Awaiting School' | 'Resolved';
  internalNotes: string;
  resolutionDate?: string;
  createdAt: string;
}

export interface AuditEventItem {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  actionType:
    | 'Sign-in'
    | 'Role change'
    | 'School assignment change'
    | 'Evidence access'
    | 'Review decision'
    | 'Milestone verification'
    | 'Report export'
    | 'Sensitive record access'
    | 'Staff deactivation'
    | 'School tenant created'
    | string;
  details: string;
  schoolId?: string;
  schoolName?: string;
  ipAddress: string;
}

export interface PriorityQueueItem {
  id: string;
  priority: 'urgent' | 'high' | 'medium';
  schoolId: string;
  schoolName: string;
  issue: string;
  lastActivity: string;
  ownerName: string;
  dueDate: string;
  actionLabel: string;
  actionTarget: 'dossier' | 'school' | 'milestones' | 'support' | 'training';
}

export interface RecentActivityItem {
  id: string;
  type: 'school_onboarded' | 'evidence_submitted' | 'milestone_verified' | 'support_opened' | 'school_update' | 'cohort_completed';
  schoolName: string;
  title: string;
  description: string;
  timestamp: string;
  actorName: string;
}
