// ============================================================================
// CEQHS PRISTINE BASELINE STATE & SINGLE SUPER ADMIN DEFINITION
// Sole Super Admin: Saugat Singh (Founder and Chief Program Architect)
// ============================================================================

import {
  SuperAdminProfile,
  ApprovalRequest,
  PilotSchoolTenant,
  EnvironmentResetRecord,
  CurriculumAlignmentMapping,
} from '../types/ceqhsGovernance';
import {
  OFFICIAL_PHASES,
  OFFICIAL_PRACTICES,
  OFFICIAL_CURRICULUM_FRAMEWORKS,
  INITIAL_CURRICULUM_MAPPINGS,
} from './ceqhsCurriculumBaseline';
import { AuditEventItem } from '../types/ceqhsUser';

export const FOUNDER_SUPER_ADMIN: SuperAdminProfile = {
  id: 'user-saugat-singh',
  name: 'Saugat Singh',
  title: 'Founder and Chief Program Architect',
  organisation: 'CEQHS / Swataha',
  role: 'super_admin',
  scope: 'Entire platform and all partner schools',
  email: 'saugat.swataha@gmail.com',
  avatarInitials: 'SS',
};

// Initial Pilot Schools (Fresh clean baseline - ready for school onboarding)
export const SEED_PILOT_SCHOOLS: PilotSchoolTenant[] = [];

// Initial Pending Approval Requests awaiting Founder Saugat Singh (Fresh clean baseline)
export const SEED_APPROVAL_REQUESTS: ApprovalRequest[] = [];

export const INITIAL_RESET_EVENT: EnvironmentResetRecord = {
  id: 'reset-baseline-001',
  timestamp: '2026-09-15 08:30:00 UTC',
  operator: 'Saugat Singh',
  operatorRole: 'Founder and Chief Program Architect',
  environmentName: 'Development Pilot Environment',
  deploymentId: 'ais-pilot-2026.09-release1',
  confirmationPhraseUsed: 'RESET CEQHS PILOT DATA',
  recordsRemovedCount: 0,
  recordsRetainedCount: 24,
  categoriesPurged: [
    'Test Schools & Tenants',
    'Test Student Records',
    'Test Dossiers & Reviews',
    'Sample Evidence Artifacts',
    'Legacy Mock Support Cases',
    'Test Notifications',
  ],
  resetVersion: '1.0.0-pilot-clean',
  notes: 'System initialized to clean Grade 1–5 governance baseline with single Super Admin authority.',
};
