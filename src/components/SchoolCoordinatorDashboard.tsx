import React, { useState } from 'react';
import {
  School,
  Sparkles,
  TrendingUp,
  Users,
  BookOpen,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Filter,
  ArrowRight,
} from 'lucide-react';
import {
  User,
  SchoolSignal,
  JourneyEntry,
  JourneyPhase,
} from '../types';

interface SchoolCoordinatorDashboardProps {
  currentUser: User;
  signals: SchoolSignal[];
  entries: JourneyEntry[];
  phases: JourneyPhase[];
  onNavigateTab: (tab: string) => void;
}

export const SchoolCoordinatorDashboard: React.FC<SchoolCoordinatorDashboardProps> = ({
  currentUser,
  signals,
  entries,
  phases,
  onNavigateTab,
}) => {
  const [selectedSignalTab, setSelectedSignalTab] = useState<string>('all');

  const dossierNominated = entries.filter((e) => e.includedInDossier);

  return (
    <div className="space-y-8 pb-12 max-w-6xl mx-auto">
      {/* Header Banner */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#C88A2E]">
              <School className="w-4 h-4" />
              <span>School-Level Living Dashboard</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
              Our CEQHS Journey ({currentUser.academicYear})
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              {currentUser.schoolName} · Facilitated by {currentUser.name} (Coordinator)
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('dossier')}
            className="px-4 py-2.5 rounded-xl bg-[#252525] text-white text-xs font-semibold hover:bg-black transition-colors flex items-center gap-2 self-start md:self-auto shadow-xs"
          >
            <BookOpen className="w-4 h-4" />
            <span>Curate School Dossier</span>
          </button>
        </div>

        {/* Holistic School Counts (Not completion scores!) */}
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#252525]">28</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Educators</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#C45D3E]">143</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Moments</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#C88A2E]">87</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Reflections</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#3F6C8A]">64</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Evidence Items</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-[#4A6B53]">12</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Practices</span>
          </div>
          <div className="p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
            <span className="text-2xl font-editorial font-bold text-purple-700">4</span>
            <span className="text-xs font-semibold text-stone-600 block mt-0.5">Emerging Patterns</span>
          </div>
        </div>

        {/* School Journey Phase Map */}
        <div className="mt-8 pt-6 border-t border-stone-200">
          <div className="flex items-center justify-between mb-3 text-xs">
            <span className="font-semibold uppercase tracking-wider text-stone-500">
              Campus Journey Progress Map
            </span>
            <span className="text-[#4A6B53] font-medium">
              Classroom experiments actively embedding
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2">
            {phases.map((p, idx) => {
              const isPast = idx < 2;
              const isCurrent = idx === 2;
              return (
                <div
                  key={p.id}
                  className={`p-2.5 rounded-xl border text-xs ${
                    isCurrent
                      ? 'bg-[#FAF3E7] border-[#C88A2E] ring-1 ring-[#C88A2E] font-bold text-stone-900'
                      : isPast
                      ? 'bg-[#EAF0EB] border-[#4A6B53]/30 text-[#4A6B53]'
                      : 'bg-[#FAF9F5] border-stone-200 text-stone-400'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase">{p.number}</span>
                    {isPast && <span>✓</span>}
                    {isCurrent && <span className="w-2 h-2 rounded-full bg-[#C88A2E]" />}
                  </div>
                  <div className="font-semibold mt-1">{p.name}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Coordinator Philosophy Box: Patterns over policing */}
      <div className="p-5 rounded-2xl bg-[#EAF0EB]/80 border border-[#4A6B53]/30 flex items-start gap-4">
        <div className="w-8 h-8 rounded-full bg-[#4A6B53] text-white flex items-center justify-center font-bold text-sm shrink-0">
          💡
        </div>
        <div className="space-y-1 text-sm text-stone-800">
          <span className="font-bold text-[#4A6B53]">The Coordinator Principle:</span>
          <p className="leading-relaxed">
            The coordinator dashboard does not police teachers or track compliance quotas ("Teacher X hasn’t uploaded 3 files").
            Instead, we surface <strong className="text-stone-900 font-semibold">emerging patterns, collective breakthroughs, and shared pedagogical struggles</strong> for constructive dialogue.
          </p>
        </div>
      </div>

      {/* School Signals (Emerging Patterns for Conversation) */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#C88A2E]">
              Collective Diagnostics
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal">
              School Signals & Emerging Themes
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Patterns identified across educator field notes, reflections, and moments.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {signals.map((sig) => (
            <div
              key={sig.id}
              className="p-5 rounded-xl border border-stone-200/80 bg-[#FAF9F5] hover:bg-stone-50 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-stone-200 text-stone-700 capitalize">
                  {sig.type}
                </span>
                <span className="text-sm font-editorial font-bold text-[#4A6B53]">
                  {sig.count} teachers noting this
                </span>
              </div>

              <h3 className="font-editorial text-xl font-normal text-stone-900">
                {sig.topic}
              </h3>

              <p className="text-xs text-stone-700 leading-relaxed font-normal">
                {sig.note}
              </p>

              <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
                <span>Recommended next action:</span>
                <span className="font-semibold text-[#4A6B53]">Agenda for Practice Circle</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Contributions Nominated for the Annual Dossier */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Living Curation
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal">
              Contributions Nominated for the School Dossier
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              {dossierNominated.length} items flagged by teachers for inclusion in the annual publication.
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('dossier')}
            className="text-xs font-semibold text-[#4A6B53] hover:underline flex items-center gap-1"
          >
            <span>Preview Annual Book</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3">
          {dossierNominated.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl border border-stone-200 bg-[#FAF9F5] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded-full bg-stone-200 text-stone-800">
                    {item.type}
                  </span>
                  <span className="text-xs font-semibold text-stone-900">{item.authorName}</span>
                  <span className="text-xs text-stone-500">({item.authorRole})</span>
                </div>
                <div className="text-sm font-semibold text-stone-900">{item.title}</div>
                <p className="text-xs text-stone-600 line-clamp-1 italic">
                  "{item.whyDoesThisMatter || item.description}"
                </p>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-center">
                <span className="text-xs font-medium text-[#4A6B53] bg-[#EAF0EB] px-2.5 py-1 rounded-md">
                  ✓ Ready for Book
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
