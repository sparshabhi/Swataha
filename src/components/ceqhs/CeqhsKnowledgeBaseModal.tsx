import React, { useState } from 'react';
import { X, BookOpen, Search, Download, CheckCircle2, ChevronRight, FileText, Sparkles, ExternalLink } from 'lucide-react';
import { triggerBlobDownload } from '../../utils/impactDocumentGenerator';

interface KnowledgeDoc {
  id: string;
  category: 'Accreditation Standards' | 'Evidence Guide' | 'Facilitator Manuals' | 'Research & Science';
  title: string;
  summary: string;
  chapters: string[];
  lastUpdated: string;
  downloadSize: string;
}

const KNOWLEDGE_DOCS: KnowledgeDoc[] = [
  {
    id: 'doc-1',
    category: 'Accreditation Standards',
    title: 'CEQHS 10-Chapter Living Dossier Rubrics (2026 Edition)',
    summary: 'The formal accreditation framework for evaluating emotional regulation, classroom dialogue, and school-wide developmental signals.',
    chapters: ['Chapter 1: Institutional Intent', 'Chapter 2: Relational Safety', 'Chapter 3: Reflective Practice'],
    lastUpdated: 'August 2026',
    downloadSize: '2.4 MB PDF',
  },
  {
    id: 'doc-2',
    category: 'Evidence Guide',
    title: 'Classroom Artifact Verification & Media Safeguarding Guide',
    summary: 'Best practices for capturing micro-pauses, anonymizing student reflection logs, and compiling tamper-evident audio journals.',
    chapters: ['Section A: Privacy & Consents', 'Section B: Qualitative Descriptors', 'Section C: Triangulation'],
    lastUpdated: 'September 2026',
    downloadSize: '1.8 MB PDF',
  },
  {
    id: 'doc-3',
    category: 'Facilitator Manuals',
    title: 'School Coordinator & EQ Lead Playbook',
    summary: 'Step-by-step guidance for launching the 30-week implementation roadmap and facilitating monthly peer-coaching circles.',
    chapters: ['Module 1: Orientation', 'Module 2: Pacing & Checkpoints', 'Module 3: Endline Synthesis'],
    lastUpdated: 'July 2026',
    downloadSize: '3.1 MB PDF',
  },
  {
    id: 'doc-4',
    category: 'Research & Science',
    title: 'Neurobiological Foundations of Emotional Quality in Secondary Education',
    summary: 'The empirical research grounding CEQHS, synthesized by Swataha research fellows and international neuro-education specialists.',
    chapters: ['Part 1: Amygdala Regulation', 'Part 2: Prefrontal Engagement', 'Part 3: Longitudinal Indicators'],
    lastUpdated: 'May 2026',
    downloadSize: '4.5 MB PDF',
  },
];

interface CeqhsKnowledgeBaseModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CeqhsKnowledgeBaseModal: React.FC<CeqhsKnowledgeBaseModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const filteredDocs = KNOWLEDGE_DOCS.filter((doc) => {
    const matchesCat = selectedCategory === 'all' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.summary.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleDownload = (doc: KnowledgeDoc) => {
    const docContent = `# CEQHS LIVING JOURNEY OFFICIAL PUBLICATION
Category: ${doc.category}
Title: ${doc.title}
Published: ${doc.lastUpdated}

## Overview
${doc.summary}

## Key Chapters & Modules
${doc.chapters.map((ch, idx) => `${idx + 1}. ${ch}`).join('\n')}

---
### Accreditation & Governance Notice
This official document is governed by the Swataha CEQHS Living Journey Platform accreditation guidelines. All contents are proprietary and provided to authorized partner institutions for continuous socio-emotional and institutional development.

Chief Program Architect: Saugat Singh Saud
Document ID: CEQHS-KB-${doc.id.toUpperCase()}
`;
    const blob = new Blob([docContent], { type: 'text/markdown;charset=utf-8;' });
    const filename = `${doc.title.replace(/[^a-zA-Z0-9_-]/g, '_')}.md`;
    triggerBlobDownload(blob, filename);

    setDownloadSuccess(doc.title);
    setTimeout(() => {
      setDownloadSuccess(null);
    }, 2500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative animate-in fade-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-50 border border-sky-300 text-sky-600 flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 tracking-tight">
                CEQHS Knowledge Base &amp; Standards
              </h2>
              <p className="text-xs text-stone-500">
                Official rubrics, evidence guidelines, and facilitator playbooks
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-stone-400 hover:text-stone-700 rounded-xl hover:bg-stone-100 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filters */}
        <div className="mt-4 flex flex-col sm:flex-row gap-2.5 shrink-0">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search standards, rubrics, guides..."
              className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:border-sky-500"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {['all', 'Accreditation Standards', 'Evidence Guide', 'Facilitator Manuals'].map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? 'bg-[#00A3C4] text-white'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {cat === 'all' ? 'All Resources' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* Download Alert */}
        {downloadSuccess && (
          <div className="mt-3 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-center gap-2 shrink-0">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Downloaded official package: <strong>{downloadSuccess}</strong></span>
          </div>
        )}

        {/* Document List */}
        <div className="mt-4 overflow-y-auto pr-1 space-y-3 flex-1">
          {filteredDocs.map((doc) => (
            <div
              key={doc.id}
              className="p-4 rounded-2xl border border-stone-200 hover:border-sky-300 bg-white hover:bg-sky-50/20 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs"
            >
              <div className="space-y-1 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-sky-50 text-sky-700 border border-sky-100">
                    {doc.category}
                  </span>
                  <span className="text-[11px] text-stone-400">Updated {doc.lastUpdated}</span>
                </div>
                <h3 className="text-sm font-bold text-stone-900">{doc.title}</h3>
                <p className="text-xs text-stone-600 leading-relaxed">{doc.summary}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {doc.chapters.map((chap, i) => (
                    <span key={i} className="text-[10px] text-stone-500 bg-stone-100 px-2 py-0.5 rounded">
                      {chap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="sm:text-right shrink-0 flex sm:flex-col items-center sm:items-end justify-between gap-2">
                <span className="text-[11px] text-stone-400">{doc.downloadSize}</span>
                <button
                  onClick={() => handleDownload(doc)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  Download
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer info */}
        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 shrink-0">
          <span>Continuous Emotional Quality Accreditation Framework · Swataha</span>
          <span className="flex items-center gap-1 text-sky-600 cursor-pointer hover:underline">
            View Live API Schema <ExternalLink className="w-3 h-3" />
          </span>
        </div>
      </div>
    </div>
  );
};
