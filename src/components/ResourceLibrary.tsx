import React, { useState } from 'react';
import { FolderOpen, BookOpen, Clock, ArrowRight, X, Sparkles, Check } from 'lucide-react';
import { ResourceItem } from '../types';

interface ResourceLibraryProps {
  resources: ResourceItem[];
}

export const ResourceLibrary: React.FC<ResourceLibraryProps> = ({ resources }) => {
  const [selectedResource, setSelectedResource] = useState<ResourceItem | null>(null);
  const [activeThemeFilter, setActiveThemeFilter] = useState<string>('ALL');

  const themes = ['ALL', ...Array.from(new Set(resources.map((r) => r.theme)))];

  const filtered = resources.filter((r) => {
    if (activeThemeFilter === 'ALL') return true;
    return r.theme === activeThemeFilter;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
          Contextual Field Guides
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
          Resource Library
        </h1>
        <p className="font-editorial italic text-stone-700 text-base sm:text-lg mt-2">
          "Not a file repository, but actionable companions for classroom practice, somatic awareness, and reflection."
        </p>

        {/* Theme Filters */}
        <div className="mt-6 pt-5 border-t border-stone-200 flex items-center gap-2 overflow-x-auto">
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setActiveThemeFilter(t)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                activeThemeFilter === t
                  ? 'bg-[#252525] text-white'
                  : 'bg-[#FAF9F5] text-stone-600 hover:bg-stone-200 border border-stone-200/80'
              }`}
            >
              {t === 'ALL' ? 'All Inquiries' : t}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Resources */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-4"
          >
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF0EB] text-[#4A6B53]">
                  {item.type}
                </span>
                <span className="text-xs text-stone-500 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{item.readTime}</span>
                </span>
              </div>

              <h3 className="font-editorial text-2xl text-[#252525] font-normal leading-snug">
                {item.title}
              </h3>

              <div className="text-xs text-[#C88A2E] font-medium">
                Theme: {item.theme} · {item.role}
              </div>

              <p className="text-sm text-stone-600 leading-relaxed font-normal">
                {item.summary}
              </p>
            </div>

            <button
              onClick={() => setSelectedResource(item)}
              className="pt-4 border-t border-stone-200 w-full flex items-center justify-between text-xs font-semibold text-[#4A6B53] hover:text-[#3d5945] transition-colors"
            >
              <span>Read Full Field Guide</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* Resource Detail Modal */}
      {selectedResource && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#252525]/40 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl bg-[#F8F7F3] rounded-2xl border border-stone-300 shadow-xl overflow-hidden max-h-[85vh] flex flex-col">
            <div className="flex items-center justify-between px-6 py-4 border-b border-stone-200 bg-[#F4F1EA]">
              <div>
                <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
                  {selectedResource.type}
                </span>
                <h2 className="font-editorial text-2xl text-[#252525] font-normal">
                  {selectedResource.title}
                </h2>
              </div>
              <button
                onClick={() => setSelectedResource(null)}
                className="p-1.5 text-stone-500 rounded-lg hover:bg-stone-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4 text-sm text-stone-800 leading-relaxed">
              <div className="p-3 rounded-lg bg-[#FAF9F5] border border-stone-200 text-xs text-stone-600">
                <span className="font-semibold text-stone-900">Theme:</span> {selectedResource.theme} ·{' '}
                <span className="font-semibold text-stone-900">Role:</span> {selectedResource.role}
              </div>

              <div className="whitespace-pre-line font-sans text-stone-800 space-y-3">
                {selectedResource.content}
              </div>
            </div>

            <div className="p-4 border-t border-stone-200 bg-[#F4F1EA] flex justify-end">
              <button
                onClick={() => setSelectedResource(null)}
                className="px-4 py-2 text-xs font-semibold bg-[#252525] text-white rounded-lg hover:bg-black"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
