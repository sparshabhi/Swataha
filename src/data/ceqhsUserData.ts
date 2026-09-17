import {
  CEQHSStaffUser,
  CEQHSPartnerSchool,
  DossierItemEvidence,
  MilestoneItem,
  TrainingCohort,
  SupportCaseItem,
  AuditEventItem,
  PriorityQueueItem,
  RecentActivityItem,
  CEQHSEducator,
  SurveyComparisonMetric,
  DossierReadinessMetrics,
  RolePermissions,
} from '../types/ceqhsUser';

// ---------------------------------------------------------------------------
// DEFAULT RBAC PERMISSION CONFIGURATIONS
// ---------------------------------------------------------------------------
export const DEFAULT_ROLE_PERMISSIONS: Record<string, RolePermissions> = {
  platform_admin: {
    tenants: { view: true, add: true, edit: true, archive: true, delete: true, scope: 'global' },
    users: { view: true, add: true, edit: true, deactivate: true, delete: true, changeRole: true, scope: 'global' },
    programmes: { view: true, add: true, edit: true, archive: true, scope: 'global' },
    content: { view: true, add: true, edit: true, delete: true, publish: true, scope: 'global' },
    practice: { view: true, add: true, edit: true, delete: true, scope: 'global' },
    evidence: { view: true, add: true, edit: true, delete: true, review: true, verify: true, requestRevision: true, scope: 'global' },
    surveys: { view: true, create: true, edit: true, publish: true, close: true, reviewResults: true, export: true, scope: 'global' },
    milestones: { view: true, add: true, edit: true, verify: true, scope: 'global' },
    dossiers: { view: true, create: true, edit: true, review: true, approve: true, export: true, publish: true, scope: 'global' },
    reports: { view: true, generate: true, export: true, scope: 'global' },
    team: { view: true, add: true, edit: true, deactivate: true, scope: 'global' },
    audit: { view: true, scope: 'global' },
    settings: { view: true, edit: true, scope: 'global' },
  },
  programme_lead: {
    tenants: { view: true, add: false, edit: true, archive: false, delete: false, scope: 'assigned' },
    users: { view: true, add: true, edit: true, deactivate: false, delete: false, changeRole: false, scope: 'assigned' },
    programmes: { view: true, add: false, edit: false, archive: false, scope: 'assigned' },
    content: { view: true, add: true, edit: true, delete: false, publish: false, scope: 'assigned' },
    practice: { view: true, add: true, edit: true, delete: false, scope: 'assigned' },
    evidence: { view: true, add: true, edit: true, delete: false, review: true, verify: true, requestRevision: true, scope: 'assigned' },
    surveys: { view: true, create: false, edit: false, publish: false, close: false, reviewResults: true, export: true, scope: 'assigned' },
    milestones: { view: true, add: false, edit: true, verify: true, scope: 'assigned' },
    dossiers: { view: true, create: true, edit: true, review: true, approve: false, export: true, publish: false, scope: 'assigned' },
    reports: { view: true, generate: true, export: true, scope: 'assigned' },
    team: { view: true, add: false, edit: false, deactivate: false, scope: 'assigned' },
    audit: { view: false, scope: 'assigned' },
    settings: { view: false, edit: false, scope: 'assigned' },
  },
  reviewer: {
    tenants: { view: true, add: false, edit: false, archive: false, delete: false, scope: 'assigned' },
    users: { view: true, add: false, edit: false, deactivate: false, delete: false, changeRole: false, scope: 'assigned' },
    programmes: { view: true, add: false, edit: false, archive: false, scope: 'assigned' },
    content: { view: true, add: false, edit: false, delete: false, publish: false, scope: 'assigned' },
    practice: { view: true, add: false, edit: false, delete: false, scope: 'assigned' },
    evidence: { view: true, add: false, edit: false, delete: false, review: true, verify: true, requestRevision: true, scope: 'assigned' },
    surveys: { view: true, create: false, edit: false, publish: false, close: false, reviewResults: true, export: false, scope: 'assigned' },
    milestones: { view: true, add: false, edit: false, verify: true, scope: 'assigned' },
    dossiers: { view: true, create: false, edit: false, review: true, approve: false, export: false, publish: false, scope: 'assigned' },
    reports: { view: true, generate: false, export: false, scope: 'assigned' },
    team: { view: false, add: false, edit: false, deactivate: false, scope: 'assigned' },
    audit: { view: false, scope: 'assigned' },
    settings: { view: false, edit: false, scope: 'assigned' },
  },
  observer: {
    tenants: { view: true, add: false, edit: false, archive: false, delete: false, scope: 'assigned' },
    users: { view: true, add: false, edit: false, deactivate: false, delete: false, changeRole: false, scope: 'assigned' },
    programmes: { view: true, add: false, edit: false, archive: false, scope: 'assigned' },
    content: { view: true, add: false, edit: false, delete: false, publish: false, scope: 'assigned' },
    practice: { view: true, add: false, edit: false, delete: false, scope: 'assigned' },
    evidence: { view: true, add: false, edit: false, delete: false, review: false, verify: false, requestRevision: false, scope: 'assigned' },
    surveys: { view: true, create: false, edit: false, publish: false, close: false, reviewResults: true, export: false, scope: 'assigned' },
    milestones: { view: true, add: false, edit: false, verify: false, scope: 'assigned' },
    dossiers: { view: true, create: false, edit: false, review: false, approve: false, export: true, publish: false, scope: 'assigned' },
    reports: { view: true, generate: false, export: true, scope: 'assigned' },
    team: { view: false, add: false, edit: false, deactivate: false, scope: 'assigned' },
    audit: { view: false, scope: 'assigned' },
    settings: { view: false, edit: false, scope: 'assigned' },
  },
};

// ---------------------------------------------------------------------------
// CEQHS PROGRAMME STAFF
// ---------------------------------------------------------------------------
export const SEED_CEQHS_STAFF: CEQHSStaffUser[] = [
  {
    id: 'staff-1',
    name: 'Saugat Singh',
    email: 'saugat.swataha@gmail.com',
    role: 'platform_admin',
    title: 'Founder & Chief Program Architect',
    assignedSchoolIds: [],
    assignedCount: 0,
    avatarInitials: 'SS',
    lastSignIn: 'Today at 08:30 AM',
    isActive: true,
    phone: '+1 (555) 234-9810',
    joinedDate: '2025-06-01',
  },
  {
    id: 'staff-2',
    name: 'Priya Sharma',
    email: 'priya.sharma@ceqhs.org',
    role: 'programme_lead',
    title: 'Senior Programme Lead',
    assignedSchoolIds: [],
    assignedCount: 0,
    avatarInitials: 'PS',
    lastSignIn: 'Today at 09:15 AM',
    isActive: true,
    phone: '+1 (555) 438-1122',
    joinedDate: '2025-09-15',
  },
  {
    id: 'staff-3',
    name: 'Marcus Vance',
    email: 'marcus.vance@ceqhs.org',
    role: 'reviewer',
    title: 'Lead Quality & Evidence Reviewer',
    assignedSchoolIds: [],
    assignedCount: 0,
    avatarInitials: 'MV',
    lastSignIn: 'Yesterday at 04:40 PM',
    isActive: true,
    phone: '+1 (555) 890-4433',
    joinedDate: '2025-11-01',
  },
  {
    id: 'staff-4',
    name: 'Elena Woods',
    email: 'elena.woods@ceqhs.org',
    role: 'observer',
    title: 'Academic Observer & Research Analyst',
    assignedSchoolIds: [],
    assignedCount: 0,
    avatarInitials: 'EW',
    lastSignIn: 'Today at 07:55 AM',
    isActive: true,
    phone: '+1 (555) 672-9901',
    joinedDate: '2026-01-10',
  },
];

// ---------------------------------------------------------------------------
// PARTNER SCHOOLS (Fresh baseline - ready for school onboarding)
// ---------------------------------------------------------------------------
export const SEED_PARTNER_SCHOOLS: CEQHSPartnerSchool[] = [];

// ---------------------------------------------------------------------------
// DOSSIER REVIEW QUEUE ITEMS (with Version History & Confidentiality Rules)
// ---------------------------------------------------------------------------
export const SEED_DOSSIER_ITEMS: DossierItemEvidence[] = [];

// ---------------------------------------------------------------------------
// NETWORK DEVELOPMENTAL MILESTONES (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_MILESTONES: MilestoneItem[] = [];

// ---------------------------------------------------------------------------
// TRAINING PROGRAMMES & COHORTS (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_TRAINING_COHORTS: TrainingCohort[] = [];

// ---------------------------------------------------------------------------
// FOLLOW-UP & SUPPORT CASES (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_SUPPORT_CASES: SupportCaseItem[] = [];

// ---------------------------------------------------------------------------
// PRIORITY QUEUE (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_PRIORITY_QUEUE: PriorityQueueItem[] = [];

// ---------------------------------------------------------------------------
// RECENT NETWORK ACTIVITY LOG (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_RECENT_ACTIVITY: RecentActivityItem[] = [];

// ---------------------------------------------------------------------------
// AUDIT LOG EVENTS (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_AUDIT_LOGS: AuditEventItem[] = [
  {
    id: 'audit-fresh-001',
    timestamp: '2026-09-17 09:20:00',
    actorName: 'Saugat Singh',
    actorRole: 'Super Admin',
    actionType: 'Fresh Platform Initialized',
    details: 'CEQHS Platform initialized in clean state. All previous tenants, schools, reports, and dossiers cleared. System is ready for new partner school onboarding.',
    ipAddress: '192.168.1.100',
  },
];

// ---------------------------------------------------------------------------
export const TEN_DEVELOPMENTAL_MILESTONES_DEF = [
  { key: 'baseline_complete', name: '1. Baseline complete', phase: 'Phase 1: Orientation' as const, requirement: 'Baseline survey completed by at least 80% of faculty.' },
  { key: 'onboarding_complete', name: '2. Educator onboarding complete', phase: 'Phase 1: Orientation' as const, requirement: 'Staff accounts provisioned, portal walkthrough and charter signed.' },
  { key: 'first_practice_cycle', name: '3. First practice cycle', phase: 'Phase 2: Teacher EQ Training' as const, requirement: 'Initial 14-day micro-pause or transition rhythm logged.' },
  { key: 'classroom_application', name: '4. Classroom application', phase: 'Phase 3: Classroom Implementation' as const, requirement: 'Direct classroom emotional literacy protocol observed in 10+ groups.' },
  { key: 'peer_observation', name: '5. Peer observation', phase: 'Phase 3: Classroom Implementation' as const, requirement: 'Reciprocal teacher observation debriefs with co-regulation rubric.' },
  { key: 'midpoint_reflection', name: '6. Midpoint reflection', phase: 'Phase 3: Classroom Implementation' as const, requirement: 'Departmental synthesis on relational climate and adult stress management.' },
  { key: 'sustained_practice', name: '7. Sustained practice', phase: 'Phase 3: Classroom Implementation' as const, requirement: 'Consistent weekly practice cadence verified across whole school term.' },
  { key: 'endline_complete', name: '8. Endline complete', phase: 'Phase 4: Synthesis & Dossier' as const, requirement: 'Repeated endline survey administered with comparison dataset.' },
  { key: 'dossier_ready', name: '9. Dossier ready', phase: 'Phase 4: Synthesis & Dossier' as const, requirement: 'All 11 living dossier chapters curated with representative evidence artifacts.' },
  { key: 'ceqhs_verification', name: '10. CEQHS verification', phase: 'Phase 4: Synthesis & Dossier' as const, requirement: 'Formal CEQHS accreditation quality sign-off and published audit seal.' },
];

// ---------------------------------------------------------------------------
// EDUCATORS ROSTER (Across Partner Schools — 144 Total)
// ---------------------------------------------------------------------------
export const SEED_EDUCATORS: CEQHSEducator[] = [];

// ---------------------------------------------------------------------------
// BASELINE & ENDLINE SURVEY COMPARISON DATA (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_SURVEY_COMPARISONS: SurveyComparisonMetric[] = [];

// ---------------------------------------------------------------------------
// DOSSIER QUALITY CONTROL / READINESS METRICS (Fresh baseline)
// ---------------------------------------------------------------------------
export const SEED_DOSSIER_READINESS: Record<string, DossierReadinessMetrics> = {};
