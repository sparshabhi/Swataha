import React, { useState } from 'react';
import {
  Calendar,
  Filter,
  Sparkles,
  Plus,
  Lock,
  Users,
  BookOpen,
  CheckCircle2,
  Mic,
  Play,
  Pause,
  MessageSquare,
  Eye,
  FileText,
  Camera,
  Layers,
  Search,
} from 'lucide-react';
import {
  JourneyEntry,
  User,
  EntryType,
  VisibilityLevel,
  BeforeNowShift,
} from '../types';

interface MyJourneyTimelineProps {
  entries: JourneyEntry[];
  currentUser: User;
  onOpenCapture: (type: EntryType) => void;
  onToggleDossierInclusion: (entryId: string) => void;
  beforeNowShifts: BeforeNowShift[];
}

export const MyJourneyTimeline: React.FC<MyJourneyTimelineProps> = ({
  entries,
  currentUser,
  onOpenCapture,
  onToggleDossierInclusion,
  beforeNowShifts,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAudioId, setActiveAudioId] = useState<string | null>(null);

  // Group entries chronologically by month
  const filteredEntries = entries.filter((entry) => {
    if (selectedFilter !== 'all' && entry.type !== selectedFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        entry.title.toLowerCase().includes(q) ||
        entry.description.toLowerCase().includes(q) ||
        (entry.themeTitle && entry.themeTitle.toLowerCase().includes(q)) ||
        (entry.whyDoesThisMatter && entry.whyDoesThisMatter.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const months = Array.from(new Set(filteredEntries.map((e) => e.month)));

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Personal Record Book
            </span>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
              My Living Journey
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              A chronological field journal of classroom experiments, pauses, reflections, and moments.
            </p>
          </div>

          <button
            onClick={() => onOpenCapture('practice')}
            className="px-4 py-2.5 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-colors flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Entry</span>
          </button>
        </div>

        {/* Intention Reminder Banner */}
        <div className="mt-6 p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#4A6B53]">
              Active Personal Intention ({currentUser.academicYear})
            </span>
            <p className="font-editorial italic text-stone-800 text-sm">
              "{currentUser.intention}"
            </p>
          </div>
          <span className="text-xs text-stone-500 shrink-0">
            Recorded {currentUser.intentionDate}
          </span>
        </div>

        {/* Search & Filter Toolbar */}
        <div className="mt-6 pt-5 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            {[
              { id: 'all', label: 'All Entries' },
              { id: 'practice', label: '🌱 Practices' },
              { id: 'reflection', label: '💡 Reflections' },
              { id: 'moment', label: '✨ Moments' },
              { id: 'evidence', label: '📷 Evidence' },
              { id: 'voice', label: '🎙 Voice' },
              { id: 'seen_by_others', label: '👥 Seen by Others' },
            ].map((f) => (
              <button
                key={f.id}
                onClick={() => setSelectedFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedFilter === f.id
                    ? 'bg-[#252525] text-white'
                    : 'bg-[#FAF9F5] text-stone-600 hover:bg-stone-200'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-60">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-stone-400" />
            <input
              type="text"
              placeholder="Search reflections, moments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#FAF9F5] border border-stone-300 rounded-lg text-xs text-stone-800 focus:outline-hidden focus:ring-1 focus:ring-[#4A6B53]"
            />
          </div>
        </div>
      </div>

      {/* Before / Now Growth Shift Highlights */}
      <section className="bg-[#FAF9F5] border border-stone-200 rounded-2xl p-6 shadow-2xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C45D3E]">
              Longitudinal Development
            </span>
            <h2 className="font-editorial text-2xl text-[#252525] font-normal">
              Before & Now: Observable Cultural Shifts
            </h2>
          </div>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Emerges naturally in Dossier Chapter 08
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {beforeNowShifts.slice(0, 2).map((shift) => (
            <div
              key={shift.id}
              className="p-4 rounded-xl bg-white border border-stone-200/80 space-y-3"
            >
              <div className="space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400">
                  Before
                </div>
                <p className="text-xs text-stone-600 italic">"{shift.before}"</p>
              </div>

              <div className="pt-2 border-t border-dashed border-stone-200 space-y-1">
                <div className="text-[10px] uppercase font-bold tracking-wider text-[#4A6B53]">
                  Now (Practices Becoming Routine)
                </div>
                <p className="text-xs text-stone-900 font-medium leading-relaxed">
                  "{shift.now}"
                </p>
              </div>

              <div className="pt-1 flex flex-wrap gap-1">
                {shift.catalysts.map((cat, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] bg-[#EAF0EB] text-[#4A6B53] px-2 py-0.5 rounded-sm font-medium"
                  >
                    {cat}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Timeline Entries by Month */}
      <div className="space-y-8">
        {months.map((month) => {
          const monthEntries = filteredEntries.filter((e) => e.month === month);

          return (
            <div key={month} className="space-y-4">
              {/* Month Divider Header */}
              <div className="sticky top-14 z-20 bg-[#F8F7F3]/90 backdrop-blur-xs py-2 border-b border-stone-300 flex items-center justify-between">
                <h3 className="font-editorial text-xl font-normal text-[#252525]">
                  {month}
                </h3>
                <span className="text-xs font-semibold text-stone-500">
                  {monthEntries.length} {monthEntries.length === 1 ? 'entry' : 'entries'}
                </span>
              </div>

              {/* Entries Feed */}
              <div className="space-y-4 pl-2 sm:pl-4 border-l-2 border-stone-300">
                {monthEntries.map((entry) => (
                  <article
                    key={entry.id}
                    className="relative bg-white border border-stone-200 rounded-2xl p-5 sm:p-6 shadow-2xs hover:shadow-xs transition-shadow space-y-4 -ml-4 sm:-ml-6"
                  >
                    {/* Top Metadata Header */}
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        {/* Type Badge */}
                        <span
                          className={`text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1 ${
                            entry.type === 'moment'
                              ? 'bg-[#FAF3E7] text-[#C88A2E]'
                              : entry.type === 'practice'
                              ? 'bg-[#EAF0EB] text-[#4A6B53]'
                              : entry.type === 'reflection'
                              ? 'bg-amber-100 text-amber-900'
                              : entry.type === 'voice'
                              ? 'bg-purple-100 text-purple-900'
                              : entry.type === 'seen_by_others'
                              ? 'bg-sky-100 text-sky-900'
                              : 'bg-stone-200 text-stone-800'
                          }`}
                        >
                          {entry.type === 'moment' && '✨ MOMENT'}
                          {entry.type === 'practice' && '🌱 PRACTICE'}
                          {entry.type === 'reflection' && '💡 REFLECTION'}
                          {entry.type === 'evidence' && '📷 EVIDENCE'}
                          {entry.type === 'voice' && '🎙 VOICE REFLECTION'}
                          {entry.type === 'seen_by_others' && '👥 SEEN BY OTHERS'}
                          {entry.type === 'student_voice' && '🧑‍🎓 STUDENT VOICE'}
                        </span>

                        {entry.momentCategory && (
                          <span className="text-xs px-2 py-0.5 bg-stone-100 text-stone-700 rounded-full font-medium">
                            {entry.momentCategory}
                          </span>
                        )}

                        <span className="text-xs text-stone-500">{entry.date}</span>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* Visibility Pill */}
                        <span className="text-[11px] px-2.5 py-0.5 rounded-md bg-[#FAF9F5] border border-stone-200 text-stone-600 font-medium flex items-center gap-1">
                          {entry.visibility === 'Private' && <Lock className="w-3 h-3 text-stone-500" />}
                          {entry.visibility === 'School' && <Users className="w-3 h-3 text-stone-500" />}
                          {entry.visibility === 'Dossier' && <BookOpen className="w-3 h-3 text-[#4A6B53]" />}
                          {entry.visibility === 'CEQHS Review' && <CheckCircle2 className="w-3 h-3 text-blue-500" />}
                          <span>{entry.visibility}</span>
                        </span>

                        {/* Toggle Dossier Inclusion */}
                        <button
                          onClick={() => onToggleDossierInclusion(entry.id)}
                          className={`text-[11px] px-2.5 py-0.5 rounded-md font-medium border transition-colors ${
                            entry.includedInDossier
                              ? 'bg-[#EAF0EB] text-[#4A6B53] border-[#4A6B53]/30'
                              : 'bg-white text-stone-400 border-stone-200 hover:text-stone-700'
                          }`}
                          title="Toggle whether this entry is nominated for the annual school dossier"
                        >
                          {entry.includedInDossier ? '✓ In School Dossier' : '+ Nominate for Dossier'}
                        </button>
                      </div>
                    </div>

                    {/* Entry Title & Theme */}
                    <div>
                      <h4 className="font-editorial text-2xl text-[#252525] font-normal">
                        {entry.title}
                      </h4>
                      {entry.themeTitle && (
                        <span className="text-xs text-[#4A6B53] font-medium block mt-0.5">
                          Theme: {entry.themeTitle}
                        </span>
                      )}
                    </div>

                    {/* Main Story / Description */}
                    <p className="text-sm text-stone-800 leading-relaxed font-normal">
                      {entry.description}
                    </p>

                    {/* Practice Specific Structured Flow */}
                    {entry.type === 'practice' && (
                      <div className="p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 space-y-3 text-xs">
                        {entry.whatHappened && (
                          <div>
                            <span className="font-bold text-stone-700 block uppercase tracking-wider text-[10px] mb-0.5">
                              What happened?
                            </span>
                            <p className="text-stone-800">{entry.whatHappened}</p>
                          </div>
                        )}
                        {entry.whatDidINotice && (
                          <div>
                            <span className="font-bold text-[#4A6B53] block uppercase tracking-wider text-[10px] mb-0.5">
                              What did I notice?
                            </span>
                            <p className="text-stone-800">{entry.whatDidINotice}</p>
                          </div>
                        )}
                        {entry.whatMightITryNext && (
                          <div>
                            <span className="font-bold text-[#C88A2E] block uppercase tracking-wider text-[10px] mb-0.5">
                              What might I try next?
                            </span>
                            <p className="text-stone-800">{entry.whatMightITryNext}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Why Does This Matter (The Emotional Center) */}
                    {entry.whyDoesThisMatter && (
                      <div className="p-3.5 rounded-xl bg-[#F8EDE9]/60 border-l-4 border-[#C45D3E] text-stone-800">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#C45D3E] block mb-0.5">
                          Why does this matter?
                        </span>
                        <p className="text-xs sm:text-sm text-stone-800 italic leading-relaxed">
                          "{entry.whyDoesThisMatter}"
                        </p>
                      </div>
                    )}

                    {/* Voice Recording Player & Transcript */}
                    {entry.type === 'voice' && (
                      <div className="p-4 rounded-xl bg-purple-50/70 border border-purple-200/80 space-y-3">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() =>
                              setActiveAudioId(activeAudioId === entry.id ? null : entry.id)
                            }
                            className="w-9 h-9 rounded-full bg-purple-700 text-white flex items-center justify-center shadow-xs hover:bg-purple-800"
                          >
                            {activeAudioId === entry.id ? (
                              <Pause className="w-4 h-4" />
                            ) : (
                              <Play className="w-4 h-4 ml-0.5" />
                            )}
                          </button>
                          <div>
                            <span className="text-xs font-semibold text-purple-900 block">
                              🎙 Spoken Voice Recording ({entry.audioDuration || '01:14'})
                            </span>
                            <span className="text-[10px] text-purple-600">
                              {activeAudioId === entry.id ? 'Playing reflection...' : 'Click to play audio'}
                            </span>
                          </div>
                        </div>

                        {entry.transcript && (
                          <div className="pt-2 border-t border-purple-200/60">
                            <span className="text-[10px] uppercase font-bold text-purple-800 block mb-1">
                              Spoken Transcript:
                            </span>
                            <p className="text-xs text-stone-700 italic leading-relaxed">
                              "{entry.transcript}"
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Photograph / Artifact Preview */}
                    {entry.photoUrl && (
                      <div className="rounded-xl overflow-hidden border border-stone-200 bg-stone-100 max-h-80">
                        <img
                          src={entry.photoUrl}
                          alt={entry.title}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}

                    {/* Seen by Others (Colleague Observation) */}
                    {entry.type === 'seen_by_others' && (
                      <div className="p-4 rounded-xl bg-[#EBF2F6] border border-[#3F6C8A]/30 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-[#3F6C8A] block">
                          Observed by {entry.observedBy}
                        </span>
                        <p className="font-editorial text-stone-800 italic text-sm leading-relaxed">
                          {entry.whatHappened}
                        </p>
                      </div>
                    )}

                    {/* Student Voice */}
                    {entry.type === 'student_voice' && (
                      <div className="p-4 rounded-xl bg-amber-50/80 border border-amber-200/80 space-y-1">
                        <span className="text-[10px] uppercase font-bold text-amber-900 block">
                          Student Voice ({entry.gradeLevel})
                        </span>
                        <p className="font-editorial text-stone-900 italic text-base leading-relaxed">
                          {entry.studentQuote}
                        </p>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </div>
          );
        })}

        {filteredEntries.length === 0 && (
          <div className="p-12 text-center bg-white border border-stone-200 rounded-2xl">
            <Sparkles className="w-8 h-8 text-stone-400 mx-auto mb-2" />
            <h4 className="font-editorial text-xl text-stone-700">No entries match this filter</h4>
            <p className="text-xs text-stone-500 mt-1">
              Try switching your filter tab or logging a new classroom practice experiment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
