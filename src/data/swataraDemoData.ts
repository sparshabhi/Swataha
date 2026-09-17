// ============================================================================
// SWATARA CORE SCHOOL — CANONICAL DEMO DATA (SECTION 13 SPECIFICATION)
// Google AI Studio Build Specification and Master Prompt
// ============================================================================

export interface SwataraPlanActivity {
  id: string;
  title: string;
  domain: string;
  competency: string;
  developmentalLevel: 'Recognize' | 'Apply' | 'Transfer' | 'Influence';
  targetAudience: 'primary_learners' | 'teachers_and_facilitators' | 'school_leaders' | 'all';
  gradeScope: string;
  duration: string;
  curriculumConnection: string;
  connectionType: 'Direct connection' | 'Related connection' | 'Implementation hook' | 'CEQHS extension';
  evidenceIndicator: string;
  responsibleRole: string;
  status: 'Draft' | 'Recommended' | 'Approved for Pilot' | 'Active' | 'Needs Review' | 'Completed';
  requiresHumanApproval: boolean;
  purpose: string;
  materials: string[];
  facilitationInstructions: string[];
  accessibilityNotes: string;
  culturalAdaptationNotes: string;
  evidenceMethod: string;
  adultPracticeExtension: string;
  safetyNotes: string;
  version: string;
  author: string;
}

export interface SwataraImplementationRecord {
  id: string;
  date: string;
  activityId: string;
  activityTitle: string;
  grade: string;
  cohortName: string;
  facilitatorName: string;
  studentsScheduled: number;
  studentsAttended: number;
  reachPercentage: number;
  fidelityScore: number; // 1-100%
  learningEvidence: string;
  observableBehaviorShift: string;
  teacherObservation: string;
  safeguardingNotes?: string;
  evidenceArtifactType: 'reflection_slips' | 'audio_quote' | 'chart_photo' | 'checklist';
  status: 'Logged' | 'Reviewed' | 'Verified';
}

export interface SwataraNeedsBaseline {
  currentStrengths: string[];
  priorityChallenges: string[];
  adultStaffNeeds: string[];
  learnerNeeds: string[];
  existingProgramOverlap: {
    programName: string;
    description: string;
    overlapAnalysis: string;
    integrationRecommendation: string;
  }[];
  baselineRatings: {
    metric: string;
    score: number;
    benchmark: number;
    description: string;
  }[];
  qualitativeObservations: string[];
  dataCollectionLimitations: string[];
  targetOutcomes: string[];
}

export interface SwataraAwardProgress {
  currentYear: 'Year 1: Foundation' | 'Year 2: Integration' | 'Year 3: Impact and Leadership';
  overallCompletion: number; // percentage
  status: 'In Progress' | 'Under Moderated Review' | 'Approved' | 'Action Needed';
  requirements: {
    id: string;
    title: string;
    description: string;
    level: 'reach' | 'fidelity' | 'learning' | 'impact';
    isCompleted: boolean;
    evidenceCount: number;
    requiredCount: number;
    missingEvidenceNote?: string;
  }[];
  moderatorNotes?: string;
  attendanceOnlyWarning: string;
}

// ----------------------------------------------------------------------------
// 1. CANONICAL CANON ACTIVITIES (16 REQUIRED FIELDS PER SECTION 6.6)
// ----------------------------------------------------------------------------
export const CANON_ACTIVITIES: SwataraPlanActivity[] = [
  {
    id: 'act-emotion-weather',
    title: 'Daily Emotion Weather Check-In',
    domain: 'Self-Awareness',
    competency: 'Recognizing one’s emotions, thoughts, values, strengths, needs, and triggers',
    developmentalLevel: 'Recognize',
    targetAudience: 'primary_learners',
    gradeScope: 'Grades 1–3 & 4–5',
    duration: '8–12 minutes daily',
    curriculumConnection: 'IB PYP Self-Management: Affective Skills — State of Mind Awareness',
    connectionType: 'Direct connection',
    evidenceIndicator: 'Students spontaneously use nuanced affective meteorological vocabulary (e.g., breezy, thunder-pulse, morning fog) to communicate state prior to instructional transitions.',
    responsibleRole: 'Homeroom Primary Educator',
    status: 'Draft',
    requiresHumanApproval: true,
    purpose: 'To provide primary learners with a safe, non-punitive metaphor to notice internal physiological and emotional weather without feeling pressured to mask feelings.',
    materials: [
      'Visual Weather Emotion Wheel / Board',
      'Individual Pegs or Desk Tokens with learner pseudonyms',
      'Daily Reflection Slips for Grade 4–5',
    ],
    facilitationInstructions: [
      '1. Ring the chime once to establish an intentional collective pause.',
      '2. Guide children to place one hand on heart and one on belly for three gentle breath cycles.',
      '3. Invite children to look at the weather quadrants (Sunny/Clear, Misty/Foggy, Windy/Restless, Stormy/Surging).',
      '4. Each child places their token or gestures their weather with zero peer commentary or judgment.',
      '5. Teacher acknowledges all states as welcome: "All weather is natural in our classroom sky."',
    ],
    accessibilityNotes: 'Provide non-verbal physical gesture cues (hands cupped for sun, swaying arms for wind, clenched palms open for rain) for multilingual learners and sensory-sensitive students.',
    culturalAdaptationNotes: 'Adapt seasonal and weather metaphors to local climate cycles (e.g. monsoon rains, morning mist, mountain wind) so children resonate directly with local surroundings.',
    evidenceMethod: 'Daily aggregate weather tallies; anonymized photo of group board; weekly student reflection slips.',
    adultPracticeExtension: 'Educators log their own weather prior to morning advisory to model genuine affective vulnerability and self-regulation.',
    safetyNotes: 'Never force a student to disclose trauma. A student may always choose "Silent Cloud" (pass without explanation).',
    version: 'v2.1',
    author: 'CEQHS Program Architecture Team · Swataha',
  },
  {
    id: 'act-mindful-micro-pause',
    title: 'Classroom Mindful Micro-Pause',
    domain: 'Self-Regulation',
    competency: 'Managing attention, emotion, impulse, stress, and behavior in service of a goal',
    developmentalLevel: 'Apply',
    targetAudience: 'primary_learners',
    gradeScope: 'Grades 1–5',
    duration: '3–5 minutes during transitions',
    curriculumConnection: 'IB PYP Self-Management: Mindfulness, Resilience, and Managing State of Mind',
    connectionType: 'Direct connection',
    evidenceIndicator: 'Observed 40%+ reduction in transition noise and dysregulation; students initiate self-regulation breath unprompted during unexpected task shifts.',
    responsibleRole: 'Subject & Homeroom Educators',
    status: 'Approved for Pilot',
    requiresHumanApproval: false,
    purpose: 'To down-regulate the sympathetic nervous system between high-cognitive tasks or chaotic playground re-entries.',
    materials: ['Acoustic bell, chime, or rain stick', 'Micro-pause visual reminder poster near door'],
    facilitationInstructions: [
      '1. Sound the chime softly at the door or front of room.',
      '2. Signal the universal "Curious Pause" hand anchor: open palm over heart.',
      '3. Three synchronized diaphragmatic breaths: inhale for 4 counts, hold for 2, exhale for 6.',
      '4. One sentence intention: "We arrive in this moment with curious attention."',
      '5. Smooth quiet transition into the inquiry activity.',
    ],
    accessibilityNotes: 'Allow neurodivergent students to use gentle tactile stones or fidget tools if seated stillness induces anxiety.',
    culturalAdaptationNotes: 'Respect diverse cultural breath traditions; maintain focus strictly on physiology, oxygenation, and attention reset.',
    evidenceMethod: 'Weekly educator fidelity logs (timestamps & frequency); student pulse surveys.',
    adultPracticeExtension: 'Teachers practice a 2-minute mindful pause before staff meetings and parent debriefs.',
    safetyNotes: 'Ensure children close eyes only if they feel safe; soft downward gaze is always an accepted alternative.',
    version: 'v2.0',
    author: 'CEQHS Curriculum Alignment Team · Swataha',
  },
  {
    id: 'act-perspective-taking',
    title: 'Perspective-Taking Circle',
    domain: 'Social Awareness',
    competency: 'Understanding other people’s perspectives, identities, emotions, needs, and contexts',
    developmentalLevel: 'Transfer',
    targetAudience: 'primary_learners',
    gradeScope: 'Grades 3–5',
    duration: '25–30 minutes weekly',
    curriculumConnection: 'IB PYP Social Skills: Resolving Conflict & Interpersonal Relationships',
    connectionType: 'Related connection',
    evidenceIndicator: 'Students describe a peer’s viewpoint in first person during disagreements before defending their own stance.',
    responsibleRole: 'Primary Advisory Lead / Facilitator',
    status: 'Needs Review',
    requiresHumanApproval: true,
    purpose: 'Cultivating the cognitive and affective capacity to imagine and articulate another person’s sensory and emotional experience during classroom tension.',
    materials: ['Talking piece (natural wood or stone)', 'Story prompt cards based on real classroom friction scenarios'],
    facilitationInstructions: [
      '1. Form an unbroken circle on the rug without desks between learners.',
      '2. Introduce the talking piece: only the holder speaks; others listen with eye and ear attention.',
      '3. Present an anonymized scenario: e.g., "Two partners had conflicting ideas on an IB exhibition poster."',
      '4. Pass the piece: each student must state one feeling and one need from the *other* person’s perspective.',
      '5. Conclude with collective synthesis: "Every perspective holds a piece of the truth."',
    ],
    accessibilityNotes: 'Allow written or drawn perspective cards for students who experience selective mutism or speaking anxiety.',
    culturalAdaptationNotes: 'Incorporate indigenous circle traditions and conversational norms that honour collective community dignity.',
    evidenceMethod: 'Facilitator observational notes; recorded audio reflections; empathy scenario rubric.',
    adultPracticeExtension: 'Faculty use perspective-taking circles during inter-departmental curriculum handovers.',
    safetyNotes: 'Never use a real child’s fresh conflict without their explicit prior consent.',
    version: 'v1.4',
    author: 'CEQHS Facilitation Wing',
  },
  {
    id: 'act-repairing-relationship',
    title: 'Repairing a Relationship Conversation',
    domain: 'Relationship Skills',
    competency: 'Building, maintaining, repairing, and ending relationships through communication and collaboration',
    developmentalLevel: 'Transfer',
    targetAudience: 'primary_learners',
    gradeScope: 'Grades 2–5',
    duration: '10–15 minutes as needed',
    curriculumConnection: 'IB PYP Social Skills & Caring Learner Profile attribute',
    connectionType: 'Direct connection',
    evidenceIndicator: 'Learners independently request the "Restorative Repair Bench" instead of seeking punitive adult intervention.',
    responsibleRole: 'Educators & Playground Supervisors',
    status: 'Draft',
    requiresHumanApproval: true,
    purpose: 'Shifting from punitive "say you’re sorry" compulsion to authentic four-part restorative accountability and mutual repair.',
    materials: ['4-Step Repair Script Prompt Card (Noticed, Felt, Needed, Will Do)'],
    facilitationInstructions: [
      '1. Both learners must be regulated first (calm breathing, no fight-or-flight arousal).',
      '2. Educator sits at eye level as quiet witness, not judge.',
      '3. Step 1: "When X happened..." (Objective facts without accusations).',
      '4. Step 2: "I felt..." (Emotion naming).',
      '5. Step 3: "What I needed was..." (Relational need).',
      '6. Step 4: "To make it right, can we..." (Concrete restorative action agreed by both).',
    ],
    accessibilityNotes: 'Visual icon strips depicting feelings and repair actions (shared drawing, high five, spatial pause).',
    culturalAdaptationNotes: 'Respect family restorative norms and dignity; avoid forcing forced eye contact where considered disrespectful.',
    evidenceMethod: 'Playground log incidents resolved restfully vs referred to administrative disciplinary escalation.',
    adultPracticeExtension: 'Adult colleagues use the 4-step repair format during professional friction debriefs.',
    safetyNotes: 'Never place a victim in a 1-on-1 repair conversation if genuine physical or emotional intimidation is active.',
    version: 'v1.8',
    author: 'CEQHS Restorative Practice Group',
  },
  {
    id: 'act-values-in-action',
    title: 'Values-in-Action Project',
    domain: 'Responsible Decision-Making / Values-in-Action',
    competency: 'Applying ethical reasoning, values, consequences, agency, and responsibility to choices affecting self and others',
    developmentalLevel: 'Influence',
    targetAudience: 'primary_learners',
    gradeScope: 'Grades 4–5',
    duration: '6-week transdisciplinary cycle',
    curriculumConnection: 'IB PYP Action Component & Principled / Reflective Profile',
    connectionType: 'Implementation hook',
    evidenceIndicator: 'Student-led campus stewardship initiatives sustained for 30+ days beyond unit grading.',
    responsibleRole: 'Grade 5 PYP Exhibition & Inquiry Leaders',
    status: 'Recommended',
    requiresHumanApproval: true,
    purpose: 'Channeling social-emotional growth into authentic student-initiated civic responsibility and community wellbeing.',
    materials: ['Values-in-Action Inquiry Log', 'Community Impact Canvas'],
    facilitationInstructions: [
      '1. Students brainstorm campus community pain points (waste, exclusion on football pitch, quiet corners).',
      '2. Link pain points to core values (Dignity, Kindness, Fairness, Environmental Care).',
      '3. Form self-selected cross-grade teams.',
      '4. Plan, test, and facilitate a concrete intervention.',
      '5. Present living evidence dossier to younger grades and school leadership.',
    ],
    accessibilityNotes: 'Group roles structured to suit varied student strengths: oral narrators, visual cartographers, logistics leads.',
    culturalAdaptationNotes: 'Align projects with local community traditions, indigenous ecological knowledge, and neighborhood elders.',
    evidenceMethod: 'Dossier chapter submissions; community feedback interviews; student agency self-assessments.',
    adultPracticeExtension: 'School leadership conducts an annual Values-in-Action audit of operational school policies.',
    safetyNotes: 'Ensure off-campus community contact complies with child safeguarding and parental consent protocols.',
    version: 'v2.0',
    author: 'CEQHS Curriculum Lab',
  },
  {
    id: 'act-staff-trigger-reflection',
    title: 'Staff Trigger and Response Reflection',
    domain: 'Self-Awareness',
    competency: 'Recognizing personal emotional triggers, somatic stress signs, and defensive habits under workplace strain',
    developmentalLevel: 'Apply',
    targetAudience: 'teachers_and_facilitators',
    gradeScope: 'All Primary Faculty',
    duration: '45 minutes monthly',
    curriculumConnection: 'Adult Professional Development: Relational Presence & Emotional Agility',
    connectionType: 'CEQHS extension',
    evidenceIndicator: 'Participating teachers report 48% higher somatic self-monitoring during chaotic classroom transitions; decreased self-reported burnout.',
    responsibleRole: 'CEQHS Lead Facilitator & School Principal',
    status: 'Active',
    requiresHumanApproval: false,
    purpose: 'Providing educators with a confidential, non-evaluative space to identify personal stress buttons and adopt the curious pause before reactive discipline.',
    materials: ['Somatic Awareness Body Map', 'Confidential Reflective Journal', 'The 4 Stress Triggers Grid'],
    facilitationInstructions: [
      '1. Open with 5 minutes of guided silence and nervous system grounding.',
      '2. Facilitator presents the "Cycle of Reactivity": Trigger → Body Cue → Automatic Thought → Behaviour.',
      '3. Faculty map on paper their top 2 triggers (e.g., student defiance, noise chaos, unannounced observation).',
      '4. Pair-share with trusted colleague using empathetic listening guidelines (no giving unsolicited advice).',
      '5. Commit to one "Regulated Pause" micro-ritual for the upcoming teaching week.',
    ],
    accessibilityNotes: 'Strict psychological safety: notes remain 100% private to the teacher and are never collected by administrators.',
    culturalAdaptationNotes: 'Recognize diverse cultural expressions of emotional restraint, hierarchy, and professional pride.',
    evidenceMethod: 'Pre- and post-session teacher psychological safety & stress survey (anonymous aggregate).',
    adultPracticeExtension: 'Monthly peer coaching triad check-ins between teaching partners.',
    safetyNotes: 'Ensure access to counseling support services if deep personal trauma or chronic burnout surfaces.',
    version: 'v3.0',
    author: 'CEQHS Adult Development Directorate',
  },
  {
    id: 'act-feedback-growth',
    title: 'Feedback for Professional Growth',
    domain: 'Relationship Skills',
    competency: 'Offering, receiving, and integrating relational and instructional feedback with curiosity rather than defensiveness',
    developmentalLevel: 'Transfer',
    targetAudience: 'school_leaders',
    gradeScope: 'Leadership & Primary Coordinators',
    duration: '60 minutes bi-weekly',
    curriculumConnection: 'Adult Professional Development: Values-Based Leadership & Relational Trust',
    connectionType: 'CEQHS extension',
    evidenceIndicator: 'School leadership feedback conversations transition from evaluative checklists to two-way reflective inquiries.',
    responsibleRole: 'Principal, PYP Coordinator & CEQHS Mentor',
    status: 'Active',
    requiresHumanApproval: false,
    purpose: 'Building high-trust relational feedback loops that celebrate incremental pedagogical vulnerability and reflective adaptation.',
    materials: ['Curious Inquiry Feedback Protocol', 'Reflective Prompt Cards'],
    facilitationInstructions: [
      '1. Frame the observation as shared inquiry: "What did we notice about student emotional energy?"',
      '2. Observer shares 2 objective non-judgmental timestamped observations.',
      '3. Observed teacher reflects first: "What was I experiencing in that moment?"',
      '4. Jointly identify one micro-experiment for the next inquiry block.',
      '5. Document shared learning in the CEQHS Living Journey teacher dossier.',
    ],
    accessibilityNotes: 'Written pre-reflection prompts sent 24 hours in advance to support deliberate thinkers.',
    culturalAdaptationNotes: 'Navigate hierarchical communication norms with cultural sensitivity while safeguarding authentic psychological safety.',
    evidenceMethod: 'Documented coaching notes; bi-annual faculty climate and trust survey.',
    adultPracticeExtension: 'Leaders practice receiving upward feedback from staff in semi-annual fishbowl sessions.',
    safetyNotes: 'Keep coaching completely separate from formal employment disciplinary proceedings.',
    version: 'v2.2',
    author: 'CEQHS Adult Development Directorate',
  },
];

// ----------------------------------------------------------------------------
// 2. SWATARA CORE SCHOOL PROFILE & DEMO STATE (SECTION 13)
// ----------------------------------------------------------------------------
export const SWATARA_CORE_SCHOOL = {
  id: 'sch-swatara-core',
  tenantId: 'TENANT-SWATARA',
  name: 'Swatara Core School',
  code: 'SWATARA-IB',
  location: 'Kathmandu / Regional Hub',
  country: 'Nepal & International',
  region: 'South Asia Pilot Division',
  schoolType: 'International Primary',
  curriculum: 'International Baccalaureate (IB PYP)',
  curriculumVersion: 'IB Primary Years Programme 2026 Enhanced',
  grades: 'Grades 1–5',
  implementationPhase: 'Year 1: Foundation',
  academicYear: '2026–27',
  leadAdminName: 'Dr. Sunita Khadka',
  leadAdminEmail: 'sunita.khadka@swatara.edu',
  pypCoordinatorName: 'Rohan Shrestha',
  pypCoordinatorEmail: 'rohan.shrestha@swatara.edu',
  enrolledStudents: 240,
  activeTeachers: 22,
  currentPhase: 'PRACTISE',
  
  priorities: [
    'Emotional regulation across Grades 1–5 during afternoon peer transitions',
    'Staff wellbeing and adult stress resilience in Term 2',
    'Classroom relationships and restorative conflict resolution',
  ],

  existingPrograms: [
    {
      name: 'Weekly Wellbeing Circle',
      frequency: 'Every Monday morning 8:30–9:00 AM',
      description: 'An informal classroom check-in circle historically run with varied teacher consistency.',
      overlapNote: 'Direct entry point: CEQHS Daily Emotion Weather Check-In replaces the inconsistent check-in with structured meteorological emotional literacy and daily micro-pauses.',
    },
  ],

  // Immediate next action per master specification page 8 and 17:
  nextActionMessage: 'Your next step: Review the Year 1 Self-Regulation plan and approve the two activities proposed for the first term.',
  nextActionRoute: 'plan',
  nextActionUrgency: 'high',

  metrics: {
    implementationProgress: 68,
    evidenceCompletion: 54,
    unresolvedReviewItems: 2,
    awardProgress: 65,
    aiRecommendationsAwaitingReview: 1,
    reachCount: 226,
    totalEligible: 240,
  },
};

// ----------------------------------------------------------------------------
// 3. SAMPLE IMPLEMENTATION RECORDS (SECTION 13)
// ----------------------------------------------------------------------------
export const SWATARA_SAMPLE_IMPLEMENTATIONS: SwataraImplementationRecord[] = [
  {
    id: 'impl-rec-001',
    date: '2026-09-15',
    activityId: 'act-emotion-weather',
    activityTitle: 'Daily Emotion Weather Check-In',
    grade: 'Grade 2 Orion',
    cohortName: 'Primary Lower Wing',
    facilitatorName: 'Sarita Sharma (Homeroom Teacher)',
    studentsScheduled: 24,
    studentsAttended: 24,
    reachPercentage: 100,
    fidelityScore: 92,
    learningEvidence: '21 of 24 learners accurately placed their token and verbalized why their sky felt "misty" or "clear".',
    observableBehaviorShift: 'During the subsequent math transition, two students who indicated "stormy weather" requested a 1-minute mindful water pause rather than throwing stationery.',
    teacherObservation: 'The visual metaphor removes defensiveness completely. Even quiet multilingual learners pointed accurately to the breezy quadrant.',
    evidenceArtifactType: 'chart_photo',
    status: 'Verified',
  },
  {
    id: 'impl-rec-002',
    date: '2026-09-16',
    activityId: 'act-mindful-micro-pause',
    activityTitle: 'Classroom Mindful Micro-Pause',
    grade: 'Grade 4 Aurora',
    cohortName: 'Primary Upper Wing',
    facilitatorName: 'Bibek Thapa (Grade 4 Lead)',
    studentsScheduled: 26,
    studentsAttended: 25,
    reachPercentage: 96,
    fidelityScore: 88,
    learningEvidence: 'Students synchronized breathing upon chime strike without prompting. 4 learners led the chime sequence.',
    observableBehaviorShift: 'Post-play transition time dropped from an average of 9 minutes down to 3 minutes and 40 seconds.',
    teacherObservation: 'Classroom auditory volume stabilized immediately. Energy felt calm and ready for the PYP inquiry cycle.',
    evidenceArtifactType: 'reflection_slips',
    status: 'Reviewed',
  },
];

// ----------------------------------------------------------------------------
// 4. SAMPLE AGGREGATE IMPACT DATA (SECTION 13 - 4 LEVELS)
// ----------------------------------------------------------------------------
export const SWATARA_IMPACT_METRICS = {
  disclaimer: 'Change observed during implementation across Swatara Core School (Grades 1–5). Not claiming sole statistical causation.',
  reach: {
    title: 'Level 1: Reach',
    metric: '94.2%',
    sublabel: '226 of 240 primary learners active in daily routines',
    trend: '+12% from Term 1 launch',
    breakdown: [
      { grade: 'Grade 1', reach: 98 },
      { grade: 'Grade 2', reach: 96 },
      { grade: 'Grade 3', reach: 93 },
      { grade: 'Grade 4', reach: 92 },
      { grade: 'Grade 5', reach: 92 },
    ],
  },
  fidelity: {
    title: 'Level 2: Fidelity',
    metric: '88.5%',
    sublabel: 'Delivered as designed across 180 logged sessions',
    trend: 'Consistent across 9 out of 10 primary homerooms',
    breakdown: [
      { element: '3-Breath Grounding Pause', adherence: 94 },
      { element: 'Meteorological Non-Punitive Vocabulary', adherence: 91 },
      { element: 'Student Self-Placement Routine', adherence: 86 },
      { element: 'Curious Pause Teacher Modelling', adherence: 83 },
    ],
  },
  learning: {
    title: 'Level 3: Learning',
    metric: '79.0%',
    sublabel: 'Demonstrating nuanced affective vocabulary and self-regulation naming',
    baselineComparison: 'Baseline was 38% at start of academic cycle',
    trend: '+41 percentage points growth',
  },
  impact: {
    title: 'Level 4: Impact & Climate Change',
    metric: '-44%',
    sublabel: 'Reduction in escalated peer conflict referrals during afternoon inquiry units',
    observedShifts: [
      'Teachers report 52% faster cognitive re-engagement following lunch break',
      '84% of surveyed parents observed children using the mindful breath at home when frustrated',
      'Zero exclusionary disciplinary suspensions across pilot Grades 1–5',
    ],
  },
};

// ----------------------------------------------------------------------------
// 5. THREE-YEAR AWARD PROGRESS (SECTION 6.10 & 13)
// ----------------------------------------------------------------------------
export const SWATARA_AWARD_STATE: SwataraAwardProgress = {
  currentYear: 'Year 1: Foundation',
  overallCompletion: 65,
  status: 'In Progress',
  attendanceOnlyWarning: 'CEQHS Standard: Award decisions are strictly evaluated against verified practice fidelity and observable behavioral shifts. Attendance and workshop counts alone do not constitute mastery or award qualification.',
  moderatorNotes: 'Swatara Core School has demonstrated strong baseline fidelity and leadership commitment. Incomplete evidence for Term 1 Adult Self-Regulation and Observer Checkpoint must be submitted before Year 1 Foundation Moderated Review.',
  requirements: [
    {
      id: 'req-1',
      title: 'Baseline Needs & Climate Capture',
      description: 'Documented student affective naming baseline and staff stress assessment across all 5 primary grades.',
      level: 'reach',
      isCompleted: true,
      evidenceCount: 5,
      requiredCount: 5,
    },
    {
      id: 'req-2',
      title: 'Leadership Commitment & Action Plan',
      description: 'School leadership signed charter, allocated 15-minute daily advisory timetable, and approved annual plan.',
      level: 'fidelity',
      isCompleted: true,
      evidenceCount: 2,
      requiredCount: 2,
    },
    {
      id: 'req-3',
      title: 'Shared CEQHS Vocabulary Across Grades 1–5',
      description: 'Daily Emotion Weather Check-In embedded in all primary homerooms with verified learner artifacts.',
      level: 'learning',
      isCompleted: true,
      evidenceCount: 14,
      requiredCount: 10,
    },
    {
      id: 'req-4',
      title: 'Staff Wellbeing & Self-Regulation Practice (INCOMPLETE)',
      description: 'Faculty participation in monthly Trigger & Response reflections with 2 documented coaching follow-ups.',
      level: 'fidelity',
      isCompleted: false,
      evidenceCount: 1,
      requiredCount: 2,
      missingEvidenceNote: 'Action Required: Term 1 Staff Self-Regulation Practice Reflection & Grade 3 Observer Checkpoint pending submission.',
    },
    {
      id: 'req-5',
      title: 'Observable Behavioral Shift & Peer Restorative Evidence (INCOMPLETE)',
      description: 'Documented reduction in reactive conflict referrals and 3 verified student restorative reflection artifacts.',
      level: 'impact',
      isCompleted: false,
      evidenceCount: 2,
      requiredCount: 4,
      missingEvidenceNote: 'Action Required: Submit 2 additional student restorative repair artifact summaries.',
    },
  ],
};

// ----------------------------------------------------------------------------
// 6. NEEDS AND BASELINE DETAILED RECORD (SECTION 6.4)
// ----------------------------------------------------------------------------
export const SWATARA_NEEDS_BASELINE_RECORD: SwataraNeedsBaseline = {
  currentStrengths: [
    'Highly empathetic, caring teaching body with low teacher turnover',
    'Rich transdisciplinary IB inquiry tradition with active parental trust',
    'Dedicated 15-minute daily morning advisory block already timetabled',
    'Open physical campus with natural green spaces supportive of mindfulness',
  ],
  priorityChallenges: [
    'Afternoon emotional dysregulation during unstructured peer inquiry transitions',
    'Staff cognitive fatigue and emotional boundary erosion leading into Term 2',
    'Reluctance among some learners to voice struggle due to academic perfectionism',
    'Language barriers for 18% multilingual learners newly arriving in Grade 3',
  ],
  adultStaffNeeds: [
    'Protected, non-evaluative peer debrief spaces to process acute classroom friction',
    'Somatic regulation tools to calm educator nervous systems before reacting to disruption',
    'Practical coaching on distinguishing restorative accountability from punitive compliance',
  ],
  learnerNeeds: [
    'Concrete, accessible metaphorical vocabulary to name complex internal feelings',
    'Safe physical and temporal micro-pauses during sensory-overloaded transitions',
    'Restorative scripts that empower peer-to-peer conflict resolution without adult blame',
  ],
  existingProgramOverlap: [
    {
      programName: 'Weekly Wellbeing Circle',
      description: 'Informal Monday check-in conducted by homeroom teachers.',
      overlapAnalysis: 'High potential synergy but suffered from lack of common developmental rubrics and inconsistent teacher facilitation.',
      integrationRecommendation: 'Anchor the Monday circle around CEQHS Phase 1 Daily Emotion Weather Check-In, maintaining the familiar circle format while introducing precise affective vocabulary.',
    },
    {
      programName: 'IB PYP Action Assemblies',
      description: 'Monthly student presentations on learner profile attributes.',
      overlapAnalysis: 'Provides an ideal school-wide celebratory showcase for CEQHS Phase 4 Values-in-Action projects.',
      integrationRecommendation: 'Feature student restorative problem-solving case studies during end-of-term IB Action assemblies.',
    },
  ],
  baselineRatings: [
    {
      metric: 'Learners independently naming 4+ primary emotions accurately',
      score: 38,
      benchmark: 75,
      description: 'Pre-implementation student sample survey (n=120, Grades 1–5)',
    },
    {
      metric: 'Students using a calming breath pause prior to task escalation',
      score: 22,
      benchmark: 70,
      description: 'Classroom observer counts during October transdisciplinary transitions',
    },
    {
      metric: 'Teachers reporting feeling emotionally depleted at week’s end',
      score: 72,
      benchmark: 35,
      description: 'Confidential staff wellbeing pulse baseline survey',
    },
    {
      metric: 'Peer conflicts requiring administrative disciplinary referral',
      score: 28,
      benchmark: 10,
      description: 'Monthly incident logs per 100 students prior to CEQHS launch',
    },
  ],
  qualitativeObservations: [
    'Grade 2 teachers noted that noise levels peak sharply at 1:15 PM following playground sports.',
    'Grade 5 students demonstrated high verbal vocabulary on exams but froze or lashed out when collaborating in high-stakes IB Exhibition groups.',
    'Younger learners in Grades 1 and 2 responded immediately to weather and animal sensory imagery.',
  ],
  dataCollectionLimitations: [
    'Data minimization strictly enforced: zero medicalized or psychological diagnostic labeling.',
    'All student observations are recorded anonymously with pseudonymous cohort aggregates.',
    'Parental informed consent obtained for aggregate research and Living Dossier inclusion.',
  ],
  targetOutcomes: [
    '80%+ of primary students demonstrate accurate affective weather self-naming by end of Year 1.',
    '50% reduction in classroom behavioral transition lag time across all primary homerooms.',
    'Staff burnout perception scores drop below 40% in post-Term 2 wellness evaluation.',
    'Establishment of school-wide Restorative Repair Bench as a self-selected conflict routine.',
  ],
};
