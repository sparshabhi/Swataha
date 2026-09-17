import React from 'react';
import {
  GraduationCap,
  Sprout,
  BookOpen,
  BarChart3,
  ClipboardList,
  Users,
  Layers,
  Settings,
  ArrowUpRight,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import {
  CEQHSStaffUser,
  CEQHSPartnerSchool,
  DossierItemEvidence,
  MilestoneItem,
  SupportCaseItem,
} from '../../types/ceqhsUser';

interface CeqhsWorkspaceChooserProps {
  currentUser: CEQHSStaffUser;
  schools: CEQHSPartnerSchool[];
  dossierItems: DossierItemEvidence[];
  milestones: MilestoneItem[];
  supportCases: SupportCaseItem[];
  pendingApprovalsCount?: number;
  onNavigate: (route: string, filterParam?: string) => void;
  onOpenSchoolWorkspace: (schoolId: string) => void;
  onAddSchool: () => void;
  onOpenCardsApp: () => void;
  onOpenKnowledgeBase: () => void;
  onOpenFreshResetModal?: () => void;
}

type WorkspaceCategory = 'operations' | 'reporting' | 'admin';

interface WorkspaceCardItem {
  id: string;
  icon: React.ElementType;
  title: string;
  countLabel?: string;
  badgeTone?: 'urgent' | 'neutral';
  category: WorkspaceCategory;
  route: string;
  action?: () => void;
}

export const CeqhsWorkspaceChooser: React.FC<CeqhsWorkspaceChooserProps> = ({
  currentUser: _currentUser,
  schools,
  dossierItems,
  milestones,
  pendingApprovalsCount = 3,
  onNavigate,
  onOpenFreshResetModal,
}) => {
  // Calculated live metrics
  const activeSchoolsCount = schools.filter((s) => s.status === 'Active').length || schools.length;
  const pendingDossierCount =
    dossierItems.filter((d) => d.reviewStatus === 'Awaiting review').length || 1;
  const activeMilestonesCount =
    milestones.filter((m) => m.status === 'Evidence Submitted' || m.status === 'In Progress').length || 2;

  // 1. OPERATIONS (4 cards)
  const operationsCards: WorkspaceCardItem[] = [
    {
      id: 'schools',
      icon: GraduationCap,
      title: 'Partner Schools',
      countLabel: `${activeSchoolsCount} Active (Grades 1–5)`,
      badgeTone: 'neutral',
      category: 'operations',
      route: 'schools',
      action: () => onNavigate('schools'),
    },
    {
      id: 'approvals',
      icon: ShieldCheck,
      title: 'Approvals Hub',
      countLabel: `${pendingApprovalsCount} Pending Founder Review`,
      badgeTone: 'urgent', // Urgent actionable pill in amber
      category: 'operations',
      route: 'approvals',
      action: () => onNavigate('approvals'),
    },
    {
      id: 'curriculum',
      icon: BookOpen,
      title: 'Curriculum Alignment',
      countLabel: 'IB · Oxford · Cambridge · NC',
      badgeTone: 'neutral',
      category: 'operations',
      route: 'curriculum',
      action: () => onNavigate('curriculum'),
    },
    {
      id: 'implementation',
      icon: Sprout,
      title: 'Implementation',
      countLabel: `${activeMilestonesCount} Active Workstreams`,
      badgeTone: 'neutral',
      category: 'operations',
      route: 'milestones',
      action: () => onNavigate('milestones'),
    },
  ];

  // 2. REPORTING (3 cards)
  const reportingCards: WorkspaceCardItem[] = [
    {
      id: 'impact-evidence',
      icon: ShieldCheck,
      title: 'Impact & Evidence Portal',
      countLabel: '12 Layers · Verified Traceability',
      badgeTone: 'neutral',
      category: 'reporting',
      route: 'impact-evidence',
      action: () => onNavigate('impact-evidence'),
    },
    {
      id: 'dossier-review',
      icon: Layers,
      title: 'Dossier Review',
      countLabel: `${pendingDossierCount} Ready for Review`,
      badgeTone: 'neutral',
      category: 'reporting',
      route: 'dossier-review',
      action: () => onNavigate('dossier-review'),
    },
    {
      id: 'network-insights',
      icon: BarChart3,
      title: 'Network Insights',
      countLabel: 'Grades 1–5 Scoped',
      badgeTone: 'neutral',
      category: 'reporting',
      route: 'reports',
      action: () => onNavigate('reports'),
    },
  ];

  // 3. ADMIN & GOVERNANCE (3 cards)
  const adminCards: WorkspaceCardItem[] = [
    {
      id: 'phases-practices',
      icon: ClipboardList,
      title: 'Phases & Practices',
      countLabel: 'Primary SEL & Baseline',
      badgeTone: 'neutral',
      category: 'admin',
      route: 'surveys',
      action: () => onNavigate('surveys'),
    },
    {
      id: 'ceqhs-team',
      icon: Users,
      title: 'CEQHS Governance',
      countLabel: 'Single Founder Authority',
      badgeTone: 'neutral',
      category: 'admin',
      route: 'team',
      action: () => onNavigate('team'),
    },
    {
      id: 'control-center',
      icon: Settings,
      title: 'Control Center & Reset',
      countLabel: 'Development Pilot',
      badgeTone: 'neutral',
      category: 'admin',
      route: 'settings',
      action: onOpenFreshResetModal ? onOpenFreshResetModal : () => onNavigate('settings'),
    },
  ];

  // Top accent border per category (Max 3 consistent colors)
  const getCardBorderClass = (category: WorkspaceCategory) => {
    switch (category) {
      case 'operations':
        return 'border-t-3 border-t-emerald-700 hover:border-emerald-600';
      case 'reporting':
        return 'border-t-3 border-t-blue-700 hover:border-blue-600';
      case 'admin':
        return 'border-t-3 border-t-amber-700 hover:border-amber-600';
    }
  };

  // Icon tint and hover effect per category
  const getCardIconStyle = (category: WorkspaceCategory) => {
    switch (category) {
      case 'operations':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200/70 group-hover:bg-[#1B3626] group-hover:text-white';
      case 'reporting':
        return 'bg-blue-50 text-blue-800 border-blue-200/70 group-hover:bg-[#1E40AF] group-hover:text-white';
      case 'admin':
        return 'bg-amber-50 text-amber-900 border-amber-200/70 group-hover:bg-[#78350F] group-hover:text-white';
    }
  };

  // Status pill with verified WCAG AAA contrast ratio
  const renderBadge = (item: WorkspaceCardItem) => {
    if (!item.countLabel) {
      return <div className="h-5 shrink-0" aria-hidden="true" />;
    }

    // Urgent / Actionable: warm amber pill
    if (item.badgeTone === 'urgent') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100/90 text-amber-950 border border-amber-300 shadow-2xs shrink-0">
          {item.countLabel}
        </span>
      );
    }

    // Purely descriptive: neutral stone gray pill
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-stone-100 text-stone-700 border border-stone-200/90 shrink-0">
        {item.countLabel}
      </span>
    );
  };

  const renderCard = (item: WorkspaceCardItem) => {
    const IconComponent = item.icon;

    return (
      <button
        key={item.id}
        onClick={item.action}
        className={`group relative bg-white hover:bg-[#FAFAF9] rounded-xl border border-stone-200 p-3.5 sm:p-4 flex flex-col justify-between text-left transition-all duration-150 shadow-2xs hover:shadow-xs focus:outline-none focus:ring-2 focus:ring-[#2D5A3D]/20 cursor-pointer overflow-hidden min-h-[135px] sm:min-h-[145px] ${getCardBorderClass(
          item.category
        )}`}
        id={`workspace-card-${item.id}`}
      >
        {/* Top row: Icon with boosted stroke width + Arrow icon */}
        <div className="flex items-start justify-between w-full">
          <div
            className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl flex items-center justify-center shrink-0 border transition-colors ${getCardIconStyle(
              item.category
            )}`}
          >
            <IconComponent className="w-5 h-5 sm:w-5.5 sm:h-5.5 stroke-[2.25]" strokeWidth={2.25} />
          </div>
          <ArrowUpRight className="w-4 h-4 text-stone-300 group-hover:text-stone-700 shrink-0 transition-colors" />
        </div>

        {/* Bottom row: Title and Status Pill */}
        <div className="mt-3">
          <h3 className="text-xs sm:text-sm font-bold text-stone-900 group-hover:text-stone-950 transition-colors line-clamp-1 leading-snug">
            {item.title}
          </h3>
          <div className="mt-1.5">{renderBadge(item)}</div>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full flex-1 flex flex-col px-4 sm:px-6 lg:px-8 py-4 sm:py-5 max-w-6xl mx-auto">
      {/* 1. CLEAN HEADER (No duplicate center logo, no screaming banner) */}
      <div className="mb-5 sm:mb-6 shrink-0">
        <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-1 border-b border-stone-200/80 pb-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-stone-900 font-editorial tracking-tight">
              Choose a Workspace
            </h1>
            <p className="text-xs text-stone-500 mt-0.5 font-medium">
              Founder Leadership Portal · Saugat Singh
            </p>
          </div>
          <div className="text-right hidden sm:block">
            <span className="text-xs font-semibold text-stone-600 bg-stone-100 px-2.5 py-1 rounded-md border border-stone-200">
              Grades 1–5 Pilot · Swataha Core
            </span>
          </div>
        </div>
      </div>

      {/* 2. GROUPED CARDS CONTAINER */}
      <div className="space-y-5 sm:space-y-6 flex-1">
        {/* FEATURED: CEQHS LIVING JOURNEY (PRIMARY PILOT) */}
        <div className="bg-gradient-to-r from-[#1B3626] to-[#244733] rounded-2xl p-5 text-white shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4 border border-[#2D5A3D]/40">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-emerald-800/80 text-[10px] font-bold uppercase tracking-wider text-emerald-100 border border-emerald-700/50">
                Primary School Pilot
              </span>
              <span className="text-xs text-emerald-200/80 font-medium">
                Swataha Core School · Grades 1–5
              </span>
            </div>
            <h2 className="text-lg font-bold tracking-tight">
              CEQHS Living Journey Workspace
            </h2>
            <p className="text-xs text-emerald-100/80 max-w-xl">
              Annual plan composer, 4 curriculum adapters (IB PYP, Oxford, Cambridge, NCF 2076), 7 canonical activities, adult presence journal, and 4-tier evidence ledger.
            </p>
          </div>

          <div className="flex items-center shrink-0">
            <button
              onClick={() => onNavigate('living-dashboard')}
              className="px-4 py-2.5 rounded-xl bg-white hover:bg-stone-100 text-[#1B3626] text-xs font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>Open Living Journey</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* GROUP 1: OPERATIONS (4 cards) */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-700 inline-block" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-emerald-950">
              Operations
            </span>
            <span className="text-[10px] text-stone-500 font-medium ml-1">
              (Partner Schools, Approvals, Curriculum &amp; Milestones)
            </span>
            <div className="h-px bg-stone-200 flex-1 ml-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-3.5">
            {operationsCards.map((item) => renderCard(item))}
          </div>
        </div>

        {/* GROUP 2: REPORTING (2 cards) */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-blue-700 inline-block" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-blue-950">
              Reporting
            </span>
            <span className="text-[10px] text-stone-500 font-medium ml-1">
              (Dossier Review &amp; Network Analytics)
            </span>
            <div className="h-px bg-stone-200 flex-1 ml-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-3 sm:gap-3.5 max-w-2xl">
            {reportingCards.map((item) => renderCard(item))}
          </div>
        </div>

        {/* GROUP 3: ADMIN / GOVERNANCE (3 cards) */}
        <div>
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-2 h-2 rounded-full bg-amber-700 inline-block" />
            <span className="text-[11px] font-bold tracking-wider uppercase text-amber-950">
              Admin &amp; Governance
            </span>
            <span className="text-[10px] text-stone-500 font-medium ml-1">
              (Practices, Founder Authority &amp; System Reset)
            </span>
            <div className="h-px bg-stone-200 flex-1 ml-2" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-3 gap-3 sm:gap-3.5">
            {adminCards.map((item) => renderCard(item))}
          </div>
        </div>
      </div>
    </div>
  );
};
