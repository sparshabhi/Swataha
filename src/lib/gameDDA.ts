import {
  DifficultyTier,
  ScenarioItem,
  DDAState,
  ScenarioAttempt,
  Achievement,
  GameProgressState,
  UserSettings,
} from '../types';

export const INITIAL_ACHIEVEMENTS: Achievement[] = [
  {
    id: 'first_pause',
    title: 'The First Breath',
    description: 'Complete your first classroom dilemma with a deliberate Curious Pause.',
    icon: '🧘',
    category: 'pause',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'flow_zone',
    title: 'In The Flow Channel',
    description: 'Attain and sustain an Optimal Flow score of 75% or higher for 3 rounds.',
    icon: '🌊',
    category: 'flow',
    unlocked: false,
    progress: 0,
    maxProgress: 3,
  },
  {
    id: 'restorative_streak',
    title: 'Unshakable Grounding',
    description: 'Achieve a 4-scenario streak of empathetic, restorative resolutions.',
    icon: '✨',
    category: 'mastery',
    unlocked: false,
    progress: 0,
    maxProgress: 4,
  },
  {
    id: 'master_tier',
    title: 'Systemic Navigator',
    description: 'Reach and conquer a Tier 4 or Tier 5 Masterclass educational scenario.',
    icon: '👑',
    category: 'mastery',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'deliberate_pace',
    title: 'Somatic Attunement',
    description: 'Respond in the ideal 4–8 second reflective pause window 5 times.',
    icon: '⏳',
    category: 'pause',
    unlocked: false,
    progress: 0,
    maxProgress: 5,
  },
  {
    id: 'adaptive_resilience',
    title: 'Resilient Adaptability',
    description: 'Recover from a challenging scenario setback and return to mastery.',
    icon: '🌱',
    category: 'persistence',
    unlocked: false,
    progress: 0,
    maxProgress: 1,
  },
];

export const INITIAL_DDA_STATE: DDAState = {
  currentTier: 2,
  skillRating: 1200,
  rollingSuccessRate: 75,
  rollingAvgTime: 6.2,
  currentStreak: 0,
  bestStreak: 0,
  flowState: 'flow',
  flowScore: 78,
  adaptiveTimerSeconds: 18,
  nuanceLevel: 2,
  lastAdjustmentReason: 'Calibrating to initial educator baseline rhythm.',
};

export const INITIAL_BASELINE_HISTORY: ScenarioAttempt[] = [
  {
    scenarioId: 'sc-baseline-1',
    scenarioTitle: 'Morning Advisory Eye Contact',
    chosenOptionId: 'opt-b1',
    isOptimal: true,
    score: 95,
    timeTakenSeconds: 5.6,
    pausedBeforeAnswering: true,
    difficultyTier: 1,
    timestamp: 'Baseline 1',
    adjustmentNote: 'Somatic pause established (5.6s). Calibrating Tier 1 groundwork.',
    skillRatingAfter: 1224,
    flowScore: 72,
  },
  {
    scenarioId: 'sc-baseline-2',
    scenarioTitle: 'Hallway Backpack Spill Frustration',
    chosenOptionId: 'opt-b2',
    isOptimal: true,
    score: 100,
    timeTakenSeconds: 6.2,
    pausedBeforeAnswering: true,
    difficultyTier: 1,
    timestamp: 'Baseline 2',
    adjustmentNote: 'Consecutive attunement. Promoting engine difficulty to Tier 2.',
    skillRatingAfter: 1258,
    flowScore: 79,
  },
  {
    scenarioId: 'sc-baseline-3',
    scenarioTitle: 'Unannounced Curriculum Audit Friction',
    chosenOptionId: 'opt-b3',
    isOptimal: false,
    score: 65,
    timeTakenSeconds: 8.5,
    pausedBeforeAnswering: true,
    difficultyTier: 2,
    timestamp: 'Baseline 3',
    adjustmentNote: 'Cognitive load detected under colleague tension. Stabilizing Tier 2.',
    skillRatingAfter: 1242,
    flowScore: 68,
  },
  {
    scenarioId: 'sc-baseline-4',
    scenarioTitle: 'The Reluctant Math Journaler',
    chosenOptionId: 'opt-b4',
    isOptimal: true,
    score: 100,
    timeTakenSeconds: 5.9,
    pausedBeforeAnswering: true,
    difficultyTier: 2,
    timestamp: 'Baseline 4',
    adjustmentNote: 'Curious pause sustained (5.9s). Flow zone restored (Rating: 1276).',
    skillRatingAfter: 1276,
    flowScore: 82,
  },
];

export const INITIAL_GAME_PROGRESS: GameProgressState = {
  userId: 'guest',
  dda: INITIAL_DDA_STATE,
  totalPlayed: 4,
  totalSuccesses: 3,
  achievements: INITIAL_ACHIEVEMENTS,
  recentHistory: INITIAL_BASELINE_HISTORY,
  updatedAt: new Date().toISOString(),
};

export const DEFAULT_USER_SETTINGS: UserSettings = {
  soundEnabled: true,
  timerMode: 'adaptive',
  ddaSensitivity: 'standard',
  preferredContext: 'whole_school',
  autoAdvance: false,
  themePreference: 'warm_ivory',
};

// ---------------------------------------------------------------------------
// SCENARIOS REPOSITORY (Spanning Tiers 1 through 5)
// ---------------------------------------------------------------------------

export const SCENARIOS: ScenarioItem[] = [
  // --- TIER 1: Foundational Grounding (Clear contrast, gentle stakes) ---
  {
    id: 'sc-101',
    title: 'The Slammed Textbook',
    context: 'Period 3 Math Class · Independent Problem Solving',
    gradeBand: 'Middle School',
    themeId: 'empathetic-discipline',
    difficultyTier: 1,
    situation:
      'Liam (Grade 7) abruptly slams his algebra workbook shut, pushes his desk back with a screech, and crosses his arms, breathing heavily after staring at a complex word problem.',
    studentOrColleagueVoice: '"I\'m not doing this stupid worksheet. It makes zero sense."',
    curiosityQuestion: 'What is happening in Liam\'s nervous system before we address the defiance?',
    minimumDeliberatePauseSeconds: 3,
    options: [
      {
        id: 'opt-101-a',
        text: '"Liam, that behavior is unacceptable in my classroom. Open the book now or take a 10-minute detention."',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 20,
        pedagogicalRationale:
          'Escalates the threat response in an already overwhelmed student, turning cognitive frustration into a power struggle.',
        humanImpact: 'Liam shuts down further or escalates into open rebellion to protect his dignity.',
        somaticNote: 'Teacher reacts immediately from tension and control.',
      },
      {
        id: 'opt-101-b',
        text: '"Liam, school policy requires all students to attempt every exercise before lunch. Please follow the class expectations."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 45,
        pedagogicalRationale:
          'Appeals to cold policy while ignoring Liam\'s acute cognitive overload and nervous system distress.',
        humanImpact: 'Liam feels like an obstacle in a system rather than a seen human being.',
      },
      {
        id: 'opt-101-c',
        text: '"Come on Liam, you are so smart! Cheer up, math is fun! Let\'s just smile and do problem number three together."',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 60,
        pedagogicalRationale:
          'Invalidates his genuine distress with forced cheerfulness without giving him space to regulate.',
        humanImpact: 'Temporarily pacifying, but does not build real emotional safety or agency.',
      },
      {
        id: 'opt-101-d',
        text: 'Take a calm breath. Step down to his eye level at a non-threatening angle, and gently say: "That was a big sound, Liam. Looks like this problem hit a wall. Take a moment. What part of the question started feeling tangled?"',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'The Curious Pause in action: regulates educator physiology first, lowers social threat, validates the overwhelm, and reframes frustration into an objective puzzle.',
        humanImpact: 'Liam’s shoulders drop; feeling safe from public humiliation, he points to the step where he got lost.',
        somaticNote: 'Lowered posture, soft gaze, calm breath transmits parasympathetic safety.',
      },
    ],
  },

  {
    id: 'sc-102',
    title: 'The Silent Withdrawal',
    context: 'Morning Advisory Circle · Weekly Check-In',
    gradeBand: 'High School',
    themeId: 'listening-depth',
    difficultyTier: 1,
    situation:
      'During the circle prompt ("One thing weighing on you this week"), Priya usually shares enthusiastically. Today she is slumped, staring at her sneakers, and mumbles a flat "Nothing."',
    studentOrColleagueVoice: '"Pass. Nothing to say."',
    curiosityQuestion: 'How do we honor student autonomy while signaling unwavering emotional presence?',
    minimumDeliberatePauseSeconds: 3,
    options: [
      {
        id: 'opt-102-a',
        text: '"Priya, advisory participation is 15% of your term grade. You can\'t just pass on check-ins."',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 15,
        pedagogicalRationale: 'Weaponizes grading against emotional vulnerability.',
        humanImpact: 'Priya feels exposed and resentful.',
      },
      {
        id: 'opt-102-b',
        text: 'Immediately ask in front of everyone: "Why are you looking so sad today, Priya? What happened at home?"',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 35,
        pedagogicalRationale: 'Puts private emotional distress on public display.',
        humanImpact: 'Deep social embarrassment and defensive walls.',
      },
      {
        id: 'opt-102-c',
        text: '"Okay, pass accepted. Next person please."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 55,
        pedagogicalRationale: 'Respects the pass, but offers zero relational tether or follow-up reassurance.',
        humanImpact: 'Priya feels invisible and confirmed in her isolation.',
      },
      {
        id: 'opt-102-d',
        text: 'Pause, nod gently with a warm, steady gaze: "Thank you for letting us know where you are at, Priya. We hear you." Catch her eye softly after the circle with a private note: "I noticed your quietness today. No need to talk, but my door is open at lunch if you want quiet space."',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Protects circle safety without forcing exposure, while offering a low-pressure, high-dignity private bridge.',
        humanImpact: 'Priya feels both respected in the group and privately cared for.',
      },
    ],
  },

  // --- TIER 2: Emerging Nuance (Subtle emotional layers, classroom momentum) ---
  {
    id: 'sc-201',
    title: 'The Cafeteria Collision',
    context: 'Transition Corridor after Lunch · 12:45 PM',
    gradeBand: 'Middle School',
    themeId: 'pause-before-solving',
    difficultyTier: 2,
    situation:
      'Two 8th graders, Marcus and Devon, bump shoulders in the crowded hallway. Drinks spill. Marcus squares his shoulders, shouting, "Watch where you\'re going!" Other students instantly stop and pull out phones.',
    studentOrColleagueVoice: '"He deliberately shoved me! Tell him to step back right now!"',
    curiosityQuestion: 'How does an educator de-escalate the audience effect and the fight-or-flight spike?',
    minimumDeliberatePauseSeconds: 4,
    options: [
      {
        id: 'opt-201-a',
        text: 'Yell over the crowd: "Put those phones away right this second! Marcus, Devon, office right now!"',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 30,
        pedagogicalRationale: 'Matches student frenzy with educator frenzy, validating the crisis atmosphere.',
        humanImpact: 'Heightened adrenaline; students feel cornered in front of peers.',
      },
      {
        id: 'opt-201-b',
        text: 'Hand Devon a paper towel: "Clean up this spilled milk. Marcus, apologize for shouting so we can move to class."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 50,
        pedagogicalRationale: 'Focuses prematurely on cleaning and forced compliance before adrenaline drops.',
        humanImpact: 'Insincere forced apologies that leave simmering hostility.',
      },
      {
        id: 'opt-201-c',
        text: '"Guys, you are best friends on the basketball team! Why are you fighting over spilled juice? That is silly."',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 55,
        pedagogicalRationale: 'Minimizes their pride and public face threat as "silly".',
        humanImpact: 'Both boys feel misunderstood in their threat response.',
      },
      {
        id: 'opt-201-d',
        text: 'Step smoothly between them sideways (body angled, palms open at waist height, breathing low). Address the crowd first in a steady, low voice: "Give our classmates room, folks. Head to class." Then to Marcus and Devon: "Both of you, take two slow breaths with me. I see the spill. I am here. We will figure this out together out of the hallway."',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Disperses the audience first to eliminate face-saving pressure; somatic non-confrontational positioning protects both students.',
        humanImpact: 'Defuses the audience trigger; allows both boys’ amygdala to stand down.',
      },
    ],
  },

  {
    id: 'sc-202',
    title: 'The Defensive Department Head',
    context: 'Staff Curriculum Planning Session · Tuesday 3:30 PM',
    gradeBand: 'Faculty/Leadership',
    themeId: 'colleague-attunement',
    difficultyTier: 2,
    situation:
      'You suggest piloting a 3-minute emotional check-in routine before weekly departmental staff meetings. A senior colleague scoffs openly: "We don\'t have time for group therapy. We have 14 state standards to cover this quarter."',
    studentOrColleagueVoice: '"Some of us are actually trying to teach content here."',
    curiosityQuestion: 'How do you respond to professional cynicism without defensiveness?',
    minimumDeliberatePauseSeconds: 4,
    options: [
      {
        id: 'opt-202-a',
        text: '"Well, research from Yale and Harvard shows that EQ improves scores, so actually you\'re wrong about the time."',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 25,
        pedagogicalRationale: 'Uses intellectual superiority and research as a cudgel, increasing polarization.',
        humanImpact: 'Deepens the colleague’s resistance and alienates other faculty.',
      },
      {
        id: 'opt-202-b',
        text: '"Fine. If the department doesn\'t want it, let\'s just skip it and stick to the bullet points."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 40,
        pedagogicalRationale: 'Passive retreat that leaves the culture unexamined and resentful.',
        humanImpact: 'Human skills remain a discarded hobby rather than an integrated discipline.',
      },
      {
        id: 'opt-202-c',
        text: '"I understand you feel overwhelmed, Sarah. Take a deep breath. We all feel stressed."',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 55,
        pedagogicalRationale: 'Patronizing tone that diagnoses the colleague’s emotions publicly.',
        humanImpact: 'Sarah feels spoken down to and bristles further.',
      },
      {
        id: 'opt-202-d',
        text: 'Pause, smile with genuine appreciation: "Sarah, you are 100% right that the curriculum pacing guide is intense right now. That pressure is real for all of us. What if we tried it for just 60 seconds as an experiment—not as therapy, but simply to help us clear the noise so our meeting runs tighter?"',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Validates her legitimate concern about workload; frames the practice as an experiment that serves her goals rather than threatening them.',
        humanImpact: 'Lowers peer defenses; transforms an antagonistic blocker into an experimental partner.',
      },
    ],
  },

  // --- TIER 3: Complex Multi-Party & High Ambiguity ---
  {
    id: 'sc-301',
    title: 'The Accusatory Dismissal Encounter',
    context: 'School Front Gate at 3:15 PM · Heavy Traffic',
    gradeBand: 'Elementary',
    themeId: 'restorative-dialogue',
    difficultyTier: 3,
    situation:
      'An upset parent, Mr. Vance, marches up to you at pickup holding his 3rd grader’s reading notebook. His voice is trembling with fury: "Why did you single my daughter out today? She told me you made her cry during read-aloud!"',
    studentOrColleagueVoice: '"You humiliated my child in front of her friends. I want an explanation right now."',
    curiosityQuestion: 'When an adult projects fierce protective anger, how do we anchor in collaborative dignity?',
    minimumDeliberatePauseSeconds: 5,
    options: [
      {
        id: 'opt-301-a',
        text: '"Sir, that is completely false. Your daughter wasn\'t paying attention and I simply asked her to track line four."',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 20,
        pedagogicalRationale: 'Directly challenges the parent\'s narrative at pickup, invalidating their child’s felt experience.',
        humanImpact: 'Parent escalates immediately to the principal or social media.',
      },
      {
        id: 'opt-301-b',
        text: '"Mr. Vance, dismissal time is not an authorized conference period. Please email the front office for an appointment."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 45,
        pedagogicalRationale: 'Technically true policy, but weaponizes bureaucracy against a distressed caregiver.',
        humanImpact: 'Parent perceives an arrogant wall of school indifference.',
      },
      {
        id: 'opt-301-c',
        text: '"I am so terribly sorry! Oh no, please don\'t be mad at me, I love Maya, she is an angel!"',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 50,
        pedagogicalRationale: 'Over-apologetic people-pleasing that sacrifices professional clarity and boundaries.',
        humanImpact: 'Undermines professional trust and does not resolve what actually transpired.',
      },
      {
        id: 'opt-301-d',
        text: 'Plant feet, breathe deeply to steady your voice. Lower vocal pitch and step to the side of the walkway: "Mr. Vance, I can hear how deeply this hurts you, and I care deeply about Maya\'s emotional safety here. Let\'s step three paces away from the crowd. Tell me what Maya shared when she came out, and let\'s understand together what happened."',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Somatic self-regulation anchors the interaction; acknowledges the parent\'s protective love while moving out of the public eye.',
        humanImpact: 'Parent sees an educator who cares about his child’s heart, disarming the aggressive posture.',
      },
    ],
  },

  {
    id: 'sc-302',
    title: 'The Overwhelmed Colleague Breakdown',
    context: 'Faculty Workroom during Planning Period',
    gradeBand: 'Faculty/Leadership',
    themeId: 'somatic-regulation',
    difficultyTier: 3,
    situation:
      'A second-year teacher sits at the copy machine with stacks of paper sliding to the floor. Their hands are trembling, and they whisper: "I can\'t do this. I don\'t know how to manage 5th period. I\'m failing every single one of them."',
    studentOrColleagueVoice: '"I thought I was cut out for teaching. I\'m just not strong enough."',
    curiosityQuestion: 'How do we hold holding space for educator vulnerability without toxic positivity or hurried fixes?',
    minimumDeliberatePauseSeconds: 5,
    options: [
      {
        id: 'opt-302-a',
        text: '"Here, let me give you my classroom management chart. If you just implement token economies by Friday, you\'ll fix it."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 45,
        pedagogicalRationale: 'Rushes into cognitive fixing while the nervous system is in acute collapse.',
        humanImpact: 'Colleague feels inadequate, like a failed technician who needs basic tools.',
      },
      {
        id: 'opt-302-b',
        text: '"Oh don\'t cry! Teaching is the best profession in the world! You\'re doing amazing, remember your why!"',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 40,
        pedagogicalRationale: 'Toxic positivity that stifles honest professional grief and exhaustion.',
        humanImpact: 'Isolation; colleague hides their struggles going forward.',
      },
      {
        id: 'opt-302-c',
        text: '"Honestly, 5th period is awful for everyone. The administration doesn\'t give us any support anyway."',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 35,
        pedagogicalRationale: 'Dumps cynicism into despair, feeding collective helplessness.',
        humanImpact: 'Deepens the spiral into burnout and resignation.',
      },
      {
        id: 'opt-302-d',
        text: 'Quietly kneel by the paper stack. Help pick up three sheets, place a warm hand on the table nearby, and sit quietly for a beat: "Take a breath with me. Sit right here. You are not failing them, you are carrying an enormous load today. Don\'t solve 5th period right now. What does your body need in the next 10 minutes?"',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Somatic co-regulation first, cognitive problem-solving later. Grounds the colleague in biological safety.',
        humanImpact: 'The colleague exhales deeply, breaks the shame spiral, and recovers equilibrium.',
      },
    ],
  },

  // --- TIER 4: High-Stakes Crisis & Institutional Dilemmas ---
  {
    id: 'sc-401',
    title: 'The Identity Slur Under the Bleachers',
    context: 'School Gymnasium · PE Free Period',
    gradeBand: 'High School',
    themeId: 'restorative-dialogue',
    difficultyTier: 4,
    situation:
      'A heated exchange erupts near the locker room. A student uses a derogatory, identity-based slur against another student. The targeted student is trembling in rage, clenching fists; the offending student smirks defensively to his peer clique.',
    studentOrColleagueVoice: '"It was just a joke! People are way too sensitive these days."',
    curiosityQuestion: 'How do you uphold uncompromising identity safety while keeping restorative channels open?',
    minimumDeliberatePauseSeconds: 6,
    options: [
      {
        id: 'opt-401-a',
        text: '"Zero tolerance! Both of you to the suspension room immediately. I will not tolerate that language in this school!"',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 30,
        pedagogicalRationale: 'Punishes the targeted victim alongside the aggressor, destroying institutional trust.',
        humanImpact: 'Victim feels re-victimized by the system; aggressor doubles down on grievance.',
      },
      {
        id: 'opt-401-b',
        text: 'Force them to shake hands right on the gym floor: "Say you\'re sorry right now so we can move past this."',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 25,
        pedagogicalRationale: 'Performative reconciliation that trivializes real psychological harm.',
        humanImpact: 'Dignity injury to the victim; teaches students that apologies are meaningless theater.',
      },
      {
        id: 'opt-401-c',
        text: 'Write the incident report silently and tell the class to go back to shooting hoops.',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 35,
        pedagogicalRationale: 'Bureaucratic avoidance that communicates slurs are just paperwork matters.',
        humanImpact: 'Toxic cultural norm sets in that hate speech has no immediate human boundary.',
      },
      {
        id: 'opt-401-d',
        text: 'Firm, immovable presence: Body oriented to protect the targeted student. Clear boundary without yelling: "That word causes real harm and stops right now. It has no place in our gym." Separate them immediately. Ensure targeted student is with a trusted adult. Then face the speaker with calm, unyielding gravity: "We are going to unpack the human impact of what you said. This is not a joke, and we will not brush it aside."',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Clear firm boundary protecting the harmed party, coupled with refusal to either ignore the harm or discard the offender.',
        humanImpact: 'Targeted student feels protected; entire gym witnesses safety anchored in adult moral courage.',
      },
    ],
  },

  // --- TIER 5: Systemic Masterclass (Complex Stakeholder Tensions) ---
  {
    id: 'sc-501',
    title: 'The Standardized Testing Walkout Threat',
    context: 'High School Auditorium · All-School Assembly',
    gradeBand: 'High School',
    themeId: 'restorative-dialogue',
    difficultyTier: 5,
    situation:
      'Five minutes before state testing orientation, a group of senior student council leaders stand up with banners protesting the impact of high-stakes testing on campus mental health, urging peers to refuse the exam. District observers are present in the back row.',
    studentOrColleagueVoice: '"Our grades are not our worth! We demand that mental health be prioritized over school rankings!"',
    curiosityQuestion: 'How does an educational leader honor genuine student voice and ethical conviction without sacrificing school stability?',
    minimumDeliberatePauseSeconds: 7,
    options: [
      {
        id: 'opt-501-a',
        text: 'Call campus security immediately and confiscate the banners, threatening to revoke graduation privileges.',
        responseStyle: 'reactive',
        isOptimal: false,
        score: 15,
        pedagogicalRationale: 'Autocratic suppression that proves the students\' critique of institutional coldness.',
        humanImpact: 'Sparks widespread rebellion and severe media/community backlash.',
      },
      {
        id: 'opt-501-b',
        text: 'Speak into the mic: "Students, education law code 442 requires all students present to sit for the diagnostic. Please sit."',
        responseStyle: 'procedural',
        isOptimal: false,
        score: 40,
        pedagogicalRationale: 'Legalistic rebuttal that completely dodges the moral and psychological core of the protest.',
        humanImpact: 'Audience boos; administrative credibility collapses.',
      },
      {
        id: 'opt-501-c',
        text: '"I agree with you 100%! Testing is evil! Let\'s all take the day off and drink hot chocolate!"',
        responseStyle: 'surface_empathy',
        isOptimal: false,
        score: 30,
        pedagogicalRationale: 'Abdication of institutional responsibility and leadership duty.',
        humanImpact: 'Chaos; campus loses legal standing and adult stewardship.',
      },
      {
        id: 'opt-501-d',
        text: 'Walk calmly to the podium, pause for three steady seconds to quiet the room. Speak with deep warmth and measured clarity: "I see your banners, and I hear the moral courage behind them. You care about the mental health of this student body—and so do we. Today\'s state test fulfills a legal mandate for our school, but your voice is not silenced by taking it. I invite your five leaders to join me in my office at 1:00 PM today with our district guests to plan a real mental health forum. Right now, let\'s demonstrate both our academic discipline and our human dignity."',
        responseStyle: 'curious_pause',
        isOptimal: true,
        score: 100,
        pedagogicalRationale:
          'Masterclass leadership: validates the ethical legitimacy of student voice, integrates external stakeholders, and establishes an authentic dialogic forum while preserving campus order.',
        humanImpact: 'Students feel heard, respected, and treated as civic partners; testing proceeds calmly.',
      },
    ],
  },
];

// ---------------------------------------------------------------------------
// DYNAMIC DIFFICULTY ADJUSTMENT (DDA) ENGINE
// ---------------------------------------------------------------------------

export function calculateNextDDA(
  currentDDA: DDAState,
  attempt: {
    score: number;
    isOptimal: boolean;
    timeTakenSeconds: number;
    pausedEnough: boolean;
    difficultyTier: DifficultyTier;
  },
  settings: UserSettings
): { nextDDA: DDAState; unlockedAchievements: string[]; adjustmentReason: string } {
  const { score, isOptimal, timeTakenSeconds, pausedEnough, difficultyTier } = attempt;

  // Sensitivity multiplier
  const sensitivityMultiplier =
    settings.ddaSensitivity === 'aggressive'
      ? 1.5
      : settings.ddaSensitivity === 'gentle'
      ? 0.7
      : 1.0;

  // Update streaks
  const nextStreak = isOptimal ? currentDDA.currentStreak + 1 : 0;
  const nextBestStreak = Math.max(currentDDA.bestStreak, nextStreak);

  // Update rolling metrics (exponential moving average over ~5 trials)
  const alpha = 0.25 * sensitivityMultiplier;
  const trialSuccessScore = isOptimal ? 100 : score;
  const nextRollingSuccessRate = Math.round(
    currentDDA.rollingSuccessRate * (1 - alpha) + trialSuccessScore * alpha
  );

  const nextRollingAvgTime = Number(
    (currentDDA.rollingAvgTime * (1 - alpha) + timeTakenSeconds * alpha).toFixed(1)
  );

  // ELO skill rating adjustment
  let ratingDelta = 0;
  if (isOptimal) {
    const tierBonus = difficultyTier * 8;
    const pauseBonus = pausedEnough ? 12 : 4;
    ratingDelta = Math.round((20 + tierBonus + pauseBonus) * sensitivityMultiplier);
  } else {
    ratingDelta = -Math.round((18 - (score / 100) * 10) * sensitivityMultiplier);
  }
  const nextSkillRating = Math.max(800, Math.min(2600, currentDDA.skillRating + ratingDelta));

  // Determine Flow Zone (Csikszentmihalyi channel)
  // Target: Success rate 65% - 85%, healthy pause time (3.5 - 9.0s)
  let nextFlowState: 'boredom' | 'flow' | 'anxiety' = 'flow';
  let flowScore = 75;

  if (nextRollingSuccessRate > 88 && nextRollingAvgTime < 3.5) {
    nextFlowState = 'boredom'; // Too easy, player rushing through
    flowScore = 60;
  } else if (nextRollingSuccessRate < 55 || (nextRollingAvgTime > 14 && !isOptimal)) {
    nextFlowState = 'anxiety'; // Too hard, cognitive friction
    flowScore = 50;
  } else {
    nextFlowState = 'flow'; // Sweet spot
    flowScore = Math.min(98, 70 + nextStreak * 5 + (pausedEnough ? 10 : 0));
  }

  // Dynamic Tier Adjustment
  let nextTier: DifficultyTier = currentDDA.currentTier;
  let nextTimer = currentDDA.adaptiveTimerSeconds;
  let nextNuance = currentDDA.nuanceLevel;
  let reason = '';

  if (nextFlowState === 'boredom' || (nextStreak >= 3 && nextRollingSuccessRate >= 80)) {
    // Challenge is too low -> subtly increase challenge
    if (nextTier < 5) {
      nextTier = (nextTier + 1) as DifficultyTier;
      nextTimer = Math.max(8, currentDDA.adaptiveTimerSeconds - 2);
      nextNuance = Math.min(5, currentDDA.nuanceLevel + 1);
      reason = `Sustained high mastery (${nextRollingSuccessRate}%). Elevating to Tier ${nextTier} with subtle distractor nuance.`;
    } else {
      nextTimer = Math.max(7, currentDDA.adaptiveTimerSeconds - 1);
      reason = `Master tier achieved. Tightening response window to ${nextTimer}s.`;
    }
  } else if (nextFlowState === 'anxiety' || (!isOptimal && currentDDA.rollingSuccessRate < 60)) {
    // Challenge is too high -> gently support player
    if (nextTier > 1) {
      nextTier = (nextTier - 1) as DifficultyTier;
      nextTimer = Math.min(25, currentDDA.adaptiveTimerSeconds + 3);
      nextNuance = Math.max(1, currentDDA.nuanceLevel - 1);
      reason = `Nervous system load detected. Lowering to Tier ${nextTier} and expanding pause window.`;
    } else {
      nextTimer = Math.min(25, currentDDA.adaptiveTimerSeconds + 2);
      reason = `Providing additional grounding space (+2s pause window).`;
    }
  } else {
    // Optimal Flow Zone
    reason = `Optimal Flow Zone sustained (Rating: ${nextSkillRating}, ${nextRollingSuccessRate}% accuracy).`;
  }

  // Check achievements
  const newUnlocked: string[] = [];
  if (isOptimal && pausedEnough) {
    newUnlocked.push('first_pause');
  }
  if (flowScore >= 75) {
    newUnlocked.push('flow_zone');
  }
  if (nextStreak >= 4) {
    newUnlocked.push('restorative_streak');
  }
  if (nextTier >= 4 && isOptimal) {
    newUnlocked.push('master_tier');
  }
  if (timeTakenSeconds >= 4 && timeTakenSeconds <= 8 && isOptimal) {
    newUnlocked.push('deliberate_pace');
  }
  if (currentDDA.currentStreak === 0 && isOptimal && currentDDA.rollingSuccessRate < 60) {
    newUnlocked.push('adaptive_resilience');
  }

  const nextDDA: DDAState = {
    currentTier: nextTier,
    skillRating: nextSkillRating,
    rollingSuccessRate: nextRollingSuccessRate,
    rollingAvgTime: nextRollingAvgTime,
    currentStreak: nextStreak,
    bestStreak: nextBestStreak,
    flowState: nextFlowState,
    flowScore,
    adaptiveTimerSeconds: nextTimer,
    nuanceLevel: nextNuance,
    lastAdjustmentReason: reason,
  };

  return {
    nextDDA,
    unlockedAchievements: newUnlocked,
    adjustmentReason: reason,
  };
}
