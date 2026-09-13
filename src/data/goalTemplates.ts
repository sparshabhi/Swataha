import {
  PersonalDevelopmentGoal,
  SEIAssessmentSource,
  SEICompetencyCategory,
  WeeklyActionTip,
} from '../types';

export interface CompetencyMetadata {
  id: string;
  name: string;
  category: SEICompetencyCategory;
  assessmentSource: SEIAssessmentSource;
  description: string;
  briefingQuestion: string;
  weeklyTipsTemplate: { habit: string; tip: string }[];
}

export const SEI_COMPETENCIES: CompetencyMetadata[] = [
  {
    id: 'increasing-empathy',
    name: 'Increasing Empathy',
    category: 'Give Yourself',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    description: 'Recognizing, understanding, and responding purposefully to others’ emotional cues and unstated needs.',
    briefingQuestion: 'How can you pause long enough to understand a student’s unspoken internal state before addressing their outward behaviour?',
    weeklyTipsTemplate: [
      {
        habit: 'The 4-Second Somatic Breath',
        tip: 'Before vocalizing a redirection, inhale once and exhale for 4 seconds to de-escalate your own nervous system.',
      },
      {
        habit: 'Curious Restatement',
        tip: 'Instead of issuing a direct command, reflect what you observe: "I notice a lot of energy or tension right now. What feels heavy today?"',
      },
      {
        habit: 'Unconditional Post-Incident Check-In',
        tip: 'Find 60 quiet seconds after class with a dysregulated student to reaffirm relationship: "I care about how you are doing today."',
      },
      {
        habit: 'Perspective Mapping in Advisory',
        tip: 'During group conflicts, invite students to name the feelings of the other person before discussing solutions.',
      },
      {
        habit: 'Emotional Mirroring Without Judgment',
        tip: 'Notice when your own emotional response mirrors student anxiety, and acknowledge it silently to prevent escalation.',
      },
      {
        habit: 'Sustainable Compassion Practice',
        tip: 'Conduct an end-of-day self-empathy debrief: celebrate where you held emotional boundaries without taking student reactions personally.',
      },
    ],
  },
  {
    id: 'emotional-literacy',
    name: 'Emotional Literacy',
    category: 'Know Yourself',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    description: 'Accurately identifying, feeling, and naming emotions in yourself and your students.',
    briefingQuestion: 'How can distinguishing nuanced emotions help you move beyond reactive categorizations of student distress?',
    weeklyTipsTemplate: [
      {
        habit: 'Body Sensation Log',
        tip: 'Notice where emotional temperature registers first in your body (jaw clenching, tight chest, shallow breathing) before difficult periods.',
      },
      {
        habit: 'Nuanced Vocabulary Shift',
        tip: 'Replace generic words like "fine", "bad", or "mad" with specific states like "overwhelmed", "vulnerable", "apprehensive", or "disconnected".',
      },
      {
        habit: 'The Feeling Thermometer Check-In',
        tip: 'Introduce a low-stakes visual feeling barometer at the classroom threshold for students entering advisory.',
      },
      {
        habit: 'Silent Self-Naming',
        tip: 'When feeling hurried or frustrated, internally name your state three times: "I am feeling hurried right now" before opening your mouth.',
      },
    ],
  },
  {
    id: 'recognizing-patterns',
    name: 'Recognizing Patterns',
    category: 'Know Yourself',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    description: 'Acknowledging recurring emotional triggers, habitual defensive cycles, and cognitive defaults.',
    briefingQuestion: 'Which specific classroom moments reliably trigger your fight-or-flight defensive habits?',
    weeklyTipsTemplate: [
      {
        habit: 'Trigger Audit',
        tip: 'Identify the top 2 classroom moments that provoke your fastest irritation (e.g. repeated interruptions, side conversations, tardiness).',
      },
      {
        habit: 'Pattern Interrupt Mechanism',
        tip: 'Establish a physical anchor (touching a smooth stone on your desk, clasping fingers) to break your automatic script.',
      },
      {
        habit: 'Tracing Student Behavioral Cascades',
        tip: 'Map what precedes a student blow-up: was it transition time, unstructured group work, or public reading?',
      },
      {
        habit: 'Script Rewriting',
        tip: 'Draft an alternative sentence for your most common reactive phrase and test it 3 times this week.',
      },
    ],
  },
  {
    id: 'navigating-emotions',
    name: 'Navigating Emotions',
    category: 'Choose Yourself',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    description: 'Transforming intense emotions into insightful information and constructive energy rather than suppressing them.',
    briefingQuestion: 'How can you allow adult frustration to serve as data rather than as a disciplinary driver?',
    weeklyTipsTemplate: [
      {
        habit: 'Emotion as Information',
        tip: 'Ask: "What is this anger protecting? Is it my schedule, my authority, or my fatigue?" Use the answer to adjust.',
      },
      {
        habit: 'Classroom De-compression Micro-break',
        tip: 'When class energy feels prickly, introduce a 90-second silent stretch or ambient sound pause for everyone, including you.',
      },
      {
        habit: 'Repair Dialogue',
        tip: 'If you spoke with an edge or raised your voice, offer a quick adult model of repair: "I was feeling rushed earlier and spoke abruptly; let us reset."',
      },
      {
        habit: 'Energy Redistribution',
        tip: 'Channel end-of-day tension into a brisk walk or deep writing reflection rather than carrying it into family spaces.',
      },
    ],
  },
  {
    id: 'consequential-thinking',
    name: 'Applying Consequential Thinking',
    category: 'Choose Yourself',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    description: 'Evaluating the costs and benefits of choices, balancing short-term reactions against long-term relationship and development.',
    briefingQuestion: 'Does winning this immediate compliance battle erode the long-term relational safety needed for learning?',
    weeklyTipsTemplate: [
      {
        habit: 'The 10-Minute vs. 10-Year Lens',
        tip: 'Ask: "Will sending this student to the office solve my lesson flow now, or will it damage our trust for the next 6 months?"',
      },
      {
        habit: 'Collaborative Consequence Setting',
        tip: 'Invite the student into defining restorative accountability: "How can we make this right with the group?"',
      },
      {
        habit: 'Post-Mortem of Escalations',
        tip: 'Review one escalation at the end of the week: identify the exact juncture where a different choice could have altered the trajectory.',
      },
      {
        habit: 'Proactive Choice Offerings',
        tip: 'Give resistant students 2 dignified options: "Would you prefer to do this at your desk or at the side table?"',
      },
    ],
  },
  {
    id: 'neural-brain-focus',
    name: 'Neural Net: Emotional vs. Rational Balance (Focus)',
    category: 'Neural Net Profile',
    assessmentSource: 'SEI Adults (Neural Net)',
    description: 'Balancing data-driven curriculum pacing with acute sensing of the room’s human emotional pulse.',
    briefingQuestion: 'When lesson pacing is tight, how do you keep your emotional radar attuned to subtle student withdrawal?',
    weeklyTipsTemplate: [
      {
        habit: 'Dual-Channel Attention',
        tip: 'Spend the first 3 minutes of class scanning faces rather than setting up slides or taking attendance.',
      },
      {
        habit: 'Emotional Readiness Gauge',
        tip: 'Before introducing complex academic concepts, verify emotional readiness with a 30-second thumb barometer.',
      },
      {
        habit: 'Data + Heart Synthesis',
        tip: 'When reviewing student assessment drop-offs, investigate life context and emotional safety alongside quiz scores.',
      },
      {
        habit: 'Cognitive Load & Affect Balance',
        tip: 'Notice when student cognitive overload triggers emotional shutdown, and build in processing pauses.',
      },
    ],
  },
  {
    id: 'neural-brain-decisions',
    name: 'Neural Net: Care vs. Plan (Decisions)',
    category: 'Neural Net Profile',
    assessmentSource: 'SEI Adults (Neural Net)',
    description: 'Navigating decisions between adhering to strict systemic rules and prioritizing individual human restoration.',
    briefingQuestion: 'Where can you introduce intentional flexibility into your classroom agreements to protect human dignity?',
    weeklyTipsTemplate: [
      {
        habit: 'Compassionate Boundary Alignment',
        tip: 'Distinguish between safety boundaries (non-negotiable) and procedural compliance (negotiable for student dignity).',
      },
      {
        habit: 'Private Conferencing',
        tip: 'Address student non-compliance 1-on-1 at the door or side counter rather than calling them out in front of peers.',
      },
      {
        habit: 'Flexible Deadlines with Accountability',
        tip: 'Offer grace extensions paired with brief check-ins to teach planning without inducing shame.',
      },
      {
        habit: 'Restorative Justice Over Sanctions',
        tip: 'Replace detention slips with structured reflection conferences exploring emotional triggers and restitution.',
      },
    ],
  },
];

/**
 * Initial curated goals for Maya Lin based on her SEI Adult assessment briefing
 */
export const INITIAL_MAYA_GOALS: PersonalDevelopmentGoal[] = [
  {
    id: 'goal-maya-1',
    userId: 'maya',
    title: 'Hold the Curious Pause & Increase Empathy Under Classroom Stress',
    assessmentSource: 'SEI Adults (UEQ Profile)',
    assessmentReportName: 'Maya_Lin_SEI_Adults_UEQ_Profile_Report_2026.pdf',
    assessmentReportDate: '08 September 2026',
    competency: 'Increasing Empathy',
    competencyCategory: 'Give Yourself',
    timeframeWeeks: 6,
    targetDate: '24 October 2026',
    actionPlan:
      'Practice the 4-second curious somatic pause when student silence or defiance triggers my urge to control. Focus on asking one clarifying question before issuing any disciplinary redirection.',
    weeklyTips: [
      {
        weekNumber: 1,
        habit: 'The 4-Second Somatic Breath',
        tip: 'Inhale deeply and exhale for 4 full seconds before vocalizing any correction to a disruptive or withdrawn student.',
        isCompleted: true,
      },
      {
        weekNumber: 2,
        habit: 'Curious Restatement',
        tip: 'Instead of assuming disinterest, reflect what you observe: "I notice a lot of quiet tension right now. What feels heavy today?"',
        isCompleted: true,
      },
      {
        weekNumber: 3,
        habit: 'Unconditional Post-Incident Check-In',
        tip: 'Find 60 quiet seconds after class with a dysregulated student to reaffirm relationship: "I care about how you are doing today."',
        isCompleted: false,
      },
      {
        weekNumber: 4,
        habit: 'Perspective Mapping in Advisory',
        tip: 'During group conflicts, invite students to name the feelings of the other person before discussing solutions.',
        isCompleted: false,
      },
      {
        weekNumber: 5,
        habit: 'Emotional Mirroring Without Judgment',
        tip: 'Notice when your own emotional response mirrors student anxiety, and acknowledge it silently to prevent escalation.',
        isCompleted: false,
      },
      {
        weekNumber: 6,
        habit: 'Sustainable Compassion Practice',
        tip: 'Conduct an end-of-day self-empathy debrief: celebrate where you held emotional boundaries without taking student reactions personally.',
        isCompleted: false,
      },
    ],
    currentWeekTipIndex: 2, // Week 3 active
    linkedEntryIds: ['entry-1', 'entry-3'],
    status: 'On Track',
    progressPercentage: 55,
    createdAt: '2026-09-09T10:00:00Z',
    notes: 'Briefing note from CEQHS Anchor: Maya showed high Emotional Literacy in the UEQ Profile, with growth opportunity in delaying the initial reaction under time pressure.',
  },
  {
    id: 'goal-maya-2',
    userId: 'maya',
    title: 'Neural Net: Balance Rational Lesson Pacing with Emotional Pulse Tracking',
    assessmentSource: 'SEI Adults (Neural Net)',
    assessmentReportName: 'Maya_Lin_Brain_Profile_NeuralNet_Analysis.pdf',
    assessmentReportDate: '11 September 2026',
    competency: 'Neural Net: Emotional vs. Rational Balance (Focus)',
    competencyCategory: 'Neural Net Profile',
    timeframeWeeks: 4,
    targetDate: '15 October 2026',
    actionPlan:
      'Integrate 30-second feeling barometer checks during humanities advisory transitions so cognitive goals do not override students who are emotionally flooded.',
    weeklyTips: [
      {
        weekNumber: 1,
        habit: 'Threshold Scanning',
        tip: 'Spend the first 3 minutes of humanities scanning posture, gaze, and entrance energy instead of rushing to open slide decks.',
        isCompleted: true,
      },
      {
        weekNumber: 2,
        habit: 'Mid-Period Pulse Check',
        tip: 'When shifting from independent reading to partner work, pause the whole room for 15 seconds to take a collective deep breath.',
        isCompleted: false,
      },
      {
        weekNumber: 3,
        habit: 'Data + Heart Synthesis',
        tip: 'When students do not complete journal reflections, investigate what emotional block was present before assigning grade penalties.',
        isCompleted: false,
      },
      {
        weekNumber: 4,
        habit: 'Shared Reflection Closure',
        tip: 'Close Friday advisory by asking each student for one word that described the emotional climate of our learning community this week.',
        isCompleted: false,
      },
    ],
    currentWeekTipIndex: 1, // Week 2 active
    linkedEntryIds: ['entry-2'],
    status: 'In Progress',
    progressPercentage: 35,
    createdAt: '2026-09-12T14:30:00Z',
    notes: 'Neural Net profile highlighted high Rational execution; building muscle to stay flexible when students need emotional debriefing.',
  },
];

/**
 * Generate customized weekly tips based on competency and timeframe
 */
export function generateWeeklyTipsForCompetency(
  competencyName: string,
  timeframeWeeks: number
): WeeklyActionTip[] {
  const meta = SEI_COMPETENCIES.find((c) => c.name === competencyName);
  const baseTips = meta?.weeklyTipsTemplate || [
    {
      habit: 'Daily Somatic Check-in',
      tip: 'Spend 2 minutes noticing where physical tension appears before teaching periods.',
    },
    {
      habit: 'Curious Pause',
      tip: 'Take one deep breath and ask one clarifying question before responding to student conflict.',
    },
    {
      habit: 'Active Listening',
      tip: 'Mirror what the student or colleague expressed before proposing an action.',
    },
    {
      habit: 'Reflective Journaling',
      tip: 'Log one interaction where you chose a conscious pedagogical response.',
    },
  ];

  const tips: WeeklyActionTip[] = [];
  for (let i = 0; i < timeframeWeeks; i++) {
    const template = baseTips[i % baseTips.length];
    tips.push({
      weekNumber: i + 1,
      habit: template.habit,
      tip: template.tip,
      isCompleted: false,
    });
  }

  return tips;
}
