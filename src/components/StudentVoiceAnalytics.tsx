import React, { useState } from 'react';
import {
  Heart,
  Smile,
  Users,
  ShieldCheck,
  TrendingUp,
  Sparkles,
  Filter,
  Quote,
  MessageCircle,
  FileSpreadsheet,
  Printer,
  ChevronDown,
  Info,
  Calendar,
  Layers,
  ArrowUpRight,
  Sun,
  CloudSun,
  CloudRain,
  Compass,
} from 'lucide-react';
import { JourneyEntry, StudentClimateQuote, GradeClimateMetric } from '../types';

interface StudentVoiceAnalyticsProps {
  entries: JourneyEntry[];
  schoolName: string;
}

const INITIAL_STUDENT_QUOTES: StudentClimateQuote[] = [
  {
    id: 'sv-1',
    quote:
      'In other classes, if you get it wrong, people giggle and the teacher moves to someone else. Here, Ms. Lin says: ‘That is an interesting angle, walk me through how your brain got there.’ It makes getting it wrong feel like solving a puzzle instead of dying.',
    gradeLevel: 'Grade 7',
    themeTitle: 'Psychological Belonging',
    date: '18 Nov 2026',
    teacherName: 'Maya Lin',
    sentiment: 'positive',
    emotionalShift: 'From fear of public humiliation to intellectual curiosity',
    tags: ['Mistake Welcoming', 'Classroom Safety', 'Voice'],
  },
  {
    id: 'sv-2',
    quote:
      'When Mr. Vance noticed I was clenching my notebook, he didn’t give me a detention for not reading aloud. He walked by and tapped the calming card on my desk. That two-minute breath saved my entire afternoon.',
    gradeLevel: 'Grade 9',
    themeTitle: 'Empathetic Discipline',
    date: '02 Dec 2026',
    teacherName: 'Arthur Vance',
    sentiment: 'breakthrough' as any,
    emotionalShift: 'Dysregulated defense replaced by silent nervous-system reset',
    tags: ['Co-Regulation', 'Non-Punitive', 'Trigger Awareness'],
  },
  {
    id: 'sv-3',
    quote:
      'The morning circle check-in feels weird at first because high schoolers usually pretend they don’t care. But hearing our physics teacher say he was exhausted and reset his intentions made me realize we are all carrying heavy backpacks.',
    gradeLevel: 'Grade 11',
    themeTitle: 'Emotional Literacy',
    date: '14 Jan 2027',
    teacherName: 'Marcus Bell',
    sentiment: 'reflective',
    emotionalShift: 'Vulnerability normalized as an adult human reality',
    tags: ['Relational Safety', 'Morning Check-In', 'Shared Humanity'],
  },
  {
    id: 'sv-4',
    quote:
      'I used to shut down whenever group projects were announced because my ideas always got talked over. Having the talking piece norm forced people to wait until I found my words.',
    gradeLevel: 'Grade 8',
    themeTitle: 'Psychological Belonging',
    date: '20 Jan 2027',
    teacherName: 'Priya Patel',
    sentiment: 'positive',
    emotionalShift: 'Withdrawal transformed into guaranteed conversational equity',
    tags: ['Restorative Circles', 'Talking Piece', 'Inclusion'],
  },
  {
    id: 'sv-5',
    quote:
      'We had a disagreement during the ethics debate. Instead of yelling, our teacher had both sides pause and name what emotion was rising behind the argument. It stopped the fight instantly.',
    gradeLevel: 'Grade 10',
    themeTitle: 'Empathetic Discipline',
    date: '28 Jan 2027',
    teacherName: 'David Kim',
    sentiment: 'reflective',
    emotionalShift: 'Ideological hostility de-escalated via emotional labeling',
    tags: ['Conflict Transformation', 'Emotional Agility', 'Debate'],
  },
  {
    id: 'sv-6',
    quote:
      'I appreciate that we are allowed to take the window seat for 2 minutes without asking for a bathroom pass when our nervous system feels overwhelmed. It treats us like adults.',
    gradeLevel: 'Grade 12',
    themeTitle: 'Emotional Literacy',
    date: '05 Feb 2027',
    teacherName: 'Sarah Jenkins',
    sentiment: 'positive',
    emotionalShift: 'Autonomous self-regulation validated by classroom culture',
    tags: ['Window Seat Anchor', 'Dignity', 'Restorative Agency'],
  },
];

const GRADE_METRICS: GradeClimateMetric[] = [
  {
    grade: 'Grade 7',
    safetyScore: 92,
    belongingScore: 89,
    expressionScore: 86,
    responsesCount: 38,
    dominantMood: 'Curious & Inspired',
    notableInsight: 'Highest responsiveness to mistake-welcoming question framing.',
  },
  {
    grade: 'Grade 8',
    safetyScore: 84,
    belongingScore: 82,
    expressionScore: 78,
    responsesCount: 32,
    dominantMood: 'Restless / Anxious',
    notableInsight: 'Peer dynamics peak; benefited most from structured restorative talking circles.',
  },
  {
    grade: 'Grade 9',
    safetyScore: 86,
    belongingScore: 88,
    expressionScore: 82,
    responsesCount: 29,
    dominantMood: 'Calm & Centered',
    notableInsight: 'Transition year anxiety softened by non-punitive silent regulation cues.',
  },
  {
    grade: 'Grade 10',
    safetyScore: 89,
    belongingScore: 91,
    expressionScore: 85,
    responsesCount: 24,
    dominantMood: 'Curious & Inspired',
    notableInsight: 'Strong uptake of emotional labeling in academic debate contexts.',
  },
  {
    grade: 'Grade 11',
    safetyScore: 87,
    belongingScore: 89,
    expressionScore: 90,
    responsesCount: 25,
    dominantMood: 'Fatigued',
    notableInsight: 'Academic burnout mitigated when educators model vulnerable adult resets.',
  },
  {
    grade: 'Grade 12',
    safetyScore: 94,
    belongingScore: 93,
    expressionScore: 92,
    responsesCount: 20,
    dominantMood: 'Calm & Centered',
    notableInsight: 'Highest agency in self-directed regulation and independent window-seat pauses.',
  },
];

export const StudentVoiceAnalytics: React.FC<StudentVoiceAnalyticsProps> = ({
  entries,
  schoolName,
}) => {
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [selectedTheme, setSelectedTheme] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'overview' | 'quotes' | 'grades'>('overview');

  // Also include any student voice entries created dynamically by users in entries!
  const userStudentVoiceEntries = entries.filter((e) => e.type === 'student_voice');

  const filteredQuotes = INITIAL_STUDENT_QUOTES.filter((q) => {
    const matchesGrade = selectedGrade === 'all' || q.gradeLevel === selectedGrade;
    const matchesTheme = selectedTheme === 'all' || q.themeTitle === selectedTheme;
    return matchesGrade && matchesTheme;
  });

  const totalVoices = 168 + userStudentVoiceEntries.length;

  const handlePrint = () => {
    window.print();
  };

  return (
    <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-8 print:p-0 print:border-none print:shadow-none">
      {/* Header with Print / Export CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#4A6B53]">
            <Heart className="w-4 h-4 text-[#4A6B53]" />
            <span>Campus Emotional Climate &amp; Student Voices</span>
          </div>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal mt-0.5">
            Aggregated Student Voice Analytics
          </h2>
          <p className="text-xs text-stone-600 mt-1 max-w-2xl">
            Anonymized sentiment indicators, emotional weather trends, and verbatim reflections captured across participating classrooms at <strong className="text-stone-900">{schoolName}</strong>.
          </p>
        </div>

        <div className="flex items-center gap-2 print:hidden self-start sm:self-auto">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5 text-stone-500" />
            <span>Print Climate Briefing</span>
          </button>
        </div>
      </div>

      {/* Analytical Sub-Nav Tabs */}
      <div className="flex items-center gap-1 border-b border-stone-200 text-xs font-medium pb-2 print:hidden">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'overview'
              ? 'bg-[#1B3626] text-white font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <TrendingUp className="w-3.5 h-3.5" />
          <span>School Climate Indices</span>
        </button>
        <button
          onClick={() => setActiveTab('quotes')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'quotes'
              ? 'bg-[#1B3626] text-white font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Quote className="w-3.5 h-3.5" />
          <span>Verbatim Student Voices ({filteredQuotes.length})</span>
        </button>
        <button
          onClick={() => setActiveTab('grades')}
          className={`px-3 py-1.5 rounded-lg transition-colors flex items-center gap-1.5 ${
            activeTab === 'grades'
              ? 'bg-[#1B3626] text-white font-bold'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Grade-by-Grade Comparison</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & CLIMATE INDICES */}
      {activeTab === 'overview' && (
        <div className="space-y-8 animate-in fade-in duration-150">
          {/* 4 Core Climate Index Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Psychological Safety
                </span>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-stone-900">88.4%</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  +12% vs Baseline
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Students report feeling safe to answer incorrectly without peer ridicule.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Relational Belonging
                </span>
                <Heart className="w-4 h-4 text-rose-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-stone-900">91.8%</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  +9% YoY
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Report feeling personally known, respected, and welcomed by classroom educators.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Emotional Regulation Agency
                </span>
                <Sparkles className="w-4 h-4 text-amber-600" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-stone-900">85.2%</span>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">
                  +18% Peak Shift
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                Utilize calm corners, 2-minute breathing anchors, or emotional labeling during friction.
              </p>
            </div>

            <div className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  Total Student Voices
                </span>
                <MessageCircle className="w-4 h-4 text-[#4A6B53]" />
              </div>
              <div className="flex items-baseline gap-2">
                <span className="font-editorial text-3xl font-bold text-stone-900">{totalVoices}</span>
                <span className="text-[10px] text-stone-500 font-mono">
                  Grades 7–12
                </span>
              </div>
              <p className="text-[11px] text-stone-600 leading-tight">
                De-identified exit tickets, talking circles, and audio reflection transcriptions.
              </p>
            </div>
          </div>

          {/* Emotional Weather Breakdown */}
          <div className="p-5 rounded-xl border border-stone-200 bg-[#FAF9F5] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-editorial text-lg font-bold text-stone-900 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-amber-600" />
                  <span>Campus Emotional Weather Pulse (Past 30 Days)</span>
                </h3>
                <p className="text-xs text-stone-600">
                  Aggregated from student self-selected feeling check-ins and restorative debriefs.
                </p>
              </div>
              <span className="text-xs font-mono font-bold text-[#4A6B53] bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
                69% Positive / Centered Horizon
              </span>
            </div>

            {/* Stacked Progress Bar */}
            <div className="h-4 w-full rounded-full overflow-hidden flex shadow-inner bg-stone-200">
              <div
                style={{ width: '38%' }}
                className="bg-emerald-600 h-full transition-all"
                title="Calm & Centered: 38%"
              />
              <div
                style={{ width: '31%' }}
                className="bg-[#4A6B53] h-full transition-all"
                title="Curious & Inspired: 31%"
              />
              <div
                style={{ width: '18%' }}
                className="bg-amber-400 h-full transition-all"
                title="Restless / Anxious: 18%"
              />
              <div
                style={{ width: '13%' }}
                className="bg-stone-400 h-full transition-all"
                title="Fatigued / Heavy: 13%"
              />
            </div>

            {/* Weather Legend */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-600 shrink-0" />
                <div>
                  <strong className="block font-semibold text-stone-900">38% Calm &amp; Centered</strong>
                  <span className="text-[10px] text-stone-500">Ready to learn, grounded</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-[#4A6B53] shrink-0" />
                <div>
                  <strong className="block font-semibold text-stone-900">31% Curious &amp; Inspired</strong>
                  <span className="text-[10px] text-stone-500">Engaged, asking questions</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-400 shrink-0" />
                <div>
                  <strong className="block font-semibold text-stone-900">18% Restless / Anxious</strong>
                  <span className="text-[10px] text-stone-500">Peer or test stress</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-stone-400 shrink-0" />
                <div>
                  <strong className="block font-semibold text-stone-900">13% Fatigued / Heavy</strong>
                  <span className="text-[10px] text-stone-500">Late study, life load</span>
                </div>
              </div>
            </div>
          </div>

          {/* Key Pedagogical Takeaways for School Leaders */}
          <div className="p-5 rounded-xl bg-[#EAF0EB]/80 border border-[#4A6B53]/30 flex items-start gap-4">
            <div className="w-8 h-8 rounded-full bg-[#1B3626] text-white flex items-center justify-center font-bold text-sm shrink-0">
              <Compass className="w-4 h-4" />
            </div>
            <div className="space-y-1.5 text-xs text-stone-800">
              <strong className="font-bold text-[#1B3626] text-sm block">
                Coordinator Climate Analysis &amp; Action Recommendation
              </strong>
              <p className="leading-relaxed">
                When classroom teachers replace instantaneous sanctioning with a <strong>curious question</strong> or a silent <strong>breathing anchor</strong>, student reports of classroom anxiety drop by <span className="font-bold text-stone-900">34%</span> within the same period.
              </p>
              <div className="flex items-center gap-2 pt-1 text-[11px] text-stone-600">
                <span>Recommended focus for next staff circle:</span>
                <strong className="text-[#1B3626] underline cursor-pointer" onClick={() => setActiveTab('quotes')}>
                  Review Grade 8 restorative circle voices
                </strong>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: VERBATIM STUDENT VOICES */}
      {activeTab === 'quotes' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          {/* Filters Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-stone-600">
                <Filter className="w-3.5 h-3.5 text-stone-400" />
                <span className="font-semibold">Filter Grade:</span>
              </div>
              <div className="flex items-center gap-1 overflow-x-auto">
                {['all', 'Grade 7', 'Grade 8', 'Grade 9', 'Grade 10', 'Grade 11', 'Grade 12'].map(
                  (grade) => (
                    <button
                      key={grade}
                      onClick={() => setSelectedGrade(grade)}
                      className={`px-2.5 py-1 rounded-lg text-xs transition-colors shrink-0 ${
                        selectedGrade === grade
                          ? 'bg-[#1B3626] text-white font-semibold'
                          : 'text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      {grade === 'all' ? 'All Grades' : grade}
                    </button>
                  )
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={selectedTheme}
                onChange={(e) => setSelectedTheme(e.target.value)}
                className="text-xs p-1.5 rounded-lg border border-stone-300 bg-white text-stone-800"
              >
                <option value="all">All Emotional Themes</option>
                <option value="Psychological Belonging">Psychological Belonging</option>
                <option value="Empathetic Discipline">Empathetic Discipline</option>
                <option value="Emotional Literacy">Emotional Literacy</option>
              </select>
            </div>
          </div>

          {/* Student Quote Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredQuotes.map((q) => (
              <div
                key={q.id}
                className="p-5 rounded-xl border border-stone-200 bg-[#FAF9F5] hover:bg-white transition-all space-y-3 shadow-2xs group flex flex-col justify-between"
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-stone-200 text-stone-800">
                        {q.gradeLevel}
                      </span>
                      <span className="text-[11px] font-medium text-stone-500">
                        {q.themeTitle}
                      </span>
                    </div>

                    <span className="text-[10px] text-stone-400 font-mono">{q.date}</span>
                  </div>

                  <p className="text-xs text-stone-900 leading-relaxed font-normal italic relative pl-4 border-l-2 border-l-[#4A6B53]">
                    "{q.quote}"
                  </p>
                </div>

                <div className="pt-3 border-t border-stone-200/80 space-y-2">
                  <div className="text-[11px] text-stone-600">
                    <strong className="text-stone-900 font-medium">Emotional Shift:</strong>{' '}
                    <span>{q.emotionalShift}</span>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-1 text-[10px]">
                    <div className="flex flex-wrap gap-1">
                      {q.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-1.5 py-0.5 rounded bg-stone-100 text-stone-600 border border-stone-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <span className="text-stone-400 font-medium">
                      Facilitator: {q.teacherName}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Ethical Anonymization Notice */}
          <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 text-[11px] text-stone-600 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-stone-900">Student Anonymity Guarantee:</strong> In accordance with CEQHS research ethics and student privacy governance, all student names and classroom identifiers are stripped before aggregation. Data is curated purely to reflect campus atmosphere and pedagogical shifts.
            </p>
          </div>
        </div>
      )}

      {/* TAB 3: GRADE-BY-GRADE COMPARISON */}
      {activeTab === 'grades' && (
        <div className="space-y-6 animate-in fade-in duration-150">
          <div className="border border-stone-200 rounded-xl overflow-hidden shadow-2xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold uppercase tracking-wider text-stone-600">
                <tr>
                  <th className="p-3">Cohort</th>
                  <th className="p-3">Safety Index</th>
                  <th className="p-3">Belonging Score</th>
                  <th className="p-3">Regulation Agency</th>
                  <th className="p-3">Dominant Mood</th>
                  <th className="p-3">Responses</th>
                  <th className="p-3">Pedagogical Insight</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-200 bg-white">
                {GRADE_METRICS.map((gm) => (
                  <tr key={gm.grade} className="hover:bg-stone-50 transition-colors">
                    <td className="p-3 font-bold text-stone-900">{gm.grade}</td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{gm.safetyScore}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            style={{ width: `${gm.safetyScore}%` }}
                            className="bg-emerald-600 h-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{gm.belongingScore}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            style={{ width: `${gm.belongingScore}%` }}
                            className="bg-[#4A6B53] h-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-stone-900">{gm.expressionScore}%</span>
                        <div className="w-16 h-1.5 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            style={{ width: `${gm.expressionScore}%` }}
                            className="bg-amber-500 h-full"
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded-full text-[11px] font-medium bg-stone-100 text-stone-800 border border-stone-200">
                        {gm.dominantMood}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-stone-600">{gm.responsesCount}</td>
                    <td className="p-3 text-stone-600 max-w-xs">{gm.notableInsight}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </section>
  );
};
