import React, { useState } from 'react';
import {
  Building2,
  BookOpen,
  Calendar,
  Users,
  ShieldCheck,
  Save,
  Check,
  Compass,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { SWATARA_CORE_SCHOOL } from '../../data/swataraDemoData';

export const CeqhsSchoolProfileView: React.FC<{
  onLaunchOnboarding?: () => void;
}> = ({ onLaunchOnboarding }) => {
  const [profile, setProfile] = useState(SWATARA_CORE_SCHOOL);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2500);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#EAF0EB] text-[#1B3626]">
                Section 6.2 School Profile
              </span>
              <span className="text-xs text-stone-500 font-medium">
                {profile.code}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">
              {profile.name}
            </h1>
            <p className="text-sm text-stone-600 mt-1 max-w-xl">
              School governance profile, curriculum version anchor, participating grades, and delivery constraints.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {isSaved && (
              <span className="text-xs font-semibold text-emerald-700 flex items-center gap-1">
                <Check className="w-3.5 h-3.5" /> Profile updated
              </span>
            )}
            <button
              onClick={handleSave}
              className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#2D5A3D] text-white text-xs font-semibold flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Profile</span>
            </button>
            {onLaunchOnboarding && (
              <button
                onClick={onLaunchOnboarding}
                className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold cursor-pointer"
              >
                Launch Onboarding Wizard
              </button>
            )}
          </div>
        </div>

        {/* Core Attributes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-6">
          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Curriculum Anchor
            </div>
            <div className="text-sm font-bold text-stone-900 mt-1">
              {profile.curriculum}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              {profile.curriculumVersion}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Grade Scope
            </div>
            <div className="text-sm font-bold text-stone-900 mt-1">
              {profile.grades}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Primary Cohort Pilot
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Phase
            </div>
            <div className="text-sm font-bold text-[#1B3626] mt-1">
              {profile.implementationPhase}
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              Academic Year {profile.academicYear}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-stone-50 border border-stone-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
              Community
            </div>
            <div className="text-sm font-bold text-stone-900 mt-1">
              {profile.enrolledStudents} Students
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">
              {profile.activeTeachers} Primary Faculty
            </div>
          </div>
        </div>
      </div>

      {/* Editable Details Form */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs space-y-6">
        <h2 className="text-base font-bold text-stone-900 border-b border-stone-100 pb-3">
          Governance &amp; Timetable Parameters
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              School Name
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) => setProfile({ ...profile, name: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Primary Curriculum Anchor
            </label>
            <select
              value={profile.curriculum}
              onChange={(e) => setProfile({ ...profile, curriculum: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
            >
              <option>International Baccalaureate (IB PYP)</option>
              <option>Oxford International Curriculum</option>
              <option>Cambridge International</option>
              <option>Nepal National Curriculum (NCF 2076)</option>
              <option>Other / Custom Curriculum</option>
            </select>
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              Lead Administrator / Principal
            </label>
            <input
              type="text"
              value={profile.leadAdminName}
              onChange={(e) => setProfile({ ...profile, leadAdminName: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
            />
          </div>

          <div>
            <label className="font-semibold text-stone-700 block mb-1">
              PYP / Curriculum Coordinator
            </label>
            <input
              type="text"
              value={profile.pypCoordinatorName}
              onChange={(e) => setProfile({ ...profile, pypCoordinatorName: e.target.value })}
              className="w-full p-2.5 rounded-lg border border-stone-200 bg-stone-50 focus:bg-white"
            />
          </div>
        </div>

        {/* Priorities */}
        <div className="space-y-2 pt-2">
          <label className="font-semibold text-stone-700 block text-xs">
            School Implementation Priorities (Year 1)
          </label>
          <div className="space-y-2">
            {profile.priorities.map((pr, i) => (
              <div key={i} className="p-3 rounded-lg bg-[#FAF8F5] border border-stone-200/60 text-xs text-stone-800">
                • {pr}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
