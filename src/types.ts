export type UserRole = 'educator' | 'coordinator' | 'admin';

export type JourneyPhaseId =
  | '01_EXPLORE'
  | '02_FOCUS'
  | '03_PRACTISE'
  | '04_EMBED'
  | '05_REFLECT'
  | '06_REVIEW'
  | '07_RENEW';

export interface JourneyPhase {
  id: JourneyPhaseId;
  number: string;
  name: string;
  question: string;
  description: string;
}

export type MomentCategory =
  | 'Growth'
  | 'Connection'
  | 'Insight'
  | 'Belonging'
  | 'Change'
  | 'Surprise';

export type VisibilityLevel = 'Private' | 'School' | 'Dossier' | 'CEQHS Review';

export type EntryType =
  | 'practice'
  | 'reflection'
  | 'moment'
  | 'evidence'
  | 'voice'
  | 'seen_by_others'
  | 'student_voice';

export interface UserSettings {
  soundEnabled: boolean;
  timerMode: 'adaptive' | 'zen' | 'timed';
  ddaSensitivity: 'gentle' | 'standard' | 'aggressive';
  preferredContext: 'elementary' | 'middle' | 'high' | 'whole_school';
  autoAdvance: boolean;
  themePreference: 'warm_ivory' | 'charcoal' | 'editorial';
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  schoolId: string;
  schoolName: string;
  academicYear: string;
  title: string;
  avatarUrl?: string;
  intention?: string;
  intentionDate?: string;
  settings?: UserSettings;
  reflectionMirror?: {
    earlyReflection: string;
    earlyDate: string;
    prompt: string;
  };
}

export interface Theme {
  id: string;
  title: string;
  question: string;
  category: string;
  tagline: string;
  overview: string;
  whyItMatters: string;
  practiseSteps: string[];
  reflectPrompt: string;
  evidenceIdeas: string[];
  relatedPractices: string[];
}

export interface JourneyEntry {
  id: string;
  tenantId?: string;
  type: EntryType;
  title: string;
  date: string;
  month: string;
  phaseId: JourneyPhaseId;
  themeId?: string;
  themeTitle?: string;
  authorId: string;
  authorName: string;
  authorRole: string;
  description: string;
  // Specific fields
  whatHappened?: string;
  whatDidINotice?: string;
  whatMightITryNext?: string;
  whyDoesThisMatter?: string;
  momentCategory?: MomentCategory;
  evidenceType?: 'Photograph' | 'Document' | 'Video' | 'Voice' | 'Note' | 'Student Work' | 'Observation' | 'Quote';
  photoUrl?: string;
  audioDuration?: string;
  audioBlobUrl?: string;
  transcript?: string;
  observedBy?: string;
  studentQuote?: string;
  gradeLevel?: string;
  visibility: VisibilityLevel;
  includedInDossier: boolean;
  goalId?: string;
  competency?: string;
}

// ---------------------------------------------------------------------------
// PERSONAL DEVELOPMENT GOALS & SEI ADULTS ASSESSMENT
// ---------------------------------------------------------------------------

export type SEIAssessmentSource =
  | 'SEI Adults (UEQ Profile)'
  | 'SEI Adults (Neural Net)'
  | 'SEI Leadership Profile'
  | 'CEQHS Baseline Self-Assessment';

export type SEICompetencyCategory =
  | 'Know Yourself'
  | 'Choose Yourself'
  | 'Give Yourself'
  | 'Neural Net Profile';

export interface WeeklyActionTip {
  weekNumber: number;
  tip: string;
  focusHabit?: string;
  habit?: string;
  isCompleted?: boolean;
}

export interface PersonalDevelopmentGoal {
  id: string;
  userId: string;
  title: string;
  assessmentSource: SEIAssessmentSource;
  assessmentReportName?: string;
  assessmentReportDate?: string;
  competency: string;
  competencyCategory: SEICompetencyCategory;
  timeframeWeeks: number;
  targetDate: string;
  actionPlan: string;
  weeklyTips: WeeklyActionTip[];
  currentWeekTipIndex: number;
  linkedEntryIds: string[];
  status: 'In Progress' | 'On Track' | 'Needs Attention' | 'Completed';
  progressPercentage: number;
  createdAt: string;
  updatedAt?: string;
  notes?: string;
}

export interface CalendarEvent {
  id: string;
  date: string;
  monthDay: string;
  type: 'LEARN' | 'PRACTISE' | 'REFLECT';
  title: string;
  description: string;
  preparation?: string;
  relatedTheme?: string;
  expectedAction?: string;
}

export interface ResourceItem {
  id: string;
  title: string;
  type: 'Activity Guide' | 'Facilitation Guide' | 'Reflection Prompt' | 'Article' | 'Classroom Practice' | 'Template';
  theme: string;
  journeyPhase: string;
  role: string;
  summary: string;
  readTime: string;
  content: string;
}

export interface BeforeNowShift {
  id: string;
  before: string;
  now: string;
  catalysts: string[];
  theme: string;
}

export interface SchoolSignal {
  id: string;
  topic: string;
  count: number;
  type: 'reflections' | 'moments' | 'challenges' | 'voices';
  note: string;
}

export interface DossierChapter {
  number: string;
  title: string;
  subtitle: string;
  status: 'Building' | 'Curated' | 'Verified';
  summary: string;
  keyInsights: string[];
  sampleQuotes?: { quote: string; author: string; role: string }[];
}

export interface CEQHSReviewCheckpoint {
  id: string;
  date: string;
  reviewerName: string;
  milestone: string;
  status: 'Completed' | 'In Progress' | 'Upcoming';
  stage: 'Observe' | 'Understand' | 'Reflect' | 'Verify';
  notes: string;
  strengthsObserved: string[];
  inquiriesForSchool: string[];
}

// ---------------------------------------------------------------------------
// DYNAMIC DIFFICULTY ADJUSTMENT (DDA) & GAME ENGINE TYPES
// ---------------------------------------------------------------------------

export type DifficultyTier = 1 | 2 | 3 | 4 | 5;

export interface ScenarioOption {
  id: string;
  text: string;
  responseStyle: 'reactive' | 'procedural' | 'surface_empathy' | 'curious_pause';
  isOptimal: boolean;
  score: number; // 0 to 100
  pedagogicalRationale: string;
  humanImpact: string;
  somaticNote?: string;
}

export interface ScenarioItem {
  id: string;
  title: string;
  context: string;
  gradeBand: 'Elementary' | 'Middle School' | 'High School' | 'Faculty/Leadership';
  themeId: string;
  difficultyTier: DifficultyTier;
  situation: string;
  studentOrColleagueVoice: string;
  options: ScenarioOption[];
  curiosityQuestion: string;
  minimumDeliberatePauseSeconds: number; // Encourages the "Curious Pause"
}

export interface ScenarioAttempt {
  scenarioId: string;
  scenarioTitle: string;
  chosenOptionId: string;
  isOptimal: boolean;
  score: number;
  timeTakenSeconds: number;
  pausedBeforeAnswering: boolean;
  difficultyTier: DifficultyTier;
  timestamp: string;
  adjustmentNote: string;
  skillRatingAfter?: number;
  flowScore?: number;
}

export interface DDAState {
  currentTier: DifficultyTier;
  skillRating: number; // ELO-like rating starting at 1200
  rollingSuccessRate: number; // 0 - 100%
  rollingAvgTime: number; // seconds
  currentStreak: number;
  bestStreak: number;
  flowState: 'boredom' | 'flow' | 'anxiety'; // Csikszentmihalyi Flow zone
  flowScore: number; // 0 - 100
  adaptiveTimerSeconds: number; // Dynamic time limit for current round
  nuanceLevel: number; // 1 to 5 (how subtle distractors are)
  lastAdjustmentReason: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  category: 'mastery' | 'flow' | 'pause' | 'persistence';
  unlocked: boolean;
  unlockedAt?: string;
  progress?: number;
  maxProgress?: number;
}

export interface GameProgressState {
  userId: string;
  dda: DDAState;
  totalPlayed: number;
  totalSuccesses: number;
  achievements: Achievement[];
  recentHistory: ScenarioAttempt[];
  updatedAt: string;
}

// ---------------------------------------------------------------------------
// CEQHS MULTI-TENANT ARCHITECTURE FOR DOSSIER DEVELOPMENT
// ---------------------------------------------------------------------------

export type TenantHierarchyRole = 'platform_admin' | 'school_admin' | 'coordinator' | 'teacher';

export interface TenantDossierPillar {
  id: string;
  name: string;
  completedItems: number;
  totalRequired: number;
}

export interface Tenant {
  id: string;
  code: string; // e.g. 'TENANT-A', 'TENANT-B'
  name: string; // e.g. 'Oakridge Secondary School'
  type: 'secondary' | 'high_school' | 'k12' | 'charter' | 'international';
  region: string;
  academicYear: string;
  leadAdminName: string;
  leadAdminEmail: string;
  coordinatorName: string;
  coordinatorEmail: string;
  status: 'active' | 'onboarding' | 'review_ready';
  dossierStage: JourneyPhaseId;
  dossierProgress: number; // 0-100%
  pillars: TenantDossierPillar[];
  createdAt: string;
  motto?: string;
  description?: string;
  enrolledStudents?: number;
  participatingTeachers?: number;
}

export interface TenantUser {
  id: string;
  tenantId: string;
  tenantName: string;
  name: string;
  email: string;
  role: 'school_admin' | 'coordinator' | 'teacher';
  title: string;
  department?: string;
  competencyFocus?: string;
  joinedDate: string;
  activeEntriesCount?: number;
  avatarInitials?: string;
  status?: 'pending_approval' | 'active' | 'suspended';
  approvedAt?: string;
  approvedBy?: string;
  requestedAt?: string;
}

// ---------------------------------------------------------------------------
// NOTIFICATION SYSTEM & EMAIL PREVIEWS
// ---------------------------------------------------------------------------

export interface SimulatedEmail {
  id: string;
  subject: string;
  fromName: string;
  fromEmail: string;
  toName: string;
  toEmail: string;
  schoolName: string;
  sentAt: string;
  previewSnippet: string;
  bodyText: string;
  temporaryPassword?: string;
  loginUrl?: string;
  competencyFocus?: string;
}

export interface AppNotification {
  id: string;
  type: 'account_approved' | 'dossier_feedback' | 'bulk_enrolled' | 'checkpoint_assigned' | 'system';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  recipientEmail?: string;
  recipientRole?: 'educator' | 'coordinator' | 'admin' | 'all';
  tenantId?: string;
  actionLabel?: string;
  actionTab?: string;
  simulatedEmail?: SimulatedEmail;
  feedbackAuthor?: string;
  feedbackQuote?: string;
}

// ---------------------------------------------------------------------------
// AGGREGATED STUDENT VOICE & EMOTIONAL CLIMATE
// ---------------------------------------------------------------------------

export interface StudentClimateQuote {
  id: string;
  quote: string;
  gradeLevel: string; // e.g. 'Grade 7', 'Grade 9', 'Grade 11'
  themeTitle: string;
  date: string;
  teacherName: string;
  sentiment: 'positive' | 'reflective' | 'vulnerable';
  emotionalShift: string;
  tags: string[];
}

export interface GradeClimateMetric {
  grade: string;
  safetyScore: number; // 0 - 100
  belongingScore: number; // 0 - 100
  expressionScore: number; // 0 - 100
  responsesCount: number;
  dominantMood: 'Calm & Centered' | 'Curious & Inspired' | 'Restless / Anxious' | 'Fatigued';
  notableInsight: string;
}

// ---------------------------------------------------------------------------
// CEQHS METRICS AND QUESTIONNAIRE MANUAL (GRADES 1-5 MEASUREMENT ARCHITECTURE)
// ---------------------------------------------------------------------------

export type CeqhsDomainKey =
  | 'self_awareness'
  | 'self_management'
  | 'social_awareness'
  | 'relationship_skills'
  | 'responsible_decision_making';

export type EvidenceSourceKey =
  | 'learner_voice'
  | 'adult_practice'
  | 'structured_observation'
  | 'context_implementation';

export type EvidenceStrength =
  | 'emerging'
  | 'developing'
  | 'strong'
  | 'reviewed_impact';

export type MeasurementWaveKey =
  | 'baseline'
  | 'early_check'
  | 'midline'
  | 'endline'
  | 'follow_up';

export interface WaveDataPoint {
  indicatorScore: number; // 0-100 index for visualization
  label: string;
  sampleSize: number;
  responseRate: number; // percentage
  date: string;
}

export interface DomainEvidenceProfile {
  id: string;
  domainKey: CeqhsDomainKey;
  domainName: string;
  measurementDefinition: string;
  evidenceStrength: EvidenceStrength;
  evidenceSourcesActive: EvidenceSourceKey[];
  waves: Record<MeasurementWaveKey, WaveDataPoint>;
  factualObservationSummary: string;
  nextStepRecommendation: string;
  missingnessRate: number; // percentage
  reviewerStatus: 'Pending Review' | 'Verified by Council' | 'Needs Multi-source Evidence';
}

export interface GuidedPerformanceTask {
  id: string;
  taskCode: 'Task A' | 'Task B' | 'Task C' | 'Task D' | 'Task E';
  title: string;
  primaryDomain: string;
  secondaryDomain?: string;
  durationMinutes: string;
  scenarioIllustration: string;
  inquiryPrompt: string;
  checklistCriteria: string[];
  administrationGuidance: string;
}

export interface LearnerVoiceItem {
  id: string;
  code: string;
  domainKey: CeqhsDomainKey;
  prompt: string;
  ageBand: 'Grades 1-2' | 'Grade 3' | 'Grades 4-5';
  isContextItem?: boolean;
}

export interface GuidedDilemmaScenario {
  id: string;
  title: string;
  scenarioCode: string;
  primaryDomain: string;
  secondaryDomains: string[];
  storyText: string;
  question: string;
  options: {
    key: string;
    text: string;
    isConstructive: boolean;
    reasoningExplanation: string;
  }[];
  reasoningRubricCriteria: string[];
}

export interface AdultPracticeItem {
  id: string;
  code: string;
  domainKey: CeqhsDomainKey;
  prompt: string;
  isContextItem?: boolean;
}

export interface ObservationRubricDomain {
  domainKey: CeqhsDomainKey;
  domainName: string;
  learnerIndicator: string;
  adultIndicator: string;
}

export interface StructuredObservationSession {
  id: string;
  date: string;
  durationMinutes: number;
  activityContext: string;
  gradeLevel: string;
  observerName: string;
  observerRole: string;
  opportunityPresent: boolean;
  ratings: Record<CeqhsDomainKey, {
    score: 0 | 1 | 2 | 3 | 4; // 0 = not observed (not counted as zero)
    factualExample: string;
    supportPromptingGiven: string;
  }>;
  adaptationNotes: string;
  followUpRecommendation: string;
  reviewerStatus: 'Draft' | 'Validated';
}

export interface ValuesInActionProject {
  id: string;
  title: string;
  gradeCohort: string;
  teacherLead: string;
  term: string;
  dimensions: {
    need: string; // Did learners help identify a real and relevant need?
    perspective: string; // Were affected people, differing views, and inclusion needs considered?
    decision: string; // Did the group consider evidence, safety, fairness, values, and consequences?
    action: string; // Did learners take an age-appropriate responsible action with adult support?
    reflection: string; // Did they examine results, unintended effects, limitations, and next steps?
  };
  artifactsCount: number;
  dossierStatus: 'Proposal' | 'In Progress' | 'Nominated for Dossier' | 'Accredited Evidence';
}

export interface ImplementationFidelityMetrics {
  reachLearnersPercent: number;
  reachAdultsPercent: number;
  plannedSessions: number;
  deliveredSessions: number;
  minimumDosePercent: number;
  coreComponentsPercent: number;
  adultPsychologicalSafetyScore: number;
  protectedTimetablePercent: number;
  newStaffInductionActive: boolean;
  belongingContextScore: number;
  perceivedSafetyScore: number;
  helpSeekingConfidenceScore: number;
}



