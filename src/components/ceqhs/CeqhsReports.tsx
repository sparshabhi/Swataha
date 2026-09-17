import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  FileSpreadsheet,
  Printer,
  Building2,
  GraduationCap,
  Award,
  CheckCircle2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';
import {
  CEQHSPartnerSchool,
  MilestoneItem,
  TrainingCohort,
  DossierItemEvidence,
} from '../../types/ceqhsUser';

interface CeqhsReportsProps {
  schools: CEQHSPartnerSchool[];
  milestones: MilestoneItem[];
  cohorts: TrainingCohort[];
  dossierItems: DossierItemEvidence[];
}

export const CeqhsReports: React.FC<CeqhsReportsProps> = ({
  schools,
  milestones,
  cohorts,
  dossierItems,
}) => {
  const [reportType, setReportType] = useState<'status' | 'training' | 'milestones' | 'dossier'>('status');

  const downloadCSV = (type: string) => {
    let headers: string[] = [];
    let rows: (string | number)[][] = [];
    let filename = '';

    if (type === 'status') {
      filename = `CEQHS_Partner_School_Status_${new Date().toISOString().split('T')[0]}.csv`;
      headers = [
        'School Name',
        'Tenant Code',
        'Location',
        'Partnership Status',
        'Programme',
        'Administrator',
        'Teachers Enrolled',
        'Training Pace %',
        'Dossier Completion %',
        'CEQHS Lead',
      ];
      rows = schools.map((s) => [
        `"${s.name}"`,
        `"${s.code}"`,
        `"${s.location}"`,
        `"${s.status}"`,
        `"${s.programme}"`,
        `"${s.schoolAdminName}"`,
        s.activeTeachersCount,
        `${s.trainingProgressPercent}%`,
        `${s.dossierProgressPercent}%`,
        `"${s.assignedOwnerName}"`,
      ]);
    } else if (type === 'training') {
      filename = `CEQHS_Training_Participation_${new Date().toISOString().split('T')[0]}.csv`;
      headers = [
        'Cohort Code',
        'Programme',
        'School',
        'Enrolled Staff',
        'Completed Staff',
        'Stalled Staff',
        'Completion Rate %',
        'Status',
      ];
      rows = cohorts.map((c) => [
        `"${c.cohortCode}"`,
        `"${c.programmeName}"`,
        `"${c.schoolName}"`,
        c.enrolledTeachersCount,
        c.completedTeachersCount,
        c.stalledTeachersCount,
        `${c.averageProgressPercent}%`,
        `"${c.status}"`,
      ]);
    } else if (type === 'milestones') {
      filename = `CEQHS_Milestones_Audit_${new Date().toISOString().split('T')[0]}.csv`;
      headers = [
        'Milestone Key',
        'Name',
        'Phase',
        'School',
        'Status',
        'Verified By',
        'Verified Date',
      ];
      rows = milestones.map((m) => [
        `"${m.key}"`,
        `"${m.name}"`,
        `"${m.phase}"`,
        `"${m.schoolName}"`,
        `"${m.status}"`,
        `"${m.verifiedBy || 'Pending'}"`,
        `"${m.verifiedDate || '-'}"`,
      ]);
    } else {
      filename = `CEQHS_Dossier_Evidence_Summary_${new Date().toISOString().split('T')[0]}.csv`;
      headers = [
        'Artifact Title',
        'Domain Section',
        'School',
        'Submitted By',
        'Review Status',
        'Version',
        'Sensitive Flag',
      ];
      rows = dossierItems.map((d) => [
        `"${d.title}"`,
        `"${d.sectionDomain}"`,
        `"${d.schoolName}"`,
        `"${d.submittedBy}"`,
        `"${d.reviewStatus}"`,
        d.version,
        d.isSensitiveContent ? 'YES' : 'NO',
      ]);
    }

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-stone-200/80 pb-5">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-1">
            <span>Practical Intelligence</span>
            <span>·</span>
            <span>Network Reporting & Exports</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Programme Supervisory Reports
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Generate verifiable reports for partner school trusts, CEQHS board reviews, and research documentation.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Report View</span>
          </button>
          <button
            onClick={() => downloadCSV(reportType)}
            className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download CSV Data</span>
          </button>
        </div>
      </div>

      {/* Report Selection Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs font-semibold">
        {[
          { id: 'status', label: '1. Partner School Status Report' },
          { id: 'training', label: '2. Teacher Training Completion Report' },
          { id: 'milestones', label: '3. Milestone Verification Audit' },
          { id: 'dossier', label: '4. Living Dossier Evidence Summary' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setReportType(tab.id as any)}
            className={`px-4 py-2 rounded-xl transition-colors whitespace-nowrap ${
              reportType === tab.id
                ? 'bg-[#1B3626] text-white shadow-2xs'
                : 'bg-white text-stone-700 border border-stone-200 hover:bg-stone-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* REPORT CONTENT VIEW */}
      <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs p-6 space-y-6">
        {reportType === 'status' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Partner School Status Report (Network Scope)
                </h3>
                <p className="text-xs text-stone-500">
                  Current partnership standing, active teachers, and developmental indicators.
                </p>
              </div>
              <span className="text-xs text-stone-400 font-mono">
                {schools.length} records · Generated {new Date().toLocaleDateString()}
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">School Name</th>
                    <th className="py-2.5 px-3">Tenant</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Admin</th>
                    <th className="py-2.5 px-3 text-center">Teachers</th>
                    <th className="py-2.5 px-3">Training</th>
                    <th className="py-2.5 px-3">Dossier</th>
                    <th className="py-2.5 px-3">CEQHS Lead</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {schools.map((s) => (
                    <tr key={s.id}>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{s.name}</td>
                      <td className="py-2.5 px-3 font-mono text-stone-500">{s.tenantId}</td>
                      <td className="py-2.5 px-3">{s.status}</td>
                      <td className="py-2.5 px-3">{s.schoolAdminName}</td>
                      <td className="py-2.5 px-3 text-center">{s.activeTeachersCount}</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{s.trainingProgressPercent}%</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{s.dossierProgressPercent}%</td>
                      <td className="py-2.5 px-3">{s.assignedOwnerName}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'training' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Teacher Training Participation & Completion
                </h3>
                <p className="text-xs text-stone-500">
                  Cohort enrollment numbers, completions, and stalled learners requiring coaching.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Cohort Code</th>
                    <th className="py-2.5 px-3">Programme</th>
                    <th className="py-2.5 px-3">School</th>
                    <th className="py-2.5 px-3 text-center">Enrolled</th>
                    <th className="py-2.5 px-3 text-center">Completed</th>
                    <th className="py-2.5 px-3 text-center">Stalled</th>
                    <th className="py-2.5 px-3">Avg Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {cohorts.map((c) => (
                    <tr key={c.id}>
                      <td className="py-2.5 px-3 font-mono font-bold text-stone-900">{c.cohortCode}</td>
                      <td className="py-2.5 px-3">{c.programmeName}</td>
                      <td className="py-2.5 px-3">{c.schoolName}</td>
                      <td className="py-2.5 px-3 text-center">{c.enrolledTeachersCount}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-emerald-700">{c.completedTeachersCount}</td>
                      <td className="py-2.5 px-3 text-center font-bold text-amber-700">{c.stalledTeachersCount}</td>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{c.averageProgressPercent}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'milestones' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Network Milestone Verification Audit
                </h3>
                <p className="text-xs text-stone-500">
                  Accreditation milestones verified against formal criteria.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Milestone</th>
                    <th className="py-2.5 px-3">Phase</th>
                    <th className="py-2.5 px-3">School</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Verified By</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {milestones.map((m) => (
                    <tr key={m.id}>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{m.name}</td>
                      <td className="py-2.5 px-3 text-stone-500">{m.phase}</td>
                      <td className="py-2.5 px-3">{m.schoolName}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          m.status === 'Verified' ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-100 text-stone-700'
                        }`}>
                          {m.status}
                        </span>
                      </td>
                      <td className="py-2.5 px-3">{m.verifiedBy || 'Pending'}</td>
                      <td className="py-2.5 px-3">{m.verifiedDate || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {reportType === 'dossier' && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Living Dossier Evidence Artifact Summary
                </h3>
                <p className="text-xs text-stone-500">
                  Submitted evidence items across all 8 developmental domains.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase">
                  <tr>
                    <th className="py-2.5 px-3">Artifact</th>
                    <th className="py-2.5 px-3">Domain</th>
                    <th className="py-2.5 px-3">School</th>
                    <th className="py-2.5 px-3">Contributor</th>
                    <th className="py-2.5 px-3">Status</th>
                    <th className="py-2.5 px-3">Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 font-medium">
                  {dossierItems.map((d) => (
                    <tr key={d.id}>
                      <td className="py-2.5 px-3 font-bold text-stone-900">{d.title}</td>
                      <td className="py-2.5 px-3 text-stone-600">{d.sectionDomain}</td>
                      <td className="py-2.5 px-3">{d.schoolName}</td>
                      <td className="py-2.5 px-3">{d.submittedBy}</td>
                      <td className="py-2.5 px-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          d.reviewStatus === 'Approved' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                        }`}>
                          {d.reviewStatus}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-stone-500">{d.submittedDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
