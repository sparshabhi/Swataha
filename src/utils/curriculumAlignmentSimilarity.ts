/**
 * CEQHS Curriculum Alignment - Automated Quality & Similarity Guardrails
 * Version 1.0 | Grades 1–5 Pilot | Swataha Growth Ventures Pvt. Ltd.
 */

import { CurriculumAlignmentMapping, PrimaryCurriculumType } from '../types/ceqhsGovernance';

// Common English stopwords to ignore when measuring domain vocabulary overlap
const STOPWORDS = new Set([
  'the', 'and', 'for', 'that', 'this', 'with', 'from', 'have', 'were', 'been',
  'will', 'would', 'could', 'should', 'about', 'which', 'their', 'there', 'they',
  'them', 'when', 'where', 'into', 'over', 'after', 'before', 'between', 'through',
  'under', 'while', 'being', 'having', 'other', 'some', 'such', 'only', 'than',
  'then', 'also', 'more', 'most', 'very', 'each', 'every', 'both', 'these', 'those'
]);

export interface SimilarityCheckResult {
  maxSimilarityPercentage: number;
  highestOverlapMappingId: string | null;
  highestOverlapAnchor: PrimaryCurriculumType | null;
  highestOverlapPracticeName: string | null;
  overlappingKeywords: string[];
  exceedsThreshold: boolean; // Overlap > 40%
  statusMessage: string;
}

export interface ClaimLanguageCheckResult {
  hasForbiddenClaims: boolean;
  violations: string[];
}

export interface ThreeTestsCheckResult {
  substitutionTestPassed: boolean;
  sourceTestPassed: boolean;
  coordinatorTestPassed: boolean;
  notes: string[];
}

/**
 * Tokenizes text into normalized significant words
 */
function extractSignificantTokens(text: string): Set<string> {
  if (!text) return new Set();
  const words = text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 3 && !STOPWORDS.has(w));
  return new Set(words);
}

/**
 * Calculates vocabulary overlap between two rationales
 */
export function calculateVocabularyOverlap(
  textA: string,
  textB: string
): { similarity: number; sharedTokens: string[] } {
  const setA = extractSignificantTokens(textA);
  const setB = extractSignificantTokens(textB);

  if (setA.size === 0 || setB.size === 0) {
    return { similarity: 0, sharedTokens: [] };
  }

  const sharedTokens = [...setA].filter((token) => setB.has(token));
  // Overlap coefficient relative to the smaller set or candidate
  const similarity = (sharedTokens.length / Math.min(setA.size, setB.size)) * 100;

  return {
    similarity: Math.round(similarity),
    sharedTokens,
  };
}

/**
 * Automated post-generation similarity check:
 * Flags if the rationale text in a new mapping shares more than 40% overlap
 * with any existing rationale for a DIFFERENT anchor.
 */
export function checkCrossAnchorRationaleSimilarity(
  newRationale: string,
  targetAnchor: PrimaryCurriculumType,
  existingMappings: CurriculumAlignmentMapping[]
): SimilarityCheckResult {
  let maxSimilarity = 0;
  let highestMapping: CurriculumAlignmentMapping | null = null;
  let topOverlappingKeywords: string[] = [];

  // Compare only against different anchors
  const differentAnchorMappings = existingMappings.filter(
    (m) => m.frameworkName !== targetAnchor && (m.alignmentExplanation || (m as any).rationale)
  );

  for (const mapping of differentAnchorMappings) {
    const existingText = mapping.alignmentExplanation || (mapping as any).rationale || '';
    const { similarity, sharedTokens } = calculateVocabularyOverlap(newRationale, existingText);

    if (similarity > maxSimilarity) {
      maxSimilarity = similarity;
      highestMapping = mapping;
      topOverlappingKeywords = sharedTokens.slice(0, 8);
    }
  }

  const exceedsThreshold = maxSimilarity > 40;
  let statusMessage = '';

  if (exceedsThreshold && highestMapping) {
    statusMessage = `⚠️ Cross-Anchor Overlap Warning: Rationale shares ${maxSimilarity}% vocabulary overlap with ${highestMapping.frameworkName} (${highestMapping.id}). This risks failing the Substitution Test.`;
  } else if (highestMapping) {
    statusMessage = `✓ Passed Cross-Anchor Check: Max cross-anchor vocabulary overlap is ${maxSimilarity}% with ${highestMapping.frameworkName} (within safe ≤40% threshold).`;
  } else {
    statusMessage = '✓ Passed Cross-Anchor Check: No cross-anchor overlap detected.';
  }

  return {
    maxSimilarityPercentage: maxSimilarity,
    highestOverlapMappingId: highestMapping ? highestMapping.id : null,
    highestOverlapAnchor: highestMapping ? highestMapping.frameworkName : null,
    highestOverlapPracticeName: highestMapping ? highestMapping.ceqhsPracticeName : null,
    overlappingKeywords: topOverlappingKeywords,
    exceedsThreshold,
    statusMessage,
  };
}

/**
 * Verifies claim language hard rules
 */
export function verifyClaimLanguage(text: string): ClaimLanguageCheckResult {
  const lower = text.toLowerCase();
  const violations: string[] = [];

  const forbiddenTerms = [
    { phrase: 'ib-approved', reason: 'CEQHS is not affiliated with or approved by IB' },
    { phrase: 'cambridge-accredited', reason: 'CEQHS is not accredited by Cambridge' },
    { phrase: 'oxford-endorsed', reason: 'CEQHS is not endorsed by Oxford' },
    { phrase: 'cdc-approved', reason: 'CEQHS is not approved by CDC Nepal' },
    { phrase: 'meets requirements', reason: 'Forbidden claim: cannot claim to meet or satisfy framework outcomes' },
    { phrase: 'satisfies outcomes', reason: 'Forbidden claim: cannot claim to satisfy framework outcomes' },
    { phrase: 'proven to improve', reason: 'Forbidden claim: Tier 4 classroom data required' },
    { phrase: 'guarantees', reason: 'Forbidden claim: emotional/human skill outcomes cannot be guaranteed' },
    { phrase: 'delivers', reason: 'Forbidden claim: must use bounded language like "designed to support" or "contributes to"' },
    { phrase: 'alt.', reason: 'Typo rule: ATL (Approaches to Learning), never ALT' },
    { phrase: 'alt ', reason: 'Typo rule: ATL (Approaches to Learning), never ALT' },
  ];

  for (const item of forbiddenTerms) {
    if (lower.includes(item.phrase)) {
      violations.push(item.reason);
    }
  }

  return {
    hasForbiddenClaims: violations.length > 0,
    violations,
  };
}

/**
 * Evaluates the Three Rationale Tests
 */
export function evaluateThreeRationaleTests(
  rationale: string,
  anchor: PrimaryCurriculumType,
  sourceCitation: string
): ThreeTestsCheckResult {
  const notes: string[] = [];
  const lower = rationale.toLowerCase();

  // Test 1: Substitution Test
  // Checks if the text has anchor-specific vocabulary that couldn't simply be swapped
  let substitutionPassed = false;
  if (anchor === 'International Baccalaureate (IB)') {
    substitutionPassed = lower.includes('atl') || lower.includes('approaches to learning') || lower.includes('pyp') || lower.includes('self-management');
  } else if (anchor === 'Oxford Curriculum') {
    substitutionPassed = lower.includes('wellbeing') || lower.includes('scheme of work') || lower.includes('learner attributes') || lower.includes('contextual');
  } else if (anchor === 'Cambridge Curriculum') {
    substitutionPassed = lower.includes('cambridge') || lower.includes('learner attributes') || lower.includes('reflective') || lower.includes('behavioural');
  } else if (anchor === 'National Curriculum') {
    substitutionPassed = lower.includes('ncf 2076') || lower.includes('hamro serofero') || lower.includes('human values') || lower.includes('community and service') || lower.includes('cdc');
  }

  if (!substitutionPassed) {
    notes.push('Substitution Test: Rationale lacks distinctive terminology unique to ' + anchor);
  }

  // Test 2: Source Test
  const sourcePassed = Boolean(sourceCitation && sourceCitation.trim().length > 15);
  if (!sourcePassed) {
    notes.push('Source Test: Source citation must clearly name document title, publisher, and specific section');
  }

  // Test 3: Coordinator Test
  const coordinatorPassed = substitutionPassed && !lower.includes('proves') && !lower.includes('meets requirements');
  if (!coordinatorPassed) {
    notes.push('Coordinator Test: Language should be rigorously bounded and acceptable to academic coordinators');
  }

  return {
    substitutionTestPassed: substitutionPassed,
    sourceTestPassed: sourcePassed,
    coordinatorTestPassed: coordinatorPassed,
    notes,
  };
}
