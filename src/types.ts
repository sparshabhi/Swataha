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
  focusHabit: string;
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

