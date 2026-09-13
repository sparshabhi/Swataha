export interface DailyPrompt {
  id: string;
  phaseId: string;
  phaseName: string;
  phaseQuestion: string;
  question: string;
  pedagogicalAnchor: string;
  whyThisMatters: string;
  reflectionStarter: string;
  suggestedCompetency: string;
}

export const PHASE_DAILY_PROMPTS: Record<string, DailyPrompt[]> = {
  '01_EXPLORE': [
    {
      id: 'explore-1',
      phaseId: '01_EXPLORE',
      phaseName: 'EXPLORE',
      phaseQuestion: 'Where are we now?',
      question: 'When you crossed the classroom threshold this morning, what emotional climate was waiting for you?',
      pedagogicalAnchor: 'Environmental Attunement · Somatic Baseline',
      whyThisMatters: 'We cannot facilitate emotional regulation in others without first accurately mapping our baseline climate.',
      reflectionStarter: 'As I arrived in my classroom this morning, the prevailing energy felt...',
      suggestedCompetency: 'Emotional Literacy',
    },
    {
      id: 'explore-2',
      phaseId: '01_EXPLORE',
      phaseName: 'EXPLORE',
      phaseQuestion: 'Where are we now?',
      question: 'Which student voice remained in the shadows today, and what might their silence be communicating?',
      pedagogicalAnchor: 'Deep Listening · Relational Equity',
      whyThisMatters: 'Silence is not absence of thought; often it is an intuitive defense against emotional exposure.',
      reflectionStarter: 'Today, I noticed the quiet presence of...',
      suggestedCompetency: 'Increasing Empathy',
    },
    {
      id: 'explore-3',
      phaseId: '01_EXPLORE',
      phaseName: 'EXPLORE',
      phaseQuestion: 'Where are we now?',
      question: 'What expectation did you bring into your lessons today that proved different from the students’ actual reality?',
      pedagogicalAnchor: 'Curiosity Over Control · Humble Inquiry',
      whyThisMatters: 'Recognizing the gap between adult anticipation and student actuality preserves developmental trust.',
      reflectionStarter: 'I walked in expecting our class to..., but what actually surfaced was...',
      suggestedCompetency: 'Recognizing Patterns',
    },
  ],
  '02_FOCUS': [
    {
      id: 'focus-1',
      phaseId: '02_FOCUS',
      phaseName: 'FOCUS',
      phaseQuestion: 'What matters now?',
      question: 'What is the one relational boundary or agreement you want to hold with uncompromising warmth today?',
      pedagogicalAnchor: 'Compassionate Structure · Intentionality',
      whyThisMatters: 'Boundaries without empathy breed defiance; empathy without boundaries breeds chaos.',
      reflectionStarter: 'The boundary I chose to hold with calm warmth today was...',
      suggestedCompetency: 'Increasing Empathy',
    },
    {
      id: 'focus-2',
      phaseId: '02_FOCUS',
      phaseName: 'FOCUS',
      phaseQuestion: 'What matters now?',
      question: 'If you had to choose between finishing the lesson agenda and resolving a relational rupture, which would you prioritize today?',
      pedagogicalAnchor: 'Consequential Thinking · Values in Action',
      whyThisMatters: 'Students do not remember which worksheet was finished; they remember whether they were safe with us when they struggled.',
      reflectionStarter: 'When the curriculum timeline collided with a human moment today, I...',
      suggestedCompetency: 'Applying Consequential Thinking',
    },
  ],
  '03_PRACTISE': [
    {
      id: 'practise-1',
      phaseId: '03_PRACTISE',
      phaseName: 'PRACTISE',
      phaseQuestion: 'What are we trying?',
      question: 'When a student resisted or withdrew today, what was the very first physical sensation in your body before you spoke?',
      pedagogicalAnchor: 'The Curious Pause · Somatic Nervous System Co-regulation',
      whyThisMatters: 'Adult co-regulation precedes student self-regulation. Noticing your tightened jaw or quickened breath gives you the split second needed to choose curiosity over correction.',
      reflectionStarter: 'During the moment of student resistance today, my first bodily response was...',
      suggestedCompetency: 'Increasing Empathy',
    },
    {
      id: 'practise-2',
      phaseId: '03_PRACTISE',
      phaseName: 'PRACTISE',
      phaseQuestion: 'What are we trying?',
      question: 'Where did you experiment with a 4-second pause before redirecting a student, and how did their posture change?',
      pedagogicalAnchor: 'Micro-Interventions · The EAR Cycle',
      whyThisMatters: 'A 4-second exhale signals psychological safety to a hypervigilant student brain, dismantling the threat response.',
      reflectionStarter: 'I took the 4-second pause right when..., and what surprised me was...',
      suggestedCompetency: 'Navigating Emotions',
    },
    {
      id: 'practise-3',
      phaseId: '03_PRACTISE',
      phaseName: 'PRACTISE',
      phaseQuestion: 'What are we trying?',
      question: 'What happened when you asked a curious question instead of stating an immediate disciplinary conclusion?',
      pedagogicalAnchor: 'Inquiry in Conflict · Restorative Curiosity',
      whyThisMatters: 'Questions invite internal reflection, while accusations trigger defensive walls.',
      reflectionStarter: 'Instead of saying "Get to work", I asked...',
      suggestedCompetency: 'Recognizing Patterns',
    },
    {
      id: 'practise-4',
      phaseId: '03_PRACTISE',
      phaseName: 'PRACTISE',
      phaseQuestion: 'What are we trying?',
      question: 'How did you handle a moment when your own emotional patience ran dangerously thin today?',
      pedagogicalAnchor: 'Adult Vulnerability & Reset · Self-Compassion',
      whyThisMatters: 'Educator stamina relies on naming fatigue and taking brief restorative resets rather than masking tension.',
      reflectionStarter: 'When my patience dipped in the afternoon, I decided to...',
      suggestedCompetency: 'Navigating Emotions',
    },
    {
      id: 'practise-5',
      phaseId: '03_PRACTISE',
      phaseName: 'PRACTISE',
      phaseQuestion: 'What are we trying?',
      question: 'What small experiment in student agency or shared choice did you test with your classroom today?',
      pedagogicalAnchor: 'Transferring Ownership · Belonging & Agency',
      whyThisMatters: 'When students co-author the classroom culture, compliance transforms into authentic ownership.',
      reflectionStarter: 'I offered students a choice today regarding..., and the reaction was...',
      suggestedCompetency: 'Engaging Intrinsic Motivation',
    },
  ],
  '04_EMBED': [
    {
      id: 'embed-1',
      phaseId: '04_EMBED',
      phaseName: 'EMBED',
      phaseQuestion: 'What is becoming part of how we work?',
      question: 'Which emotional intelligence routine has shifted from feeling like an effort to feeling like second nature?',
      pedagogicalAnchor: 'Ritualization · Cultural Habits',
      whyThisMatters: 'Real institutional transformation occurs when deliberate practice embeds into unprompted cultural muscle.',
      reflectionStarter: 'The practice that has truly become natural in my classroom is...',
      suggestedCompetency: 'Recognizing Patterns',
    },
    {
      id: 'embed-2',
      phaseId: '04_EMBED',
      phaseName: 'EMBED',
      phaseQuestion: 'What is becoming part of how we work?',
      question: 'What shared phrase or vocabulary are students now using with each other without your prompting?',
      pedagogicalAnchor: 'Peer Culture · Shared Language',
      whyThisMatters: 'When students spontaneously mirror the language of empathy with peers, the culture has taken root.',
      reflectionStarter: 'I overheard two students today using...',
      suggestedCompetency: 'Emotional Literacy',
    },
  ],
  '05_REFLECT': [
    {
      id: 'reflect-1',
      phaseId: '05_REFLECT',
      phaseName: 'REFLECT',
      phaseQuestion: 'What are we noticing?',
      question: 'Looking back at how you reacted to disruption in September compared to today, what shift in your nervous system is most evident?',
      pedagogicalAnchor: 'Before-Now Horizon · Longitudinal Growth',
      whyThisMatters: 'Tracking our own developmental evolution prevents educator burnout and validates the emotional labour of teaching.',
      reflectionStarter: 'Three months ago I would have reacted by..., but today I found myself...',
      suggestedCompetency: 'Recognizing Patterns',
    },
    {
      id: 'reflect-2',
      phaseId: '05_REFLECT',
      phaseName: 'REFLECT',
      phaseQuestion: 'What are we noticing?',
      question: 'What did a student teach you today about vulnerability, perseverance, or emotional safety?',
      pedagogicalAnchor: 'Reciprocal Learning · Student as Mirror',
      whyThisMatters: 'The classroom is a bidirectional human laboratory; our students reflect our own growth edges back to us.',
      reflectionStarter: 'A student reminded me today that...',
      suggestedCompetency: 'Increasing Empathy',
    },
  ],
  '06_REVIEW': [
    {
      id: 'review-1',
      phaseId: '06_REVIEW',
      phaseName: 'REVIEW',
      phaseQuestion: 'What have we learned?',
      question: 'What tangible piece of classroom evidence best captures the human change in your students this term?',
      pedagogicalAnchor: 'Evidence Synthesis · CEQHS Living Archive',
      whyThisMatters: 'Grounding developmental transformation in authentic student artefacts validates systemic progress.',
      reflectionStarter: 'The moment or artefact that best embodies our journey is...',
      suggestedCompetency: 'Pursuing Noble Goals',
    },
  ],
  '07_RENEW': [
    {
      id: 'renew-1',
      phaseId: '07_RENEW',
      phaseName: 'RENEW',
      phaseQuestion: 'What continues?',
      question: 'What foundational human practice is so essential that it must travel with you into every future learning space?',
      pedagogicalAnchor: 'Sustained Practice · Generative Future',
      whyThisMatters: 'Sustainable EQ is not a temporary initiative; it is a permanent pedagogical lens for human flourishing.',
      reflectionStarter: 'The non-negotiable core practice I will preserve is...',
      suggestedCompetency: 'Pursuing Noble Goals',
    },
  ],
};

/**
 * Get daily prompt for a given phase and day index
 */
export function getDailyPromptForPhase(phaseId: string, dayIndex?: number): DailyPrompt {
  const prompts = PHASE_DAILY_PROMPTS[phaseId] || PHASE_DAILY_PROMPTS['03_PRACTISE'];
  const now = new Date();
  // Use day of year or day of week for pseudo-deterministic daily rotation
  const startOfYear = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);

  const idx = dayIndex !== undefined ? dayIndex % prompts.length : dayOfYear % prompts.length;
  return prompts[Math.abs(idx)];
}
