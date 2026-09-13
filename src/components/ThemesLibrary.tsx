import React, { useState } from 'react';
import {
  Compass,
  ArrowRight,
  Plus,
  BookOpen,
  CheckCircle2,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Theme, EntryType } from '../types';

interface ThemesLibraryProps {
  themes: Theme[];
  onOpenCaptureForTheme: (themeId: string, type: EntryType) => void;
  selectedThemeId?: string;
}

export const ThemesLibrary: React.FC<ThemesLibraryProps> = ({
  themes,
  onOpenCaptureForTheme,
  selectedThemeId,
}) => {
  const [expandedThemeId, setExpandedThemeId] = useState<string>(
    selectedThemeId || themes[0]?.id || ''
  );

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
          Curriculum of Human Skills
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
          CEQHS Theme Inquiries
        </h1>
        <p className="font-editorial italic text-stone-700 text-base sm:text-lg mt-2 max-w-2xl">
          "Each theme is framed as a central inquiry rather than a compliance checklist. Notice, pause, and experiment in your classroom."
        </p>
      </div>

      {/* Themes List */}
      <div className="space-y-6">
        {themes.map((theme) => {
          const isExpanded = expandedThemeId === theme.id;

          return (
            <section
              key={theme.id}
              className={`bg-white border rounded-2xl transition-all shadow-2xs overflow-hidden ${
                isExpanded ? 'border-[#4A6B53] ring-1 ring-[#4A6B53]' : 'border-stone-200'
              }`}
            >
              {/* Theme Collapsible Header */}
              <div
                onClick={() => setExpandedThemeId(isExpanded ? '' : theme.id)}
                className="p-6 sm:p-7 cursor-pointer hover:bg-stone-50/70 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-[#EAF0EB] text-[#4A6B53]">
                      {theme.category}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      Core CEQHS Theme
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#252525]">
                    {theme.title}
                  </h2>

                  <p className="font-editorial italic text-lg sm:text-xl text-[#4A6B53]">
                    "{theme.question}"
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onOpenCaptureForTheme(theme.id, 'practice');
                    }}
                    className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-colors flex items-center gap-1.5 shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Practise this</span>
                  </button>

                  <div className="p-2 text-stone-400 rounded-lg hover:bg-stone-200">
                    {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                  </div>
                </div>
              </div>

              {/* Expanded Theme Details */}
              {isExpanded && (
                <div className="p-6 sm:p-8 pt-0 border-t border-stone-200 bg-[#FAF9F5]/40 space-y-6">
                  {/* Overview & Why it Matters */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                    <div className="space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
                        The Core Inquiry
                      </span>
                      <p className="text-sm text-stone-700 leading-relaxed">
                        {theme.overview}
                      </p>
                    </div>

                    <div className="space-y-2 p-4 rounded-xl bg-[#F8EDE9]/60 border border-[#C45D3E]/20">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C45D3E]">
                        Why this matters
                      </span>
                      <p className="text-sm text-stone-800 leading-relaxed font-editorial italic">
                        "{theme.whyItMatters}"
                      </p>
                    </div>
                  </div>

                  {/* Practise Steps (ACT / EAR practice cycle) */}
                  <div className="p-5 rounded-xl bg-white border border-stone-200 space-y-3">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#4A6B53] block">
                      The Classroom Practice Cycle
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {theme.practiseSteps.map((step, idx) => (
                        <div
                          key={idx}
                          className="p-3 rounded-lg bg-[#FAF9F5] border border-stone-200/80 flex items-start gap-2.5 text-xs text-stone-800"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#EAF0EB] text-[#4A6B53] font-bold flex items-center justify-center shrink-0 text-[10px]">
                            {idx + 1}
                          </span>
                          <span className="leading-snug">{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Reflect & Evidence Ideas */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Reflect Prompt */}
                    <div className="p-5 rounded-xl bg-[#FAF3E7] border border-[#C88A2E]/30 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#C88A2E] block">
                        Reflection Prompt
                      </span>
                      <p className="font-editorial italic text-stone-900 text-base">
                        "{theme.reflectPrompt}"
                      </p>
                      <button
                        onClick={() => onOpenCaptureForTheme(theme.id, 'reflection')}
                        className="mt-2 text-xs font-semibold text-[#C88A2E] hover:underline block"
                      >
                        + Record a reflection on this prompt →
                      </button>
                    </div>

                    {/* Evidence Ideas */}
                    <div className="p-5 rounded-xl bg-[#EBF2F6] border border-[#3F6C8A]/30 space-y-2">
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#3F6C8A] block">
                        What Evidence Looks Like
                      </span>
                      <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                        {theme.evidenceIdeas.map((idea, idx) => (
                          <li key={idx}>{idea}</li>
                        ))}
                      </ul>
                      <button
                        onClick={() => onOpenCaptureForTheme(theme.id, 'evidence')}
                        className="mt-2 text-xs font-semibold text-[#3F6C8A] hover:underline block"
                      >
                        + Add evidence artifact →
                      </button>
                    </div>
                  </div>

                  {/* Related Themes & Practices */}
                  <div className="pt-2 flex items-center gap-2 text-xs text-stone-600">
                    <span className="font-medium text-stone-500">Related Inquiries:</span>
                    {theme.relatedPractices.map((rp, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-sm bg-stone-100 border border-stone-200 text-stone-700 font-medium"
                      >
                        {rp}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};
