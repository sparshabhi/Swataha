import React, { useState } from 'react';
import {
  Users,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Heart,
  Brain,
  MessageSquare,
  Sparkles,
  Award,
  BookOpen,
  ChevronRight,
  HelpCircle,
  Clock,
  Check,
} from 'lucide-react';

interface AdultCompetency {
  id: string;
  domain: string;
  description: string;
  practiceExample: string;
  status: 'Developing' | 'Practising' | 'Embedding' | 'Leading';
  progress: number; // 0-100
  recentReflectionsCount: number;
}

export const CeqhsAdultDevelopmentView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'domains' | 'confidential_reflections' | 'coaching_notes'>('domains');
  const [reflectionText, setReflectionText] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // The 8 adult competency domains specified in Section 6.8
  const adultDomains: AdultCompetency[] = [
    {
      id: 'dom-1',
      domain: '1. Self-Awareness & Somatic Cues',
      description: 'Recognizing personal stress triggers, somatic tension patterns, and unexamined instructional biases.',
      practiceExample: 'Monthly Somatic Body Mapping before high-stakes term reports.',
      status: 'Embedding',
      progress: 78,
      recentReflectionsCount: 4,
    },
    {
      id: 'dom-2',
      domain: '2. Self-Regulation Under Pressure',
      description: 'Down-regulating physiological fight-or-flight arousal during chaotic classroom transitions or acute defiance.',
      practiceExample: 'The 3-breath curious pause practiced at the classroom doorway.',
      status: 'Practising',
      progress: 62,
      recentReflectionsCount: 3,
    },
    {
      id: 'dom-3',
      domain: '3. Relational Communication',
      description: 'Non-defensive, compassionate inquiry and active listening during parent friction and peer disagreements.',
      practiceExample: 'Using the 4-part restorative inquiry rather than defensive justification.',
      status: 'Embedding',
      progress: 80,
      recentReflectionsCount: 5,
    },
    {
      id: 'dom-4',
      domain: '4. Facilitation Skills',
      description: 'Holding safe, non-punitive emotional weather circles without forcing disclosure or offering premature advice.',
      practiceExample: 'Facilitating morning emotion weather without requiring children to mask.',
      status: 'Leading',
      progress: 90,
      recentReflectionsCount: 6,
    },
    {
      id: 'dom-5',
      domain: '5. Feedback and Coaching',
      description: 'Seeking, giving, and digesting pedagogical feedback with curiosity rather than fear of evaluation.',
      practiceExample: 'Bi-weekly peer walkthrough observations using non-judgmental timestamp notes.',
      status: 'Practising',
      progress: 58,
      recentReflectionsCount: 2,
    },
    {
      id: 'dom-6',
      domain: '6. Inclusion and Belonging',
      description: 'Designing classroom social architecture that dignifies neurodivergent, quiet, and multilingual students.',
      practiceExample: 'Providing physical gesture tokens so non-verbal students can express state safely.',
      status: 'Embedding',
      progress: 75,
      recentReflectionsCount: 3,
    },
    {
      id: 'dom-7',
      domain: '7. Values-Based Leadership',
      description: 'Aligning operational decisions, grading expectations, and discipline with human dignity and care.',
      practiceExample: 'Leadership policy audit replacing punitive detention with restorative accountability.',
      status: 'Practising',
      progress: 65,
      recentReflectionsCount: 2,
    },
    {
      id: 'dom-8',
      domain: '8. Personal and Professional Reflection',
      description: 'Protecting intentional contemplative space to prevent emotional burnout and sustain passion for education.',
      practiceExample: 'Confidential reflective journaling in the Living Journey faculty portal.',
      status: 'Developing',
      progress: 45,
      recentReflectionsCount: 1,
    },
  ];

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      setReflectionText('');
    }, 2500);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.8 Adult Journey
              </span>
              <span className="text-xs text-stone-500 font-medium">
                8 Dedicated Adult Competencies
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Adult Professional Development &amp; Presence
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Equips educators and school leaders with personal emotional agility. Adult outcomes are distinct and not treated as merely an advanced version of child outcomes.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700">
              22 Participating Faculty
            </span>
          </div>
        </div>

        {/* CORE ADULT PRINCIPLE BANNER (SECTION 6.8 MANDATE) */}
        <div className="mt-5 p-4 rounded-xl bg-[#FAF8F5] border border-amber-200/80 flex items-start gap-3 text-stone-800 text-xs">
          <Brain className="w-5 h-5 text-amber-800 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold text-stone-900">
              Governance Principle: Attendance Does Not Equal Mastery
            </strong>
            Mastery is demonstrated through sustained observable practice in classrooms, reflective vulnerability in confidential journals, and verified coaching walkthroughs—never simply by tallying workshop attendance hours.
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex items-center gap-3 pt-5">
          {[
            { id: 'domains', label: '8 Adult Competencies' },
            { id: 'confidential_reflections', label: 'Confidential Reflective Journal' },
            { id: 'coaching_notes', label: 'Coaching Walkthrough Notes' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab.id
                  ? 'bg-[#1B3626] text-white shadow-xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tab 1: 8 Adult Domains */}
      {activeTab === 'domains' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {adultDomains.map((dom) => (
            <div
              key={dom.id}
              className="p-5 rounded-2xl border border-stone-200 bg-white shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <span className="text-xs font-bold text-stone-900">
                    {dom.domain}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                      dom.status === 'Leading'
                        ? 'bg-purple-100 text-purple-800'
                        : dom.status === 'Embedding'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {dom.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {dom.description}
                </p>

                <div className="mt-3 p-2.5 rounded-lg bg-[#FAF8F5] border border-stone-200/60 text-[11px] text-stone-700">
                  <strong className="text-stone-900">Practice Micro-Routine:</strong> {dom.practiceExample}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1">
                  <span>Developmental Progression</span>
                  <span>{dom.progress}%</span>
                </div>
                <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="h-full bg-[#1B3626] rounded-full"
                    style={{ width: `${dom.progress}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tab 2: Confidential Reflective Journal */}
      {activeTab === 'confidential_reflections' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-stone-100 pb-4">
            <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
              <Lock className="w-3.5 h-3.5" />
              100% Confidential to Educator · Non-Evaluative
            </div>
            <h2 className="text-lg font-bold text-stone-900">
              Staff Trigger and Response Reflection Log
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Reflections recorded here are never shared with administration or used in performance evaluations.
            </p>
          </div>

          <div className="space-y-3">
            <label className="block text-xs font-semibold text-stone-700">
              Prompt: Recall a moment this week when classroom friction triggered a reactive response. What was the body cue, and what pause ritual helped you regain center?
            </label>
            <textarea
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              placeholder="Record your thoughts freely. e.g., During the Grade 2 transition after playground games, the shouting made my shoulders tense up. I used the 3-breath curious pause at my desk before addressing the room..."
              className="w-full h-32 p-3.5 text-xs rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3626]"
            />

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-stone-400">
                End-to-end encrypted locally in your educator profile.
              </span>
              <div className="flex items-center gap-3">
                {isSaved && (
                  <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                    <Check className="w-3.5 h-3.5" /> Saved to private journal
                  </span>
                )}
                <button
                  onClick={handleSaveReflection}
                  className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold cursor-pointer"
                >
                  Save Entry
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Coaching Notes */}
      {activeTab === 'coaching_notes' && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div className="border-b border-stone-100 pb-3">
            <h2 className="text-base font-bold text-stone-900">
              Facilitator Walkthrough Coaching Logs
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              Objective, curiosity-oriented observation records focused on classroom emotional climate.
            </p>
          </div>

          <div className="space-y-3">
            {[
              {
                date: '2026-09-12',
                observer: 'Pooja Pandey (CEQHS Mentor)',
                educator: 'Sarita Sharma (Grade 2)',
                observation: 'Educator paused at the front chime for 20 seconds of silence before giving instruction. Students visibly mirrored her shoulder relaxation.',
                actionItem: 'Continue experimenting with non-verbal hand gestures for children who struggle to find words in the morning.',
              },
              {
                date: '2026-09-08',
                observer: 'Dr. Sunita Khadka (Lead Admin)',
                educator: 'Bibek Thapa (Grade 4)',
                observation: 'Mindful micro-pause delivered with genuine warmth after outdoor play. Classroom volume dropped from 78dB to 48dB in 90 seconds.',
                actionItem: 'Invite Grade 4 student leaders to co-ring the chime next week.',
              },
            ].map((log, i) => (
              <div key={i} className="p-4 rounded-xl border border-stone-200 bg-[#FDFBF7] space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-stone-900">{log.educator} · Observed by {log.observer}</span>
                  <span className="text-stone-500">{log.date}</span>
                </div>
                <p className="text-xs text-stone-700 leading-relaxed">
                  <strong>Observation:</strong> {log.observation}
                </p>
                <div className="text-[11px] text-[#1B3626] font-medium bg-[#EAF0EB] p-2 rounded-lg">
                  <strong>Reflective Step:</strong> {log.actionItem}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
