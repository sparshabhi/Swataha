import React, { useState } from 'react';
import {
  GraduationCap,
  Users,
  CheckCircle2,
  AlertTriangle,
  Download,
  Search,
  Filter,
  ArrowRight,
  TrendingUp,
  Clock,
  Building2,
} from 'lucide-react';
import { TrainingCohort, CEQHSPartnerSchool } from '../../types/ceqhsUser';

interface CeqhsTrainingProps {
  cohorts: TrainingCohort[];
  schools: CEQHSPartnerSchool[];
  onOpenSchoolWorkspace: (schoolId: string) => void;
}

export const CeqhsTraining: React.FC<CeqhsTrainingProps> = ({
  cohorts,
  schools,
  onOpenSchoolWorkspace,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const totalEnrolled = cohorts.reduce((acc, c) => acc + c.enrolledTeachersCount, 0);
  const totalCompleted = cohorts.reduce((acc, c) => acc + c.completedTeachersCount, 0);
  const totalStalled = cohorts.reduce((acc, c) => acc + c.stalledTeachersCount, 0);
  const avgPacing = Math.round(
    cohorts.reduce((acc, c) => acc + c.averageProgressPercent, 0) / (cohorts.length || 1)
  );

  const filteredCohorts = cohorts.filter((c) => {
    const q = searchQuery.toLowerCase();
    return (
      !q ||
      c.programmeName.toLowerCase().includes(q) ||
      c.schoolName.toLowerCase().includes(q) ||
      c.cohortCode.toLowerCase().includes(q)
    );
  });

  const exportTrainingCSV = () => {
    const headers = [
      'Cohort Code',
      'Programme Name',
      'School Name',
      'Enrolled',
      'Completed',
      'Stalled',
      'Avg Progress %',
      'Status',
      'Facilitator',
    ];
    const rows = cohorts.map((c) => [
      `"${c.cohortCode}"`,
      `"${c.programmeName}"`,
      `"${c.schoolName}"`,
      c.enrolledTeachersCount,
      c.completedTeachersCount,
      c.stalledTeachersCount,
      `${c.averageProgressPercent}%`,
      `"${c.status}"`,
      `"${c.leadFacilitator}"`,
    ]);
    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CEQHS_Teacher_Training_Pacing_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>Educator Development</span>
            <span>·</span>
            <span>Teacher Emotional Literacy Pacing</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Training & Cohorts Manager
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Track teacher cohort progress across foundational emotional literacy modules, reflection logs, and identify stalled learners.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportTrainingCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Training CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Enrolled Educators</span>
          <div className="text-2xl font-bold text-stone-900">{totalEnrolled}</div>
          <span className="text-[10px] text-stone-400">across {cohorts.length} cohorts</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Completed Modules</span>
          <div className="text-2xl font-bold text-emerald-700">{totalCompleted}</div>
          <span className="text-[10px] text-stone-400">Full certifications</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-amber-900 block mb-1">Stalled Learners</span>
          <div className="text-2xl font-bold text-amber-900">{totalStalled}</div>
          <span className="text-[10px] text-amber-800">Require intervention</span>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200/90 shadow-2xs">
          <span className="text-[11px] font-semibold text-stone-500 block mb-1">Average Network Pace</span>
          <div className="text-2xl font-bold text-stone-900">{avgPacing}%</div>
          <span className="text-[10px] text-stone-400">Completion rate</span>
        </div>
      </div>

      {/* Search & Cohorts Grid */}
      <div className="space-y-4">
        <div className="bg-white p-3 rounded-xl border border-stone-200 flex items-center">
          <Search className="w-4 h-4 text-stone-400 mr-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search cohort code, programme name, or school..."
            className="w-full text-xs bg-transparent text-stone-900 focus:outline-none"
          />
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filteredCohorts.map((cohort) => (
            <div
              key={cohort.id}
              className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-700">
                      {cohort.cohortCode}
                    </span>
                    <button
                      onClick={() => onOpenSchoolWorkspace(cohort.schoolId)}
                      className="text-xs font-bold text-stone-600 hover:text-[#1B3626] hover:underline"
                    >
                      {cohort.schoolName}
                    </button>
                  </div>
                  <h3 className="text-base font-bold text-stone-900 mt-1">
                    {cohort.programmeName}
                  </h3>
                  <p className="text-xs text-stone-500">
                    Facilitated by {cohort.leadFacilitator} · Timeline: {cohort.startDate} to {cohort.endDate}
                  </p>
                </div>

                <div className="flex items-center gap-3 self-end sm:self-center">
                  <div className="text-right">
                    <span className="text-xl font-bold text-stone-900">{cohort.averageProgressPercent}%</span>
                    <span className="text-[10px] text-stone-400 block">Progress</span>
                  </div>
                  <button
                    onClick={() => onOpenSchoolWorkspace(cohort.schoolId)}
                    className="px-3 py-1.5 rounded-lg bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold transition-colors inline-flex items-center gap-1 shadow-2xs"
                  >
                    <span>Inspect</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* Pacing Visual Bar */}
              <div>
                <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                  <span>Progress pacing</span>
                  <span>{cohort.completedTeachersCount} of {cohort.enrolledTeachersCount} teachers certified</span>
                </div>
                <div className="w-full h-2 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    style={{ width: `${cohort.averageProgressPercent}%` }}
                    className={`h-full rounded-full ${
                      cohort.averageProgressPercent >= 75
                        ? 'bg-emerald-600'
                        : cohort.averageProgressPercent >= 40
                        ? 'bg-amber-500'
                        : 'bg-blue-600'
                    }`}
                  />
                </div>
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-100">
                  <span className="text-[10px] text-stone-500 block">Enrolled Teachers</span>
                  <span className="text-sm font-bold text-stone-900">{cohort.enrolledTeachersCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                  <span className="text-[10px] text-emerald-800 block">Completed</span>
                  <span className="text-sm font-bold text-emerald-900">{cohort.completedTeachersCount}</span>
                </div>
                <div className="p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                  <span className="text-[10px] text-amber-800 block">Stalled Learners</span>
                  <span className="text-sm font-bold text-amber-900">{cohort.stalledTeachersCount}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
