import React, { useState } from 'react';
import { Calendar as CalendarIcon, Clock, CheckCircle, Tag, ArrowRight } from 'lucide-react';
import { CalendarEvent } from '../types';

interface JourneyCalendarProps {
  events: CalendarEvent[];
}

export const JourneyCalendar: React.FC<JourneyCalendarProps> = ({ events }) => {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredEvents = events.filter((evt) => {
    if (filterType === 'ALL') return true;
    return evt.type === filterType;
  });

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
          Annual Rhythm
        </span>
        <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
          Journey Calendar
        </h1>
        <p className="font-editorial italic text-stone-700 text-base sm:text-lg mt-2">
          "Three synchronized rhythms guide our school year: Learn, Practise, and Reflect."
        </p>

        {/* Filter Pills */}
        <div className="mt-6 pt-5 border-t border-stone-200 flex items-center gap-2 overflow-x-auto">
          {[
            { id: 'ALL', label: 'All Calendar Events' },
            { id: 'LEARN', label: '📘 LEARN: Workshops & PD' },
            { id: 'PRACTISE', label: '🌱 PRACTISE: Classroom Windows' },
            { id: 'REFLECT', label: '💡 REFLECT: School Checkpoints' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterType(tab.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterType === tab.id
                  ? 'bg-[#252525] text-white shadow-xs'
                  : 'bg-[#FAF9F5] text-stone-600 hover:bg-stone-200 border border-stone-200/80'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-4">
        {filteredEvents.map((evt) => (
          <div
            key={evt.id}
            className="bg-white border border-stone-200 rounded-2xl p-6 shadow-2xs hover:shadow-xs transition-all flex flex-col sm:flex-row sm:items-start gap-5"
          >
            {/* Left Date Block */}
            <div className="sm:w-28 shrink-0 text-left sm:text-center p-3 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
              <span className="block text-2xl font-bold font-editorial text-stone-900 leading-none">
                {evt.monthDay.split(' ')[0]}
              </span>
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                {evt.monthDay.split(' ')[1]} 2026
              </span>
              <span
                className={`mt-2 inline-block text-[9px] font-bold px-2 py-0.5 rounded-sm uppercase tracking-wider ${
                  evt.type === 'LEARN'
                    ? 'bg-blue-100 text-blue-800'
                    : evt.type === 'PRACTISE'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-amber-100 text-amber-800'
                }`}
              >
                {evt.type}
              </span>
            </div>

            {/* Right Event Content */}
            <div className="flex-1 space-y-3">
              <div>
                <h3 className="text-xl font-bold text-[#252525]">{evt.title}</h3>
                {evt.relatedTheme && (
                  <span className="text-xs font-medium text-[#4A6B53] block mt-0.5">
                    Theme Focus: {evt.relatedTheme}
                  </span>
                )}
              </div>

              <p className="text-sm text-stone-700 leading-relaxed font-normal">
                {evt.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2 text-xs">
                {evt.preparation && (
                  <div className="p-3 rounded-lg bg-[#FAF9F5] border border-stone-200/80 space-y-1">
                    <span className="font-semibold text-stone-700 uppercase tracking-wider text-[10px] block">
                      Preparation
                    </span>
                    <span className="text-stone-800">{evt.preparation}</span>
                  </div>
                )}
                {evt.expectedAction && (
                  <div className="p-3 rounded-lg bg-[#EAF0EB]/60 border border-[#4A6B53]/20 space-y-1">
                    <span className="font-semibold text-[#4A6B53] uppercase tracking-wider text-[10px] block">
                      Expected Action
                    </span>
                    <span className="text-stone-800">{evt.expectedAction}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
