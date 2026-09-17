import {
  DomainEvidenceProfile,
  GuidedPerformanceTask,
  LearnerVoiceItem,
  GuidedDilemmaScenario,
  AdultPracticeItem,
  ObservationRubricDomain,
  StructuredObservationSession,
  ValuesInActionProject,
  ImplementationFidelityMetrics,
} from '../types';
import {
  ImpactIndicator,
  EvidenceLink,
  DossierNarrativeDraft,
  ReviewQueueItem,
  EquitySubgroupData,
  DomainDevelopmentWheelData,
  FunnelStage,
  CultureHealthIndicator,
  SustainabilityDimensionData,
} from '../types/impactEvidence';

// ---------------------------------------------------------------------------
// 1. THE FIVE CEQHS DOMAIN EVIDENCE PROFILES
// ---------------------------------------------------------------------------

export const INITIAL_DOMAIN_PROFILES: DomainEvidenceProfile[] = [
  {
    id: 'domain-sa',
    domainKey: 'self_awareness',
    domainName: 'Self-Awareness',
    measurementDefinition:
      'Recognizing and reflecting on emotions, thoughts, values, identity, strengths, needs, and responses in context.',
    evidenceStrength: 'strong',
    evidenceSourcesActive: ['learner_voice', 'adult_practice', 'structured_observation'],
    waves: {
      baseline: {
        indicatorScore: 64,
        label: 'Baseline (Pre-Launch)',
        sampleSize: 142,
        responseRate: 95,
        date: 'Sept 2026',
      },
      early_check: {
        indicatorScore: 71,
        label: 'Early Check (Week 6)',
        sampleSize: 138,
        responseRate: 92,
        date: 'Oct 2026',
      },
      midline: {
        indicatorScore: 79,
        label: 'Midline (Mid-Year)',
        sampleSize: 140,
        responseRate: 94,
        date: 'Jan 2027',
      },
      endline: {
        indicatorScore: 86,
        label: 'Endline (End of Year)',
        sampleSize: 144,
        responseRate: 96,
        date: 'May 2027',
      },
      follow_up: {
        indicatorScore: 88,
        label: 'Year 2 Maintenance',
        sampleSize: 120,
        responseRate: 88,
        date: 'Planned',
      },
    },
    factualObservationSummary:
      'In Grades 1–2, 84% of learners successfully identify a plausible feeling and safe adult during Task A without adult leading. In Grades 4–5, learners routinely connect bodily sensations to underlying triggers during classroom check-ins.',
    nextStepRecommendation:
      'Deepen emotional vocabulary beyond primary labels (mad/sad/glad) into secondary shades (overwhelmed, dismissed, hopeful).',
    missingnessRate: 4.2,
    reviewerStatus: 'Verified by Council',
  },
  {
    id: 'domain-sm',
    domainKey: 'self_management',
    domainName: 'Self-Management and Regulation',
    measurementDefinition:
      'Using adaptive strategies to manage emotion, attention, stress, thoughts, behavior, goals, and recovery while maintaining agency.',
    evidenceStrength: 'strong',
    evidenceSourcesActive: [
      'learner_voice',
      'adult_practice',
      'structured_observation',
      'context_implementation',
    ],
    waves: {
      baseline: {
        indicatorScore: 58,
        label: 'Baseline (Pre-Launch)',
        sampleSize: 142,
        responseRate: 95,
        date: 'Sept 2026',
      },
      early_check: {
        indicatorScore: 66,
        label: 'Early Check (Week 6)',
        sampleSize: 138,
        responseRate: 92,
        date: 'Oct 2026',
      },
      midline: {
        indicatorScore: 76,
        label: 'Midline (Mid-Year)',
        sampleSize: 140,
        responseRate: 94,
        date: 'Jan 2027',
      },
      endline: {
        indicatorScore: 84,
        label: 'Endline (End of Year)',
        sampleSize: 144,
        responseRate: 96,
        date: 'May 2027',
      },
      follow_up: {
        indicatorScore: 85,
        label: 'Year 2 Maintenance',
        sampleSize: 120,
        responseRate: 88,
        date: 'Planned',
      },
    },
    factualObservationSummary:
      'Classroom observations across 18 elementary sessions documented an 82% reduction in reactive classroom escalations following the introduction of predictable 90-second breathing resets. Learners accept co-regulation readily.',
    nextStepRecommendation:
      'Strengthen student independent strategy selection during unguided transitions (recess to math block).',
    missingnessRate: 3.8,
    reviewerStatus: 'Verified by Council',
  },
  {
    id: 'domain-so',
    domainKey: 'social_awareness',
    domainName: 'Social Awareness and Perspective-Taking',
    measurementDefinition:
      'Understanding other people’s feelings, perspectives, identities, cultures, social context, supports, and inclusion needs.',
    evidenceStrength: 'developing',
    evidenceSourcesActive: ['learner_voice', 'structured_observation'],
    waves: {
      baseline: {
        indicatorScore: 62,
        label: 'Baseline (Pre-Launch)',
        sampleSize: 140,
        responseRate: 93,
        date: 'Sept 2026',
      },
      early_check: {
        indicatorScore: 69,
        label: 'Early Check (Week 6)',
        sampleSize: 136,
        responseRate: 91,
        date: 'Oct 2026',
      },
      midline: {
        indicatorScore: 74,
        label: 'Midline (Mid-Year)',
        sampleSize: 139,
        responseRate: 93,
        date: 'Jan 2027',
      },
      endline: {
        indicatorScore: 81,
        label: 'Endline (End of Year)',
        sampleSize: 142,
        responseRate: 95,
        date: 'May 2027',
      },
      follow_up: {
        indicatorScore: 82,
        label: 'Year 2 Maintenance',
        sampleSize: 118,
        responseRate: 87,
        date: 'Planned',
      },
    },
    factualObservationSummary:
      'During Task C (Perspective & Inclusion), 79% of Grade 2 learners recognized when a peer felt excluded. In Grade 4 scenario reasoning, 74% explained why group rules affect neurodivergent learners differently.',
    nextStepRecommendation:
      'Pair cross-grade reading buddies to practice perspective-taking with younger peers.',
    missingnessRate: 5.1,
    reviewerStatus: 'Needs Multi-source Evidence',
  },
  {
    id: 'domain-rs',
    domainKey: 'relationship_skills',
    domainName: 'Relationship and Collaborative Skills',
    measurementDefinition:
      'Communicating, listening, cooperating, negotiating conflict, seeking and offering help, repairing harm, and participating constructively.',
    evidenceStrength: 'strong',
    evidenceSourcesActive: [
      'learner_voice',
      'adult_practice',
      'structured_observation',
      'context_implementation',
    ],
    waves: {
      baseline: {
        indicatorScore: 60,
        label: 'Baseline (Pre-Launch)',
        sampleSize: 142,
        responseRate: 95,
        date: 'Sept 2026',
      },
      early_check: {
        indicatorScore: 68,
        label: 'Early Check (Week 6)',
        sampleSize: 137,
        responseRate: 92,
        date: 'Oct 2026',
      },
      midline: {
        indicatorScore: 77,
        label: 'Midline (Mid-Year)',
        sampleSize: 141,
        responseRate: 94,
        date: 'Jan 2027',
      },
      endline: {
        indicatorScore: 85,
        label: 'Endline (End of Year)',
        sampleSize: 144,
        responseRate: 96,
        date: 'May 2027',
      },
      follow_up: {
        indicatorScore: 87,
        label: 'Year 2 Maintenance',
        sampleSize: 120,
        responseRate: 88,
        date: 'Planned',
      },
    },
    factualObservationSummary:
      'Task D cooperative construction tasks showed clear turn-taking with zero shouting episodes in 14 of 16 observed groups. Collaborative repair language ("What can we do to fix this?") is now common among peer trios.',
    nextStepRecommendation:
      'Train student peer mediators in Grade 5 to facilitate peaceful recess dialogue.',
    missingnessRate: 3.5,
    reviewerStatus: 'Verified by Council',
  },
  {
    id: 'domain-rd',
    domainKey: 'responsible_decision_making',
    domainName: 'Responsible and Ethical Decision-Making',
    measurementDefinition:
      'Identifying problems, considering evidence, safety, rights, values, perspectives, and consequences, choosing action, and reflecting on results.',
    evidenceStrength: 'developing',
    evidenceSourcesActive: ['learner_voice', 'structured_observation'],
    waves: {
      baseline: {
        indicatorScore: 56,
        label: 'Baseline (Pre-Launch)',
        sampleSize: 140,
        responseRate: 93,
        date: 'Sept 2026',
      },
      early_check: {
        indicatorScore: 64,
        label: 'Early Check (Week 6)',
        sampleSize: 135,
        responseRate: 90,
        date: 'Oct 2026',
      },
      midline: {
        indicatorScore: 73,
        label: 'Midline (Mid-Year)',
        sampleSize: 139,
        responseRate: 93,
        date: 'Jan 2027',
      },
      endline: {
        indicatorScore: 82,
        label: 'Endline (End of Year)',
        sampleSize: 143,
        responseRate: 95,
        date: 'May 2027',
      },
      follow_up: {
        indicatorScore: 83,
        label: 'Year 2 Maintenance',
        sampleSize: 118,
        responseRate: 87,
        date: 'Planned',
      },
    },
    factualObservationSummary:
      'In Task E, young learners explain choices with reference to physical safety and mutual fairness rather than simple rule obedience. In Grades 4–5 Values-in-Action, learners examined unintended consequences of waste disposal.',
    nextStepRecommendation:
      'Collect adult practice logs specifically examining how teachers support ethical dilemmas in science and history.',
    missingnessRate: 4.8,
    reviewerStatus: 'Needs Multi-source Evidence',
  },
];

// ---------------------------------------------------------------------------
// 2. GRADES 1–2 GUIDED PERFORMANCE TASKS (TASKS A–E)
// ---------------------------------------------------------------------------

export const GUIDED_PERFORMANCE_TASKS: GuidedPerformanceTask[] = [
  {
    id: 'task-a',
    taskCode: 'Task A',
    title: 'Emotion Recognition and Help-Seeking',
    primaryDomain: 'Self-Awareness',
    secondaryDomain: 'Self-Management and Regulation',
    durationMinutes: '3–5 min',
    scenarioIllustration:
      'Show 3–4 illustrated situations: a child losing a turn, joining a new group, or attempting a difficult puzzle.',
    inquiryPrompt:
      '“How might this child feel? What could the child do or say to get help?”',
    checklistCriteria: [
      'Indicates a plausible feeling',
      'Identifies a body signal or internal need where appropriate',
      'Identifies a safe adult or constructive support action',
      'Gives an answer independently without being led',
    ],
    administrationGuidance:
      'Administration should be calm, brief, non-evaluative, and separated from discipline. Do not suggest the "correct" answer.',
  },
  {
    id: 'task-b',
    taskCode: 'Task B',
    title: 'Pause and Recover',
    primaryDomain: 'Self-Management and Regulation',
    durationMinutes: '3–5 min',
    scenarioIllustration:
      'Use a simple frustration-neutral activity (e.g., a puzzle or turn-taking game). If difficulty occurs naturally, observe response.',
    inquiryPrompt: '“What could you try now?”',
    checklistCriteria: [
      'Pauses or accepts co-regulation from educator',
      'Uses an available calm-down strategy (breath, stretch, or quiet space)',
      'Seeks help appropriately without aggression or withdrawal',
      'Returns to the learning activity constructively',
    ],
    administrationGuidance:
      'Do not deliberately distress the learner. Look for natural everyday moments of challenge.',
  },
  {
    id: 'task-c',
    taskCode: 'Task C',
    title: 'Perspective and Inclusion',
    primaryDomain: 'Social Awareness and Perspective-Taking',
    secondaryDomain: 'Relationship and Collaborative Skills',
    durationMinutes: '3–5 min',
    scenarioIllustration:
      'Show an illustrated story where one child is standing alone outside a playground circle or holds a different viewpoint.',
    inquiryPrompt:
      '“What might each child be thinking or feeling? What could help everyone take part?”',
    checklistCriteria: [
      'Notices the perspective or emotional state of the left-out peer',
      'Articulates that two people can feel differently about the same situation',
      'Proposes an inclusive action or invitation',
      'Demonstrates constructive empathy rather than pity',
    ],
    administrationGuidance:
      'Accept developmentally reasonable explanations rather than one memorized adult answer.',
  },
  {
    id: 'task-d',
    taskCode: 'Task D',
    title: 'Cooperative Construction',
    primaryDomain: 'Relationship and Collaborative Skills',
    durationMinutes: '5–8 min',
    scenarioIllustration:
      'Give a small group of 3 learners a shared task (e.g., building a bridge) with limited materials (blocks, tape).',
    inquiryPrompt: 'Observe turn-taking, listening, and shared decision-making.',
    checklistCriteria: [
      'Listens when another peer is sharing an idea',
      'Takes turns and shares physical materials willingly',
      'Attempts peaceful repair during small disagreements',
      'Does not rely on popularity, loudness, or force',
    ],
    administrationGuidance:
      'Observe without intervening unless physical safety requires it. Note collaboration patterns.',
  },
  {
    id: 'task-e',
    taskCode: 'Task E',
    title: 'Safe and Fair Choice',
    primaryDomain: 'Responsible and Ethical Decision-Making',
    durationMinutes: '3–5 min',
    scenarioIllustration:
      'Give 2–3 illustrated everyday choices in a classroom or corridor situation.',
    inquiryPrompt: '“What might happen next? Which choice is safe or fair, and why?”',
    checklistCriteria: [
      'Identifies the safer and fairer alternative',
      'Explains the reason with reference to consequences or care',
      'Shows understanding of how choices impact others',
      'Expresses personal responsibility in familiar contexts',
    ],
    administrationGuidance:
      'Praise thoughtful reasoning over fast answers. Encourage the child to explain their thinking.',
  },
];

// ---------------------------------------------------------------------------
// 3. GRADE 3 TRANSITION PROTOTYPE ITEMS (15 Items across 5 Domains)
// ---------------------------------------------------------------------------

export const GRADE_3_PROTOTYPE_ITEMS: LearnerVoiceItem[] = [
  // Self-Awareness
  {
    id: 'g3-sa-1',
    code: 'G3-SA1',
    domainKey: 'self_awareness',
    prompt: 'I can tell how I am feeling.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-sa-2',
    code: 'G3-SA2',
    domainKey: 'self_awareness',
    prompt:
      'I can tell an adult what I need when learning or working with others is difficult.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-sa-3',
    code: 'G3-SA3',
    domainKey: 'self_awareness',
    prompt: 'I can name something I do well and something I am practising.',
    ageBand: 'Grade 3',
  },

  // Self-Management
  {
    id: 'g3-sm-1',
    code: 'G3-SM1',
    domainKey: 'self_management',
    prompt: 'I can pause before I respond when I am upset or excited.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-sm-2',
    code: 'G3-SM2',
    domainKey: 'self_management',
    prompt: 'I know at least one strategy that helps me calm, focus, or try again.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-sm-3',
    code: 'G3-SM3',
    domainKey: 'self_management',
    prompt: 'I can return to an activity after a setback with support.',
    ageBand: 'Grade 3',
  },

  // Social Awareness
  {
    id: 'g3-so-1',
    code: 'G3-SO1',
    domainKey: 'social_awareness',
    prompt: 'I notice when someone may be left out or upset.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-so-2',
    code: 'G3-SO2',
    domainKey: 'social_awareness',
    prompt: 'I understand that another person may feel differently from me.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-so-3',
    code: 'G3-SO3',
    domainKey: 'social_awareness',
    prompt: 'I try to understand what another person may need.',
    ageBand: 'Grade 3',
  },

  // Relationship Skills
  {
    id: 'g3-rs-1',
    code: 'G3-RS1',
    domainKey: 'relationship_skills',
    prompt: 'I listen when another person is speaking.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-rs-2',
    code: 'G3-RS2',
    domainKey: 'relationship_skills',
    prompt: 'I can take turns and share responsibility in a group.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-rs-3',
    code: 'G3-RS3',
    domainKey: 'relationship_skills',
    prompt: 'I can ask for help after a disagreement.',
    ageBand: 'Grade 3',
  },

  // Responsible Decision-Making
  {
    id: 'g3-rd-1',
    code: 'G3-RD1',
    domainKey: 'responsible_decision_making',
    prompt: 'I think about what may happen after I make a choice.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-rd-2',
    code: 'G3-RD2',
    domainKey: 'responsible_decision_making',
    prompt: 'I can explain why I made a choice.',
    ageBand: 'Grade 3',
  },
  {
    id: 'g3-rd-3',
    code: 'G3-RD3',
    domainKey: 'responsible_decision_making',
    prompt: 'I try to make choices that are safe and fair.',
    ageBand: 'Grade 3',
  },
];

// ---------------------------------------------------------------------------
// 4. GRADES 4–5 LEARNER VOICE PACKAGE (15 Items + 5 Context Items)
// ---------------------------------------------------------------------------

export const GRADES_4_5_LEARNER_VOICE_ITEMS: LearnerVoiceItem[] = [
  // Self-Awareness
  {
    id: 'g45-sa-1',
    code: 'G45-SA1',
    domainKey: 'self_awareness',
    prompt: 'I can identify the emotion I am experiencing.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-sa-2',
    code: 'G45-SA2',
    domainKey: 'self_awareness',
    prompt: 'I can identify a situation or thought that may be influencing my reaction.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-sa-3',
    code: 'G45-SA3',
    domainKey: 'self_awareness',
    prompt: 'I can describe a strength and an area in which I am still developing.',
    ageBand: 'Grades 4-5',
  },

  // Self-Management
  {
    id: 'g45-sm-1',
    code: 'G45-SM1',
    domainKey: 'self_management',
    prompt: 'I use a strategy to manage emotions, attention, or stress during a challenge.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-sm-2',
    code: 'G45-SM2',
    domainKey: 'self_management',
    prompt: 'I can recover and return to learning after a setback.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-sm-3',
    code: 'G45-SM3',
    domainKey: 'self_management',
    prompt: 'I can choose a response instead of reacting immediately.',
    ageBand: 'Grades 4-5',
  },

  // Social Awareness
  {
    id: 'g45-so-1',
    code: 'G45-SO1',
    domainKey: 'social_awareness',
    prompt: 'I try to understand another person’s perspective before judging a situation.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-so-2',
    code: 'G45-SO2',
    domainKey: 'social_awareness',
    prompt: 'I notice when group rules or expectations may affect people differently.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-so-3',
    code: 'G45-SO3',
    domainKey: 'social_awareness',
    prompt: 'I recognize when someone may need support, inclusion, or a chance to speak.',
    ageBand: 'Grades 4-5',
  },

  // Relationship Skills
  {
    id: 'g45-rs-1',
    code: 'G45-RS1',
    domainKey: 'relationship_skills',
    prompt: 'I listen carefully and show that I have understood another person.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-rs-2',
    code: 'G45-RS2',
    domainKey: 'relationship_skills',
    prompt: 'I contribute fairly when working in a group.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-rs-3',
    code: 'G45-RS3',
    domainKey: 'relationship_skills',
    prompt: 'I can use respectful communication to work through disagreement.',
    ageBand: 'Grades 4-5',
  },

  // Responsible Decision-Making
  {
    id: 'g45-rd-1',
    code: 'G45-RD1',
    domainKey: 'responsible_decision_making',
    prompt: 'I consider how my choices may affect other people.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-rd-2',
    code: 'G45-RD2',
    domainKey: 'responsible_decision_making',
    prompt: 'I use information and different viewpoints when making an important choice.',
    ageBand: 'Grades 4-5',
  },
  {
    id: 'g45-rd-3',
    code: 'G45-RD3',
    domainKey: 'responsible_decision_making',
    prompt: 'I take responsibility for my actions and consider how to repair harm.',
    ageBand: 'Grades 4-5',
  },

  // Context Items Reported Separately (Never averaged into competency scores)
  {
    id: 'g45-ctx-1',
    code: 'CTX-1',
    domainKey: 'self_awareness',
    prompt: 'I feel safe asking for help at school.',
    ageBand: 'Grades 4-5',
    isContextItem: true,
  },
  {
    id: 'g45-ctx-2',
    code: 'CTX-2',
    domainKey: 'social_awareness',
    prompt: 'I feel accepted and included in my class.',
    ageBand: 'Grades 4-5',
    isContextItem: true,
  },
  {
    id: 'g45-ctx-3',
    code: 'CTX-3',
    domainKey: 'self_management',
    prompt: 'I have regular opportunities to practise CEQHS skills.',
    ageBand: 'Grades 4-5',
    isContextItem: true,
  },
  {
    id: 'g45-ctx-4',
    code: 'CTX-4',
    domainKey: 'relationship_skills',
    prompt: 'Adults at school take learner ideas seriously.',
    ageBand: 'Grades 4-5',
    isContextItem: true,
  },
  {
    id: 'g45-ctx-5',
    code: 'CTX-5',
    domainKey: 'responsible_decision_making',
    prompt: 'I know where to go for emotional or relationship support.',
    ageBand: 'Grades 4-5',
    isContextItem: true,
  },
];

// ---------------------------------------------------------------------------
// 5. GUIDED DILEMMA SCENARIOS FOR GRADES 4–5
// ---------------------------------------------------------------------------

export const GUIDED_SCENARIOS: GuidedDilemmaScenario[] = [
  {
    id: 'scenario-1',
    scenarioCode: 'Scenario 1',
    title: 'Regulation and Repair',
    primaryDomain: 'Self-Management and Regulation',
    secondaryDomains: ['Relationship and Collaborative Skills'],
    storyText:
      'During group work, another learner changes part of your work without asking. You feel angry.',
    question: 'What would be a constructive first step?',
    options: [
      {
        key: 'A',
        text: 'Say something hurtful so they know you are angry.',
        isConstructive: false,
        reasoningExplanation: 'Reactionary escalation that harms relationships.',
      },
      {
        key: 'B',
        text: 'Pause, notice your reaction, and ask what happened before deciding what to do.',
        isConstructive: true,
        reasoningExplanation:
          'Demonstrates the intentional micro-pause, emotional self-awareness, and seeking context before action.',
      },
      {
        key: 'C',
        text: 'Leave without telling anyone.',
        isConstructive: false,
        reasoningExplanation: 'Avoidant withdrawal that leaves the conflict unresolved.',
      },
      {
        key: 'D',
        text: 'Tell everyone that the other learner always causes problems.',
        isConstructive: false,
        reasoningExplanation: 'Triangulation and deficit labeling of a peer.',
      },
    ],
    reasoningRubricCriteria: [
      'Identifies the emotional reaction (anger / frustration)',
      'Applies a deliberate pause before acting',
      'Considers other perspectives or asks for context',
      'Selects a constructive resolution and explains the rationale',
    ],
  },
  {
    id: 'scenario-2',
    scenarioCode: 'Scenario 2',
    title: 'Inclusion and Decision-Making',
    primaryDomain: 'Responsible and Ethical Decision-Making',
    secondaryDomains: ['Social Awareness and Perspective-Taking', 'Relationship Skills'],
    storyText:
      'Your group wants to finish quickly, but one learner has not had a chance to share an idea.',
    question: 'What would be the most responsible choice?',
    options: [
      {
        key: 'A',
        text: 'Continue because most people agree.',
        isConstructive: false,
        reasoningExplanation:
          'Prioritizes speed over equity and ignores excluded voices.',
      },
      {
        key: 'B',
        text: 'Make space for the learner’s idea before deciding.',
        isConstructive: true,
        reasoningExplanation:
          'Ensures fair participation, values diverse viewpoints, and practices collaborative ethics.',
      },
      {
        key: 'C',
        text: 'Choose the loudest person’s idea.',
        isConstructive: false,
        reasoningExplanation: 'Yields to volume and dominance rather than thoughtful evaluation.',
      },
      {
        key: 'D',
        text: 'Stop the project and blame the group.',
        isConstructive: false,
        reasoningExplanation: 'Destructive escalation that halts collective work.',
      },
    ],
    reasoningRubricCriteria: [
      'Recognizes that a peer has been excluded or silenced',
      'Balances time constraints with fair procedural justice',
      'Champions inclusive participation constructively',
      'Explains why diverse viewpoints produce better collective outcomes',
    ],
  },
];

// ---------------------------------------------------------------------------
// 6. ADULT PROFESSIONAL-PRACTICE QUESTIONNAIRE (15 Items + 5 Context)
// ---------------------------------------------------------------------------

export const ADULT_PRACTICE_ITEMS: AdultPracticeItem[] = [
  // Self-Awareness
  {
    id: 'ad-sa-1',
    code: 'AD-SA1',
    domainKey: 'self_awareness',
    prompt: 'I notice the emotions and assumptions I bring into a difficult interaction.',
  },
  {
    id: 'ad-sa-2',
    code: 'AD-SA2',
    domainKey: 'self_awareness',
    prompt: 'I can identify a professional strength and a specific area for development.',
  },
  {
    id: 'ad-sa-3',
    code: 'AD-SA3',
    domainKey: 'self_awareness',
    prompt: 'I reflect on how my response may affect learners or colleagues.',
  },

  // Self-Management & Regulation
  {
    id: 'ad-sm-1',
    code: 'AD-SM1',
    domainKey: 'self_management',
    prompt: 'I use a strategy to regulate my response when I feel stressed or provoked.',
  },
  {
    id: 'ad-sm-2',
    code: 'AD-SM2',
    domainKey: 'self_management',
    prompt: 'I recover sufficiently after a difficult interaction to continue constructively.',
  },
  {
    id: 'ad-sm-3',
    code: 'AD-SM3',
    domainKey: 'self_management',
    prompt: 'I pause before responding when an immediate reaction could worsen the situation.',
  },

  // Social Awareness & Perspective-Taking
  {
    id: 'ad-so-1',
    code: 'AD-SO1',
    domainKey: 'social_awareness',
    prompt: 'I consider how a learner’s or colleague’s context may shape participation or behavior.',
  },
  {
    id: 'ad-so-2',
    code: 'AD-SO2',
    domainKey: 'social_awareness',
    prompt: 'I check my interpretation before assuming another person’s intention.',
  },
  {
    id: 'ad-so-3',
    code: 'AD-SO3',
    domainKey: 'social_awareness',
    prompt: 'I notice who may be excluded, unheard, or needing support.',
  },

  // Relationship & Collaborative Skills
  {
    id: 'ad-rs-1',
    code: 'AD-RS1',
    domainKey: 'relationship_skills',
    prompt: 'I listen for understanding before offering advice or correction.',
  },
  {
    id: 'ad-rs-2',
    code: 'AD-RS2',
    domainKey: 'relationship_skills',
    prompt: 'I use respectful communication when giving feedback or addressing conflict.',
  },
  {
    id: 'ad-rs-3',
    code: 'AD-RS3',
    domainKey: 'relationship_skills',
    prompt: 'I help repair relationships after a difficult interaction.',
  },
  {
    id: 'ad-rs-4',
    code: 'AD-RS4',
    domainKey: 'relationship_skills',
    prompt: 'I seek or offer support when a colleague or learner needs it.',
  },

  // Responsible & Ethical Decision-Making
  {
    id: 'ad-rd-1',
    code: 'AD-RD1',
    domainKey: 'responsible_decision_making',
    prompt: 'I consider safety, fairness, evidence, and likely consequences before a difficult decision.',
  },
  {
    id: 'ad-rd-2',
    code: 'AD-RD2',
    domainKey: 'responsible_decision_making',
    prompt: 'I protect learner dignity, privacy, and voice when recording or sharing information.',
  },

  // Adult Context Items (Reported Separately)
  {
    id: 'ad-ctx-1',
    code: 'AD-CTX1',
    domainKey: 'self_management',
    prompt: 'I have enough time to practise and reflect on CEQHS approaches.',
    isContextItem: true,
  },
  {
    id: 'ad-ctx-2',
    code: 'AD-CTX2',
    domainKey: 'relationship_skills',
    prompt: 'School leaders support CEQHS practice.',
    isContextItem: true,
  },
  {
    id: 'ad-ctx-3',
    code: 'AD-CTX3',
    domainKey: 'self_awareness',
    prompt: 'I receive useful feedback or coaching.',
    isContextItem: true,
  },
  {
    id: 'ad-ctx-4',
    code: 'AD-CTX4',
    domainKey: 'social_awareness',
    prompt: 'I feel safe discussing challenges without being shamed or unfairly penalized.',
    isContextItem: true,
  },
  {
    id: 'ad-ctx-5',
    code: 'AD-CTX5',
    domainKey: 'responsible_decision_making',
    prompt: 'School systems support emotionally safe and inclusive practice.',
    isContextItem: true,
  },
];

// ---------------------------------------------------------------------------
// 7. STRUCTURED OBSERVATION RUBRICS (Dual-Indicator Rubrics)
// ---------------------------------------------------------------------------

export const OBSERVATION_RUBRIC_DOMAINS: ObservationRubricDomain[] = [
  {
    domainKey: 'self_awareness',
    domainName: 'Self-Awareness',
    learnerIndicator:
      'Communicates a feeling, need, strength, or response in an accessible way.',
    adultIndicator:
      'Notices and adjusts the adult’s response during a difficult interaction.',
  },
  {
    domainKey: 'self_management',
    domainName: 'Self-Management and Regulation',
    learnerIndicator: 'Uses or accepts a strategy and returns to participation.',
    adultIndicator:
      'Maintains a calm, respectful, goal-directed response under pressure.',
  },
  {
    domainKey: 'social_awareness',
    domainName: 'Social Awareness and Perspective-Taking',
    learnerIndicator:
      'Recognizes or responds to another person’s perspective or inclusion need.',
    adultIndicator: 'Seeks context and avoids premature assumptions.',
  },
  {
    domainKey: 'relationship_skills',
    domainName: 'Relationship and Collaborative Skills',
    learnerIndicator:
      'Listens, takes turns, cooperates, seeks help, resolves disagreement, or attempts repair.',
    adultIndicator:
      'Uses listening, clear communication, repair, feedback, and inclusive participation.',
  },
  {
    domainKey: 'responsible_decision_making',
    domainName: 'Responsible and Ethical Decision-Making',
    learnerIndicator:
      'Explains a choice, considers consequences, protects safety or fairness, or takes responsibility.',
    adultIndicator:
      'Considers safety, dignity, fairness, evidence, and support pathways.',
  },
];

export const INITIAL_OBSERVATION_SESSIONS: StructuredObservationSession[] = [];

// ---------------------------------------------------------------------------
// 8. VALUES-IN-ACTION PROJECT EVIDENCE DOSSIER
// ---------------------------------------------------------------------------

export const INITIAL_VALUES_IN_ACTION_PROJECTS: ValuesInActionProject[] = [];

// ---------------------------------------------------------------------------
// 9. IMPLEMENTATION & SCHOOL CONTEXT METRICS
// ---------------------------------------------------------------------------

export const INITIAL_IMPLEMENTATION_METRICS: ImplementationFidelityMetrics = {
  reachLearnersPercent: 94,
  reachAdultsPercent: 96,
  plannedSessions: 48,
  deliveredSessions: 44,
  minimumDosePercent: 88,
  coreComponentsPercent: 92,
  adultPsychologicalSafetyScore: 89,
  protectedTimetablePercent: 91,
  newStaffInductionActive: true,
  belongingContextScore: 91,
  perceivedSafetyScore: 88,
  helpSeekingConfidenceScore: 86,
};

// ===========================================================================
// SWATARA & LEGACY IMPACT EVIDENCE DATA SUITE
// ===========================================================================

export const SWATARA_EVIDENCE_LINKS: Record<string, EvidenceLink> = {
  'ev-reach-01': {
    id: 'ev-reach-01',
    title: 'Primary Homeroom Advisory & Pauses Roster Audit',
    dossierSectionId: 'SEC-1.1-REACH',
    sourceType: 'administrative_data',
    dateLogged: '2026-11-12',
    verifiedBy: 'Coordinator Arthur Vance',
    summary: '342 of 360 scheduled primary learners actively participating in daily 15-minute advisory check-in circles across 18 classrooms.',
    sampleSize: 342,
    responseRate: 95,
    limitationNote: 'Does not capture episodic illness absences (estimated 3.2%).',
    privacyLevel: 'public_school',
  },
  'ev-fid-02': {
    id: 'ev-fid-02',
    title: 'Facilitation Fidelity Walkthrough Observations',
    dossierSectionId: 'SEC-2.0-FIDELITY',
    sourceType: 'facilitator_walkthrough',
    dateLogged: '2026-12-04',
    verifiedBy: 'Instructional Coach Elena Rostova',
    summary: '18 of 20 homerooms observed delivering somatic pauses with high adherence to scripted transition routines.',
    sampleSize: 20,
    responseRate: 100,
    limitationNote: 'Observations were pre-scheduled walkthroughs rather than unannounced visits.',
    privacyLevel: 'public_school',
  },
  'ev-learner-03': {
    id: 'ev-learner-03',
    title: 'Grades 3–5 Emotional Regulation Self-Voice Survey',
    dossierSectionId: 'SEC-3.2-REGULATION',
    sourceType: 'learner_self_report',
    dateLogged: '2027-01-18',
    verifiedBy: 'Coordinator Arthur Vance',
    summary: '82% of upper primary learners reported knowing at least two calming strategies when frustrated in class.',
    sampleSize: 184,
    responseRate: 94,
    limitationNote: 'Self-report items prone to social desirability; triangulated with teacher observation logs.',
    privacyLevel: 'public_school',
  },
  'ev-adult-04': {
    id: 'ev-adult-04',
    title: 'Faculty Reflective Journaling & Co-Regulation Logs',
    dossierSectionId: 'SEC-4.1-ADULT-PRACTICE',
    sourceType: 'coaching_log',
    dateLogged: '2027-02-02',
    verifiedBy: 'CEQHS Review Council',
    summary: '28 faculty members logged 140+ reflective micro-moments detailing calm co-regulation during heightened student distress.',
    sampleSize: 28,
    responseRate: 92,
    limitationNote: 'Qualitative documentation assessed on rubric stages 0–4.',
    privacyLevel: 'confidential_faculty',
  },
};

export const SWATARA_IMPACT_INDICATORS: ImpactIndicator[] = [
  {
    id: 'ind-01',
    name: 'Learner Emotional Naming & Self-Awareness',
    code: 'EQ-SA-01',
    impactLevel: 'learner',
    domain: 'Self-Awareness',
    description: 'Proportion of learners able to articulate current emotional state and bodily sensation without prompting.',
    measureType: 'scale_1_5',
    informant: 'learner_self_report',
    baselineValue: 2.8,
    midlineValue: 3.9,
    endlineValue: 4.3,
    unit: 'out of 5.0',
    interpretationGuide: 'Reflects progressive emotional vocabulary mastery across the academic year.',
    calculationMethod: 'Triangulated composite of Grades 3–5 survey and Grades 1–2 Task A observational checks.',
    cautiousInterpretation: 'Must not be reduced to individual student grading or clinical diagnoses.',
    sampleSize: 312,
    responseRate: 94,
    evidenceStrength: 'Strong school-level evidence',
    evidenceLinks: [SWATARA_EVIDENCE_LINKS['ev-reach-01'], SWATARA_EVIDENCE_LINKS['ev-learner-03']],
  },
  {
    id: 'ind-02',
    name: 'Classroom Co-Regulation & De-escalation Agility',
    code: 'EQ-REG-02',
    impactLevel: 'classroom_relationship',
    domain: 'Self-Management & Regulation',
    description: 'Frequency of restorative calm pauses utilized during peer friction or sensory overstimulation.',
    measureType: 'scale_1_5',
    informant: 'teacher_observation',
    baselineValue: 2.4,
    midlineValue: 3.7,
    endlineValue: 4.2,
    unit: 'out of 5.0',
    interpretationGuide: 'Measures classroom emotional safety and adult modeled regulation.',
    calculationMethod: 'Weekly observational rubrics recorded across all participating classrooms.',
    cautiousInterpretation: 'Contextual environmental stressors like testing or schedule changes may cause fluctuations.',
    sampleSize: 24,
    responseRate: 92,
    evidenceStrength: 'Strong school-level evidence',
    evidenceLinks: [SWATARA_EVIDENCE_LINKS['ev-fid-02']],
  },
  {
    id: 'ind-03',
    name: 'Adult Psychological Safety & Peer Support',
    code: 'EQ-ADULT-03',
    impactLevel: 'adult',
    domain: 'Values-in-Action',
    description: 'Faculty self-assessment of safety to acknowledge vulnerability, ask for support, and share missteps.',
    measureType: 'percentage',
    informant: 'coaching_log',
    baselineValue: 62,
    midlineValue: 84,
    endlineValue: 89,
    unit: '% agreement',
    interpretationGuide: 'Institutional foundation required for authentic adult emotional modeling.',
    calculationMethod: 'Anonymous bi-monthly staff climate pulses.',
    cautiousInterpretation: 'High turnover or administrative workload can suppress teacher wellbeing scores.',
    sampleSize: 28,
    responseRate: 96,
    evidenceStrength: 'Reviewed impact evidence',
    evidenceLinks: [SWATARA_EVIDENCE_LINKS['ev-adult-04']],
  },
  {
    id: 'ind-04',
    name: 'Peer Empathy & Active Listening in Circles',
    code: 'EQ-SOC-04',
    impactLevel: 'learner',
    domain: 'Social Awareness',
    description: 'Demonstration of respectful turn-taking and empathetic listening in structured dialogue.',
    measureType: 'scale_1_5',
    informant: 'facilitator_walkthrough',
    baselineValue: 2.6,
    midlineValue: 3.8,
    endlineValue: 4.4,
    unit: 'out of 5.0',
    interpretationGuide: 'Indicates student perspective-taking and social safety culture.',
    calculationMethod: 'Facilitator circle observation rubric.',
    cautiousInterpretation: 'Varies by grade-level developmental baseline.',
    sampleSize: 18,
    responseRate: 100,
    evidenceStrength: 'Developing evidence',
    evidenceLinks: [SWATARA_EVIDENCE_LINKS['ev-fid-02']],
  },
];

export const SWATARA_DOMAIN_WHEEL: DomainDevelopmentWheelData[] = [
  {
    domain: 'Self-Awareness',
    baseline: 2.8,
    current: 4.1,
    evidenceStrength: 'Strong school-level evidence',
    evidenceCount: 42,
    indicatorHighlight: '84% learners name feelings & body sensations accurately in check-ins',
    sourceSummary: 'Student surveys + Task A Guided Observations + Daily Check-in Boards',
    cautionaryNote: 'Growth is non-linear; post-holiday periods show temporary regression in vocabulary recall.',
  },
  {
    domain: 'Self-Management & Regulation',
    baseline: 2.4,
    current: 3.8,
    evidenceStrength: 'Strong school-level evidence',
    evidenceCount: 38,
    indicatorHighlight: 'Calm corner transitions utilized independently by 79% of learners',
    sourceSummary: 'Classroom logs + Guided Scenario Dilemmas + Somatic pause audits',
    cautionaryNote: 'External environmental noise and weather constraints impact somatic pause adoption.',
  },
  {
    domain: 'Social Awareness',
    baseline: 2.9,
    current: 4.0,
    evidenceStrength: 'Developing evidence',
    evidenceCount: 31,
    indicatorHighlight: 'Cross-peer perspective taking during literature discussions up 46%',
    sourceSummary: 'Reading response artifacts + restorative circle observations',
    cautionaryNote: 'Language development variations require differentiated sentence starters.',
  },
  {
    domain: 'Relationship Skills',
    baseline: 2.7,
    current: 3.9,
    evidenceStrength: 'Developing evidence',
    evidenceCount: 35,
    indicatorHighlight: 'Student-initiated peer repair up from 14% to 68% after playground disputes',
    sourceSummary: 'Incident resolution records + student reflection slips',
    cautionaryNote: 'Must continue monitoring unstructured transition times.',
  },
  {
    domain: 'Responsible Decision-Making',
    baseline: 2.5,
    current: 3.7,
    evidenceStrength: 'Emerging evidence',
    evidenceCount: 26,
    indicatorHighlight: '72% learners evaluate community consequences in collaborative projects',
    sourceSummary: 'Project rubrics + teacher narrative logs',
    cautionaryNote: 'Requires consistent adult scaffolding for multi-step dilemma evaluation.',
  },
];

export const SWATARA_VALUES_IN_ACTION = {
  strandTitle: 'Values-in-Action Applied Learning Strand',
  description: 'Evidence of student-led empathy, restorative circles, peer mediation, and community action demonstrating competencies in authentic environments.',
  activeProjects: [
    {
      title: 'Grade 4 Restorative Playground Buddies',
      reach: '48 Learners',
      focus: 'Peer co-regulation during high-friction unstructured breaks',
      evidenceArtifact: 'ART-REST-042',
    },
    {
      title: 'Grade 5 Community Empathy Audits',
      reach: '54 Learners',
      focus: 'Interviewing cafeteria & facilities staff on school climate',
      evidenceArtifact: 'ART-EMPA-088',
    },
    {
      title: 'Grade 2 Calm Corner Curators',
      reach: '62 Learners',
      focus: 'Visual sensory grounding cards co-designed with teacher',
      evidenceArtifact: 'ART-CALM-019',
    },
  ],
};

export const SWATARA_DOSSIER_NARRATIVES: DossierNarrativeDraft[] = [
  {
    id: 'narr-01',
    sectionTitle: 'Institutionalization of Restorative Dialogue Circles',
    academicPeriod: 'Term 1 · 2026–27',
    indicatorRef: 'EQ-REG-02',
    whatChanged: 'Transitioned from punitive disciplinary referrals to morning advisory circles across all primary classrooms.',
    evidenceSupport: 'Walkthrough logs confirmed 90% implementation adherence with 64% reduction in disciplinary escalations.',
    implementationContext: 'Supported by weekly Wednesday co-planning and coach walkthroughs.',
    plausibleContribution: 'CEQHS structured frameworks provided shared vocabulary and ring-fenced time.',
    alternativeExplanations: 'Concurrently reduced class sizes in Grade 3 may have also alleviated behavioral friction.',
    limitations: 'Afternoon recess still lacks consistent adult co-regulation coverage.',
    recommendedNextStep: 'Train lunchtime supervisory staff in shared restorative language by Term 2.',
    status: 'Approved by Architect',
    approvedBy: 'Lead Architect Saugat Singh',
    approvalDate: '2027-01-20',
    linkedEvidenceIds: ['ev-reach-01', 'ev-fid-02'],
  },
  {
    id: 'narr-02',
    sectionTitle: 'Somatic Pause & Co-Regulation Routines',
    academicPeriod: 'Term 2 · 2026–27',
    indicatorRef: 'EQ-SA-01',
    whatChanged: 'Learners independently initiating 60-second breathing pauses prior to high-stakes academic transitions.',
    evidenceSupport: 'Over 140 qualitative entries and student self-voice surveys across Grades 1–5.',
    implementationContext: 'Reinforced by physical visual cue cards placed near doorways and whiteboards.',
    plausibleContribution: 'Daily modeling by faculty normalized emotion-acknowledgment as a strength.',
    alternativeExplanations: 'Seasonal improvements in outdoor playtime during spring months.',
    limitations: 'New transfer students require structured catch-up orientation.',
    recommendedNextStep: 'Integrate student onboarding buddy protocol for mid-year entrants.',
    status: 'Under Review',
    linkedEvidenceIds: ['ev-learner-03', 'ev-adult-04'],
  },
];

export const SWATARA_REVIEW_QUEUE_ITEMS: ReviewQueueItem[] = [
  {
    id: 'rev-01',
    schoolName: 'Oakridge Secondary & Primary Campus',
    submissionDate: '2027-02-10',
    ceqhsStage: 'Year 2: Integration',
    criterionCode: 'CRIT-3.2-REG',
    criterionTitle: 'Classroom Co-Regulation & De-escalation Evidence',
    category: 'Classroom Log',
    submittedBy: 'Arthur Vance (Coordinator)',
    status: 'Awaiting Review',
    evidenceSummary: '18 classroom observation logs demonstrating calm pause adoption with 88% fidelity rate.',
  },
  {
    id: 'rev-02',
    schoolName: 'Swatara Creek Elementary',
    submissionDate: '2027-02-08',
    ceqhsStage: 'Year 1: Foundation',
    criterionCode: 'CRIT-1.1-REACH',
    criterionTitle: 'Program Dosage & Timetable Protection',
    category: 'Fidelity Audit',
    submittedBy: 'Principal Sarah Jenkins',
    status: 'Accepted',
    evidenceSummary: 'Complete master schedule audit showing protected 15-min daily advisory for 342 learners.',
    reviewerNotes: 'Verified against district timetable allocation. Full adherence achieved.',
  },
  {
    id: 'rev-03',
    schoolName: 'Hillcrest Learning Community',
    submissionDate: '2027-01-30',
    ceqhsStage: 'Year 1: Foundation',
    criterionCode: 'CRIT-4.0-ADULT',
    criterionTitle: 'Educator Emotional Agility Reflective Dossier',
    category: 'Adult Journal',
    submittedBy: 'Marcus Brody',
    status: 'Accepted with Note',
    evidenceSummary: '24 reflective journal entries with thematic tagging on vulnerability and boundaries.',
    reviewerNotes: 'Commendable depth of vulnerability. Recommended adding peer observation exchange logs.',
  },
];

export const SWATARA_EQUITY_DATA: EquitySubgroupData[] = [
  {
    groupName: 'Early Primary (Grades 1–2)',
    category: 'Grade Level',
    enrolled: 142,
    reachPct: 96,
    receivedDosePct: 91,
    changeObserved: '+1.3 scale shift on Task A feeling identification without adult leading',
    accessibilityAdaptation: 'Visual emotion feeling-stones and physical emotion thermometer cards',
  },
  {
    groupName: 'Upper Primary (Grades 3–5)',
    category: 'Grade Level',
    enrolled: 198,
    reachPct: 94,
    receivedDosePct: 88,
    changeObserved: '82% describe multi-step conflict de-escalation strategies',
    accessibilityAdaptation: 'Read-aloud audio options for survey prompts and peer co-reflection pairs',
  },
  {
    groupName: 'Multilingual Learners (ELL/ESL)',
    category: 'Language Cohort',
    enrolled: 46,
    reachPct: 93,
    receivedDosePct: 87,
    changeObserved: 'Expressive emotional vocabulary expanded across home and school languages',
    accessibilityAdaptation: 'Bilingual pictorial emotion wheels and native language discussion prompts',
  },
  {
    groupName: 'Neurodiverse & Sensory Support',
    category: 'Support Category',
    enrolled: 28,
    reachPct: 96,
    receivedDosePct: 93,
    changeObserved: 'Significant reduction in sensory overload meltdowns via calm corner access',
    accessibilityAdaptation: 'Weighted lap blankets, noise-dampening ear covers, non-verbal card signals',
  },
];

export const SWATARA_IMPLEMENTATION_FUNNEL: FunnelStage[] = [
  {
    stage: '1. Enrolled Primary Students',
    eligibleCount: 360,
    reachedCount: 360,
    percentageOfEligible: 100,
    dropOffReason: 'All students enrolled in participating grades',
    evidenceRecordRef: 'ROSTER-2026-FALL',
  },
  {
    stage: '2. Program Initiation & Baseline',
    eligibleCount: 360,
    reachedCount: 348,
    percentageOfEligible: 96.6,
    dropOffReason: '12 students absent during baseline orientation window',
    evidenceRecordRef: 'BASE-SURVEY-AUDIT',
  },
  {
    stage: '3. Routine Advisory Participation',
    eligibleCount: 360,
    reachedCount: 342,
    percentageOfEligible: 95.0,
    dropOffReason: 'Intermittent medical or transfer attendance gaps',
    evidenceRecordRef: 'EV-REACH-01',
  },
  {
    stage: '4. Minimum Dosage Target (>=80% sessions)',
    eligibleCount: 360,
    reachedCount: 318,
    percentageOfEligible: 88.3,
    dropOffReason: 'Students with chronic health absences receiving modified 1:1 check-ins',
    evidenceRecordRef: 'FIDELITY-ATTEND-Q2',
  },
  {
    stage: '5. Midline Reflection & Active Portfolio',
    eligibleCount: 360,
    reachedCount: 326,
    percentageOfEligible: 90.5,
    dropOffReason: 'Pending review of 16 late submissions',
    evidenceRecordRef: 'MID-PORTFOLIO-2027',
  },
];

export const SWATARA_CULTURE_HEALTH_MAP: CultureHealthIndicator[] = [
  {
    id: 'cult-01',
    dimension: 'Classroom Relational Safety',
    description: 'Learners feel safe to make academic and emotional mistakes without fear of ridicule.',
    status: 'green',
    statusLabel: 'Thriving',
    evidenceSummary: '92% learners in Grades 3–5 agreed "My teacher and classmates help when I make a mistake."',
    observedShift: 'Classrooms show active praise of honest attempts and restorative peer coaching.',
    dossierRef: 'SEC-1.2-SAFETY',
  },
  {
    id: 'cult-02',
    dimension: 'Adult Relational Modeling',
    description: 'Faculty and staff model regulated breathing, empathetic listening, and composure under pressure.',
    status: 'green',
    statusLabel: 'Thriving',
    evidenceSummary: '88% of walkthroughs observed explicit teacher modeling of micro-pauses during friction.',
    observedShift: 'Teachers verbally explain their calm-down strategies in real time.',
    dossierRef: 'SEC-4.0-ADULT',
  },
  {
    id: 'cult-03',
    dimension: 'Unstructured Play Safety (Recess & Lunch)',
    description: 'Relational safety and peer repair sustained in gymnasiums, cafeterias, and playgrounds.',
    status: 'amber',
    statusLabel: 'Requires Focus',
    evidenceSummary: 'Conflict referrals during lunch recess remain higher than during scheduled classroom periods.',
    observedShift: 'Buddy bench instituted; lunch duty staff training scheduled for upcoming cycle.',
    dossierRef: 'SEC-5.1-PLAYGROUND',
  },
  {
    id: 'cult-04',
    dimension: 'Restorative Conflict Resolution',
    description: 'Disputes resolved through structured repair conversations rather than exclusionary isolation.',
    status: 'green',
    statusLabel: 'Thriving',
    evidenceSummary: '64% reduction in disciplinary suspensions; restorative circles utilized in 94% of incidents.',
    observedShift: 'Students autonomously request peace circles when disagreements arise.',
    dossierRef: 'SEC-5.2-RESTORATIVE',
  },
];

export const SWATARA_SUSTAINABILITY_DIMENSIONS: SustainabilityDimensionData[] = [
  {
    id: 'sust-01',
    title: 'Ring-Fenced Timetable Schedule',
    status: 'Institutionalized',
    scoreLevel: 3,
    leadRole: 'Principal & Vice-Principal',
    evidenceNotes: 'Daily 15-minute morning advisory and weekly restorative circle permanently embedded in school master calendar.',
    nextStep: 'Ensure scheduling carry-over into 2027–28 academic budget.',
  },
  {
    id: 'sust-02',
    title: 'New Educator Onboarding Protocol',
    status: 'Institutionalized',
    scoreLevel: 3,
    leadRole: 'Lead Coordinator',
    evidenceNotes: 'Orientation module prepared covering CEQHS somatic pause toolkit, restorative dialogue, and dossier curation.',
    nextStep: 'Deliver during August 2027 faculty orientation week.',
  },
  {
    id: 'sust-03',
    title: 'Peer Coaching & Walkthrough Routine',
    status: 'Developing',
    scoreLevel: 2,
    leadRole: 'Grade-Level Team Leads',
    evidenceNotes: 'Bi-weekly peer walkthrough protocol tested by 4 veteran educators with positive feedback.',
    nextStep: 'Expand across all grade-level clusters in Term 2.',
  },
  {
    id: 'sust-04',
    title: 'Budget Allocation for Materials & Training',
    status: 'Institutionalized',
    scoreLevel: 3,
    leadRole: 'School Board & Treasurer',
    evidenceNotes: 'Board approved annual recurring line-item for sensory calm corners and CEQHS consortium participation.',
    nextStep: 'Audit material wear-and-tear before end of school year.',
  },
  {
    id: 'sust-05',
    title: 'Parent & Community Alignment',
    status: 'Developing',
    scoreLevel: 2,
    leadRole: 'Family Liaison Coordinator',
    evidenceNotes: 'Parent workshop series completed by 84 families; home pause cards distributed in 3 languages.',
    nextStep: 'Schedule quarterly family restorative conversation cafe.',
  },
];

