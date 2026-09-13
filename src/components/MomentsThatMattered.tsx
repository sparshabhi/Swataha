import React, { useState } from 'react';
import {
  Sparkles,
  Plus,
  Heart,
  MessageSquare,
  Lightbulb,
  Sprout,
  RefreshCw,
  BookOpen,
  Lock,
  Users,
  CheckCircle2,
  Filter,
} from 'lucide-react';
import { JourneyEntry, MomentCategory, User } from '../types';

interface MomentsThatMatteredProps {
  entries: JourneyEntry[];
  currentUser: User;
  onOpenCapture: (category?: MomentCategory) => void;
  onToggleDossierInclusion: (entryId: string) => void;
}

const CATEGORIES: { category: MomentCategory | 'ALL'; emoji: string; label: string; color: string }[] = [
  { category: 'ALL', emoji: '🌟', label: 'All Moments', color: 'bg-stone-100 text-stone-800' },
  { category: 'Connection', emoji: '💬', label: 'Connection', color: 'bg-[#EBF2F6] text-[#3F6C8A]' },
  { category: 'Belonging', emoji: '❤️', label: 'Belonging', color: 'bg-[#F8EDE9] text-[#C45D3E]' },
  { category: 'Insight', emoji: '💡', label: 'Insight', color: 'bg-[#FAF3E7] text-[#C88A2E]' },
  { category: 'Growth', emoji: '🌱', label: 'Growth', color: 'bg-[#EAF0EB] text-[#4A6B53]' },
  { category: 'Change', emoji: '🔄', label: 'Change', color: 'bg-stone-100 text-stone-700' },
  { category: 'Surprise', emoji: '✨', label: 'Surprise', color: 'bg-amber-50 text-amber-800' },
];

export const MomentsThatMattered: React.FC<MomentsThatMatteredProps> = ({
  entries,
  currentUser,
  onOpenCapture,
  onToggleDossierInclusion,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<MomentCategory | 'ALL'>('ALL');

  // Filter for moment entries
  const moments = entries.filter((e) => e.type === 'moment');
  const filteredMoments = moments.filter((m) => {
    if (selectedCategory === 'ALL') return true;
    return m.momentCategory === selectedCategory;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Signature Banner */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs relative overflow-hidden">
        <div className="max-w-2xl">
          <span className="text-xs uppercase tracking-wider font-semibold text-[#C45D3E]">
            The Signature Experience
          </span>
          <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
            Moments That Mattered
          </h1>
          <p className="font-editorial italic text-stone-700 text-base sm:text-lg mt-2 leading-relaxed">
            "Not everything meaningful is a formal piece of evidence. Capture small human moments: an apology, a hesitant voice, an emotional pause."
          </p>
        </div>

        {/* The Friday Afternoon Invitation Prompt Card */}
        <div className="mt-6 p-4 rounded-xl bg-[#FAF9F5] border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-0.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-stone-500">
              Weekly Reflection Prompt
            </span>
            <p className="text-sm font-semibold text-stone-900">
              Something from this week is worth remembering. What made you pause?
            </p>
          </div>
          <button
            onClick={() => onOpenCapture('Belonging')}
            className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-colors flex items-center gap-1.5 shrink-0 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Capture a Moment</span>
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="mt-6 pt-5 border-t border-stone-200 flex items-center gap-2 overflow-x-auto pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.category}
              onClick={() => setSelectedCategory(cat.category)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 whitespace-nowrap transition-all ${
                selectedCategory === cat.category
                  ? 'bg-[#252525] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-stone-600 hover:bg-stone-200 border border-stone-200/80'
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
              {cat.category !== 'ALL' && (
                <span className="text-[10px] opacity-70">
                  ({moments.filter((m) => m.momentCategory === cat.category).length})
                </span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Moments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredMoments.map((moment) => (
          <article
            key={moment.id}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              {/* Category & Date Header */}
              <div className="flex items-center justify-between">
                <span
                  className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                    moment.momentCategory === 'Belonging'
                      ? 'bg-[#F8EDE9] text-[#C45D3E]'
                      : moment.momentCategory === 'Connection'
                      ? 'bg-[#EBF2F6] text-[#3F6C8A]'
                      : moment.momentCategory === 'Insight'
                      ? 'bg-[#FAF3E7] text-[#C88A2E]'
                      : 'bg-[#EAF0EB] text-[#4A6B53]'
                  }`}
                >
                  {moment.momentCategory === 'Belonging' && '❤️ Belonging'}
                  {moment.momentCategory === 'Connection' && '💬 Connection'}
                  {moment.momentCategory === 'Insight' && '💡 Insight'}
                  {moment.momentCategory === 'Growth' && '🌱 Growth'}
                  {moment.momentCategory === 'Change' && '🔄 Change'}
                  {moment.momentCategory === 'Surprise' && '✨ Surprise'}
                </span>

                <span className="text-xs text-stone-500">{moment.date}</span>
              </div>

              {/* Title */}
              <h3 className="font-editorial text-2xl text-[#252525] font-normal leading-snug">
                {moment.title}
              </h3>

              {/* Story */}
              <p className="text-sm text-stone-700 leading-relaxed font-normal">
                "{moment.description}"
              </p>

              {/* Why does this matter? (The Signature Box) */}
              {moment.whyDoesThisMatter && (
                <div className="p-4 rounded-xl bg-[#FAF9F5] border-l-4 border-[#C88A2E] text-stone-800 space-y-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#C88A2E] block">
                    Why does this matter?
                  </span>
                  <p className="font-editorial italic text-stone-800 text-sm leading-relaxed">
                    "{moment.whyDoesThisMatter}"
                  </p>
                </div>
              )}
            </div>

            {/* Card Footer: Author, Theme, Dossier Status */}
            <div className="pt-4 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
              <div>
                <span className="font-semibold text-stone-900">{moment.authorName}</span>
                <span className="text-[11px] text-stone-500 block">{moment.themeTitle}</span>
              </div>

              <button
                onClick={() => onToggleDossierInclusion(moment.id)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-medium border transition-colors ${
                  moment.includedInDossier
                    ? 'bg-[#EAF0EB] text-[#4A6B53] border-[#4A6B53]/30'
                    : 'bg-stone-100 text-stone-500 border-stone-200 hover:text-stone-800'
                }`}
              >
                {moment.includedInDossier ? '✓ In School Dossier' : '+ Add to Dossier'}
              </button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
