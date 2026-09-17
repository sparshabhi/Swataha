import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Sparkles, RefreshCw, Bookmark, Volume2, Share2 } from 'lucide-react';

interface PracticeCard {
  id: string;
  category: 'Emotional Regulation' | 'Classroom Dialogue' | 'Empathy & Regard' | 'Reflective Practice';
  title: string;
  phase: 'Beginning of Class' | 'Mid-Lesson Transition' | 'Post-Conflict' | 'End of Day Reflection';
  duration: string;
  tagline: string;
  prompt: string;
  educatorScript: string;
  studentAction: string;
  color: string;
  bgGradient: string;
}

const CEQHS_PRACTICE_CARDS: PracticeCard[] = [
  {
    id: 'card-1',
    category: 'Emotional Regulation',
    title: 'The 90-Second Micro-Pause',
    phase: 'Mid-Lesson Transition',
    duration: '90 seconds',
    tagline: 'Reset classroom nervous systems before introducing cognitively demanding material.',
    prompt: 'Invite students to place both feet flat on the floor, unclench their jaws, and notice three natural breath cycles without trying to alter them.',
    educatorScript: '"Before we dive into this analytical chapter, let\'s give our nervous systems 90 seconds of quiet stillness. No pens, no screens—just steady breath."',
    studentAction: 'Physical down-regulation, lower defensive posture, improved focus.',
    color: '#4A6B53',
    bgGradient: 'from-emerald-50 via-white to-stone-50',
  },
  {
    id: 'card-2',
    category: 'Classroom Dialogue',
    title: 'Curious Inquiry Over Correction',
    phase: 'Post-Conflict',
    duration: '3-5 minutes',
    tagline: 'Replace defensive discipline with relational curiosity when disruption occurs.',
    prompt: 'When tension arises, address the felt emotional temperature before addressing the cognitive rule break.',
    educatorScript: '"I notice that energy is really spiked right now. Can someone help me understand what was felt before that reaction happened?"',
    studentAction: 'De-escalation, emotional naming, accountable peer dialogue.',
    color: '#0D9488',
    bgGradient: 'from-teal-50 via-white to-stone-50',
  },
  {
    id: 'card-3',
    category: 'Empathy & Regard',
    title: 'The Relational Regard Greeting',
    phase: 'Beginning of Class',
    duration: '2 minutes',
    tagline: 'Acknowledge every student as a whole human being before calling roll.',
    prompt: 'Make brief, warm eye contact and use a personal greeting that does not reference schoolwork or attendance.',
    educatorScript: '"Good morning, everyone. Before we look at the board, take a look around and silently acknowledge one person who made you feel seen today."',
    studentAction: 'Belonging affirmation, lowered amygdala threat response.',
    color: '#D97706',
    bgGradient: 'from-amber-50 via-white to-stone-50',
  },
  {
    id: 'card-4',
    category: 'Reflective Practice',
    title: 'The Three-Word Weather Check',
    phase: 'End of Day Reflection',
    duration: '2 minutes',
    tagline: 'Build emotional vocabulary by describing internal states metaphorically.',
    prompt: 'Ask each table group or individual to share three weather words describing their internal atmosphere right now.',
    educatorScript: '"If your emotional state right now had weather, what would it be? Sunny with sudden thunder? Foggy morning? Overcast and calm?"',
    studentAction: 'Emotional articulation, non-stigmatized vulnerability.',
    color: '#2563EB',
    bgGradient: 'from-blue-50 via-white to-stone-50',
  },
  {
    id: 'card-5',
    category: 'Emotional Regulation',
    title: 'Naming the Felt Shift',
    phase: 'Beginning of Class',
    duration: '3 minutes',
    tagline: 'Notice physical sensations corresponding to stress or excitement.',
    prompt: 'Guide learners to identify where in their bodies they carry today\'s urgency (shoulders, stomach, hands) and offer self-compassion.',
    educatorScript: '"Notice where your body is holding today\'s schedule. Without judgment, breathe directly into that tight space and allow it to soften."',
    studentAction: 'Somatic awareness, interoceptive intelligence.',
    color: '#1B3626',
    bgGradient: 'from-stone-50 via-emerald-50/30 to-white',
  },
];

interface CeqhsCardsAppModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeqhsCardsAppModal: React.FC<CeqhsCardsAppModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [savedCards, setSavedCards] = useState<string[]>([]);

  if (!isOpen) return null;

  const currentCard = CEQHS_PRACTICE_CARDS[currentIndex];

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % CEQHS_PRACTICE_CARDS.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + CEQHS_PRACTICE_CARDS.length) % CEQHS_PRACTICE_CARDS.length);
  };

  const toggleBookmark = (id: string) => {
    setSavedCards((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-300 text-sky-600 flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                CEQHS Cards App · Practice &amp; Micro-Pauses
              </h2>
              <p className="text-xs text-stone-500">
                Emotional intelligence prompts for high school classrooms &amp; educator reflection
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Card Display Area */}
        <div className="mt-6">
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className={`cursor-pointer min-h-[340px] rounded-3xl border-2 p-6 sm:p-8 transition-all duration-300 bg-gradient-to-br ${currentCard.bgGradient} shadow-md hover:shadow-lg flex flex-col justify-between`}
            style={{ borderColor: currentCard.color }}
          >
            {/* Top metadata */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span
                  className="px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider text-white shadow-2xs"
                  style={{ backgroundColor: currentCard.color }}
                >
                  {currentCard.category}
                </span>
                <span className="text-xs font-semibold text-stone-600 bg-white/80 px-2 py-0.5 rounded-md border border-stone-200">
                  {currentCard.phase}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs font-medium text-stone-500 bg-white/60 px-2 py-0.5 rounded">
                  {currentCard.duration}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleBookmark(currentCard.id);
                  }}
                  className={`p-1.5 rounded-lg ${
                    savedCards.includes(currentCard.id)
                      ? 'text-amber-600 bg-amber-50'
                      : 'text-stone-400 hover:text-stone-700 bg-white'
                  }`}
                  aria-label="Bookmark card"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Middle Prompt Content */}
            <div className="py-4">
              {!isFlipped ? (
                <div>
                  <h3 className="text-2xl font-bold text-stone-900 mb-2 font-editorial">
                    {currentCard.title}
                  </h3>
                  <p className="text-sm font-medium text-stone-700 mb-4 leading-relaxed">
                    {currentCard.tagline}
                  </p>
                  <div className="p-4 bg-white/90 rounded-2xl border border-stone-200 shadow-2xs">
                    <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block mb-1">
                      Classroom Practice Prompt:
                    </span>
                    <p className="text-xs sm:text-sm text-stone-800 leading-relaxed italic">
                      {currentCard.prompt}
                    </p>
                  </div>
                  <p className="text-[11px] text-stone-400 text-center mt-3">
                    (Click card to flip for educator script &amp; student outcome)
                  </p>
                </div>
              ) : (
                <div>
                  <h3 className="text-xl font-bold text-stone-900 mb-3 font-editorial">
                    Classroom Script &amp; Impact
                  </h3>
                  <div className="space-y-3">
                    <div className="p-3.5 bg-white/90 rounded-2xl border border-stone-200">
                      <span className="text-[10px] font-bold tracking-wider text-stone-400 uppercase block mb-1">
                        Verbal Invitation to Students:
                      </span>
                      <p className="text-xs text-stone-800 italic leading-relaxed">
                        {currentCard.educatorScript}
                      </p>
                    </div>
                    <div className="p-3.5 bg-emerald-50/70 rounded-2xl border border-emerald-200/60">
                      <span className="text-[10px] font-bold tracking-wider text-emerald-800 uppercase block mb-1">
                        Expected Developmental Outcome:
                      </span>
                      <p className="text-xs text-emerald-950 font-medium leading-relaxed">
                        {currentCard.studentAction}
                      </p>
                    </div>
                  </div>
                  <p className="text-[11px] text-stone-400 text-center mt-3">
                    (Click card to return to prompt)
                  </p>
                </div>
              )}
            </div>

            {/* Bottom Card Index Indicator */}
            <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-200/60">
              <span>
                Card {currentIndex + 1} of {CEQHS_PRACTICE_CARDS.length}
              </span>
              <span className="text-[11px] font-medium text-stone-400">
                CEQHS Living Toolkit · Edition 2026
              </span>
            </div>
          </div>
        </div>

        {/* Carousel Controls */}
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={handlePrev}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Previous Card
          </button>

          <div className="flex items-center gap-1.5">
            {CEQHS_PRACTICE_CARDS.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setIsFlipped(false);
                  setCurrentIndex(idx);
                }}
                className={`w-2.5 h-2.5 rounded-full transition-all ${
                  idx === currentIndex ? 'w-6 bg-[#00A3C4]' : 'bg-stone-300 hover:bg-stone-400'
                }`}
                aria-label={`Jump to card ${idx + 1}`}
              />
            ))}
          </div>

          <button
            onClick={handleNext}
            className="flex items-center gap-1 px-4 py-2 rounded-xl bg-[#00A3C4] hover:bg-[#008DA5] text-white text-xs font-semibold shadow-xs transition-colors"
          >
            Next Card
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
