// ============================================================================
// CEQHS CURRICULUM BASELINE, PHASES & GRADE 1–5 PRACTICE LIBRARY
// Official pilot configuration approved by Founder Saugat Singh
// ============================================================================

import {
  CurriculumFramework,
  CEQHSPhaseDefinition,
  CEQHSPracticeDefinition,
  CurriculumAlignmentMapping,
} from '../types/ceqhsGovernance';

export const OFFICIAL_CURRICULUM_FRAMEWORKS: CurriculumFramework[] = [
  {
    id: 'framework-ib',
    name: 'International Baccalaureate (IB)',
    shortCode: 'IB',
    defaultLabel: 'IB Primary Years Programme (PYP) / ATL Connections',
    description:
      'Connects CEQHS Grade 1–5 practices to the school’s selected IB learning-outcome language, Learner Profile attributes, and school-defined Approaches to Learning (ATL) development structures.',
    jurisdictionNote: 'Global IB World Schools (PYP Grades 1–5)',
    disclaimer:
      'CEQHS practices map to school-selected IB learning language and learner-development structures for implementation planning. This does not represent official IB endorsement or accreditation unless separately confirmed.',
    outcomeDomains: [
      {
        id: 'ib-domain-atl',
        frameworkId: 'framework-ib',
        code: 'IB-ATL-SM',
        name: 'Approaches to Learning (ATL) & Self-Management',
        description: 'Self-management, affective state regulation, resilience, and mindfulness routines.',
        gradeBands: ['Grades 1–2', 'Grades 3–5'],
        outcomes: [
          {
            id: 'ib-out-1',
            domainId: 'ib-domain-atl',
            frameworkCode: 'IB',
            referenceCode: 'CEQHS-ATL-AFF-01',
            title: 'States of Mind & Emotional Literacy',
            description: 'Demonstrating awareness of emotions and naming bodily signals during transitions.',
            gradeRange: 'Grades 1–3',
            altConnectionNote: 'Directly reinforces PYP Self-Management Skills (Affective Skills: States of Mind).',
          },
          {
            id: 'ib-out-2',
            domainId: 'ib-domain-atl',
            frameworkCode: 'IB',
            referenceCode: 'CEQHS-ATL-AFF-02',
            title: 'Regulation Strategies & Pause Before Response',
            description: 'Selecting sensory or breathing micro-pauses when overwhelmed.',
            gradeRange: 'Grades 1–5',
            altConnectionNote: 'Mindfulness and perseverance routines in active inquiry.',
          },
          {
            id: 'ib-out-3',
            domainId: 'ib-domain-atl',
            frameworkCode: 'IB',
            referenceCode: 'CEQHS-ATL-SOC-03',
            title: 'Interpersonal Relationships & Restorative Repair',
            description: 'Active listening, empathy in disagreement, and co-constructing classroom agreements.',
            gradeRange: 'Grades 3–5',
            altConnectionNote: 'Social Skills: Interpersonal relationships and resolving conflicts constructively.',
          },
        ],
      },
    ],
  },
  {
    id: 'framework-oxford',
    name: 'Oxford Curriculum',
    shortCode: 'OX',
    defaultLabel: 'Oxford International Curriculum / Wellbeing Strands',
    description:
      'Connects CEQHS Grade 1–5 practices to Oxford Wellbeing strands: Healthy Body & Mind, Positive Emotions, Relational Health, and Meaningful Action.',
    jurisdictionNote: 'Oxford International Curriculum partner institutions',
    disclaimer:
      'CEQHS practices are mapped to the school’s selected Oxford wellbeing strands to support classroom practice; this does not represent an exclusive Oxford endorsement.',
    outcomeDomains: [
      {
        id: 'ox-domain-wellbeing',
        frameworkId: 'framework-oxford',
        code: 'OX-WB',
        name: 'Wellbeing Strand: Emotional & Social Competencies',
        description: 'Developing positive emotions, relational resilience, and reflective habits.',
        gradeBands: ['Grades 1–5'],
        outcomes: [
          {
            id: 'ox-out-1',
            domainId: 'ox-domain-wellbeing',
            frameworkCode: 'OX',
            referenceCode: 'OX.WB.PEM',
            title: 'Positive Emotions & Body Awareness',
            description: 'Identifying joyful, calm, and dysregulated states in self and peers.',
            gradeRange: 'Grades 1–3',
          },
          {
            id: 'ox-out-2',
            domainId: 'ox-domain-wellbeing',
            frameworkCode: 'OX',
            referenceCode: 'OX.WB.REL',
            title: 'Relational Health & Empathy in Dialogue',
            description: 'Practicing respectful dialogue, inclusion, and repair after friction.',
            gradeRange: 'Grades 2–5',
          },
          {
            id: 'ox-out-3',
            domainId: 'ox-domain-wellbeing',
            frameworkCode: 'OX',
            referenceCode: 'OX.WB.ACT',
            title: 'Student Voice & Responsible Community Impact',
            description: 'Contributing to collective problem-solving and caring classroom culture.',
            gradeRange: 'Grades 4–5',
          },
        ],
      },
    ],
  },
  {
    id: 'framework-cambridge',
    name: 'Cambridge Curriculum',
    shortCode: 'CA',
    defaultLabel: 'Cambridge Primary / Learner Attributes & Wellbeing',
    description:
      'Connects CEQHS practices to Cambridge Primary Learner Attributes (Confident, Responsible, Reflective, Innovative, Engaged) and school-defined pastoral wellbeing frameworks.',
    jurisdictionNote: 'Cambridge Assessment International Education partner schools',
    disclaimer:
      'CEQHS practices can be mapped to the school’s selected Cambridge learning, learner-development, or pastoral priorities. The school and CEQHS confirm relevant reference points during setup.',
    outcomeDomains: [
      {
        id: 'ca-domain-attr',
        frameworkId: 'framework-cambridge',
        code: 'CA-LA',
        name: 'Cambridge Learner Attributes & Pastoral Development',
        description: 'Cultivating reflection, emotional self-confidence, and responsible contribution.',
        gradeBands: ['Grades 1–5'],
        outcomes: [
          {
            id: 'ca-out-1',
            domainId: 'ca-domain-attr',
            frameworkCode: 'CA',
            referenceCode: 'CA.REF.01',
            title: 'Reflective Learning & Self-Observation',
            description: 'Reflecting on learning feelings, challenges, and peer collaboration.',
            gradeRange: 'Grades 1–5',
          },
          {
            id: 'ca-out-2',
            domainId: 'ca-domain-attr',
            frameworkCode: 'CA',
            referenceCode: 'CA.RES.02',
            title: 'Responsible Agency & Caring Community',
            description: 'Exercising emotional responsibility for choices and classroom harmony.',
            gradeRange: 'Grades 3–5',
          },
        ],
      },
    ],
  },
  {
    id: 'framework-nc',
    name: 'National Curriculum',
    shortCode: 'NC',
    defaultLabel: 'National Curriculum / SEL, PSHE & Values Education',
    description:
      'Connects CEQHS practices to national EQ, SEL, PSHE, Life Skills, and values-education frameworks specified by the school’s jurisdiction.',
    jurisdictionNote: 'National Ministry of Education or Regional Board contexts',
    disclaimer:
      'CEQHS will identify relevant emotional-learning, social-emotional, citizenship, life-skills, or values connections in the applicable national context. Mappings are reviewed before programme activation.',
    outcomeDomains: [
      {
        id: 'nc-domain-pshe',
        frameworkId: 'framework-nc',
        code: 'NC-SEL-PSHE',
        name: 'Personal, Social & Emotional Well-Being',
        description: 'Self-knowledge, healthy emotional expression, civic empathy, and moral growth.',
        gradeBands: ['Grades 1–5'],
        outcomes: [
          {
            id: 'nc-out-1',
            domainId: 'nc-domain-pshe',
            frameworkCode: 'NC',
            referenceCode: 'NC.SEL.01',
            title: 'Self-Awareness & Naming Emotion States',
            description: 'Expressing basic and complex emotions using respectful, clear language.',
            gradeRange: 'Grades 1–3',
          },
          {
            id: 'nc-out-2',
            domainId: 'nc-domain-pshe',
            frameworkCode: 'NC',
            referenceCode: 'NC.SEL.02',
            title: 'Emotional Self-Regulation & Calming Spaces',
            description: 'Identifying personal triggers and practicing de-escalation routines.',
            gradeRange: 'Grades 2–5',
          },
          {
            id: 'nc-out-3',
            domainId: 'nc-domain-pshe',
            frameworkCode: 'NC',
            referenceCode: 'NC.SEL.03',
            title: 'Peer Empathy & Community Harmony',
            description: 'Resolving disputes with kindness and building an inclusive group atmosphere.',
            gradeRange: 'Grades 3–5',
          },
        ],
      },
    ],
  },
];

export const OFFICIAL_PHASES: CEQHSPhaseDefinition[] = [
  {
    phaseNumber: 0,
    phaseId: 'phase-0',
    code: 'PH-0',
    name: 'Phase 0: Orientation and Readiness',
    workingLabel: 'Orientation & School Readiness',
    purpose:
      'Establish shared understanding, school readiness, safeguarding expectations, teacher onboarding, curriculum context, and baseline implementation conditions for Grades 1–5.',
    studentExperience:
      'Students notice a welcoming, calm atmosphere with initial emotional check-in cues introduced by teachers.',
    teacherPracticesSummary:
      'Complete onboarding modules, understand data minimisation rules, agree on weekly implementation micro-rhythms.',
    evidenceExpectations:
      'Approved school profile, confirmed Grade 1–5 teacher cohort, reviewed curriculum alignment, baseline readiness charter.',
    readinessCriteria:
      '100% of participating teachers onboarded, primary curriculum selection approved by Super Admin, data-handling acknowledged.',
    recommendedGradeBands: ['Grades 1–2', 'Grades 3–4', 'Grade 5'],
    reviewMethod: 'Super Admin administrative verification and cohort readiness review.',
    practiceFamilyNames: ['Teacher Onboarding Checklists', 'Safeguarding Charter', 'Curriculum Scoping'],
    version: 1,
  },
  {
    phaseNumber: 1,
    phaseId: 'phase-1',
    code: 'PH-1',
    name: 'Phase 1: Emotional Awareness and Safe Classroom Climate',
    workingLabel: 'Emotional Awareness & Safe Climate',
    purpose:
      'Introduce age-appropriate emotional vocabulary, noticing, belonging, and predictable classroom routines across participating Grades 1–5.',
    studentExperience:
      'Students learn to recognise feelings in their bodies, use an emotion wheel or feeling chart, and feel secure expressing vulnerabilities.',
    teacherPracticesSummary:
      'Daily 3-minute morning check-ins, feelings weather charts, co-created classroom agreements, mindful micro-pauses.',
    evidenceExpectations:
      'Classroom agreement artifacts (photo/text summary), observation notes of morning check-ins, de-identified student feeling logs.',
    readinessCriteria:
      'At least 3 weeks of consistent check-in routines logged across all participating grade bands; 80% teacher participation.',
    recommendedGradeBands: ['Grades 1–2', 'Grades 3–4', 'Grade 5'],
    reviewMethod: 'Dossier section review with CEQHS reviewer feedback and Super Admin approval.',
    practiceFamilyNames: ['Emotion Check-ins', 'Feelings Naming', 'Classroom Agreements', 'Micro-pauses', 'Body Awareness'],
    version: 1,
  },
  {
    phaseNumber: 2,
    phaseId: 'phase-2',
    code: 'PH-2',
    name: 'Phase 2: Regulation and Responsive Choice',
    workingLabel: 'Regulation & Responsive Choice',
    purpose:
      'Help students and teachers notice physiological activation, practise calming or grounding strategies, and develop a conscious pause between feeling and response.',
    studentExperience:
      'Students learn that all feelings are acceptable, but not all behaviors are helpful. They discover self-soothing tools (box breathing, grounding 5-4-3-2-1, reset corners).',
    teacherPracticesSummary:
      'Transition breathing rituals, reset space guidelines, teacher co-regulation pauses, post-friction cooldown prompts.',
    evidenceExpectations:
      'Reset corner photos and usage charts, teacher co-regulation reflection summaries, student self-regulation choice sheets.',
    readinessCriteria:
      'Demonstrated reduction in classroom transition friction and active student use of calming rituals.',
    recommendedGradeBands: ['Grades 1–2', 'Grades 3–4', 'Grade 5'],
    reviewMethod: 'Mid-cycle review of regulation artifacts and teacher reflective logs.',
    practiceFamilyNames: ['Breathing & Grounding', 'Reset Spaces', 'Choice Points', 'Co-Regulation', 'Transition Rituals'],
    version: 1,
  },
  {
    phaseNumber: 3,
    phaseId: 'phase-3',
    code: 'PH-3',
    name: 'Phase 3: Empathy, Perspective, and Relationship',
    workingLabel: 'Empathy, Perspective & Relationship',
    purpose:
      'Develop perspective-taking, empathetic listening, peer inclusion, and constructive relationship repair after interpersonal conflict.',
    studentExperience:
      'Students listen to peers without interrupting, appreciate different points of view in story dilemmas, and practice apologies that include repair.',
    teacherPracticesSummary:
      'Weekly Listening Circles, perspective-taking story discussions, empathy partner dialogues, restorative circle protocols.',
    evidenceExpectations:
      'Circle prompt summaries, de-identified restorative conversation records, student empathy artwork or reflection snippets.',
    readinessCriteria:
      'Documented peer relationship repair instances and established listening circle routines.',
    recommendedGradeBands: ['Grades 1–2', 'Grades 3–4', 'Grade 5'],
    reviewMethod: 'Peer observation and dossier evidence checkpoint.',
    practiceFamilyNames: ['Listening Circles', 'Perspective Stories', 'Empathy Prompts', 'Peer Connections', 'Restorative Dialogue'],
    version: 1,
  },
  {
    phaseNumber: 4,
    phaseId: 'phase-4',
    code: 'PH-4',
    name: 'Phase 4: Student Voice and Responsible Action',
    workingLabel: 'Student Voice & Responsible Action',
    purpose:
      'Enable students to express authentic needs, contribute to classroom decision-making, reflect on interpersonal impact, and practise responsible social contribution.',
    studentExperience:
      'Students co-lead check-in circles, propose solutions to playground challenges, and reflect on how their actions affect the collective classroom mood.',
    teacherPracticesSummary:
      'Student-led council moments, impact reflections, cooperative problem-solving routines, student voice surveys.',
    evidenceExpectations:
      'Student-authored class charter updates, collaborative solution charts, student voice audio/text reflections (de-identified).',
    readinessCriteria:
      'Student-facilitated routines documented in at least 2 classroom sessions per participating cohort.',
    recommendedGradeBands: ['Grades 1–2', 'Grades 3–4', 'Grade 5'],
    reviewMethod: 'Student voice dossier curation and phase review.',
    practiceFamilyNames: ['Student Voice Reflections', 'Charter Revisit', 'Agency & Choice', 'Collaborative Problem-Solving'],
    version: 1,
  },
  {
    phaseNumber: 5,
    phaseId: 'phase-5',
    code: 'PH-5',
    name: 'Phase 5: Integration and School Reflection',
    workingLabel: 'Integration & School Reflection',
    purpose:
      'Consolidate the emotional intelligence practices into the school’s regular pedagogical rhythm and synthesize evidence for the CEQHS Partner School Dossier.',
    studentExperience:
      'Students celebrate growth in emotional maturity, understand their personal regulation toolkits, and transition confidently to the next school year.',
    teacherPracticesSummary:
      'Summative reflection dialogues, dossier synthesis workshops, curriculum alignment reviews, next-year implementation planning.',
    evidenceExpectations:
      'Completed school dossier chapters, school learning statement, teacher portfolio summaries, curriculum alignment evaluation report.',
    readinessCriteria:
      'Final dossier submitted, verified by CEQHS Reviewer, and approved by Super Admin Saugat Singh.',
    recommendedGradeBands: ['Grades 1–2', 'Grades 3–4', 'Grade 5'],
    reviewMethod: 'Comprehensive dossier verification and Super Admin accreditation sign-off.',
    practiceFamilyNames: ['Dossier Synthesis', 'Learning Statement', 'Curriculum Review', 'Next-Cycle Roadmap'],
    version: 1,
  },
];

export const OFFICIAL_PRACTICES: CEQHSPracticeDefinition[] = [
  {
    id: 'practice-emotion-checkin',
    name: 'Daily Emotion Weather Check-In',
    purpose:
      'Establish a predictable, welcoming morning ritual where students identify their current emotional state using age-appropriate visual or verbal anchors.',
    phaseNumber: 1,
    phaseName: 'Phase 1: Emotional Awareness and Safe Classroom Climate',
    recommendedGrades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    developmentalRationale:
      'Children cannot regulate emotional states they have not noticed or named. Predictable check-ins signal nervous system safety.',
    suggestedDuration: '4–6 minutes at morning arrival',
    materialsNeeded: 'Classroom Feeling Board or emotion cards with weather metaphors (Sunny, Breezy, Cloudy, Stormy).',
    teacherGuidance:
      'Acknowledge each student without judgment. If a student names a stormy state, validate that storms are a natural part of being human.',
    studentFacingObjective: 'I can notice how I feel this morning and share it safely with my class.',
    studentFacingLanguage: 'Look inside for a quiet moment. What is the weather inside your heart right now?',
    adaptationsFoundation:
      'Grade 1–2: Use large picture weather symbols or colored emotion tokens. Teacher models: "I feel a bit breezy today because I rushed to school."',
    adaptationsDeveloping:
      'Grade 3–4: Introduce the 2x2 Energy vs. Pleasantness grid (e.g. high energy & pleasant = excited; low energy & unpleasant = tired/sad).',
    adaptationsTransition:
      'Grade 5: Encourage nuanced emotional vocabulary (e.g., apprehensive, optimistic, frustrated, content). Optional anonymous sticky-note check-in.',
    suggestedEvidencePrompts: [
      'What percentage of students voluntarily participated in today’s check-in?',
      'Describe one adjustment you made based on the overall classroom emotional climate.',
    ],
    safeguardingNotes:
      'If a student repeatedly indicates severe distress or unsafe conditions at home, consult the school safeguarding lead immediately outside the group setting.',
    curriculumMappingReferences: ['IB: ALT.AFF.01', 'OX: OX.WB.PEM', 'CA: CA.REF.01', 'NC: NC.SEL.01'],
    version: 1,
    approvalStatus: 'Approved for pilot use',
  },
  {
    id: 'practice-micro-pause',
    name: 'Classroom Mindful Micro-Pause',
    purpose:
      'Introduce brief 45-second breathing and sensory grounding pauses during transitions between high-energy activities and focused academic work.',
    phaseNumber: 2,
    phaseName: 'Phase 2: Regulation and Responsive Choice',
    recommendedGrades: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    developmentalRationale:
      'Neurodevelopmentally, rapid cognitive task-switching triggers adrenaline in younger brains. Micro-pauses reset executive function.',
    suggestedDuration: '60 seconds during transitions',
    materialsNeeded: 'Soft chime or singing bowl, optional visual breathing ring.',
    teacherGuidance:
      'Model slow belly breathing. Keep instructions gentle and non-punitive. Never use micro-pauses as a disciplinary sanction.',
    studentFacingObjective: 'I can take three deep belly breaths to help my mind and body feel calm and ready.',
    studentFacingLanguage: 'When the chime rings, feet on the floor, hands in your lap. Let’s breathe in calm, breathe out rushing.',
    adaptationsFoundation:
      'Grade 1–2: "Five Finger Breathing" — trace up one finger as you breathe in, down as you breathe out. Or "Smell the flower, blow out the candle."',
    adaptationsDeveloping:
      'Grade 3–4: "Box Breathing" (4 counts in, 4 counts hold, 4 counts out, 4 counts rest). Count gently with fingers.',
    adaptationsTransition:
      'Grade 5: Self-directed 60-second silence with attention on the natural breath. Student rotating facilitator rings the chime.',
    suggestedEvidencePrompts: [
      'How quickly did students settle into the subsequent task compared to non-pause days?',
      'Did students request the micro-pause during high-stress moments?',
    ],
    safeguardingNotes: 'Allow students who feel anxious closing their eyes to simply soften their gaze towards their desk.',
    curriculumMappingReferences: ['IB: ALT.AFF.02', 'OX: OX.WB.PEM', 'CA: CA.REF.01', 'NC: NC.SEL.02'],
    version: 1,
    approvalStatus: 'Approved for pilot use',
  },
  {
    id: 'practice-listening-circle',
    name: 'Empathetic Listening Circle',
    purpose:
      'Facilitate structured peer conversations where students practice respectful silence while another speaks, followed by validating reflections.',
    phaseNumber: 3,
    phaseName: 'Phase 3: Empathy, Perspective, and Relationship',
    recommendedGrades: ['Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
    developmentalRationale:
      'Theory of mind develops rapidly between ages 7 and 11. Structured talking-piece circles prevent louder voices from monopolizing empathy.',
    suggestedDuration: '15–20 minutes once weekly',
    materialsNeeded: 'Talking piece (smooth stone, wooden token, or soft object), center fabric or reminder card.',
    teacherGuidance:
      'Hold the space as equal co-participants. Enforce the rule: only the person holding the talking piece speaks; others listen with eye and heart.',
    studentFacingObjective: 'I can listen to my classmate with full attention and understand their point of view.',
    studentFacingLanguage: 'In this circle, everyone’s story matters. We listen with our ears, our eyes, and our quiet bodies.',
    adaptationsFoundation:
      'Grade 1–2: Short prompt: "One thing that made me smile or feel proud this week." Keep turns under 30 seconds.',
    adaptationsDeveloping:
      'Grade 3–4: Relational prompt: "A time I felt left out or misunderstood, and what helped." Focus on empathetic validation.',
    adaptationsTransition:
      'Grade 5: Complex perspective: "How can our class support someone having a hard week without making them feel singled out?" Co-facilitated by students.',
    suggestedEvidencePrompts: [
      'Describe an instance where a student mirrored or validated a classmate’s perspective during the circle.',
      'How did the circle affect playground interactions during recess?',
    ],
    safeguardingNotes:
      'Remind students of confidentiality within the circle while reiterating that safety concerns must be brought to an adult.',
    curriculumMappingReferences: ['IB: ALT.SOC.03', 'OX: OX.WB.REL', 'CA: CA.RES.02', 'NC: NC.SEL.03'],
    version: 1,
    approvalStatus: 'Approved for pilot use',
  },
  {
    id: 'practice-student-voice-action',
    name: 'Classroom Solution Council & Impact Reflection',
    purpose:
      'Provide structured opportunities for students to identify classroom or playground friction points and propose collaborative, caring solutions.',
    phaseNumber: 4,
    phaseName: 'Phase 4: Student Voice and Responsible Action',
    recommendedGrades: ['Grade 3', 'Grade 4', 'Grade 5'],
    developmentalRationale:
      'Older primary students desire genuine agency. Giving them a constructive forum for collective problem-solving channelizes critical thinking into civic care.',
    suggestedDuration: '20 minutes bi-weekly',
    materialsNeeded: 'Classroom Solution Box, large chart paper, markers.',
    teacherGuidance:
      'Act as scribe or neutral facilitator. Guide discussion toward restorative solutions rather than assigning blame or punishment.',
    studentFacingObjective: 'I can collaborate with my peers to solve a shared classroom challenge and take responsibility for our agreements.',
    studentFacingLanguage: 'We are a learning community. When something isn’t working, we work together to fix it with kindness.',
    adaptationsFoundation:
      'Grade 1–2: Teacher presents a common sharing dilemma (e.g. sharing the building blocks). Class votes with thumbs on two kind solutions.',
    adaptationsDeveloping:
      'Grade 3–4: Small groups of 4 brainstorm ideas for improving hallway transitions; each group presents one idea.',
    adaptationsTransition:
      'Grade 5: Student council leads the meeting, logs action items, and revisits impact at the next meeting.',
    suggestedEvidencePrompts: [
      'What student-proposed solution was implemented, and what measurable impact was observed?',
      'How did reluctant students participate in the decision-making process?',
    ],
    safeguardingNotes: 'Ensure discussions address systems and shared habits, never individual children by name.',
    curriculumMappingReferences: ['IB: CEQHS-ATL-SOC-03', 'OX: OX.WB.ACT', 'CA: CA.RES.02', 'NC: NC.SEL.03'],
    version: 1,
    approvalStatus: 'Approved for pilot use',
  },
];

export const INITIAL_CURRICULUM_MAPPINGS: CurriculumAlignmentMapping[] = [
  {
    id: 'map-ib-1',
    frameworkName: 'International Baccalaureate (IB)',
    jurisdiction: 'IB PYP Global',
    gradeRange: 'Grades 1–3',
    outcomeDomainName: 'Approaches to Learning & Affective Skills',
    outcomeReferenceCode: 'CEQHS-ATL-AFF-01',
    outcomeTitle: 'States of Mind & Emotional Literacy',
    ceqhsPracticeId: 'practice-emotion-checkin',
    ceqhsPracticeName: 'Daily Emotion Weather Check-In',
    ceqhsPhaseNumber: 1,
    ceqhsPhaseName: 'Phase 1: Emotional Awareness and Safe Classroom Climate',
    alignmentType: 'Contributing',
    evidenceTier: 'Tier 2',
    evidenceTierLabel: 'Tier 2 — Reasoned',
    alignmentExplanation:
      'The daily emotion check-in directly establishes the self-awareness and emotional vocabulary required under IB PYP Self-Management (Affective Skills: States of Mind). It does not claim a sixth ATL category or build a parallel assessment structure, but provides transdisciplinary morning routines for noticing affective states.',
    connectionTypeLabel: 'IB / ATL-related learning outcome connection',
    confidenceStatus: 'High',
    mappingStatus: 'Approved for pilot use',
    sourceReference: 'IB Primary Years Programme: The Learner (Approaches to Learning Framework, Affective Skills)',
    createdBy: 'Saugat Singh',
    approvedBy: 'Saugat Singh',
    approvedAt: '2026-09-01T10:00:00Z',
    version: 1,
  },
  {
    id: 'map-ib-2',
    frameworkName: 'International Baccalaureate (IB)',
    jurisdiction: 'IB PYP Global',
    gradeRange: 'Grades 1–5',
    outcomeDomainName: 'Approaches to Learning & Affective Skills',
    outcomeReferenceCode: 'CEQHS-ATL-AFF-02',
    outcomeTitle: 'Regulation Strategies & Pause Before Response',
    ceqhsPracticeId: 'practice-micro-pause',
    ceqhsPracticeName: 'Classroom Mindful Micro-Pause',
    ceqhsPhaseNumber: 2,
    ceqhsPhaseName: 'Phase 2: Regulation and Responsive Choice',
    alignmentType: 'Contributing',
    evidenceTier: 'Tier 2',
    evidenceTierLabel: 'Tier 2 — Reasoned',
    alignmentExplanation:
      'Micro-pauses provide experiential practice for perseverance, mindfulness, and sensory reset in high-inquiry PYP classroom environments without invoking contested psychological constructs.',
    connectionTypeLabel: 'IB / ATL-related learning outcome connection',
    confidenceStatus: 'High',
    mappingStatus: 'Approved for pilot use',
    sourceReference: 'IB Primary Years Programme: Self-Management & Mindfulness',
    createdBy: 'Saugat Singh',
    approvedBy: 'Saugat Singh',
    approvedAt: '2026-09-01T10:00:00Z',
    version: 1,
  },
  {
    id: 'map-ox-1',
    frameworkName: 'Oxford Curriculum',
    jurisdiction: 'Oxford International Curriculum',
    gradeRange: 'Grades 1–3',
    outcomeDomainName: 'Wellbeing Strand: Emotional & Social Competencies',
    outcomeReferenceCode: 'OX.WB.PEM',
    outcomeTitle: 'Positive Emotions & Body Awareness',
    ceqhsPracticeId: 'practice-emotion-checkin',
    ceqhsPracticeName: 'Daily Emotion Weather Check-In',
    ceqhsPhaseNumber: 1,
    ceqhsPhaseName: 'Phase 1: Emotional Awareness and Safe Classroom Climate',
    alignmentExplanation:
      'Maps to the Oxford Wellbeing curriculum strand on emotional recognition, self-knowledge, and safe classroom climate.',
    connectionTypeLabel: 'Oxford / Wellbeing connection',
    confidenceStatus: 'High',
    mappingStatus: 'Approved for pilot use',
    sourceReference: 'Oxford International Curriculum Wellbeing Framework (Key Stages 1 & 2)',
    createdBy: 'Saugat Singh',
    approvedBy: 'Saugat Singh',
    approvedAt: '2026-09-01T10:00:00Z',
    version: 1,
  },
  {
    id: 'map-ca-1',
    frameworkName: 'Cambridge Curriculum',
    jurisdiction: 'Cambridge Primary',
    gradeRange: 'Grades 1–5',
    outcomeDomainName: 'Cambridge Learner Attributes & Pastoral Development',
    outcomeReferenceCode: 'CA.REF.01',
    outcomeTitle: 'Reflective Learning & Self-Observation',
    ceqhsPracticeId: 'practice-micro-pause',
    ceqhsPracticeName: 'Classroom Mindful Micro-Pause',
    ceqhsPhaseNumber: 2,
    ceqhsPhaseName: 'Phase 2: Regulation and Responsive Choice',
    alignmentExplanation:
      'Strengthens the "Reflective" Cambridge Learner Attribute by enabling young students to pause, evaluate their bodily state, and re-engage thoughtfully.',
    connectionTypeLabel: 'Cambridge / Learner Attribute connection',
    confidenceStatus: 'High',
    mappingStatus: 'Approved for pilot use',
    sourceReference: 'Cambridge Primary Learner Attributes & Pastoral Care Guidelines',
    createdBy: 'Saugat Singh',
    approvedBy: 'Saugat Singh',
    approvedAt: '2026-09-01T10:00:00Z',
    version: 1,
  },
  {
    id: 'map-nc-1',
    frameworkName: 'National Curriculum',
    jurisdiction: 'National Curriculum SEL / PSHE Guidelines',
    gradeRange: 'Grades 1–3',
    outcomeDomainName: 'Personal, Social & Emotional Well-Being',
    outcomeReferenceCode: 'NC.SEL.01',
    outcomeTitle: 'Self-Awareness & Naming Emotion States',
    ceqhsPracticeId: 'practice-emotion-checkin',
    ceqhsPracticeName: 'Daily Emotion Weather Check-In',
    ceqhsPhaseNumber: 1,
    ceqhsPhaseName: 'Phase 1: Emotional Awareness and Safe Classroom Climate',
    alignmentExplanation:
      'Aligns with foundational National Curriculum PSHE/SEL objectives focusing on mental health awareness, body signals, and vocabulary.',
    connectionTypeLabel: 'National Curriculum / SEL connection',
    confidenceStatus: 'High',
    mappingStatus: 'Approved for pilot use',
    sourceReference: 'National Curriculum PSHE & Citizenship Core Theme 1: Health and Wellbeing',
    createdBy: 'Saugat Singh',
    approvedBy: 'Saugat Singh',
    approvedAt: '2026-09-01T10:00:00Z',
    version: 1,
  },
];
