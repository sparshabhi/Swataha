import React, { useState } from 'react';
import {
  FileCheck2,
  CalendarDays,
  Layers,
  Wrench,
  GraduationCap,
  Sparkles,
  Building2,
  HelpCircle,
  PlusCircle,
  Users,
  ExternalLink,
  ArrowRight,
  Clock,
  AlertTriangle,
  BarChart3,
} from 'lucide-react';
import {
  CEQHSStaffUser,
  CEQHSPartnerSchool,
  DossierItemEvidence,
  MilestoneItem,
  SupportCaseItem,
} from '../../types/ceqhsUser';

interface CeqhsApplicationsDashboardProps {
  currentUser: CEQHSStaffUser;
  schools: CEQHSPartnerSchool[];
  dossierItems: DossierItemEvidence[];
  milestones: MilestoneItem[];
  supportCases: SupportCaseItem[];
  onNavigate: (route: string, filterParam?: string) => void;
  onOpenSchoolWorkspace: (schoolId: string) => void;
  onAddSchool: () => void;
  onOpenCardsApp: () => void;
  onOpenKnowledgeBase: () => void;
}

export const CeqhsApplicationsDashboard: React.FC<CeqhsApplicationsDashboardProps> = ({
  currentUser,
  schools,
  dossierItems,
  milestones,
  supportCases,
  onNavigate,
  onOpenSchoolWorkspace,
  onAddSchool,
  onOpenCardsApp,
  onOpenKnowledgeBase,
}) => {
  // Currently hovered or selected application card (defaults to eLearning as seen in screenshot)
  const [activeCardId, setActiveCardId] = useState<string>('elearning');

  // Summary counts
  const pendingDossiers = dossierItems.filter((d) => d.reviewStatus === 'Awaiting review').length;
  const pendingMilestones = milestones.filter((m) => m.status === 'Evidence Submitted').length;
  const openCases = supportCases.filter((s) => s.status !== 'Resolved').length;

  // Exact application cards list matching Six Seconds SSO Dashboard
  const applications = [
    {
      id: 'cert-home',
      title: 'Cert Home',
      subtitle: 'Accreditation & Dossier Review',
      badge: pendingDossiers > 0 ? `${pendingDossiers} Pending` : null,
      badgeColor: 'bg-rose-50 text-rose-700 border-rose-200',
      action: () => onNavigate('dossier-review'),
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <path d="M9 15l2 2 4-4" />
          <circle cx="12" cy="15" r="3" stroke="#0099FF" fill="none" />
        </svg>
      ),
    },
    {
      id: 'my-events',
      title: 'My Events',
      subtitle: 'Milestones & Implementation',
      badge: pendingMilestones > 0 ? `${pendingMilestones} Ready` : null,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => onNavigate('milestones'),
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          <circle cx="8" cy="14" r="1" fill="#0099FF" />
          <circle cx="12" cy="14" r="1" fill="#0099FF" />
          <circle cx="16" cy="14" r="1" fill="#0099FF" />
          <circle cx="8" cy="18" r="1" fill="#0099FF" />
          <circle cx="12" cy="18" r="1" fill="#0099FF" />
          <circle cx="16" cy="18" r="1" fill="#0099FF" />
        </svg>
      ),
    },
    {
      id: 'cards-app',
      title: 'Cards App',
      subtitle: 'Classroom EQ Practices & Moments',
      badge: '5 Practices',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      action: onOpenCardsApp,
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="currentColor">
          {/* Three fanned cards */}
          <path
            d="M5.5 6.5C5.5 5.4 6.4 4.5 7.5 4.5H16.5C17.6 4.5 18.5 5.4 18.5 6.5V17.5C18.5 18.6 17.6 19.5 16.5 19.5H7.5C6.4 19.5 5.5 18.6 5.5 17.5V6.5Z"
            fill="none"
            stroke="#0099FF"
            strokeWidth="1.8"
          />
          <path
            d="M9 4.5L14 3C15.1 2.7 16.2 3.3 16.5 4.4L19.5 14.5C19.8 15.6 19.2 16.7 18.1 17L16.5 17.5"
            fill="none"
            stroke="#0099FF"
            strokeWidth="1.8"
          />
          <path
            d="M12 10.5C11.2 9.7 9.8 9.7 9 10.5C8.2 11.3 8.2 12.7 9 13.5L12 16.5L15 13.5C15.8 12.7 15.8 11.3 15 10.5C14.2 9.7 12.8 9.7 12 10.5Z"
            fill="#0099FF"
          />
        </svg>
      ),
    },
    {
      id: 'new-tools',
      title: 'New Tools',
      subtitle: 'Network Analytics & Diagnostics',
      badge: 'v2.28',
      badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
      action: () => onNavigate('reports'),
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          <line x1="3.5" y1="20.5" x2="7.5" y2="16.5" />
        </svg>
      ),
    },
    {
      id: 'elearning',
      title: 'eLearning\n(English)',
      subtitle: 'Educator Academy & Training',
      badge: '144 Enrolled',
      badgeColor: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => onNavigate('training'),
      icon: (
        <div className="relative flex items-center justify-center">
          <svg className="w-10 h-10 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
            <path d="M6 12v5c0 3 6 3 6 3s6 0 6-3v-5" />
          </svg>
          <span className="absolute top-2.5 text-[9px] font-black text-[#0099FF] tracking-tighter">
            EN
          </span>
        </div>
      ),
    },
    {
      id: 'popup',
      title: 'Popup',
      subtitle: 'School Climate Signals & Sentiment',
      badge: 'Live',
      badgeColor: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: () => onNavigate('reports'),
      icon: (
        <div className="relative flex items-center justify-center">
          {/* Six Seconds cute popup elephant graphic with hearts */}
          <svg className="w-10 h-10 text-[#0099FF]" viewBox="0 0 64 64" fill="none">
            {/* Elephant body */}
            <path
              d="M12 42C12 33.1634 19.1634 26 28 26H42C48.6274 26 54 31.3726 54 38V46C54 48.2091 52.2091 50 50 50H46C43.7909 50 42 48.2091 42 46V44H34V46C34 48.2091 32.1909 50 30 50H26C23.7909 50 22 48.2091 22 46V44H18C14.6863 44 12 41.3137 12 38V42Z"
              fill="#0099FF"
              opacity="0.85"
            />
            {/* Elephant eye */}
            <circle cx="46" cy="34" r="2" fill="white" />
            {/* Elephant trunk curving up */}
            <path
              d="M54 38C57 37 60 33 60 28C60 25 57 24 55 26"
              stroke="#0099FF"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Floating hearts from trunk */}
            <path
              d="M58 20C57 19 55 19 54 20C53 19 51 19 50 20C49 21.5 50.5 23.5 54 26C57.5 23.5 59 21.5 58 20Z"
              fill="#FF4B72"
            />
            <path
              d="M62 13C61.3 12.3 60 12.3 59.3 13C58.6 12.3 57.3 12.3 56.6 13C56 14 57 15.3 59.3 17C61.6 15.3 62.6 14 62 13Z"
              fill="#FF809B"
            />
          </svg>
        </div>
      ),
    },
    {
      id: 'events-home',
      title: 'Events Home',
      subtitle: 'Partner Schools Directory',
      badge: `${schools.length} Schools`,
      badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => onNavigate('schools'),
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
          {/* Home icon in center */}
          <path d="M12 12l-4 3.5v4.5h3v-3h2v3h3v-4.5z" fill="#0099FF" stroke="#0099FF" strokeWidth="1" />
        </svg>
      ),
    },
    {
      id: 'knowledge-base',
      title: 'Knowledge Base',
      subtitle: 'Accreditation Rubrics & Guides',
      badge: 'Official',
      badgeColor: 'bg-sky-50 text-sky-700 border-sky-200',
      action: onOpenKnowledgeBase,
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
          <circle cx="12" cy="10" r="3" stroke="#0099FF" fill="none" />
          <path d="M6 19c0-3.3 2.7-6 6-6s6 2.7 6 6" fill="none" />
        </svg>
      ),
    },
    {
      id: 'onboard-school',
      title: 'Onboard School',
      subtitle: '7-Step Partner Setup Wizard',
      badge: 'Wizard',
      badgeColor: 'bg-purple-50 text-purple-700 border-purple-200',
      action: onAddSchool,
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="4" y="4" width="16" height="16" rx="2" />
          <line x1="12" y1="8" x2="12" y2="16" />
          <line x1="8" y1="12" x2="16" y2="12" />
        </svg>
      ),
    },
    {
      id: 'review-team',
      title: 'Review Team',
      subtitle: 'Staff Portfolios & RBAC Roles',
      badge: 'Governance',
      badgeColor: 'bg-stone-50 text-stone-700 border-stone-200',
      action: () => onNavigate('team'),
      icon: (
        <svg className="w-9 h-9 text-[#0099FF]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
  ];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-8 py-8 sm:py-12">
      {/* ---------------------------------------------------- */}
      {/* Header Section (Six Seconds typography)              */}
      {/* ---------------------------------------------------- */}
      <div className="mb-8 sm:mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-stone-900 tracking-tight">
          Applications &amp; Workspaces
        </h1>
        <p className="text-stone-500 text-sm sm:text-base mt-1.5 font-normal">
          Please click the CEQHS application or workspace you wish to access.
        </p>
      </div>

      {/* ---------------------------------------------------- */}
      {/* The 5-Column Applications Squircle Grid              */}
      {/* ---------------------------------------------------- */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 sm:gap-7">
        {applications.map((app) => {
          const isHighlighted = activeCardId === app.id;

          return (
            <div
              key={app.id}
              onClick={() => {
                setActiveCardId(app.id);
                app.action();
              }}
              onMouseEnter={() => setActiveCardId(app.id)}
              className={`group relative bg-white rounded-[26px] p-5 sm:p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 select-none min-h-[175px] sm:min-h-[195px] ${
                isHighlighted
                  ? 'border-2 border-[#0099FF] shadow-[0_6px_28px_rgba(0,153,255,0.22)] -translate-y-1'
                  : 'border border-stone-200/90 shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:border-sky-300 hover:shadow-md hover:-translate-y-0.5'
              }`}
            >
              {/* Optional Subtle Badge */}
              {app.badge && (
                <span
                  className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full border ${app.badgeColor}`}
                >
                  {app.badge}
                </span>
              )}

              {/* Squircle Icon Wrapper */}
              <div
                className={`w-16 h-16 sm:w-18 sm:h-18 rounded-[20px] flex items-center justify-center transition-transform duration-200 mb-3 sm:mb-4 ${
                  isHighlighted
                    ? 'border-2 border-[#0099FF] bg-sky-50/40 scale-105'
                    : 'border border-[#0099FF]/60 bg-sky-50/20 group-hover:border-[#0099FF]'
                }`}
              >
                {app.icon}
              </div>

              {/* Title */}
              <h2
                className={`text-sm sm:text-base font-bold leading-snug whitespace-pre-line tracking-tight transition-colors ${
                  isHighlighted
                    ? 'text-[#0077CC]'
                    : 'text-stone-800 group-hover:text-stone-900'
                }`}
              >
                {app.title}
              </h2>

              {/* Subtitle helper tooltip text */}
              <p className="text-[11px] text-stone-400 mt-1 line-clamp-1 font-normal opacity-0 group-hover:opacity-100 transition-opacity">
                {app.subtitle}
              </p>
            </div>
          );
        })}
      </div>

      {/* ---------------------------------------------------- */}
      {/* Quick Institutional Network Snapshot Strip           */}
      {/* ---------------------------------------------------- */}
      <div className="mt-12 pt-8 border-t border-stone-200/80">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-stone-50/80 border border-stone-200/80 rounded-2xl p-4 sm:p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#1B3626] text-white flex items-center justify-center font-bold text-xs">
              CE
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Active CEQHS Network Status
              </h3>
              <p className="text-sm font-semibold text-stone-900">
                {schools.length} Partner High Schools · 144 Teachers in Living Journal Pacing
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs">
            <button
              onClick={() => onNavigate('schools')}
              className="flex items-center gap-1.5 font-semibold text-sky-600 hover:text-sky-700 transition-colors"
            >
              <span>View All Partner Schools</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <span className="text-stone-300">|</span>
            <button
              onClick={() => onNavigate('dossier-review')}
              className="flex items-center gap-1.5 font-semibold text-emerald-700 hover:text-emerald-800 transition-colors"
            >
              <span>{pendingDossiers} Dossier Submissions Awaiting Review</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
