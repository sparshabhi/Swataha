export type ImpactLevel =
  | 'learner'
  | 'adult'
  | 'classroom_relationship'
  | 'school_culture_systems'
  | 'family_community'
  | 'implementation_quality'
  | 'equity_safety'
  | 'sustainability';

export type MeasurementWave = 'baseline' | 'midline' | 'endline' | 'follow_up';

export type EvidenceStrength =
  | 'Emerging evidence'
  | 'Developing evidence'
  | 'Strong school-level evidence'
  | 'Reviewed impact evidence';

export type InformantType =
  | 'learner_self_report'
  | 'teacher_observation'
  | 'facilitator_walkthrough'
  | 'administrative_data'
  | 'parent_feedback'
  | 'coaching_log';

export interface EvidenceLink {
  id: string;
  title: string;
  dossierSectionId: string;
  sourceType: InformantType;
  dateLogged: string;
  verifiedBy: string;
  summary: string;
  sampleSize?: number;
  responseRate?: number;
  limitationNote?: string;
  privacyLevel: 'public_school' | 'confidential_faculty' | 'internal_ceqhs_only';
}

export interface ImpactIndicator {
  id: string;
  name: string;
  code: string;
  impactLevel: ImpactLevel;
  domain?: 'Self-Awareness' | 'Self-Management & Regulation' | 'Social Awareness' | 'Relationship Skills' | 'Responsible Decision-Making' | 'Values-in-Action';
  description: string;
  measureType: 'scale_1_5' | 'percentage' | 'count' | 'rubric_stage' | 'frequency';
  informant: InformantType;
  baselineValue: number;
  midlineValue?: number;
  endlineValue?: number;
  unit: string;
  interpretationGuide: string;
  calculationMethod: string;
  cautiousInterpretation: string;
  sampleSize: number;
  responseRate: number;
  evidenceStrength: EvidenceStrength;
  evidenceLinks: EvidenceLink[];
  needsAttention?: boolean;
}

export interface DomainDevelopmentWheelData {
  domain: string;
  baseline: number; // e.g. 1 to 5 scale
  current: number;
  evidenceStrength: EvidenceStrength;
  evidenceCount: number;
  indicatorHighlight: string;
  sourceSummary: string;
  cautionaryNote: string;
}

export interface FunnelStage {
  stage: string;
  eligibleCount: number;
  reachedCount: number;
  percentageOfEligible: number;
  dropOffReason: string;
  evidenceRecordRef: string;
}

export interface TimelineMilestone {
  id: string;
  name: string;
  period: string;
  status: 'Planned' | 'Active' | 'Completed' | 'Delayed' | 'Needs review' | 'Evidence approved';
  evidenceCount: number;
  dossierRef: string;
  details: string;
}

export interface CultureHealthIndicator {
  id: string;
  dimension: string;
  description: string;
  status: 'green' | 'amber' | 'red' | 'grey';
  statusLabel: string;
  evidenceSummary: string;
  observedShift: string;
  dossierRef: string;
}

export interface EquitySubgroupData {
  groupName: string;
  category: 'Grade Level' | 'Language Cohort' | 'Support Category';
  enrolled: number;
  reachPct: number;
  receivedDosePct: number;
  changeObserved: string;
  accessibilityAdaptation: string;
  cellSuppressed?: boolean; // privacy safety rule: suppress small n < 5
}

export interface SustainabilityDimensionData {
  id: string;
  title: string;
  status: 'Institutionalized' | 'Developing' | 'Action Needed';
  scoreLevel: 1 | 2 | 3; // 1 = early, 2 = developing, 3 = established
  leadRole: string;
  evidenceNotes: string;
  nextStep: string;
}

export interface DossierNarrativeDraft {
  id: string;
  sectionTitle: string;
  academicPeriod: string;
  indicatorRef: string;
  whatChanged: string;
  evidenceSupport: string;
  implementationContext: string;
  plausibleContribution: string;
  alternativeExplanations: string;
  limitations: string;
  recommendedNextStep: string;
  status: 'Draft generated' | 'Under Review' | 'Approved by Architect' | 'Revision Requested';
  approvedBy?: string;
  approvalDate?: string;
  linkedEvidenceIds: string[];
}

export interface ReviewQueueItem {
  id: string;
  schoolName: string;
  submissionDate: string;
  ceqhsStage: 'Year 1: Foundation' | 'Year 2: Integration' | 'Year 3: Impact & Leadership';
  criterionCode: string;
  criterionTitle: string;
  category: 'Classroom Log' | 'Adult Journal' | 'Baseline Survey' | 'Fidelity Audit' | 'Accreditation Dossier';
  submittedBy: string;
  status: 'Awaiting Review' | 'Accepted' | 'Accepted with Note' | 'Clarification Requested' | 'Insufficient';
  evidenceSummary: string;
  reviewerNotes?: string;
  flags?: ('safeguarding_separate' | 'low_dosage' | 'missing_baseline')[];
}
