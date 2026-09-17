import React, { useState } from 'react';
import {
  Building2,
  Users,
  UserPlus,
  PlusCircle,
  Shield,
  GraduationCap,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  ChevronRight,
  Layers,
  FileCheck,
  Search,
  Filter,
  UserCheck,
  ExternalLink,
  Lock,
  Download,
  School,
  Briefcase,
  AlertCircle,
} from 'lucide-react';
import { Tenant, TenantUser, User } from '../types';
import { CeqhsLogo } from './CeqhsLogo';

interface TenantManagementHubProps {
  tenants: Tenant[];
  tenantUsers: TenantUser[];
  activeTenantId: string;
  onSelectTenant: (tenantId: string) => void;
  onCreateTenant: (tenant: Omit<Tenant, 'id' | 'createdAt' | 'pillars' | 'dossierProgress'>) => void;
  onCreateUser: (user: Omit<TenantUser, 'id' | 'joinedDate' | 'activeEntriesCount' | 'tenantName'>) => void;
  onNavigateToDossier: (tenantId: string) => void;
  onImpersonateUser: (user: TenantUser) => void;
  currentUser: User;
}

export const TenantManagementHub: React.FC<TenantManagementHubProps> = ({
  tenants,
  tenantUsers,
  activeTenantId,
  onSelectTenant,
  onCreateTenant,
  onCreateUser,
  onNavigateToDossier,
  onImpersonateUser,
  currentUser,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'tenants' | 'users' | 'hierarchy'>('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTenantId, setFilterTenantId] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');

  // Modal States
  const [isCreateTenantOpen, setIsCreateTenantOpen] = useState(false);
  const [isCreateUserOpen, setIsCreateUserOpen] = useState(false);

  // New Tenant Form
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantCode, setNewTenantCode] = useState('');
  const [newTenantType, setNewTenantType] = useState<Tenant['type']>('secondary');
  const [newTenantRegion, setNewTenantRegion] = useState('');
  const [newTenantYear, setNewTenantYear] = useState('2026–27');
  const [newTenantLeadName, setNewTenantLeadName] = useState('');
  const [newTenantLeadEmail, setNewTenantLeadEmail] = useState('');
  const [newTenantCoordName, setNewTenantCoordName] = useState('');
  const [newTenantCoordEmail, setNewTenantCoordEmail] = useState('');
  const [newTenantMotto, setNewTenantMotto] = useState('');

  // New User Form
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserTenantId, setNewUserTenantId] = useState<string>(activeTenantId || tenants[0]?.id || '');
  const [newUserRole, setNewUserRole] = useState<'school_admin' | 'coordinator' | 'teacher'>('teacher');
  const [newUserTitle, setNewUserTitle] = useState('');
  const [newUserDepartment, setNewUserDepartment] = useState('');
  const [newUserCompetency, setNewUserCompetency] = useState('Know Yourself (Emotional Literacy)');

  const activeTenant = tenants.find((t) => t.id === activeTenantId) || tenants[0];

  const handleCreateTenantSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantName || !newTenantCode) return;

    onCreateTenant({
      name: newTenantName.trim(),
      code: newTenantCode.trim().toUpperCase(),
      type: newTenantType,
      region: newTenantRegion || 'Regional Consortium',
      academicYear: newTenantYear,
      leadAdminName: newTenantLeadName || 'Interim Principal',
      leadAdminEmail: newTenantLeadEmail || `admin@${newTenantCode.toLowerCase()}.edu`,
      coordinatorName: newTenantCoordName || 'Interim Coordinator',
      coordinatorEmail: newTenantCoordEmail || `coordinator@${newTenantCode.toLowerCase()}.edu`,
      status: 'active',
      dossierStage: '01_EXPLORE',
      motto: newTenantMotto,
      description: `${newTenantName} is an active school tenant within the CEQHS Living Dossier ecosystem.`,
      enrolledStudents: 500,
      participatingTeachers: 24,
    });

    // Reset Form & Close
    setNewTenantName('');
    setNewTenantCode('');
    setNewTenantRegion('');
    setNewTenantLeadName('');
    setNewTenantLeadEmail('');
    setNewTenantCoordName('');
    setNewTenantCoordEmail('');
    setNewTenantMotto('');
    setIsCreateTenantOpen(false);
  };

  const handleCreateUserSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName || !newUserEmail || !newUserTenantId) return;

    onCreateUser({
      name: newUserName.trim(),
      email: newUserEmail.trim(),
      tenantId: newUserTenantId,
      role: newUserRole,
      title: newUserTitle || (newUserRole === 'school_admin' ? 'School Administrator' : newUserRole === 'coordinator' ? 'CEQHS Coordinator' : 'Teacher'),
      department: newUserDepartment || 'Academic Department',
      competencyFocus: newUserCompetency,
    });

    // Reset Form & Close
    setNewUserName('');
    setNewUserEmail('');
    setNewUserTitle('');
    setNewUserDepartment('');
    setIsCreateUserOpen(false);
  };

  // Filtered users list
  const filteredUsers = tenantUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.tenantName.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesTenant = filterTenantId === 'all' || u.tenantId === filterTenantId;
    const matchesRole = filterRole === 'all' || u.role === filterRole;

    return matchesSearch && matchesTenant && matchesRole;
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Top Banner with Official CEQHS Logo */}
      <div className="bg-gradient-to-br from-[#0D1B2A] to-[#1B2D44] text-white rounded-2xl p-6 sm:p-8 shadow-sm border border-stone-800 relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-radial from-amber-500/10 via-transparent to-transparent pointer-events-none" />

        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start sm:items-center gap-4">
            <CeqhsLogo size={58} className="drop-shadow-md" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[11px] uppercase tracking-widest font-bold text-[#DFC078]">
                  CEQHS Multi-Tenant Platform
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-white/10 text-white border border-white/20">
                  Dossier Development
                </span>
              </div>
              <h1 className="font-editorial text-2xl sm:text-3xl font-normal text-white tracking-tight mt-0.5">
                School Tenants & User Administration
              </h1>
              <p className="text-xs text-stone-300 mt-1 max-w-2xl leading-relaxed">
                Oversee onboarded school tenants, provision administrators, coordinators, and teachers, and supervise school-specific living dossier accreditations.
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={() => setIsCreateTenantOpen(true)}
              className="px-3.5 py-2.5 bg-[#C5A059] hover:bg-[#b08b47] text-stone-950 text-xs font-semibold rounded-xl flex items-center gap-2 shadow-sm transition-all active:scale-[0.98]"
            >
              <Building2 className="w-4 h-4" />
              <span>Create School Tenant</span>
            </button>
            <button
              onClick={() => setIsCreateUserOpen(true)}
              className="px-3.5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl flex items-center gap-2 border border-white/20 transition-all active:scale-[0.98]"
            >
              <UserPlus className="w-4 h-4" />
              <span>Add User to Tenant</span>
            </button>
          </div>
        </div>

        {/* Active Tenant Quick Selector */}
        <div className="mt-6 pt-5 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-stone-300">
            <School className="w-4 h-4 text-[#DFC078]" />
            <span>Currently Active for Dossier Development:</span>
            <span className="font-semibold text-white px-2 py-0.5 rounded bg-white/15 border border-white/20">
              {activeTenant?.name} ({activeTenant?.code})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400">Switch School:</span>
            {tenants.map((tenant) => (
              <button
                key={tenant.id}
                onClick={() => onSelectTenant(tenant.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all ${
                  tenant.id === activeTenantId
                    ? 'bg-[#C5A059] text-stone-950 font-semibold shadow-xs'
                    : 'bg-white/10 text-stone-200 hover:bg-white/20 border border-white/10'
                }`}
              >
                {tenant.code}: {tenant.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'overview'
              ? 'bg-[#4A6B53] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>Tenant Dossier Hub</span>
        </button>

        <button
          onClick={() => setActiveTab('hierarchy')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'hierarchy'
              ? 'bg-[#4A6B53] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Platform Hierarchy Map</span>
        </button>

        <button
          onClick={() => setActiveTab('tenants')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'tenants'
              ? 'bg-[#4A6B53] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>All School Tenants ({tenants.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-2 shrink-0 ${
            activeTab === 'users'
              ? 'bg-[#4A6B53] text-white shadow-2xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>Tenant Users & Roles ({tenantUsers.length})</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW & DOSSIER PROGRESS */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Summary Stats Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Onboarded Tenants</span>
                <Building2 className="w-4 h-4 text-[#4A6B53]" />
              </div>
              <div className="text-2xl font-bold text-stone-900 mt-2">{tenants.length}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Active School Communities</div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Registered Staff</span>
                <Users className="w-4 h-4 text-[#4A6B53]" />
              </div>
              <div className="text-2xl font-bold text-stone-900 mt-2">{tenantUsers.length}</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Teachers, Coords & Admins</div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Active Dossier Focus</span>
                <FileCheck className="w-4 h-4 text-[#4A6B53]" />
              </div>
              <div className="text-base font-bold text-stone-900 mt-2 truncate">{activeTenant.name}</div>
              <div className="text-[11px] text-emerald-700 font-medium mt-0.5">{activeTenant.dossierProgress}% Ready for Review</div>
            </div>

            <div className="bg-white border border-stone-200/80 rounded-2xl p-4 shadow-2xs">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">CEQHS Accreditation</span>
                <Shield className="w-4 h-4 text-[#C5A059]" />
              </div>
              <div className="text-2xl font-bold text-stone-900 mt-2">Cycle 2026</div>
              <div className="text-[11px] text-stone-500 mt-0.5">Whole-School Climate Verification</div>
            </div>
          </div>

          {/* School Tenants Comparison Grid */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-stone-900">School Tenants Dossier Status</h2>
                <p className="text-xs text-stone-500">Live developmental accreditation progress for each onboarded school</p>
              </div>
              <button
                onClick={() => setIsCreateTenantOpen(true)}
                className="text-xs text-[#4A6B53] font-semibold hover:underline flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                <span>Add Another School</span>
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {tenants.map((tenant) => {
                const schoolUsers = tenantUsers.filter((u) => u.tenantId === tenant.id);
                const isCurrent = tenant.id === activeTenantId;

                return (
                  <div
                    key={tenant.id}
                    className={`bg-white border rounded-2xl p-6 transition-all ${
                      isCurrent
                        ? 'border-[#4A6B53] ring-2 ring-[#4A6B53]/15 shadow-sm'
                        : 'border-stone-200/90 shadow-2xs hover:border-stone-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] text-white flex items-center justify-center font-editorial text-lg font-bold border border-[#C5A059]/40 shrink-0">
                          {tenant.code.slice(-1)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                              {tenant.code}
                            </span>
                            <span className="text-[10px] text-stone-500 font-medium">{tenant.academicYear}</span>
                            {isCurrent && (
                              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded-full">
                                Active Focus
                              </span>
                            )}
                          </div>
                          <h3 className="font-editorial text-xl font-normal text-stone-900 mt-1">
                            {tenant.name}
                          </h3>
                          <p className="text-xs text-stone-500 line-clamp-1">{tenant.motto || tenant.region}</p>
                        </div>
                      </div>

                      <button
                        onClick={() => onSelectTenant(tenant.id)}
                        className={`text-xs font-semibold px-3 py-1.5 rounded-xl transition-colors shrink-0 ${
                          isCurrent
                            ? 'bg-[#4A6B53] text-white'
                            : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                        }`}
                      >
                        {isCurrent ? 'Selected' : 'Select'}
                      </button>
                    </div>

                    {/* Dossier Progress Meter */}
                    <div className="mt-5 p-4 rounded-xl bg-[#FAF9F5] border border-stone-200/80">
                      <div className="flex items-center justify-between text-xs mb-1.5">
                        <span className="font-semibold text-stone-700">Dossier Readiness for CEQHS Review</span>
                        <span className="font-bold text-[#4A6B53]">{tenant.dossierProgress}% Complete</span>
                      </div>
                      <div className="w-full h-2.5 bg-stone-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#C5A059] to-[#4A6B53] rounded-full transition-all duration-500"
                          style={{ width: `${tenant.dossierProgress}%` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-[11px] text-stone-500 mt-2">
                        <span>Stage: <strong>{tenant.dossierStage.replace('_', ' ')}</strong></span>
                        <span>{tenant.participatingTeachers || schoolUsers.length} Contributing Educators</span>
                      </div>
                    </div>

                    {/* Dossier Pillars */}
                    <div className="mt-4 space-y-2">
                      <div className="text-[11px] font-semibold uppercase tracking-wider text-stone-400">
                        Accreditation Pillars
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        {tenant.pillars.map((pillar) => (
                          <div
                            key={pillar.id}
                            className="p-2.5 rounded-lg border border-stone-100 bg-white flex items-center justify-between"
                          >
                            <span className="text-stone-700 font-medium truncate mr-2">{pillar.name}</span>
                            <span className="font-mono text-[11px] text-stone-500 shrink-0 font-bold">
                              {pillar.completedItems}/{pillar.totalRequired}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Key Personnel & Quick Actions */}
                    <div className="mt-5 pt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                      <div className="text-stone-500 truncate mr-2">
                        <span>Admin: <strong className="text-stone-800">{tenant.leadAdminName}</strong></span>
                        <span className="mx-1.5">·</span>
                        <span>Coord: <strong className="text-stone-800">{tenant.coordinatorName}</strong></span>
                      </div>

                      <button
                        onClick={() => {
                          onSelectTenant(tenant.id);
                          onNavigateToDossier(tenant.id);
                        }}
                        className="text-xs font-semibold text-[#4A6B53] hover:text-[#38523f] flex items-center gap-1 shrink-0"
                      >
                        <span>Open Dossier</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PLATFORM HIERARCHY MAP (Matches user's exact ASCII architecture diagram) */}
      {activeTab === 'hierarchy' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 sm:p-8 shadow-2xs space-y-6">
          <div className="text-center max-w-xl mx-auto mb-6">
            <span className="text-[11px] uppercase tracking-widest font-bold text-[#C5A059]">
              Architectural Structural Layout
            </span>
            <h2 className="font-editorial text-2xl font-normal text-stone-900 mt-1">
              CEQHS Multi-Tenant Ecosystem
            </h2>
            <p className="text-xs text-stone-500 mt-1.5">
              Visualizing the organizational governance from Platform Admin down to School Tenants and Users.
            </p>
          </div>

          {/* Interactive Hierarchy Flow Diagram */}
          <div className="flex flex-col items-center space-y-6 py-4">
            {/* Level 1: CEQHS PLATFORM ROOT */}
            <div className="w-full max-w-md p-4 rounded-2xl bg-gradient-to-r from-[#0D1B2A] to-[#1B2D44] text-white border-2 border-[#C5A059] shadow-md flex items-center justify-between">
              <div className="flex items-center gap-3">
                <CeqhsLogo size={36} />
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-wider text-[#DFC078]">Root Governance</div>
                  <div className="font-editorial text-base font-bold">CEQHS PLATFORM</div>
                </div>
              </div>
              <span className="text-[10px] font-semibold bg-white/10 px-2 py-0.5 rounded-full border border-white/20">
                Central Authority
              </span>
            </div>

            {/* Connecting Vertical Line */}
            <div className="w-0.5 h-6 bg-stone-300" />

            {/* Level 2: Split Branch (Platform Admin / CEQHS Team vs Tenants) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-3xl">
              {/* Branch A: Platform Admin / CEQHS Team */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-300 shadow-2xs">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
                  <Shield className="w-4 h-4 text-[#C5A059]" />
                  <div className="font-semibold text-xs text-stone-900 uppercase tracking-wide">
                    Platform Admin / CEQHS Team
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-stone-200">
                    <div>
                      <div className="font-semibold text-stone-900">Saugat Singh</div>
                      <div className="text-[10px] text-stone-500">CEQHS Senior Director & Journey Anchor</div>
                    </div>
                    <span className="text-[10px] bg-purple-100 text-purple-800 font-semibold px-2 py-0.5 rounded">
                      Super Admin
                    </span>
                  </div>
                  <div className="text-[11px] text-stone-500 italic px-1">
                    Oversees accreditation criteria, multi-tenant provisioning, and final review dialogues.
                  </div>
                </div>
              </div>

              {/* Branch B: Tenants Hub */}
              <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-stone-300 shadow-2xs">
                <div className="flex items-center gap-2.5 pb-2 border-b border-stone-200">
                  <Building2 className="w-4 h-4 text-[#4A6B53]" />
                  <div className="font-semibold text-xs text-stone-900 uppercase tracking-wide">
                    School & Org Tenants ({tenants.length})
                  </div>
                </div>
                <div className="mt-3 space-y-2 text-xs">
                  {tenants.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => onSelectTenant(t.id)}
                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                        t.id === activeTenantId
                          ? 'bg-[#EAF0EB] border-[#4A6B53] font-semibold text-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div>
                        <div className="text-xs font-semibold">{t.name}</div>
                        <div className="text-[10px] text-stone-500">{t.code} · {t.region}</div>
                      </div>
                      <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                        {t.dossierProgress}%
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Connecting Line to Onboarded Schools */}
            <div className="w-0.5 h-6 bg-stone-300" />

            {/* Level 3: Individual School Tenant Decomposition */}
            <div className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6">
              {tenants.map((tenant) => {
                const schoolUsers = tenantUsers.filter((u) => u.tenantId === tenant.id);
                const adminUser = schoolUsers.find((u) => u.role === 'school_admin');
                const coordUser = schoolUsers.find((u) => u.role === 'coordinator');
                const teachers = schoolUsers.filter((u) => u.role === 'teacher');

                return (
                  <div
                    key={tenant.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs space-y-4"
                  >
                    {/* School Header */}
                    <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-[#C5A059]">{tenant.code}</span>
                        <h4 className="font-editorial text-lg font-bold text-stone-900">{tenant.name}</h4>
                      </div>
                      <button
                        onClick={() => onNavigateToDossier(tenant.id)}
                        className="text-[11px] font-semibold text-[#4A6B53] hover:underline flex items-center gap-1"
                      >
                        <span>Dossier</span>
                        <ChevronRight className="w-3 h-3" />
                      </button>
                    </div>

                    {/* School Admin Box */}
                    <div className="p-3 rounded-xl bg-amber-50/70 border border-amber-200 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-amber-900 uppercase text-[10px] tracking-wider">
                          School Admin
                        </span>
                        {adminUser && (
                          <button
                            onClick={() => onImpersonateUser(adminUser)}
                            className="text-[10px] text-amber-800 font-semibold hover:underline"
                          >
                            View as Admin
                          </button>
                        )}
                      </div>
                      <div className="font-semibold text-stone-900">{tenant.leadAdminName}</div>
                      <div className="text-[11px] text-stone-600">{tenant.leadAdminEmail}</div>
                    </div>

                    {/* Users Sub-Branch: Teachers & Coordinator */}
                    <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                      <div className="font-bold text-stone-700 uppercase text-[10px] tracking-wider">
                        Users (Pedagogical Team)
                      </div>

                      {/* Coordinator */}
                      {coordUser && (
                        <div className="p-2 rounded-lg bg-white border border-emerald-200 flex items-center justify-between">
                          <div>
                            <div className="font-semibold text-stone-900">{coordUser.name}</div>
                            <div className="text-[10px] text-emerald-800 font-medium">CEQHS Coordinator</div>
                          </div>
                          <button
                            onClick={() => onImpersonateUser(coordUser)}
                            className="text-[10px] text-emerald-700 font-semibold hover:underline"
                          >
                            Impersonate
                          </button>
                        </div>
                      )}

                      {/* Teachers */}
                      <div className="space-y-1.5 pt-1">
                        <span className="text-[10px] text-stone-400 font-semibold uppercase">Contributing Teachers</span>
                        {teachers.map((t) => (
                          <div
                            key={t.id}
                            className="p-2 rounded-lg bg-white border border-stone-200 flex items-center justify-between"
                          >
                            <div>
                              <div className="font-semibold text-stone-900">{t.name}</div>
                              <div className="text-[10px] text-stone-500">{t.title}</div>
                            </div>
                            <button
                              onClick={() => onImpersonateUser(t)}
                              className="text-[10px] text-[#4A6B53] font-semibold hover:underline"
                            >
                              Impersonate
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ALL TENANTS TABLE & MANAGEMENT */}
      {activeTab === 'tenants' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Registered School Tenants</h2>
              <p className="text-xs text-stone-500">Manage school institutions, accreditation stages, and leadership leads</p>
            </div>
            <button
              onClick={() => setIsCreateTenantOpen(true)}
              className="px-3.5 py-2 bg-[#4A6B53] hover:bg-[#3d5945] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
            >
              <Building2 className="w-4 h-4" />
              <span>Create New School</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase font-semibold text-stone-500">
                  <th className="py-3 px-4">School Tenant</th>
                  <th className="py-3 px-4">Tenant Code</th>
                  <th className="py-3 px-4">Region</th>
                  <th className="py-3 px-4">Principal / Lead Admin</th>
                  <th className="py-3 px-4">Coordinator</th>
                  <th className="py-3 px-4">Dossier Stage</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {tenants.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-stone-900 text-sm">{t.name}</div>
                      <div className="text-[11px] text-stone-500">{t.academicYear}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-mono font-bold text-[11px] px-2 py-0.5 rounded bg-amber-50 text-amber-800 border border-amber-200">
                        {t.code}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">{t.region}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{t.leadAdminName}</div>
                      <div className="text-[11px] text-stone-500">{t.leadAdminEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{t.coordinatorName}</div>
                      <div className="text-[11px] text-stone-500">{t.coordinatorEmail}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="inline-flex items-center gap-1 font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full text-[10px]">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{t.dossierProgress}% ({t.dossierStage.replace('_', ' ')})</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => {
                          onSelectTenant(t.id);
                          onNavigateToDossier(t.id);
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-stone-100 hover:bg-[#EAF0EB] hover:text-[#4A6B53] font-semibold text-[11px] text-stone-700 transition-colors"
                      >
                        Open Dossier
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: TENANT USERS & ROLES */}
      {activeTab === 'users' && (
        <div className="bg-white border border-stone-200/90 rounded-2xl p-6 shadow-2xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-base font-bold text-stone-900">Tenant Users Directory</h2>
              <p className="text-xs text-stone-500">Assigned teachers, coordinators, and administrators contributing to living dossiers</p>
            </div>
            <button
              onClick={() => setIsCreateUserOpen(true)}
              className="px-3.5 py-2 bg-[#4A6B53] hover:bg-[#3d5945] text-white text-xs font-semibold rounded-xl flex items-center gap-2 shadow-2xs transition-colors self-start sm:self-auto"
            >
              <UserPlus className="w-4 h-4" />
              <span>Provision User</span>
            </button>
          </div>

          {/* Search & Filters */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <div className="relative flex-1 min-w-[200px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search staff by name, email, or title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B53]/30"
              />
            </div>

            <select
              value={filterTenantId}
              onChange={(e) => setFilterTenantId(e.target.value)}
              className="text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B53]/30"
            >
              <option value="all">All School Tenants</option>
              {tenants.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name} ({t.code})
                </option>
              ))}
            </select>

            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="text-xs py-2 px-3 bg-stone-50 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4A6B53]/30"
            >
              <option value="all">All Roles</option>
              <option value="school_admin">School Admin</option>
              <option value="coordinator">CEQHS Coordinator</option>
              <option value="teacher">Teacher</option>
            </select>
          </div>

          {/* Users Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-stone-700 border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-[11px] uppercase font-semibold text-stone-500">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Assigned Tenant</th>
                  <th className="py-3 px-4">Department / Title</th>
                  <th className="py-3 px-4">CEQHS SEI Focus</th>
                  <th className="py-3 px-4 text-right">Switch / Impersonate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredUsers.map((u) => (
                  <tr key={u.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-stone-200 text-stone-700 font-bold text-[11px] flex items-center justify-center shrink-0">
                          {u.avatarInitials || u.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900">{u.name}</div>
                          <div className="text-[11px] text-stone-500">{u.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          u.role === 'school_admin'
                            ? 'bg-amber-100 text-amber-800'
                            : u.role === 'coordinator'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {u.role === 'school_admin'
                          ? 'School Admin'
                          : u.role === 'coordinator'
                          ? 'Coordinator'
                          : 'Teacher'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">{u.tenantName}</td>
                    <td className="py-3.5 px-4">
                      <div className="font-medium text-stone-900">{u.title}</div>
                      <div className="text-[11px] text-stone-500">{u.department}</div>
                    </td>
                    <td className="py-3.5 px-4 text-stone-600">
                      <span className="text-[11px] bg-stone-100 px-2 py-0.5 rounded text-stone-700">
                        {u.competencyFocus || 'General Inquirer'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={() => onImpersonateUser(u)}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 hover:bg-[#4A6B53] hover:text-white font-semibold text-[11px] text-stone-700 transition-colors shadow-2xs"
                      >
                        Open as User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CREATE NEW TENANT MODAL */}
      {isCreateTenantOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] text-white flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900">Provision New School Tenant</h3>
                  <p className="text-xs text-stone-500">Add an institution to the CEQHS Living Field Journal</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateTenantOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTenantSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    School / Org Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Summit Hill Academy"
                    value={newTenantName}
                    onChange={(e) => setNewTenantName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Tenant Code / ID <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., TENANT-C"
                    value={newTenantCode}
                    onChange={(e) => setNewTenantCode(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl uppercase focus:ring-2 focus:ring-[#4A6B53]/30 font-mono"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">School Type</label>
                  <select
                    value={newTenantType}
                    onChange={(e) => setNewTenantType(e.target.value as Tenant['type'])}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30"
                  >
                    <option value="secondary">Secondary School</option>
                    <option value="high_school">High School</option>
                    <option value="k12">K-12 Academy</option>
                    <option value="charter">Charter School</option>
                    <option value="international">International School</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Region / District</label>
                  <input
                    type="text"
                    placeholder="e.g., Eastern District"
                    value={newTenantRegion}
                    onChange={(e) => setNewTenantRegion(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Academic Year</label>
                  <input
                    type="text"
                    value={newTenantYear}
                    onChange={(e) => setNewTenantYear(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30"
                  />
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100">
                <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block mb-2">
                  Leadership Contacts
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Principal / Head</label>
                    <input
                      type="text"
                      placeholder="e.g., Dr. Robert Diaz"
                      value={newTenantLeadName}
                      onChange={(e) => setNewTenantLeadName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Principal Email</label>
                    <input
                      type="email"
                      placeholder="r.diaz@school.edu"
                      value={newTenantLeadEmail}
                      onChange={(e) => setNewTenantLeadEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">CEQHS Coordinator</label>
                    <input
                      type="text"
                      placeholder="e.g., Claire Dupont"
                      value={newTenantCoordName}
                      onChange={(e) => setNewTenantCoordName(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">Coordinator Email</label>
                    <input
                      type="email"
                      placeholder="c.dupont@school.edu"
                      value={newTenantCoordEmail}
                      onChange={(e) => setNewTenantCoordEmail(e.target.value)}
                      className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">School Motto or Intention</label>
                <input
                  type="text"
                  placeholder="e.g., Leading with empathy, dignity, and restorative clarity."
                  value={newTenantMotto}
                  onChange={(e) => setNewTenantMotto(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateTenantOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4A6B53] hover:bg-[#3d5945] rounded-xl shadow-2xs"
                >
                  Provision School Tenant
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE NEW USER MODAL */}
      {isCreateUserOpen && (
        <div className="fixed inset-0 bg-stone-950/40 backdrop-blur-xs flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl border border-stone-200 shadow-xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-6 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#0D1B2A] text-white flex items-center justify-center">
                  <UserPlus className="w-5 h-5 text-[#C5A059]" />
                </div>
                <div>
                  <h3 className="font-editorial text-lg font-bold text-stone-900">Provision User to Tenant</h3>
                  <p className="text-xs text-stone-500">Add an educator, coordinator, or admin for dossier development</p>
                </div>
              </div>
              <button
                onClick={() => setIsCreateUserOpen(false)}
                className="text-stone-400 hover:text-stone-700 p-1 text-sm font-semibold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateUserSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  Assign to School Tenant <span className="text-red-500">*</span>
                </label>
                <select
                  required
                  value={newUserTenantId}
                  onChange={(e) => setNewUserTenantId(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30 font-medium"
                >
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.code})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Full Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g., Sarah Jenkins"
                    value={newUserName}
                    onChange={(e) => setNewUserName(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="e.g., s.jenkins@school.edu"
                    value={newUserEmail}
                    onChange={(e) => setNewUserEmail(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Role in Tenant <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={newUserRole}
                    onChange={(e) => setNewUserRole(e.target.value as 'school_admin' | 'coordinator' | 'teacher')}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl focus:ring-2 focus:ring-[#4A6B53]/30 font-semibold"
                  >
                    <option value="teacher">Teacher</option>
                    <option value="coordinator">Coordinator</option>
                    <option value="school_admin">School Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">Department / Subject</label>
                  <input
                    type="text"
                    placeholder="e.g., Grade 10 English Literature"
                    value={newUserDepartment}
                    onChange={(e) => setNewUserDepartment(e.target.value)}
                    className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Title / Designation</label>
                <input
                  type="text"
                  placeholder="e.g., Department Chair & Advisory Lead"
                  value={newUserTitle}
                  onChange={(e) => setNewUserTitle(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  SEI Competency Inquiring Focus
                </label>
                <select
                  value={newUserCompetency}
                  onChange={(e) => setNewUserCompetency(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-stone-300 rounded-xl"
                >
                  <option value="Know Yourself (Emotional Literacy)">Know Yourself (Emotional Literacy & Patterns)</option>
                  <option value="Choose Yourself (Consequential Thinking)">Choose Yourself (Consequential Thinking & Optimism)</option>
                  <option value="Give Yourself (Empathy Cultivation)">Give Yourself (Empathy Cultivation & Purpose)</option>
                  <option value="Restorative Inquiry (Whole School)">Restorative Inquiry (Whole School)</option>
                </select>
              </div>

              <div className="pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateUserOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:bg-stone-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-xs font-semibold text-white bg-[#4A6B53] hover:bg-[#3d5945] rounded-xl shadow-2xs"
                >
                  Provision User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
