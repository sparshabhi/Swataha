import React, { useState } from 'react';
import {
  BookOpen,
  Filter,
  Clock,
  CheckCircle2,
  AlertCircle,
  Users,
  Search,
  Sparkles,
  ChevronRight,
  X,
  ShieldAlert,
  Layers,
} from 'lucide-react';
import { CANON_ACTIVITIES, SwataraPlanActivity } from '../../data/swataraDemoData';

export const CeqhsActivityLibraryView: React.FC = () => {
  const [activities] = useState<SwataraPlanActivity[]>(CANON_ACTIVITIES);
  const [selectedActivity, setSelectedActivity] = useState<SwataraPlanActivity | null>(null);
  const [selectedDomain, setSelectedDomain] = useState<string>('All');
  const [selectedAudience, setSelectedAudience] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const domains = [
    'All',
    'Self-Awareness',
    'Self-Regulation',
    'Social Awareness',
    'Relationship Skills',
    'Responsible Decision-Making / Values-in-Action',
  ];

  const filtered = activities.filter((act) => {
    if (selectedDomain !== 'All' && act.domain !== selectedDomain) return false;
    if (selectedAudience === 'learners' && act.targetAudience !== 'primary_learners') return false;
    if (selectedAudience === 'adults' && act.targetAudience === 'primary_learners') return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        act.title.toLowerCase().includes(q) ||
        act.purpose.toLowerCase().includes(q) ||
        act.curriculumConnection.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.6 Program Library
              </span>
              <span className="text-xs text-stone-500 font-medium">
                16-Field Canonical Specification
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              Classroom &amp; Adult Practice Library
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-2xl">
              Concrete routines, micro-pauses, circles, and adult reflective practices designed for primary learners (Grades 1–5) and faculty.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-stone-100 text-stone-700">
              {filtered.length} of {activities.length} Practices
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex flex-wrap items-center gap-4 pt-5">
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search practices, materials, or curriculum hooks..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-stone-200 bg-stone-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-[#1B3626]"
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto">
            {['All', 'learners', 'adults'].map((aud) => (
              <button
                key={aud}
                onClick={() => setSelectedAudience(aud)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-colors cursor-pointer ${
                  selectedAudience === aud
                    ? 'bg-[#1B3626] text-white'
                    : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                }`}
              >
                {aud === 'learners' ? 'Primary Learners' : aud === 'adults' ? 'Adult Faculty' : 'All Audiences'}
              </button>
            ))}
          </div>
        </div>

        {/* Domain Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pt-3">
          {domains.map((dom) => (
            <button
              key={dom}
              onClick={() => setSelectedDomain(dom)}
              className={`px-3 py-1 rounded-md text-xs whitespace-nowrap transition-colors cursor-pointer ${
                selectedDomain === dom
                  ? 'bg-stone-800 text-white font-medium'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              {dom}
            </button>
          ))}
        </div>
      </div>

      {/* Activities Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {filtered.map((act) => (
          <div
            key={act.id}
            onClick={() => setSelectedActivity(act)}
            className="p-6 rounded-2xl border border-stone-200 bg-white hover:border-stone-300 hover:shadow-xs transition-all cursor-pointer flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between gap-3 mb-2">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#EAF0EB] text-[#1B3626]">
                    {act.domain}
                  </span>
                  <span className="ml-2 text-xs text-stone-500 font-medium">
                    Level: {act.developmentalLevel}
                  </span>
                </div>
                <span
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded ${
                    act.status === 'Approved for Pilot' || act.status === 'Active'
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-amber-100 text-amber-900'
                  }`}
                >
                  {act.status}
                </span>
              </div>

              <h3 className="text-base font-bold text-stone-900 mt-1">
                {act.title}
              </h3>

              <div className="text-xs text-stone-500 mt-1 flex items-center gap-3">
                <span>{act.gradeScope}</span>
                <span>•</span>
                <span>{act.duration}</span>
              </div>

              <p className="text-xs text-stone-600 mt-2.5 leading-relaxed line-clamp-3">
                {act.purpose}
              </p>
            </div>

            <div className="mt-5 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
              <span className="truncate max-w-[240px]">{act.curriculumConnection}</span>
              <span className="font-semibold text-[#1B3626] flex items-center gap-1 shrink-0">
                Full Facilitation <ChevronRight className="w-3 h-3" />
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Activity Detail Modal (All 16 Fields) */}
      {selectedActivity && (
        <div className="fixed inset-0 z-50 bg-stone-900/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[92vh] overflow-y-auto p-6 sm:p-8 space-y-6 shadow-2xl border border-stone-200">
            <div className="flex items-start justify-between gap-4 border-b border-stone-100 pb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-stone-500 uppercase tracking-wider">
                    {selectedActivity.id}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                    {selectedActivity.domain}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-stone-100 text-stone-700">
                    Level: {selectedActivity.developmentalLevel}
                  </span>
                </div>
                <h2 className="text-2xl font-bold text-stone-900">
                  {selectedActivity.title}
                </h2>
                <div className="text-xs text-stone-500 mt-1">
                  Audience: {selectedActivity.targetAudience.replace('_', ' ')} · {selectedActivity.gradeScope} · {selectedActivity.duration}
                </div>
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="p-1 rounded-lg hover:bg-stone-100 text-stone-500 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Purpose */}
            <div className="space-y-1">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                1. Purpose &amp; Competency
              </div>
              <p className="text-xs text-stone-700 leading-relaxed bg-[#FAF8F5] p-3.5 rounded-xl border border-stone-200/60">
                {selectedActivity.purpose}
              </p>
              <div className="text-[11px] text-stone-500 mt-1">
                <strong>Core Competency:</strong> {selectedActivity.competency}
              </div>
            </div>

            {/* Facilitation Instructions */}
            <div className="space-y-2">
              <div className="text-xs font-bold uppercase tracking-wider text-stone-500">
                2. Step-by-Step Facilitation Instructions
              </div>
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-2">
                {selectedActivity.facilitationInstructions.map((step, i) => (
                  <div key={i} className="text-xs text-stone-800 leading-relaxed">
                    {step}
                  </div>
                ))}
              </div>
            </div>

            {/* Materials & Curriculum Connection */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                <div className="text-xs font-bold text-stone-900">
                  3. Required Materials
                </div>
                <ul className="text-xs text-stone-600 space-y-1">
                  {selectedActivity.materials.map((mat, i) => (
                    <li key={i}>• {mat}</li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200/70 space-y-1.5">
                <div className="text-xs font-bold text-stone-900">
                  4. Curriculum Connection
                </div>
                <div className="text-xs text-stone-700">
                  {selectedActivity.curriculumConnection}
                </div>
                <div className="text-[11px] text-[#1B3626] font-semibold">
                  Type: {selectedActivity.connectionType}
                </div>
              </div>
            </div>

            {/* Accessibility & Cultural Adaptation */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 space-y-1">
                <div className="text-xs font-bold text-stone-900">
                  5. Accessibility Notes
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedActivity.accessibilityNotes}
                </p>
              </div>

              <div className="p-4 rounded-xl bg-[#FDFBF7] border border-stone-200 space-y-1">
                <div className="text-xs font-bold text-stone-900">
                  6. Cultural Adaptation Notes
                </div>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {selectedActivity.culturalAdaptationNotes}
                </p>
              </div>
            </div>

            {/* Adult Extension & Safety Notes */}
            <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/70 space-y-1 text-amber-950">
              <div className="text-xs font-bold flex items-center gap-1.5 text-amber-900">
                <ShieldAlert className="w-3.5 h-3.5" />
                7. Psychological Safety Notes
              </div>
              <p className="text-xs leading-relaxed">
                {selectedActivity.safetyNotes}
              </p>
              <div className="pt-2 text-xs border-t border-amber-200/50">
                <strong>Adult Practice Extension:</strong> {selectedActivity.adultPracticeExtension}
              </div>
            </div>

            {/* Footer / Meta */}
            <div className="pt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                Author: {selectedActivity.author} · {selectedActivity.version}
              </div>
              <button
                onClick={() => setSelectedActivity(null)}
                className="px-4 py-2 bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold rounded-xl cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
