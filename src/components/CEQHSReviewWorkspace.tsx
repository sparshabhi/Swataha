import React, { useState } from 'react';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Award,
  Sparkles,
  ArrowRight,
  Plus,
} from 'lucide-react';
import {
  CEQHSReviewCheckpoint,
  User,
  JourneyEntry,
} from '../types';

interface CEQHSReviewWorkspaceProps {
  currentUser: User;
  checkpoints: CEQHSReviewCheckpoint[];
  entries: JourneyEntry[];
  onAddReviewFeedback: (notes: string) => void;
}

export const CEQHSReviewWorkspace: React.FC<CEQHSReviewWorkspaceProps> = ({
  currentUser,
  checkpoints,
  entries,
  onAddReviewFeedback,
}) => {
  const [newNote, setNewNote] = useState('');
  const [isDesignated, setIsDesignated] = useState(true);

  const verificationCriteria = [
    { label: 'Living Journey documented throughout year', status: true },
    { label: 'Authentic educator participation across departments', status: true },
    { label: 'Classroom practice demonstrated & logged', status: true },
    { label: 'Regular reflection checkpoints completed', status: true },
    { label: 'School-level embedding & Before/Now shifts evidenced', status: true },
    { label: 'CEQHS developmental review dialogue held', status: true },
  ];

  const handlePostNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    onAddReviewFeedback(newNote);
    setNewNote('');
  };

  return (
    <div className="space-y-8 pb-12 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#3F6C8A]">
              <ShieldCheck className="w-4 h-4" />
              <span>CEQHS Review & Verification Workspace</span>
            </div>
            <h1 className="font-editorial text-3xl sm:text-4xl text-[#252525] font-normal tracking-tight mt-1">
              Developmental Anchor Review
            </h1>
            <p className="text-sm text-stone-600 mt-1">
              St. Jude Academy · Academic Year 2026–27 · Reviewer: {currentUser.name}
            </p>
          </div>

          <div className="p-3 bg-[#EAF0EB] rounded-xl border border-[#4A6B53]/30 text-right self-start sm:self-auto">
            <span className="text-[10px] uppercase font-bold text-[#4A6B53] block">
              Designation Status
            </span>
            <span className="text-sm font-bold text-stone-900">
              Verified Learning Center
            </span>
          </div>
        </div>

        {/* The 4-Stage Developmental Cycle Banner */}
        <div className="mt-8 p-4 rounded-xl bg-[#FAF9F5] border border-stone-200">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 block mb-2">
            The Review Paradigm: Not an inspection, but an accompaniment
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-center">
              <span className="font-bold text-[#3F6C8A] block">01 · OBSERVE</span>
              <span className="text-[11px] text-stone-600">Notice authentic practice</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-center">
              <span className="font-bold text-[#4A6B53] block">02 · UNDERSTAND</span>
              <span className="text-[11px] text-stone-600">Comprehend school context</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-center">
              <span className="font-bold text-[#C88A2E] block">03 · REFLECT</span>
              <span className="text-[11px] text-stone-600">Offer mirror questions</span>
            </div>
            <div className="p-2.5 rounded-lg bg-white border border-stone-200 text-center">
              <span className="font-bold text-[#C45D3E] block">04 · VERIFY</span>
              <span className="text-[11px] text-stone-600">Acknowledge lasting growth</span>
            </div>
          </div>
        </div>
      </div>

      {/* CEQHS Learning Center Designation Card */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <span className="text-xs uppercase tracking-wider font-semibold text-[#4A6B53]">
              Institutional Accreditation
            </span>
            <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal">
              CEQHS Learning Center Designation
            </h2>
          </div>
          <Award className="w-8 h-8 text-[#C88A2E]" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {verificationCriteria.map((c, i) => (
            <div
              key={i}
              className="p-3.5 rounded-xl bg-[#FAF9F5] border border-stone-200 flex items-center justify-between text-xs"
            >
              <span className="text-stone-800 font-medium">{c.label}</span>
              <span className="flex items-center gap-1 font-semibold text-[#4A6B53] bg-[#EAF0EB] px-2 py-0.5 rounded-md text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Verified
              </span>
            </div>
          ))}
        </div>

        <div className="p-6 rounded-xl bg-[#FAF3E7] border border-[#C88A2E]/30 text-center space-y-2">
          <span className="text-xs uppercase tracking-widest font-bold text-[#C88A2E]">
            Official Designation
          </span>
          <h3 className="font-editorial text-3xl text-stone-900 font-normal">
            St. Jude Academy
          </h3>
          <p className="font-editorial italic text-stone-700 text-base">
            Verified CEQHS Learning Center · Academic Year 2026–27
          </p>
        </div>
      </section>

      {/* Review Checkpoints History */}
      <section className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
        <div>
          <span className="text-xs uppercase tracking-wider font-semibold text-[#3F6C8A]">
            Review Dialogue History
          </span>
          <h2 className="font-editorial text-2xl sm:text-3xl text-[#252525] font-normal">
            Checkpoint Synthesis & Inquiries
          </h2>
        </div>

        <div className="space-y-6">
          {checkpoints.map((chk) => (
            <div
              key={chk.id}
              className="p-6 rounded-2xl border border-stone-200 bg-[#FAF9F5] space-y-4"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#EAF0EB] text-[#4A6B53]">
                    Stage: {chk.stage}
                  </span>
                  <span className="text-xs text-stone-500">{chk.date}</span>
                </div>
                <span className="text-xs font-semibold text-stone-700">{chk.reviewerName}</span>
              </div>

              <h3 className="text-lg font-bold text-stone-900">{chk.milestone}</h3>

              <p className="text-sm text-stone-700 leading-relaxed italic font-editorial">
                "{chk.notes}"
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 text-xs">
                <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5">
                  <span className="font-bold text-[#4A6B53] uppercase tracking-wider text-[10px] block">
                    Strengths Observed
                  </span>
                  <ul className="space-y-1 text-stone-700 list-disc list-inside">
                    {chk.strengthsObserved.map((s, idx) => (
                      <li key={idx}>{s}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3.5 rounded-xl bg-white border border-stone-200 space-y-1.5">
                  <span className="font-bold text-[#C88A2E] uppercase tracking-wider text-[10px] block">
                    Reflective Inquiries for School
                  </span>
                  <ul className="space-y-1 text-stone-700 list-disc list-inside">
                    {chk.inquiriesForSchool.map((inq, idx) => (
                      <li key={idx}>{inq}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Add Reviewer Feedback Form */}
        <form onSubmit={handlePostNote} className="pt-4 border-t border-stone-200 space-y-3">
          <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600">
            Add Facilitator Review Note / Mirror Question
          </label>
          <textarea
            rows={3}
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Share an observation or gentle inquiry to accompany the school's growth..."
            className="w-full bg-[#FAF9F5] border border-stone-300 rounded-xl p-3 text-sm text-stone-800 focus:ring-1 focus:ring-[#4A6B53] focus:outline-hidden"
          />
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-[#4A6B53] text-white text-xs font-semibold hover:bg-[#3d5945] transition-colors shadow-2xs"
            >
              Post Facilitator Observation
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};
