import React, { useState } from 'react';
import {
  Grid,
  ChevronDown,
  LogOut,
  ArrowLeft,
  Check,
  ShieldCheck,
  BookOpen,
  RotateCcw,
  Bell,
  LayoutGrid,
  GraduationCap,
  Sprout,
  BarChart3,
  ClipboardList,
  Users,
  Layers,
  Settings,
  Award,
} from 'lucide-react';
import { CEQHSStaffUser } from '../../types/ceqhsUser';
import { CeqhsLogo } from '../CeqhsLogo';

interface CeqhsLayoutProps {
  currentUser: CEQHSStaffUser;
  allStaff: CEQHSStaffUser[];
  activeRoute: string;
  onNavigate: (route: string) => void;
  onSwitchUser: (staffId: string) => void;
  onSignOut: () => void;
  onOpenLauncher?: () => void;
  onAddSchool: () => void;
  onOpenCardsApp?: () => void;
  onOpenKnowledgeBase?: () => void;
  onOpenFreshResetModal?: () => void;
  pendingApprovalsCount?: number;
  pendingDossierCount?: number;
  pendingMilestoneCount?: number;
  openSupportCount?: number;
  children: React.ReactNode;
}

export const CeqhsLayout: React.FC<CeqhsLayoutProps> = ({
  currentUser,
  allStaff,
  activeRoute,
  onNavigate,
  onSwitchUser,
  onSignOut,
  onAddSchool,
  onOpenCardsApp,
  onOpenKnowledgeBase,
  onOpenFreshResetModal,
  pendingApprovalsCount = 3,
  pendingDossierCount = 1,
  pendingMilestoneCount = 1,
  openSupportCount = 3,
  children,
}) => {
  const [isNavMenuOpen, setIsNavMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [currentLang, setCurrentLang] = useState('EN');

  // Close menus when clicking outside
  const closeAllMenus = () => {
    setIsNavMenuOpen(false);
    setIsUserMenuOpen(false);
    setIsLangMenuOpen(false);
  };

  // Route labels for breadcrumbs
  const getRouteLabel = (route: string) => {
    switch (route) {
      case 'approvals':
        return 'Approvals Hub';
      case 'curriculum':
        return 'Curriculum Alignment (Grades 1–5)';
      case 'schools':
        return 'Partner Schools';
      case 'milestones':
        return 'Phases & Practices';
      case 'dossier-review':
        return 'Dossier Review';
      case 'reports':
        return 'Network Insights';
      case 'surveys':
        return 'Surveys & Baseline';
      case 'team':
        return 'CEQHS Team';
      case 'programme-studio':
        return 'Programme Studio';
      case 'settings':
        return 'Control Center & Reset';
      case 'school-workspace':
        return 'School Implementation Workspace';
      case 'training':
        return 'Educator Academy';
      case 'overview':
        return 'Overview';
      case 'living-dashboard':
        return 'Living Journey Dashboard';
      case 'school-profile':
        return 'School Profile';
      case 'needs-baseline':
        return 'Needs & Baseline';
      case 'ceqhs-plan':
        return 'CEQHS Annual Plan';
      case 'curriculum-integration':
        return 'Curriculum Integration';
      case 'activity-library':
        return 'Practice Library';
      case 'adult-development':
        return 'Adult Development';
      case 'evidence-impact':
        return 'Evidence & Impact';
      case 'impact-evidence':
        return 'Impact & Evidence Portal';
      case 'award-progress':
        return 'Award Progress';
      case 'administration':
        return 'Platform Administration';
      default:
        return 'Workspace';
    }
  };

  const isHomeWorkspace = activeRoute === 'workspaces' || activeRoute === 'applications';

  return (
    <div
      className={`bg-[#FDFBF7] text-stone-800 flex flex-col font-sans ${
        isHomeWorkspace ? 'h-[100dvh] max-h-[100dvh] overflow-hidden' : 'min-h-screen'
      }`}
      onClick={() => {
        if (isUserMenuOpen || isLangMenuOpen) {
          closeAllMenus();
        }
      }}
    >
      {/* ---------------------------------------------------------------- */}
      {/* GLOBAL HEADER: CEQHS BRANDING MATCHING LANDING PAGE              */}
      {/* ---------------------------------------------------------------- */}
      <header className="sticky top-0 z-40 bg-white border-b border-stone-200 shrink-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-[64px] sm:min-h-[72px] py-2 flex items-center justify-between gap-4">
          {/* LEFT: CEQHS BRANDING (Fixed min-width, no wrapping or overlap) */}
          <div className="flex items-center gap-3 shrink-0" style={{ display: 'flex', alignItems: 'center' }}>
            <button
              onClick={() => onNavigate('workspaces')}
              className="text-left group focus:outline-none cursor-pointer"
              style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
              title="Choose a workspace"
            >
              <img
                src="https://ibb.co/8nxMTMnN"
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png') {
                    target.src = 'https://i.ibb.co/NgNxQxgt/Untitled-design-2.png';
                  } else if (target.src !== '/ceqhs-logo.png') {
                    target.src = '/ceqhs-logo.png';
                  }
                }}
                alt="CEQHS Official Logo"
                style={{
                  height: '55px',
                  width: 'auto',
                  objectFit: 'contain',
                  flexShrink: 0,
                  borderRadius: '0',
                }}
              />
              <div className="flex flex-col leading-tight min-w-[230px] sm:min-w-[270px] select-none">
                <div className="flex items-center gap-1.5 whitespace-nowrap" style={{ display: 'flex', alignItems: 'center' }}>
                  <span className="font-editorial text-lg font-bold tracking-tight text-[#1B3626]">
                    CEQHS
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20 whitespace-nowrap">
                    Living Journal
                  </span>
                </div>
                <span className="text-[11px] text-stone-500 font-medium tracking-tight whitespace-nowrap">
                  Grades 1–5 Pilot · Swataha Core
                </span>
              </div>
            </button>
          </div>

          {/* CENTER / COLLAPSED NAV: Dropdown for Workspaces (Replaces 8 horizontal links) */}
          <div className="relative">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsNavMenuOpen(!isNavMenuOpen);
                setIsUserMenuOpen(false);
                setIsLangMenuOpen(false);
              }}
              className={`px-3 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
                isNavMenuOpen || (!isHomeWorkspace && activeRoute !== 'overview')
                  ? 'bg-[#EAF0EB] text-[#1B3626] border-[#2D5A3D]/30 shadow-2xs'
                  : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
              }`}
              aria-label="Navigation Menu"
            >
              <LayoutGrid className="w-4 h-4 text-[#1B3626]" />
              <span className="max-w-[140px] sm:max-w-[180px] truncate">
                {isHomeWorkspace ? 'Workspaces' : getRouteLabel(activeRoute)}
              </span>
              <ChevronDown
                className={`w-3.5 h-3.5 text-stone-500 transition-transform duration-150 ${
                  isNavMenuOpen ? 'rotate-180' : ''
                }`}
              />
            </button>

            {isNavMenuOpen && (
              <div
                className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 mt-2 w-72 sm:w-80 bg-white rounded-xl border border-stone-200 shadow-xl py-2 z-50 animate-in fade-in zoom-in-95 duration-150 max-h-[80vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="px-3.5 py-1.5 border-b border-stone-100 flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                    Workspaces &amp; Modules
                  </span>
                  <button
                    onClick={() => {
                      onNavigate('workspaces');
                      setIsNavMenuOpen(false);
                    }}
                    className="text-[11px] text-[#2D5A3D] hover:underline font-semibold cursor-pointer"
                  >
                    All Workspaces
                  </button>
                </div>

                {/* Categories inside dropdown */}
                <div className="p-1.5 space-y-1">
                  {/* Living Journey Modules (Section 9 Specification) */}
                  <div className="px-2 pt-1.5 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-[#1B3626] flex items-center justify-between">
                    <span>Swataha Living Journey</span>
                    <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-800 font-semibold">Grades 1–5</span>
                  </div>
                  {[
                    { id: 'living-dashboard', label: 'School Journey Dashboard', icon: Sprout },
                    { id: 'ceqhs-plan', label: 'Annual Plan & Timetable', icon: ClipboardList },
                    { id: 'curriculum-integration', label: 'Curriculum Integration', icon: BookOpen },
                    { id: 'activity-library', label: 'Practice Library (7 Canon)', icon: Layers },
                    { id: 'adult-development', label: 'Adult Competencies & Journal', icon: Users },
                    { id: 'evidence-impact', label: 'Evidence & Impact Ledger', icon: BarChart3 },
                    { id: 'impact-evidence', label: 'Impact & Evidence Section (New)', icon: ShieldCheck },
                    { id: 'award-progress', label: 'Three-Year Award Pathway', icon: Award },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsNavMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                          activeRoute === item.id
                            ? 'bg-[#EAF0EB] text-[#1B3626] font-semibold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-[#EAF0EB] text-[#1B3626] flex items-center justify-center shrink-0 border border-[#2D5A3D]/20">
                          <Icon className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Operations */}
                  <div className="px-2 pt-2.5 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                    Network Operations
                  </div>
                  {[
                    { id: 'schools', label: 'Partner Schools', icon: GraduationCap },
                    { id: 'approvals', label: 'Approvals Hub', icon: ShieldCheck }, // Notification count kept exclusively on card per brief
                    { id: 'curriculum', label: 'Curriculum Alignment', icon: BookOpen },
                    { id: 'milestones', label: 'Implementation', icon: Sprout },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsNavMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                          activeRoute === item.id
                            ? 'bg-[#EAF0EB] text-[#1B3626] font-semibold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 border border-emerald-200/60">
                          <Icon className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Reporting */}
                  <div className="px-2 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-blue-800">
                    Reporting
                  </div>
                  {[
                    { id: 'dossier-review', label: 'Dossier Review', icon: Layers },
                    { id: 'reports', label: 'Network Insights', icon: BarChart3 },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsNavMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                          activeRoute === item.id
                            ? 'bg-blue-50 text-blue-900 font-semibold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-blue-50 text-blue-800 flex items-center justify-center shrink-0 border border-blue-200/60">
                          <Icon className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}

                  {/* Admin & Governance */}
                  <div className="px-2 pt-2 pb-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-900">
                    Admin &amp; Governance
                  </div>
                  {[
                    { id: 'surveys', label: 'Phases & Practices', icon: ClipboardList },
                    { id: 'team', label: 'CEQHS Governance', icon: Users },
                    { id: 'settings', label: 'Control Center & Reset', icon: Settings },
                  ].map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => {
                          onNavigate(item.id);
                          setIsNavMenuOpen(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center gap-2.5 text-xs transition-colors cursor-pointer ${
                          activeRoute === item.id
                            ? 'bg-amber-50 text-amber-950 font-semibold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <div className="w-6 h-6 rounded-md bg-amber-50 text-amber-900 flex items-center justify-center shrink-0 border border-amber-200/60">
                          <Icon className="w-3.5 h-3.5 stroke-[2]" />
                        </div>
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Notifications + [ EN ▾ ] + User Profile */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            {/* Notifications quick button */}
            <button
              onClick={() => onNavigate('approvals')}
              className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition-colors cursor-pointer"
              title="Approvals & Notifications"
              aria-label="Approvals & Notifications"
            >
              <Bell className="w-4 h-4" />
            </button>

            {/* Language Selector */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsLangMenuOpen(!isLangMenuOpen);
                  setIsUserMenuOpen(false);
                }}
                className="bg-white hover:bg-stone-50 text-stone-700 border border-stone-300 rounded px-2.5 py-1 text-xs font-medium flex items-center gap-1.5 shadow-2xs transition-colors cursor-pointer focus:outline-none focus:border-[#2D5A3D]"
                aria-label="Select language"
              >
                <span>{currentLang}</span>
                <ChevronDown className="w-3 h-3 text-stone-500" />
              </button>

              {isLangMenuOpen && (
                <div className="absolute right-0 mt-1.5 w-36 bg-white rounded-lg border border-stone-200 shadow-lg py-1 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  {['EN', 'ES', 'FR', 'DE'].map((lang) => (
                    <button
                      key={lang}
                      onClick={() => {
                        setCurrentLang(lang);
                        setIsLangMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 flex items-center justify-between hover:bg-[#EAF0EB] cursor-pointer ${
                        currentLang === lang ? 'text-[#1B3626] font-semibold bg-[#EAF0EB]/50' : 'text-stone-700'
                      }`}
                    >
                      <span>
                        {lang === 'EN'
                          ? 'English'
                          : lang === 'ES'
                          ? 'Español'
                          : lang === 'FR'
                          ? 'Français'
                          : 'Deutsch'}
                      </span>
                      {currentLang === lang && <Check className="w-3.5 h-3.5 text-[#2D5A3D]" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* User Avatar with Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsUserMenuOpen(!isUserMenuOpen);
                  setIsLangMenuOpen(false);
                }}
                className="flex items-center gap-1.5 p-1 rounded-full hover:ring-2 hover:ring-[#2D5A3D]/20 transition-all focus:outline-none cursor-pointer"
                aria-label="User profile menu"
              >
                <div className="w-8 h-8 rounded-full bg-[#1B3626] text-white flex items-center justify-center font-bold text-xs shadow-2xs border border-white">
                  {currentUser.avatarInitials || 'SS'}
                </div>
                <div className="hidden xl:flex flex-col text-left leading-none">
                  <span className="text-xs font-bold text-stone-900 truncate max-w-[120px]">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-stone-500 font-medium truncate max-w-[120px] mt-0.5">
                    {currentUser.role === 'platform_admin' ? 'Founder & Super Admin' : currentUser.title}
                  </span>
                </div>
                <ChevronDown className="w-3 h-3 text-stone-500 hidden sm:block" />
              </button>

              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-76 bg-white rounded-xl border border-stone-200 shadow-xl py-2 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
                  {/* Current User Header */}
                  <div className="px-4 py-2.5 border-b border-stone-100">
                    <div className="font-bold text-stone-900 text-sm">{currentUser.name}</div>
                    <div className="text-stone-500 text-[11px]">{currentUser.email}</div>
                    <div className="mt-1 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#EAF0EB] text-[#1B3626] border border-[#2D5A3D]/20">
                        {currentUser.role === 'platform_admin' ? 'Founder & Sole Super Admin' : currentUser.role.replace('_', ' ')}
                      </span>
                    </div>
                  </div>

                  {/* Switch Staff Persona */}
                  <div className="py-2 border-b border-stone-100">
                    <span className="px-4 py-1 text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                      Switch Staff Persona
                    </span>
                    {allStaff.map((st) => (
                      <button
                        key={st.id}
                        onClick={() => {
                          onSwitchUser(st.id);
                          setIsUserMenuOpen(false);
                        }}
                        className={`w-full text-left px-4 py-1.5 flex items-center justify-between hover:bg-stone-50 cursor-pointer ${
                          st.id === currentUser.id ? 'font-semibold text-[#1B3626] bg-[#EAF0EB]/50' : 'text-stone-700'
                        }`}
                      >
                        <div className="truncate">
                          <span className="block truncate font-medium">{st.name}</span>
                          <span className="text-[10px] text-stone-400 capitalize block -mt-0.5">
                            {st.role === 'platform_admin' ? 'Sole Super Admin' : st.title}
                          </span>
                        </div>
                        {st.id === currentUser.id && (
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2D5A3D]" />
                        )}
                      </button>
                    ))}
                  </div>

                  {/* Founder Actions */}
                  {onOpenFreshResetModal && (
                    <div className="py-1 border-b border-stone-100">
                      <button
                        onClick={() => {
                          setIsUserMenuOpen(false);
                          onOpenFreshResetModal();
                        }}
                        className="w-full text-left px-4 py-2 hover:bg-rose-50 text-rose-700 font-semibold flex items-center gap-2 cursor-pointer transition-colors"
                      >
                        <RotateCcw className="w-3.5 h-3.5 text-rose-600" />
                        <span>Protected Pilot Reset (Founder)</span>
                      </button>
                    </div>
                  )}

                  {/* Quick links & Sign Out */}
                  <div className="pt-1">
                    <button
                      onClick={() => {
                        onNavigate('workspaces');
                        setIsUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <Grid className="w-3.5 h-3.5 text-stone-400" />
                      <span>Choose a workspace</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsUserMenuOpen(false);
                        onSignOut();
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-stone-50 text-stone-700 font-medium flex items-center gap-2 cursor-pointer"
                    >
                      <LogOut className="w-3.5 h-3.5 text-stone-400" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ---------------------------------------------------------------- */}
      {/* SECONDARY BREADCRUMB BAR (Only shown on non-home screens)        */}
      {/* ---------------------------------------------------------------- */}
      {!isHomeWorkspace && (
        <div className="bg-[#FAF9F5] border-b border-stone-200/80 px-4 sm:px-6 lg:px-8 py-2 shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-stone-500">
              <button
                onClick={() => onNavigate('workspaces')}
                className="hover:text-[#1B3626] transition-colors flex items-center gap-1 font-medium cursor-pointer"
              >
                <ArrowLeft className="w-3 h-3" />
                <span>Workspaces</span>
              </button>
              <span className="text-stone-300">/</span>
              <span className="text-stone-900 font-semibold">{getRouteLabel(activeRoute)}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onAddSchool}
                className="px-3 py-1 rounded bg-[#1B3626] text-white font-medium hover:bg-[#2D5A3D] transition-colors text-xs cursor-pointer shadow-xs"
              >
                + Onboard School
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------------------- */}
      {/* MAIN CONTENT AREA                                                */}
      {/* ---------------------------------------------------------------- */}
      <main
        className={`flex-1 ${
          isHomeWorkspace
            ? 'h-[calc(100dvh-4rem)] overflow-y-auto flex flex-col'
            : 'max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6'
        }`}
      >
        {children}
      </main>
    </div>
  );
};
