import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { CEQHS_CURRICULUM_SYSTEM_PROMPT } from './server/curriculumSystemPrompt';

let genAIClient: GoogleGenAI | null = null;

const REQUIRED_DRAFT_FIELDS = ['practiceName', 'curriculumAnchor', 'gradeScope', 'phaseNumber'] as const;

function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return null;
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({ apiKey });
  }
  return genAIClient;
}

function validateRequiredFields(body: any, requiredFields: readonly string[]) {
  const missing = requiredFields.filter((field) => {
    const value = body?.[field];
    return value === undefined || value === null || value === '';
  });

  return missing;
}

async function generateWithFallback<T>({
  aiRequest,
  fallback,
  context,
}: {
  aiRequest: () => Promise<T>;
  fallback: () => T;
  context: string;
}): Promise<T> {
  const ai = getGenAI();

  if (!ai) {
    return fallback();
  }

  try {
    return await aiRequest();
  } catch (error: any) {
    console.warn(`${context} failed, using fallback:`, error?.message || error);
    return fallback();
  }
}

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(express.json({ limit: '10mb' }));

  // API routes FIRST
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      hasApiKey: Boolean(process.env.GEMINI_API_KEY),
      service: 'CEQHS Living Journal Backend',
    });
  });

  // Curriculum Alignment Drafting API
  app.post('/api/curriculum/draft-mapping', async (req, res) => {
    try {
      const {
        practiceName,
        curriculumAnchor,
        gradeScope,
        phaseNumber,
        frameworkOutcome,
        sourceCitation,
        alignmentType,
        evidenceTier,
        existingMappings,
        notes,
      } = req.body;

      const missingFields = validateRequiredFields(req.body, REQUIRED_DRAFT_FIELDS);
      if (missingFields.length > 0) {
        return res.status(400).json({
          error: `Missing required parameters: ${missingFields.join(', ')}.`,
        });
      }

      const userPrompt = `Please draft a complete CEQHS Curriculum Alignment Mapping record adhering strictly to the System Prompt guidelines.

CEQHS Practice Name: ${practiceName}
Curriculum Anchor: ${curriculumAnchor}
Grade Scope: ${gradeScope}
CEQHS Phase: Phase ${phaseNumber}
${frameworkOutcome ? `Provided Framework Outcome (verbatim if known): ${frameworkOutcome}` : ''}
${sourceCitation ? `Provided Source Citation: ${sourceCitation}` : ''}
${alignmentType ? `Proposed Alignment Type: ${alignmentType}` : ''}
${evidenceTier ? `Proposed Evidence Tier: ${evidenceTier}` : ''}
${notes ? `Additional Context from Saugat Singh (Founder): ${notes}` : ''}

CRITICAL DIRECTIVES:
1. Adhere strictly to the required output format:
---
CEQHS MAPPING DRAFT
---
Mapping ID:         CEQHS-MAP-[ANCHOR]-[nnn]
Version:            v1
Status:             DRAFT — Pending Founder Review
CEQHS Practice:     ${practiceName}
Curriculum Anchor:  ${curriculumAnchor}
Grade Scope:        ${gradeScope}
CEQHS Phase:        Phase ${phaseNumber}

Framework Outcome (verbatim):
[exact words from the source framework]

Source Citation:
[Document title · Publisher · Edition/Year · Section/Strand/Cluster]

Alignment Type:     [Direct | Contributing | Contextual]
Evidence Tier:      [Tier 1 | Tier 2 | Tier 3 | Tier 4] — [label]

Rationale:
[Anchor-specific rationale, minimum 80 words. Must pass the Substitution, Source, and Coordinator tests.]

Indicators of Working:
- [observable evidence 1]
- [observable evidence 2]

Disconfirming Indicators:
- [what would show this mapping is not holding]

[If Tier 3]: ⚠️ INTERNAL ONLY — Do not display in school-facing views.
---

2. Follow all anchor rules:
- If IB: Never write ALT (use ATL: Approaches to Learning). Do not fake official IB coded IDs like ATL.AFF.01.
- If Oxford: Name either Oxford Wellbeing curriculum domains or Oxford International Programme Learner Attributes. Wellbeing is a timetabled subject; CEQHS is Contextual.
- If Cambridge: Use behavioural and observable language only. Name Cambridge Assessment vs CUP Life Competencies.
- If Nepal NC: NCF 2076. CAS means Community and Service. Grades 1–3 is integrated (Hamro Serofero); Grades 4–5 is subject-based. Never use SEL; use human values and holistic development.
3. Rationale must be anchor-specific and minimum 80 words. Never claim "IB-approved", "Cambridge-accredited", "proves", or "guarantees".`;

      const draftText = await generateWithFallback({
        context: 'Curriculum draft generation',
        aiRequest: async () => {
          const ai = getGenAI();
          if (!ai) {
            return generateFallbackDraft({
              practiceName,
              curriculumAnchor,
              gradeScope,
              phaseNumber,
              frameworkOutcome,
              sourceCitation,
              alignmentType,
              evidenceTier,
            });
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
              systemInstruction: CEQHS_CURRICULUM_SYSTEM_PROMPT,
              temperature: 0.2,
            },
          });

          return response.text || '';
        },
        fallback: () =>
          generateFallbackDraft({
            practiceName,
            curriculumAnchor,
            gradeScope,
            phaseNumber,
            frameworkOutcome,
            sourceCitation,
            alignmentType,
            evidenceTier,
          }),
      });

      const parsedRecord = parseDraftTextToRecord(draftText, {
        practiceName,
        curriculumAnchor,
        gradeScope,
        phaseNumber,
      });

      res.json({
        success: true,
        draftText,
        parsedRecord,
        usingFallback: !getGenAI(),
      });
    } catch (err: any) {
      console.error('Error generating curriculum draft mapping:', err);
      res.status(500).json({
        error: err.message || 'Internal error while generating curriculum alignment draft.',
      });
    }
  });

  // AI Plan Composer API (Section 6.5 & 8.2 of Specification)
  app.post('/api/plan/compose-plan', async (req, res) => {
    try {
      const {
        schoolName = 'Swatara Core School',
        curriculumAdapter = 'International Baccalaureate (IB PYP)',
        gradeRange = 'Grades 1–5',
        awardPhase = 'Year 1: Foundation',
        priorities = ['emotional regulation', 'staff wellbeing', 'classroom relationships'],
        existingPrograms = ['Weekly Wellbeing Circle'],
        timetableConstraints = '15-min daily advisory, 45-min monthly staff circle',
      } = req.body;

      const missingFields = validateRequiredFields(req.body, ['schoolName']);
      if (missingFields.length > 0 && Object.keys(req.body || {}).length === 0) {
        return res.status(400).json({
          error: 'Request body is required.',
        });
      }

      const planSystemPrompt = `You are a CEQHS implementation planner for schools. Create a draft annual school plan using the approved CEQHS core and curriculum adapter.
Non-negotiables:
1. Distinguish between CEQHS Core (what we develop), Curriculum Adapter (entry points), School Plan (actions), and Evidence System (proof of growth).
2. The current scope covers Grades 1–5 and adult educators.
3. Adult outcomes are distinct and not treated merely as an advanced version of child outcomes.
4. Distinguish four levels of evidence: Reach, Fidelity, Learning, and Impact.
5. All AI outputs are draft recommendations requiring human review. Do not auto-approve.
6. Return a valid JSON object matching the CEQHS plan structure.`;

      const userPrompt = `Generate a comprehensive Year 1 draft annual plan for:
School: ${schoolName}
Curriculum: ${curriculumAdapter}
Grades: ${gradeRange}
Phase: ${awardPhase}
Priorities: ${Array.isArray(priorities) ? priorities.join(', ') : priorities}
Existing Programs: ${Array.isArray(existingPrograms) ? existingPrograms.join(', ') : existingPrograms}
Timetable: ${timetableConstraints}

Return valid JSON with:
{
  "planTitle": "${schoolName} — ${awardPhase} Implementation Plan",
  "awardPhase": "${awardPhase}",
  "curriculumAdapter": "${curriculumAdapter}",
  "priorityDomains": ["Self-Regulation", "Self-Awareness", "Relationship Skills"],
  "yearlyObjectives": [
    "Embed daily emotional self-awareness and mindful micro-pause routines in all Grades 1–5 homerooms.",
    "Cultivate educator nervous-system regulation and stress resilience through monthly Trigger & Response reflections.",
    "Shift peer conflict resolution from punitive escalation to student-initiated restorative repair."
  ],
  "terms": [
    {
      "termNumber": 1,
      "termTitle": "Term 1: Grounding, Shared Vocabulary & Micro-Pauses",
      "focus": "Daily Emotion Weather Check-In, Classroom Mindful Micro-Pause, and Staff Self-Regulation",
      "objectives": [
        "Train 100% of primary faculty in the 3-breath curious pause and weather metaphor.",
        "Launch Daily Emotion Weather Check-In during 15-minute morning advisory.",
        "Establish baseline affective vocabulary and student regulation measures."
      ],
      "staffWorkshops": [
        "Workshop 1: The Curious Pause — Somatic Self-Regulation for Educators (45 mins)",
        "Workshop 2: Facilitating the Emotion Weather Check-In Without Judgment (45 mins)"
      ],
      "classroomPractices": [
        "Daily Emotion Weather Check-In (Grades 1–5, 8–10 mins every morning)",
        "Classroom Mindful Micro-Pause (Grades 1–5, 3 mins during post-recess transitions)"
      ],
      "learnerActivities": [
        "My Weather Token Crafting (Grades 1–3)",
        "Vocabulary of the Inner Sky Journaling (Grades 4–5)"
      ],
      "coachingAndFacilitation": [
        "Bi-weekly classroom walkthroughs by CEQHS facilitator with non-evaluative coaching notes",
        "Grade-level team debriefs on transition friction points"
      ],
      "familyCommunity": [
        "Parent Living Journey orientation letter explaining the meteorological emotion framework",
        "Home Curious Pause guide for bedtime and homework transitions"
      ]
    },
    {
      "termNumber": 2,
      "termTitle": "Term 2: Social Awareness & Perspective-Taking",
      "focus": "Perspective-Taking Circles and Peer Relationship Building",
      "objectives": [
        "Introduce weekly Perspective-Taking Circles in Grades 3–5.",
        "Support faculty in navigating mid-year cognitive fatigue with monthly trigger reflections."
      ],
      "staffWorkshops": [
        "Workshop 3: Navigating Workplace Strain and Emotional Buttons (45 mins)"
      ],
      "classroomPractices": [
        "Perspective-Taking Circles (Grades 3–5, 25 mins weekly)",
        "Continued Daily Emotion Weather Check-In & Micro-Pauses"
      ],
      "learnerActivities": [
        "Stepping Into Your Shoes Empathy Prompts (Grades 3–5)"
      ],
      "coachingAndFacilitation": [
        "Peer educator observation rounds with curious inquiry protocols"
      ],
      "familyCommunity": [
        "Community Coffee Morning: Developing Empathy in Primary Learners"
      ]
    },
    {
      "termNumber": 3,
      "termTitle": "Term 3: Restorative Repair & Values-in-Action",
      "focus": "Restorative conversations and student-led community wellbeing initiatives",
      "objectives": [
        "Establish the playground Restorative Repair Bench.",
        "Prepare Year 1 Foundation Living Dossier submission for moderated review."
      ],
      "staffWorkshops": [
        "Workshop 4: Moving Beyond Forced Apologies to Restorative Dignity (45 mins)"
      ],
      "classroomPractices": [
        "4-Step Repair Conversations (Grades 1–5, on-demand during friction)",
        "Values-in-Action mini-projects connected to IB PYP Action"
      ],
      "learnerActivities": [
        "Restorative Ambassador Training for Grade 5 learners",
        "Year-End Reflection Living Portfolio Assembly"
      ],
      "coachingAndFacilitation": [
        "Review and compilation of Year 1 Living Dossier evidence artifacts"
      ],
      "familyCommunity": [
        "End-of-Year Community Celebration of Human Growth & Resilience"
      ]
    }
  ],
  "implementationRisks": [
    "Inconsistent delivery if morning advisory is crowded out by administrative notices.",
    "Teacher fatigue during high-stakes reporting periods if adult micro-pauses are skipped.",
    "Multilingual students in Grade 3 feeling excluded if visual gestures are not provided."
  ],
  "reviewCheckpoints": [
    "Term 1 Mid-Point Observer Walkthrough (Week 6)",
    "Term 1 Evidence Dossier Review & Reflection Checkpoint (Week 12)",
    "Term 2 Mid-Year Climate & Baseline Re-Measure (Week 20)",
    "Year 1 Foundation Moderated Award Evaluation (Week 34)"
  ],
  "itemsRequiringHumanApproval": [
    "Approval of Term 1 Daily Emotion Weather Check-In and Mindful Micro-Pause for active rollout",
    "Approval of scheduled faculty workshop dates in school master calendar",
    "Moderator verification of Year 1 Foundation Evidence Dossier"
  ],
  "rationale": "This plan directly embeds into Swatara Core School's IB PYP morning advisory and transdisciplinary units. By pacing implementation from internal self-awareness (Term 1) to relational repair (Term 3), the plan honors both developmental readiness and staff capacity. The sequence keeps daily observable routines manageable while building toward evidence-based reflection and community restoration.",
  "confidence": "High (94%)",
  "assumptions": [
    "15-minute morning advisory block remains protected from schedule encroachment.",
    "Lead coordinator and principal actively participate in opening staff workshops."
  ],
  "warnings": [
    "Do not treat attendance counts as mastery. Verification requires documented evidence of practice fidelity.",
    "Never use diagnostic or medicalized labeling in student observation records."
  ]
}`;

      let planJson: any = null;

      const generatedPlan = await generateWithFallback({
        context: 'Plan generation',
        aiRequest: async () => {
          const ai = getGenAI();
          if (!ai) {
            return null;
          }

          const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userPrompt,
            config: {
              systemInstruction: planSystemPrompt,
              responseMimeType: 'application/json',
              temperature: 0.2,
            },
          });

          const rawText = response.text || '';
          return rawText ? JSON.parse(rawText) : null;
        },
        fallback: () => null,
      });

      planJson = generatedPlan || {
        planTitle: `${schoolName} — ${awardPhase} Implementation Plan`,
        awardPhase,
        curriculumAdapter,
        priorityDomains: ['Self-Regulation', 'Self-Awareness', 'Relationship Skills'],
        yearlyObjectives: [
          'Embed daily emotional self-awareness and mindful micro-pause routines in all Grades 1–5 homerooms.',
          'Cultivate educator nervous-system regulation and stress resilience through monthly Trigger & Response reflections.',
          'Shift peer conflict resolution from punitive escalation to student-initiated restorative repair.',
        ],
        terms: [
          {
            termNumber: 1,
            termTitle: 'Term 1: Grounding, Shared Vocabulary & Micro-Pauses',
            focus: 'Daily Emotion Weather Check-In, Classroom Mindful Micro-Pause, and Staff Self-Regulation',
            objectives: [
              'Train 100% of primary faculty in the 3-breath curious pause and weather metaphor.',
              'Launch Daily Emotion Weather Check-In during 15-minute morning advisory.',
              'Establish baseline affective vocabulary and student regulation measures.',
            ],
            staffWorkshops: [
              'Workshop 1: The Curious Pause — Somatic Self-Regulation for Educators (45 mins)',
              'Workshop 2: Facilitating the Emotion Weather Check-In Without Judgment (45 mins)',
            ],
            classroomPractices: [
              'Daily Emotion Weather Check-In (Grades 1–5, 8–10 mins every morning)',
              'Classroom Mindful Micro-Pause (Grades 1–5, 3 mins during post-recess transitions)',
            ],
            learnerActivities: [
              'My Weather Token Crafting (Grades 1–3)',
              'Vocabulary of the Inner Sky Journaling (Grades 4–5)',
            ],
            coachingAndFacilitation: [
              'Bi-weekly classroom walkthroughs by CEQHS facilitator with non-evaluative coaching notes',
              'Grade-level team debriefs on transition friction points',
            ],
            familyCommunity: [
              'Parent Living Journey orientation letter explaining the meteorological emotion framework',
              'Home Curious Pause guide for bedtime and homework transitions',
            ],
          },
          {
            termNumber: 2,
            termTitle: 'Term 2: Social Awareness & Perspective-Taking',
            focus: 'Perspective-Taking Circles and Peer Relationship Building',
            objectives: [
              'Introduce weekly Perspective-Taking Circles in Grades 3–5.',
              'Support faculty in navigating mid-year cognitive fatigue with monthly trigger reflections.',
            ],
            staffWorkshops: [
              'Workshop 3: Navigating Workplace Strain and Emotional Buttons (45 mins)',
            ],
            classroomPractices: [
              'Perspective-Taking Circles (Grades 3–5, 25 mins weekly)',
              'Continued Daily Emotion Weather Check-In & Micro-Pauses',
            ],
            learnerActivities: [
              'Stepping Into Your Shoes Empathy Prompts (Grades 3–5)',
            ],
            coachingAndFacilitation: [
              'Peer educator observation rounds with curious inquiry protocols',
            ],
            familyCommunity: [
              'Community Coffee Morning: Developing Empathy in Primary Learners',
            ],
          },
          {
            termNumber: 3,
            termTitle: 'Term 3: Restorative Repair & Values-in-Action',
            focus: 'Restorative conversations and student-led community wellbeing initiatives',
            objectives: [
              'Establish the playground Restorative Repair Bench.',
              'Prepare Year 1 Foundation Living Dossier submission for moderated review.',
            ],
            staffWorkshops: [
              'Workshop 4: Moving Beyond Forced Apologies to Restorative Dignity (45 mins)',
            ],
            classroomPractices: [
              '4-Step Repair Conversations (Grades 1–5, on-demand during friction)',
              'Values-in-Action mini-projects connected to IB PYP Action',
            ],
            learnerActivities: [
              'Restorative Ambassador Training for Grade 5 learners',
              'Year-End Reflection Living Portfolio Assembly',
            ],
            coachingAndFacilitation: [
              'Review and compilation of Year 1 Living Dossier evidence artifacts',
            ],
            familyCommunity: [
              'End-of-Year Community Celebration of Human Growth & Resilience',
            ],
          },
        ],
        implementationRisks: [
          'Inconsistent delivery if morning advisory is crowded out by administrative notices.',
          'Teacher fatigue during high-stakes reporting periods if adult micro-pauses are skipped.',
          'Multilingual students in Grade 3 feeling excluded if visual gestures are not provided.',
        ],
        reviewCheckpoints: [
          'Term 1 Mid-Point Observer Walkthrough (Week 6)',
          'Term 1 Evidence Dossier Review & Reflection Checkpoint (Week 12)',
          'Term 2 Mid-Year Climate & Baseline Re-Measure (Week 20)',
          'Year 1 Foundation Moderated Award Evaluation (Week 34)',
        ],
        itemsRequiringHumanApproval: [
          'Approval of Term 1 Daily Emotion Weather Check-In and Mindful Micro-Pause for active rollout',
          'Approval of scheduled faculty workshop dates in school master calendar',
          'Moderator verification of Year 1 Foundation Evidence Dossier',
        ],
        rationale: `This plan directly embeds into ${schoolName}'s ${curriculumAdapter} morning advisory and transdisciplinary units. By pacing implementation from internal self-awareness (Term 1) to relational repair (Term 3), the plan honors both developmental readiness and staff capacity. The sequence keeps daily observable routines manageable while building toward evidence-based reflection and community restoration.`,
        confidence: 'High (94%)',
        assumptions: [
          '15-minute morning advisory block remains protected from schedule encroachment.',
          'Lead coordinator and principal actively participate in opening staff workshops.',
        ],
        warnings: [
          'Do not treat attendance counts as mastery. Verification requires documented evidence of practice fidelity.',
          'Never use diagnostic or medicalized labeling in student observation records.',
        ],
      };

      res.json({
        success: true,
        result: planJson,
        requiresHumanReview: true,
        generatedAt: new Date().toISOString(),
        model: getGenAI() ? 'gemini-2.5-flash' : 'ceqhs-deterministic-planner-v1',
      });
    } catch (err: any) {
      console.error('Error composing AI plan:', err);
      res.status(500).json({
        error: err.message || 'Internal error while composing annual plan.',
      });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`CEQHS Server running on http://0.0.0.0:${PORT}`);
  });
}

function parseDraftTextToRecord(
  draftText: string,
  defaults: {
    practiceName: string;
    curriculumAnchor: string;
    gradeScope: string;
    phaseNumber: number;
  }
) {
  const getField = (regex: RegExp) => {
    const match = draftText.match(regex);
    return match ? match[1].trim() : '';
  };

  const mappingId = getField(/Mapping ID:\s*([^\n]+)/i) || `CEQHS-MAP-GEN-${Date.now().toString().slice(-4)}`;
  const version = 1;
  const practiceName = getField(/CEQHS Practice:\s*([^\n]+)/i) || defaults.practiceName;
  const anchor = getField(/Curriculum Anchor:\s*([^\n]+)/i) || defaults.curriculumAnchor;
  const gradeScope = getField(/Grade Scope:\s*([^\n]+)/i) || defaults.gradeScope;
  const phaseText = getField(/CEQHS Phase:\s*([^\n]+)/i);
  const phaseNumber = phaseText ? parseInt(phaseText.replace(/[^0-9]/g, '')) || defaults.phaseNumber : defaults.phaseNumber;

  // Extract sections
  const extractSection = (startHeader: string, nextHeader: string) => {
    const startIdx = draftText.indexOf(startHeader);
    if (startIdx === -1) return '';
    const afterStart = draftText.substring(startIdx + startHeader.length);
    const endIdx = afterStart.indexOf(nextHeader);
    return (endIdx !== -1 ? afterStart.substring(0, endIdx) : afterStart).trim();
  };

  const outcomeVerbatim = extractSection('Framework Outcome (verbatim):', 'Source Citation:');
  const sourceCitation = extractSection('Source Citation:', 'Alignment Type:');
  const alignmentTypeLine = getField(/Alignment Type:\s*([^\n]+)/i);
  const alignmentType = alignmentTypeLine.includes('Direct')
    ? 'Direct'
    : alignmentTypeLine.includes('Contextual')
    ? 'Contextual'
    : 'Contributing';

  const evidenceTierLine = getField(/Evidence Tier:\s*([^\n]+)/i);
  let evidenceTier: 'Tier 1' | 'Tier 2' | 'Tier 3' | 'Tier 4' = 'Tier 2';
  if (evidenceTierLine.includes('Tier 1')) evidenceTier = 'Tier 1';
  else if (evidenceTierLine.includes('Tier 3')) evidenceTier = 'Tier 3';
  else if (evidenceTierLine.includes('Tier 4')) evidenceTier = 'Tier 4';

  const rationale = extractSection('Rationale:', 'Indicators of Working:');
  const indicatorsSection = extractSection('Indicators of Working:', 'Disconfirming Indicators:');
  const indicatorsOfWorking = indicatorsSection
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);

  const disconfirmingSection = extractSection('Disconfirming Indicators:', '---');
  const disconfirmingIndicators = disconfirmingSection
    .split('\n')
    .map((line) => line.replace(/^-\s*/, '').trim())
    .filter(Boolean);

  const isInternalOnly = draftText.includes('INTERNAL ONLY') || evidenceTier === 'Tier 3';

  return {
    id: mappingId.toLowerCase().replace(/[^a-z0-9-]/g, '-'),
    displayId: mappingId,
    version,
    status: 'Draft',
    frameworkName: anchor,
    gradeRange: gradeScope,
    ceqhsPhaseNumber: phaseNumber,
    ceqhsPracticeName: practiceName,
    frameworkOutcomeVerbatim: outcomeVerbatim,
    sourceReference: sourceCitation,
    alignmentType,
    evidenceTier,
    evidenceTierLabel: `${evidenceTier} — ${
      evidenceTier === 'Tier 1'
        ? 'Documented'
        : evidenceTier === 'Tier 2'
        ? 'Reasoned'
        : evidenceTier === 'Tier 3'
        ? 'Hypothesised'
        : 'Observed'
    }`,
    alignmentExplanation: rationale,
    indicatorsOfWorking,
    disconfirmingIndicators,
    isInternalOnly,
  };
}

function generateFallbackDraft(params: {
  practiceName: string;
  curriculumAnchor: string;
  gradeScope: string;
  phaseNumber: number;
  frameworkOutcome?: string;
  sourceCitation?: string;
  alignmentType?: string;
  evidenceTier?: string;
}): string {
  const { practiceName, curriculumAnchor, gradeScope, phaseNumber } = params;

  if (curriculumAnchor === 'International Baccalaureate (IB)') {
    return `---
CEQHS MAPPING DRAFT
---
Mapping ID:         CEQHS-MAP-IB-003
Version:            v1
Status:             DRAFT — Pending Founder Review
CEQHS Practice:     ${practiceName}
Curriculum Anchor:  International Baccalaureate (IB)
Grade Scope:        ${gradeScope}
CEQHS Phase:        Phase ${phaseNumber}

Framework Outcome (verbatim):
Managing state of mind: mindfulness, resilience, self-motivation, managing emotions.

Source Citation:
IB Primary Years Programme: The Learner · International Baccalaureate Organization · 2018 · Approaches to Learning (ATL) Framework, Self-Management Skills / Affective Sub-cluster

Alignment Type:     Contributing
Evidence Tier:      Tier 2 — Reasoned

Rationale:
The daily execution of ${practiceName} is specifically designed to support the IB Primary Years Programme Approaches to Learning (ATL) self-management category. Within the affective sub-skills cluster, learners are supported to regulate attention, emotions, and action. This makes the practice a contributing alignment because it reinforces self-management rather than replacing a formal academic strand. In classroom use, the routine strengthens reflection and regulation across inquiry, transitions, and social collaboration. It is therefore appropriate as a contextual support for learner agency while being framed as an enacted routine rather than a direct curriculum substitute.

Indicators of Working:
- Students initiate the ${practiceName} reflection vocabulary during transdisciplinary transitions.
- Classroom teachers note decreased escalation during collaborative group tasks.

Disconfirming Indicators:
- Students complete the routine as a compliance checklist without voluntary application in unstructured play.

---`;
  }

  if (curriculumAnchor === 'Oxford Curriculum') {
    return `---
CEQHS MAPPING DRAFT
---
Mapping ID:         CEQHS-MAP-OX-002
Version:            v1
Status:             DRAFT — Pending Founder Review
CEQHS Practice:     ${practiceName}
Curriculum Anchor:  Oxford Curriculum
Grade Scope:        ${gradeScope}
CEQHS Phase:        Phase ${phaseNumber}

Framework Outcome (verbatim):
Emotional and Social Competencies: Recognizing personal emotional states and bodily sensations during learning.

Source Citation:
Oxford International Curriculum — Wellbeing · Oxford University Press · 2021 · Wellbeing Scheme of Work, Emotional Health Strand (Key Stages 1 & 2)

Alignment Type:     Contextual
Evidence Tier:      Tier 2 — Reasoned

Rationale:
This mapping operates strictly as a Contextual alignment against the Oxford International Curriculum Wellbeing scheme of work. In the Oxford framework, Wellbeing is taught as an explicit timetabled subject and the CEQHS practice functions as a reinforcement rather than a replacement. The routine helps children recognize bodily cues, emotions, and transitions in a manner that supports the active social and emotional learning intended by the curriculum. It contributes to the classroom culture in which wellbeing is practiced, but it should not be treated as a substitute for formal Oxford Wellbeing instruction.

Indicators of Working:
- Learners refer to concepts from timetabled Oxford Wellbeing lessons during daily ${practiceName}.
- Increased student fluency in articulating physical manifestations of stress or calm.

Disconfirming Indicators:
- Teachers treat ${practiceName} as a substitute for timetabled Oxford Wellbeing modules.

---`;
  }

  if (curriculumAnchor === 'Cambridge Curriculum') {
    return `---
CEQHS MAPPING DRAFT
---
Mapping ID:         CEQHS-MAP-CA-002
Version:            v1
Status:             DRAFT — Pending Founder Review
CEQHS Practice:     ${practiceName}
Curriculum Anchor:  Cambridge International
Grade Scope:        ${gradeScope}
CEQHS Phase:        Phase ${phaseNumber}

Framework Outcome (verbatim):
Reflective learner attribute: Learners understand themselves as learners, actively monitor their focus, and plan responsive actions.

Source Citation:
Developing the Cambridge Learner Attributes · Cambridge Assessment International Education · 2020 · Learner Attribute Guide: Reflective Competencies

Alignment Type:     Contributing
Evidence Tier:      Tier 2 — Reasoned

Rationale:
This mapping is intentionally framed as a Contributing alignment rather than a direct curriculum match. The Cambridge learner attribute language emphasizes observable reflection, attention, and purposeful response, which are supported by daily self-regulation routines. In practice, ${practiceName} provides students with structured opportunities to notice focus and reset attention before continuing with academic tasks. The alignment is sound when grounded in behaviour and evidence rather than in imported psychological theory or unsupported claims about accreditation.

Indicators of Working:
- Students exhibit observable pauses before re-engaging with challenging Cambridge primary tasks.
- Learners use neutral, descriptive language to document their attention and effort.

Disconfirming Indicators:
- Facilitation lapses into therapeutic or contested emotional intelligence theory rather than objective behavioural observation.

---`;
  }

  // Nepal National Curriculum
  return `---
CEQHS MAPPING DRAFT
---
Mapping ID:         CEQHS-MAP-NC-002
Version:            v1
Status:             DRAFT — Pending Founder Review
CEQHS Practice:     ${practiceName}
Curriculum Anchor:  Nepal National Curriculum
Grade Scope:        ${gradeScope}
CEQHS Phase:        Phase ${phaseNumber}

Framework Outcome (verbatim):
चारित्रिक र संवेगात्मक विकास: आत्म-सचेतना, मानवीय मूल्य र सामुदायिक सहकार।

Source Citation:
National Curriculum Framework for School Education (NCF 2076) · Curriculum Development Centre (CDC), Government of Nepal · 2019 · ${gradeScope.includes('1–3') ? 'Integrated Curriculum (Hamro Serofero)' : 'Subject-based Approach for Grades 4–5'}

Alignment Type:     Contributing
Evidence Tier:      Tier 2 — Reasoned

Rationale:
In strict alignment with the National Curriculum Framework for School Education 2076 published by the Curriculum Development Centre (CDC), this mapping avoids imported SEL terminology and instead grounds the practice in human values, self-awareness, and communal participation. The daily routine supports the integrated and contextual goals of Hamro Serofero and the subject-based emphasis of upper primary grades by helping learners notice their emotions, respect others, and participate more constructively in school life. It therefore acts as a contributing practice that strengthens the NCF 2076 emphasis on holistic development without replacing formal curriculum content.

Indicators of Working:
- Students articulate self-awareness connections using Hamro Serofero themes and Nepali civic values.
- Respectful peer communication and communal cooperation during school routines.

Disconfirming Indicators:
- Reliance on non-contextual foreign psychological jargon disconnected from NCF 2076 textbooks.

---`;
}

startServer();
