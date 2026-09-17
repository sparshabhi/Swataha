import React, { useState } from 'react';
import {
  Search,
  Filter,
  PlusCircle,
  Building2,
  Users,
  GraduationCap,
  FileCheck2,
  Clock,
  ArrowRight,
  MoreHorizontal,
  Download,
  AlertTriangle,
  CheckCircle2,
  UserCheck,
  Mail,
  MapPin,
  LayoutGrid,
  List,
  X,
  BookOpen,
} from 'lucide-react';
import {
  CEQHSPartnerSchool,
  SchoolPartnershipStatus,
  CEQHSStaffUser,
} from '../../types/ceqhsUser';

interface CeqhsPartnerSchoolsProps {
  schools: CEQHSPartnerSchool[];
  staff: CEQHSStaffUser[];
  onOpenSchoolWorkspace: (schoolId: string) => void;
  onAddSchool: (newSchool: Partial<CEQHSPartnerSchool>) => void;
  onAssignOwner?: (schoolId: string, staffId: string) => void;
  initialFilterStatus?: string;
}

export const CeqhsPartnerSchools: React.FC<CeqhsPartnerSchoolsProps> = ({
  schools,
  staff,
  onOpenSchoolWorkspace,
  onAddSchool,
  onAssignOwner,
  initialFilterStatus,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>(initialFilterStatus || 'all');
  const [ownerFilter, setOwnerFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New School Form State
  const [formName, setFormName] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formLocation, setFormLocation] = useState('');
  const [formAdminName, setFormAdminName] = useState('');
  const [formAdminEmail, setFormAdminEmail] = useState('');
  const [formOwnerId, setFormOwnerId] = useState(staff[1]?.id || staff[0]?.id || '');
  const [formTeachersCount, setFormTeachersCount] = useState('30');
  const [formProgramme, setFormProgramme] = useState('Whole-School Emotional Literacy & Restorative Culture');
  const [formCurriculum, setFormCurriculum] = useState('International Baccalaureate (IB PYP)');
  const [formCurriculumNotes, setFormCurriculumNotes] = useState('');
  const [formParticipatingGrades, setFormParticipatingGrades] = useState<string[]>([
    'Grade 1',
    'Grade 2',
    'Grade 3',
    'Grade 4',
    'Grade 5',
  ]);

  // Filter logic
  const filteredSchools = schools.filter((school) => {
    // Search
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      !q ||
      school.name.toLowerCase().includes(q) ||
      school.tenantId.toLowerCase().includes(q) ||
      school.code.toLowerCase().includes(q) ||
      school.location.toLowerCase().includes(q) ||
      school.schoolAdminName.toLowerCase().includes(q) ||
      school.schoolAdminEmail.toLowerCase().includes(q);

    // Status filter
    const matchesStatus =
      statusFilter === 'all' || school.status.toLowerCase() === statusFilter.toLowerCase();

    // Owner filter
    const matchesOwner = ownerFilter === 'all' || school.assignedOwnerId === ownerFilter;

    return matchesSearch && matchesStatus && matchesOwner;
  });

  const handleCreateSchoolSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim() || !formAdminEmail.trim()) return;

    const assignedStaff = staff.find((s) => s.id === formOwnerId) || staff[0];
    const newTenantId = `tenant-${Date.now().toString(36)}`;
    const newCode = formCode.trim() || `SCH-${Date.now().toString().slice(-4)}`;

    const newSchool: CEQHSPartnerSchool = {
      id: newTenantId,
      tenantId: `TENANT-${newCode.toUpperCase()}`,
      name: formName,
      code: newCode,
      location: formLocation || 'Regional Consortium',
      region: 'Educational Division',
      status: 'Onboarding',
      healthState: 'Healthy',
      currentPhase: 'ORIENTATION',
      implementationCycle: '2026–27',
      programme: formProgramme,
      cohort: 'Cohort 2026-Pilot',
      academicYear: '2026–27',
      schoolAdminName: formAdminName || 'Lead Administrator',
      schoolAdminEmail: formAdminEmail,
      assignedOwnerId: assignedStaff.id,
      assignedOwnerName: assignedStaff.name,
      activeTeachersCount: parseInt(formTeachersCount, 10) || 25,
      enrolledStudentsCount: (parseInt(formTeachersCount, 10) || 25) * 20,
      trainingProgressPercent: 0,
      dossierProgressPercent: 0,
      milestonesReachedCount: 0,
      totalMilestonesCount: 10,
      evidenceCount: 0,
      reflectionsCount: 0,
      peerObservationsCount: 0,
      classroomAdaptationsCount: 0,
      lastActivityDate: 'Just now',
      riskStatus: 'normal',
      onboardingDate: new Date().toISOString().split('T')[0],
      motto: 'Cultivating emotional agility and relational dignity.',
      primaryCurriculum: formCurriculum,
      curriculumJurisdiction: formCurriculumNotes.trim() || undefined,
      participatingGrades: formParticipatingGrades,
    };

    onAddSchool(newSchool);
    setIsAddModalOpen(false);

    // Reset Form
    setFormName('');
    setFormCode('');
    setFormLocation('');
    setFormAdminName('');
    setFormAdminEmail('');
  };

  const exportDirectoryCSV = () => {
    const headers = [
      'School Name',
      'Tenant ID',
      'Location',
      'Status',
      'Programme',
      'Administrator',
      'Email',
      'Teachers',
      'Training Progress %',
      'Dossier Progress %',
      'CEQHS Owner',
      'Last Activity',
    ];

    const rows = filteredSchools.map((s) => [
      `"${s.name}"`,
      `"${s.tenantId}"`,
      `"${s.location}"`,
      `"${s.status}"`,
      `"${s.programme}"`,
      `"${s.schoolAdminName}"`,
      `"${s.schoolAdminEmail}"`,
      s.activeTeachersCount,
      `${s.trainingProgressPercent}%`,
      `${s.dossierProgressPercent}%`,
      `"${s.assignedOwnerName}"`,
      `"${s.lastActivityDate}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CEQHS_Partner_Schools_Directory_${new Date().toISOString().split('T')[0]}.csv`);
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
            <span>Institutional Governance</span>
            <span>·</span>
            <span>{schools.length} Onboarded Tenants</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 tracking-tight">
            Partner Schools Directory
          </h1>
          <p className="text-xs text-stone-600 mt-1">
            Institutional records, assigned CEQHS programme leads, implementation health, and persistent workspaces.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={exportDirectoryCSV}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-stone-50 border border-stone-300 text-stone-700 text-xs font-semibold shadow-2xs transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold shadow-xs transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Onboard School</span>
          </button>
        </div>
      </div>

      {/* Controls Bar: Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by school name, tenant ID, location, or school admin..."
            className="w-full pl-9 pr-4 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl text-stone-900 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20 focus:border-[#1B3626] transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20"
            >
              <option value="all">All Statuses ({schools.length})</option>
              <option value="active">Active</option>
              <option value="needs support">Needs Support</option>
              <option value="onboarding">Onboarding</option>
              <option value="paused">Paused</option>
            </select>
          </div>

          {/* Owner Filter */}
          <div className="flex items-center gap-1.5">
            <span className="text-xs text-stone-500 font-medium">CEQHS Owner:</span>
            <select
              value={ownerFilter}
              onChange={(e) => setOwnerFilter(e.target.value)}
              className="text-xs font-medium bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#1B3626]/20"
            >
              <option value="all">All Advisors</option>
              {staff.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
              ))}
            </select>
          </div>

          {/* View Toggle */}
          <div className="flex items-center border border-stone-200 rounded-lg p-0.5 bg-stone-50">
            <button
              onClick={() => setViewMode('table')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'table'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Table View"
            >
              <List className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setViewMode('cards')}
              className={`p-1.5 rounded text-xs transition-colors ${
                viewMode === 'cards'
                  ? 'bg-white text-stone-900 shadow-2xs font-semibold'
                  : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Card View"
            >
              <LayoutGrid className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Directory Content (Table or Cards) */}
      {filteredSchools.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-stone-200 text-center">
          <Building2 className="w-10 h-10 text-stone-300 mx-auto mb-2" />
          <h3 className="text-sm font-bold text-stone-800">No partner schools matched your filter</h3>
          <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
            Try adjusting your search terms or status criteria to inspect active institutional records.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setStatusFilter('all');
              setOwnerFilter('all');
            }}
            className="mt-4 px-3.5 py-1.5 text-xs font-semibold text-[#1B3626] bg-[#1B3626]/10 rounded-lg hover:bg-[#1B3626]/20"
          >
            Clear all filters
          </button>
        </div>
      ) : viewMode === 'table' ? (
        /* TABLE VIEW (Default Desktop) */
        <div className="bg-white rounded-2xl border border-stone-200/90 shadow-2xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF9F5] border-b border-stone-200 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">School & Tenant</th>
                  <th className="py-3 px-3">Location</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">School Admin</th>
                  <th className="py-3 px-3 text-center">Teachers</th>
                  <th className="py-3 px-3">Training Pace</th>
                  <th className="py-3 px-3">Dossier</th>
                  <th className="py-3 px-3">CEQHS Owner</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-medium text-stone-800">
                {filteredSchools.map((school) => (
                  <tr
                    key={school.id}
                    className="hover:bg-stone-50/80 transition-colors group cursor-pointer"
                    onClick={() => onOpenSchoolWorkspace(school.id)}
                  >
                    {/* School Name & Tenant ID */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900 group-hover:text-[#1B3626] transition-colors">
                        {school.name}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono flex items-center gap-1.5 mt-0.5">
                        <span className="px-1.5 py-0.2 rounded bg-stone-100 text-stone-600">
                          {school.tenantId}
                        </span>
                        <span>·</span>
                        <span>{school.code}</span>
                      </div>
                      {school.primaryCurriculum && (
                        <div className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-800 bg-emerald-50/90 border border-emerald-200/60 px-2 py-0.5 rounded-md mt-1.5">
                          <BookOpen className="w-2.5 h-2.5 shrink-0 text-emerald-700" />
                          <span className="truncate max-w-[170px]">{school.primaryCurriculum}</span>
                          {school.participatingGrades && school.participatingGrades.length > 0 && (
                            <span className="text-emerald-700 font-semibold border-l border-emerald-300/70 pl-1">
                              {school.participatingGrades.map((g) => g.replace('Grade ', 'G')).join(', ')}
                            </span>
                          )}
                        </div>
                      )}
                    </td>

                    {/* Location */}
                    <td className="py-3.5 px-3 text-stone-600">
                      <div className="flex items-center gap-1 text-[11px]">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                        <span className="truncate max-w-[130px]">{school.location}</span>
                      </div>
                    </td>

                    {/* Status Chip */}
                    <td className="py-3.5 px-3">
                      {school.status === 'Active' ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-800">
                          Active
                        </span>
                      ) : school.status === 'Needs support' ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-100 text-amber-900 border border-amber-200">
                          <AlertTriangle className="w-3 h-3" />
                          <span>Needs Support</span>
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                          {school.status}
                        </span>
                      )}
                    </td>

                    {/* School Admin */}
                    <td className="py-3.5 px-3">
                      <div className="text-stone-900 text-xs font-semibold">
                        {school.schoolAdminName}
                      </div>
                      <div className="text-[10px] text-stone-500 truncate max-w-[140px]">
                        {school.schoolAdminEmail}
                      </div>
                    </td>

                    {/* Teachers Count */}
                    <td className="py-3.5 px-3 text-center">
                      <span className="font-bold text-stone-900">{school.activeTeachersCount}</span>
                      <span className="text-[10px] text-stone-400 block">enrolled</span>
                    </td>

                    {/* Training Progress */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-stone-800">{school.trainingProgressPercent}%</span>
                      </div>
                      <div className="w-24 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          style={{ width: `${school.trainingProgressPercent}%` }}
                          className={`h-full rounded-full ${
                            school.trainingProgressPercent >= 70
                              ? 'bg-emerald-600'
                              : school.trainingProgressPercent >= 40
                              ? 'bg-amber-500'
                              : 'bg-blue-600'
                          }`}
                        />
                      </div>
                    </td>

                    {/* Dossier Progress */}
                    <td className="py-3.5 px-3">
                      <div className="flex items-center justify-between text-[11px] mb-1">
                        <span className="font-semibold text-stone-800">{school.dossierProgressPercent}%</span>
                        <span className="text-[10px] text-stone-400">{school.milestonesReachedCount}/{school.totalMilestonesCount}</span>
                      </div>
                      <div className="w-20 h-1.5 rounded-full bg-stone-100 overflow-hidden">
                        <div
                          style={{ width: `${school.dossierProgressPercent}%` }}
                          className="h-full rounded-full bg-[#1B3626]"
                        />
                      </div>
                    </td>

                    {/* CEQHS Owner */}
                    <td className="py-3.5 px-3 text-stone-700">
                      <div className="flex items-center gap-1.5 text-xs font-medium">
                        <UserCheck className="w-3.5 h-3.5 text-stone-400" />
                        <span className="truncate">{school.assignedOwnerName}</span>
                      </div>
                      <span className="text-[10px] text-stone-400 block">{school.lastActivityDate}</span>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => onOpenSchoolWorkspace(school.id)}
                        className="px-3 py-1.5 rounded-lg bg-stone-100 hover:bg-[#1B3626] text-stone-700 hover:text-white text-xs font-semibold transition-colors inline-flex items-center gap-1"
                      >
                        <span>Workspace</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* CARD VIEW (Great for mobile & tablets) */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSchools.map((school) => (
            <div
              key={school.id}
              className="bg-white rounded-2xl border border-stone-200/90 p-5 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                      {school.tenantId}
                    </span>
                    <h3 className="text-base font-bold text-stone-900 mt-1.5 leading-tight">
                      {school.name}
                    </h3>
                  </div>
                  {school.status === 'Active' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-100 text-emerald-800 shrink-0">
                      Active
                    </span>
                  ) : school.status === 'Needs support' ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-100 text-amber-900 border border-amber-200 shrink-0">
                      Needs Support
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-blue-100 text-blue-800 shrink-0">
                      {school.status}
                    </span>
                  )}
                </div>

                <p className="text-xs text-stone-500 mb-2 flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-stone-400" />
                  <span>{school.location}</span>
                </p>

                {school.primaryCurriculum && (
                  <div className="mb-3.5 inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-800 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
                    <BookOpen className="w-3 h-3 text-emerald-700 shrink-0" />
                    <span>{school.primaryCurriculum}</span>
                    {school.participatingGrades && school.participatingGrades.length > 0 && (
                      <span className="font-semibold text-emerald-700 border-l border-emerald-300 pl-1">
                        Grades {school.participatingGrades.map((g) => g.replace('Grade ', '')).join(', ')}
                      </span>
                    )}
                  </div>
                )}

                {school.attentionReason && (
                  <div className="mb-4 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-900 flex items-start gap-2">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                    <span>{school.attentionReason}</span>
                  </div>
                )}

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-2.5 p-3 rounded-xl bg-stone-50 border border-stone-100 text-xs mb-4">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Training Progress</span>
                    <span className="text-sm font-bold text-stone-900">{school.trainingProgressPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Dossier Completed</span>
                    <span className="text-sm font-bold text-stone-900">{school.dossierProgressPercent}%</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Active Teachers</span>
                    <span className="text-sm font-bold text-stone-900">{school.activeTeachersCount}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">CEQHS Owner</span>
                    <span className="text-xs font-bold text-stone-800 truncate block">{school.assignedOwnerName}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">Activity: {school.lastActivityDate}</span>
                <button
                  onClick={() => onOpenSchoolWorkspace(school.id)}
                  className="px-3.5 py-1.5 rounded-xl bg-[#1B3626] hover:bg-[#284f38] text-white text-xs font-bold transition-colors inline-flex items-center gap-1.5 shadow-2xs"
                >
                  <span>Open Workspace</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* ADD PARTNER SCHOOL MODAL                                         */}
      {/* ---------------------------------------------------------------- */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-xl border border-stone-200 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  Onboard Partner School
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Initialize a new school tenant and appoint the lead administrator.
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSchoolSubmit} className="py-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  School Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  placeholder="e.g. St. Jude Secondary Academy"
                  className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    School Code (Identifier)
                  </label>
                  <input
                    type="text"
                    value={formCode}
                    onChange={(e) => setFormCode(e.target.value)}
                    placeholder="e.g. STJ-2026"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Location / Division
                  </label>
                  <input
                    type="text"
                    value={formLocation}
                    onChange={(e) => setFormLocation(e.target.value)}
                    placeholder="e.g. Leeds, North District"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Lead Administrator Name
                  </label>
                  <input
                    type="text"
                    value={formAdminName}
                    onChange={(e) => setFormAdminName(e.target.value)}
                    placeholder="e.g. Dr. Arthur Vance"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Administrator Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formAdminEmail}
                    onChange={(e) => setFormAdminEmail(e.target.value)}
                    placeholder="admin@school.edu"
                    className="w-full px-3 py-2 text-sm border border-stone-300 rounded-lg text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Assigned CEQHS Programme Lead
                </label>
                <select
                  value={formOwnerId}
                  onChange={(e) => setFormOwnerId(e.target.value)}
                  className="w-full text-xs font-medium border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                >
                  {staff.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.title})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Target Programme Framework
                </label>
                <select
                  value={formProgramme}
                  onChange={(e) => setFormProgramme(e.target.value)}
                  className="w-full text-xs font-medium border border-stone-300 rounded-lg p-2 text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                >
                  <option value="Whole-School Emotional Literacy & Restorative Culture">
                    Whole-School Emotional Literacy & Restorative Culture
                  </option>
                  <option value="Secondary Relational Climate & Micro-Pause Practice">
                    Secondary Relational Climate & Micro-Pause Practice
                  </option>
                  <option value="Primary-to-Secondary Emotional Scaffolding">
                    Primary-to-Secondary Emotional Scaffolding
                  </option>
                </select>
              </div>

              {/* Educational Board / Curriculum Selection */}
              <div className="bg-stone-50/90 p-3.5 rounded-xl border border-stone-200 space-y-3">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <label className="text-xs font-bold text-stone-800 flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5 text-[#1B3626]" />
                      <span>Educational Board / Curriculum Alignment <span className="text-red-500">*</span></span>
                    </label>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2">
                    Specify the formal curriculum framework this partner school follows.
                  </p>
                  <select
                    value={formCurriculum}
                    onChange={(e) => setFormCurriculum(e.target.value)}
                    className="w-full text-xs font-medium border border-stone-300 rounded-lg p-2 text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                  >
                    <option value="International Baccalaureate (IB PYP)">
                      International Baccalaureate (IB Primary Years Programme - PYP)
                    </option>
                    <option value="Cambridge Primary (Stages 1–5)">
                      Cambridge Primary (Stages 1–5 / Cambridge International)
                    </option>
                    <option value="Nepal National Curriculum (CDC / CAS Framework)">
                      Nepal National Curriculum (CDC / Continuous Assessment System - CAS)
                    </option>
                    <option value="Oxford International Curriculum (OIC - Wellbeing & Global Skills)">
                      Oxford International Curriculum (OIC - Wellbeing & Global Skills)
                    </option>
                    <option value="National Curriculum for England">
                      National Curriculum for England (Key Stage 1 & 2)
                    </option>
                    <option value="Custom / Integrated Multi-Board">
                      Custom / Integrated Multi-Board Framework
                    </option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-stone-600 mb-1">
                    Curriculum Specification / Local Jurisdiction (Optional)
                  </label>
                  <input
                    type="text"
                    value={formCurriculumNotes}
                    onChange={(e) => setFormCurriculumNotes(e.target.value)}
                    placeholder="e.g. IB PYP 2026 Enhanced, CDC Grades 1-5 CAS, Cambridge Primary Stage 1-5"
                    className="w-full px-3 py-1.5 text-xs border border-stone-300 rounded-lg text-stone-900 bg-white focus:outline-none focus:ring-2 focus:ring-[#1B3626]"
                  />
                </div>

                {/* Target Program Grades (1–5) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-stone-800">
                      Program Target Grades <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={() => {
                        if (formParticipatingGrades.length === 5) {
                          setFormParticipatingGrades(['Grade 1']);
                        } else {
                          setFormParticipatingGrades(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5']);
                        }
                      }}
                      className="text-[10px] font-semibold text-[#1B3626] hover:underline"
                    >
                      {formParticipatingGrades.length === 5 ? 'Deselect All' : 'Select All (Grades 1–5)'}
                    </button>
                  </div>
                  <p className="text-[11px] text-stone-500 mb-2">
                    Select the specific grade cohorts entering the CEQHS pilot implementation.
                  </p>
                  <div className="grid grid-cols-5 gap-2">
                    {(['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'] as const).map((grade) => {
                      const isSelected = formParticipatingGrades.includes(grade);
                      return (
                        <button
                          key={grade}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              if (formParticipatingGrades.length > 1) {
                                setFormParticipatingGrades(formParticipatingGrades.filter((g) => g !== grade));
                              }
                            } else {
                              setFormParticipatingGrades([...formParticipatingGrades, grade].sort());
                            }
                          }}
                          className={`py-1.5 text-xs font-bold rounded-lg border transition-all text-center ${
                            isSelected
                              ? 'bg-[#1B3626] text-white border-[#1B3626] shadow-2xs'
                              : 'bg-white text-stone-600 border-stone-300 hover:border-stone-400'
                          }`}
                        >
                          {grade}
                        </button>
                      );
                    })}
                  </div>
                  <div className="text-[10px] text-stone-500 mt-1.5">
                    Active Cohort: <span className="font-semibold text-stone-700">{formParticipatingGrades.join(', ')}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-4 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold text-white bg-[#1B3626] hover:bg-[#284f38] rounded-lg shadow-xs"
                >
                  Initialize School Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
