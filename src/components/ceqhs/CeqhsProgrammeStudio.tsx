import React, { useState } from 'react';
import {
  ArrowLeft,
  Sparkles,
  BookOpen,
  Layers,
  FileCheck2,
  Compass,
  Download,
  Plus,
  Play,
  HeartHandshake,
  Brain,
  MessageSquare,
} from 'lucide-react';

interface CeqhsProgrammeStudioProps {
  onBack: () => void;
  onOpenCardsApp: () => void;
  onOpenKnowledgeBase: () => void;
}

export const CeqhsProgrammeStudio: React.FC<CeqhsProgrammeStudioProps> = ({
  onBack,
  onOpenCardsApp,
  onOpenKnowledgeBase,
}) => {
  const [activeTab, setActiveTab] = useState<'cards' | 'rubrics' | 'pacing'>('cards');

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-1 text-xs font-semibold text-[#4A6B53] hover:text-[#1B3626] mb-2 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Workspaces</span>
          </button>
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-[#EAF0EB] text-[#4A6B53] flex items-center justify-center shrink-0">
              <Layers className="w-5 h-5 stroke-[1.75]" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
                Programme Studio
              </h1>
              <p className="text-xs text-stone-500 mt-0.5">
                Curate emotional intelligence classroom practices, living journal rubrics, and curricular micro-pauses.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Modal Triggers */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenCardsApp}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#4A6B53] hover:bg-[#3D5B45] text-white text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-100" />
            Launch Cards App
          </button>
          <button
            onClick={onOpenKnowledgeBase}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-medium shadow-2xs transition-colors cursor-pointer"
          >
            <BookOpen className="w-4 h-4 text-stone-400" />
            Knowledge Base
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex gap-2 mt-6 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveTab('cards')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'cards'
              ? 'bg-[#4A6B53] text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Classroom Practice Cards
        </button>
        <button
          onClick={() => setActiveTab('rubrics')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'rubrics'
              ? 'bg-[#4A6B53] text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          10 Quality Dimensions Rubric Studio
        </button>
        <button
          onClick={() => setActiveTab('pacing')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
            activeTab === 'pacing'
              ? 'bg-[#4A6B53] text-white'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          Curricular Pacing &amp; Audio Journals
        </button>
      </div>

      {/* Tab Contents */}
      {activeTab === 'cards' && (
        <div className="mt-8 space-y-6">
          <div className="bg-emerald-50/60 border border-emerald-200/80 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-emerald-950">
                CEQHS Living Practice Deck · 2026 Edition
              </h3>
              <p className="text-xs text-emerald-800 mt-1 max-w-2xl leading-relaxed">
                Empirical micro-pauses, restorative inquiry scripts, and somatic down-regulation routines designed for high school educators.
              </p>
            </div>
            <button
              onClick={onOpenCardsApp}
              className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-bold shadow-xs hover:bg-emerald-900 shrink-0"
            >
              Open Interactive Flipper
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-emerald-700/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold text-sm mb-3">
                <Brain className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700">
                Emotional Regulation
              </span>
              <h4 className="text-sm font-bold text-stone-900 mt-1">The 90-Second Micro-Pause</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Stillness prompt before cognitively demanding tasks. Down-regulates classroom nervous systems.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-teal-700/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-700 flex items-center justify-center font-bold text-sm mb-3">
                <MessageSquare className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700">
                Classroom Dialogue
              </span>
              <h4 className="text-sm font-bold text-stone-900 mt-1">Curious Inquiry Over Correction</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Post-conflict de-escalation dialogue. Replaces punitive reflex with relational empathy.
              </p>
            </div>

            <div className="bg-white rounded-2xl border border-stone-200 p-5 shadow-2xs hover:border-amber-700/50 transition-colors">
              <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center font-bold text-sm mb-3">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">
                Empathy &amp; Regard
              </span>
              <h4 className="text-sm font-bold text-stone-900 mt-1">The Relational Regard Greeting</h4>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                Whole-human recognition protocol before curriculum delivery. Lowers threat response.
              </p>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'rubrics' && (
        <div className="mt-8 space-y-4">
          <div className="p-4 bg-white rounded-2xl border border-stone-200">
            <h3 className="text-sm font-bold text-stone-900 mb-1">
              Accreditation Rubric Dimensions (Chapters 1–10)
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Formal assessment criteria used by CEQHS peer reviewers to audit institutional living dossiers.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { no: '01', title: 'Institutional Vision & Intent', tag: 'Core Governance' },
                { no: '02', title: 'Emotional Safety & Physical Environments', tag: 'Campus Atmosphere' },
                { no: '03', title: 'Classroom Micro-Pauses & Dialogue', tag: 'Pedagogy' },
                { no: '04', title: 'Teacher Reflective Capacity', tag: 'Staff Wellness' },
                { no: '05', title: 'Curricular Emotional Weaving', tag: 'Instruction' },
                { no: '06', title: 'Student Vulnerability & Expression', tag: 'Learner Voice' },
                { no: '07', title: 'Restorative Conflict Resolution', tag: 'Discipline & Culture' },
                { no: '08', title: 'Family & Guardian Regard', tag: 'Community Engagement' },
                { no: '09', title: 'Continuous Growth Evidence', tag: 'Triangulation' },
                { no: '10', title: 'Longitudinal Impact Signals', tag: 'Endline Synthesis' },
              ].map((r) => (
                <div key={r.no} className="p-3 bg-stone-50 rounded-xl border border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-mono font-bold text-emerald-800 mr-2">CH {r.no}</span>
                    <span className="text-xs font-bold text-stone-900">{r.title}</span>
                  </div>
                  <span className="text-[10px] text-stone-500 bg-white px-2 py-0.5 rounded border border-stone-200">
                    {r.tag}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'pacing' && (
        <div className="mt-8 bg-white rounded-2xl border border-stone-200 p-6">
          <h3 className="text-sm font-bold text-stone-900 mb-2">30-Week Living Journal Implementation Arc</h3>
          <p className="text-xs text-stone-600 mb-6 leading-relaxed">
            Secondary schools progress through four structured developmental phases, pacing practice entries and artifact uploads.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Phase 1 · Weeks 1-6</span>
              <h4 className="text-xs font-bold text-stone-900">Foundations &amp; Micro-Pauses</h4>
              <p className="text-[11px] text-stone-500 mt-1">Grounding protocols, safety baselines, and initial survey captures.</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Phase 2 · Weeks 7-14</span>
              <h4 className="text-xs font-bold text-stone-900">Classroom Dialogue &amp; Regard</h4>
              <p className="text-[11px] text-stone-500 mt-1">Deep inquiry routines, peer coaching circles, and mid-point checks.</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Phase 3 · Weeks 15-22</span>
              <h4 className="text-xs font-bold text-stone-900">Restorative Practice Integration</h4>
              <p className="text-[11px] text-stone-500 mt-1">Conflict resolution artifacts, student voice audio logs, and rubrics.</p>
            </div>
            <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
              <span className="text-[10px] font-bold text-emerald-800 uppercase block mb-1">Phase 4 · Weeks 23-30</span>
              <h4 className="text-xs font-bold text-stone-900">Dossier Synthesis &amp; Accreditation</h4>
              <p className="text-[11px] text-stone-500 mt-1">Full 10-chapter living dossier review and peer evaluation.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
